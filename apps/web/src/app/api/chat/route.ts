import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rawDb } from "@zuvre/db";
import { requireWorkspaceAccess, isAccessDenied } from "@/server/auth/workspace-access";
import { runCapability } from "@/server/capabilities/run-capability";

/**
 * Makes ai.chat stateful. Previously (apps/web/src/server/capabilities/
 * ai-chat.ts) the capability itself was — and remains — a pure function:
 * message + history in, reply out. It never touched Conversation/Message
 * even though both models already existed in the schema. This route is
 * the layer that adds persistence around that pure capability, per
 * ZUVRE_Phase1_Implementation_Blueprint.md §10 — the capability contract
 * itself (ADR-0002) is untouched.
 *
 * Reuses runCapability() rather than duplicating the grant-check/execute
 * logic that also lives in the capabilities/execute route.
 */

const bodySchema = z.object({
  workspaceId: z.string(),
  message: z.string().min(1).max(8000),
  conversationId: z.string().optional(),
  worldId: z.string().optional(),
});

const CHAT_CAPABILITY_ID = "ai.chat";

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { workspaceId, message, conversationId, worldId } = parsed.data;

  const access = await requireWorkspaceAccess(workspaceId);
  if (isAccessDenied(access)) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }

  // Resolve or create the conversation — a client-supplied conversationId
  // is verified to actually belong to this workspace, never trusted
  // blindly (same principle as the workspaceId fix in the execute route).
  let conversation;
  if (conversationId) {
    conversation = await rawDb.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation || conversation.workspaceId !== workspaceId) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
  } else {
    if (worldId) {
      const world = await rawDb.world.findUnique({ where: { id: worldId } });
      if (!world || world.workspaceId !== workspaceId) {
        return NextResponse.json({ error: "World not found" }, { status: 404 });
      }
    }
    conversation = await rawDb.conversation.create({
      data: { workspaceId, worldId: worldId ?? null },
    });
  }

  // ai.chat's own input schema caps history at 50 entries — load only the
  // most recent 50 (efficient query, not "load everything then slice"),
  // then restore ascending order for correct conversational sequence.
  // Missing this would make any conversation past 50 messages fail
  // ai.chat's own input validation inside runCapability().
  const recentMessages = await rawDb.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const history = recentMessages
    .reverse()
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
    }));

  // Persist the user's message before calling the capability — if the
  // capability call fails below, the message still exists (matching how
  // most chat UIs behave: a send that was shown, followed by an error,
  // not a message that silently vanishes).
  await rawDb.message.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  const result = await runCapability({
    workspaceId,
    capabilityId: CHAT_CAPABILITY_ID,
    input: { message, history },
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues, conversationId: conversation.id },
      { status: result.status }
    );
  }

  const output = result.output as { reply: string };

  await rawDb.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: output.reply },
  });

  return NextResponse.json({
    conversationId: conversation.id,
    reply: output.reply,
  });
}
