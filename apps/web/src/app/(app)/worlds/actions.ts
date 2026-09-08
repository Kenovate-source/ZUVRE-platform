"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "@/server/auth/session";

const createWorldSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  workspaceId: z.string(),
});

/**
 * A Server Action rather than an API route — this is a simple form
 * submission consumed only by this app's own pages, so a dedicated
 * fetch-based endpoint isn't needed (unlike chat, which needs to be
 * called repeatedly from client-side state — see
 * apps/web/src/app/api/chat/route.ts).
 *
 * Minimal Phase 1 error handling: validation/authorization failures
 * throw rather than returning field-level errors via useFormState — a
 * real implementation would want the latter; out of scope for this pass.
 */
export async function createWorld(formData: FormData) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const parsed = createWorldSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    workspaceId: formData.get("workspaceId"),
  });

  if (!parsed.success) {
    throw new Error("Invalid World data");
  }

  // Same authorization principle as the API routes — verify the
  // authenticated user is actually a member of the workspace the hidden
  // form field claims, don't trust it blindly.
  const membership = await rawDb.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId: parsed.data.workspaceId, userId: session.userId },
    },
  });
  if (!membership || membership.status !== "ACTIVE") {
    throw new Error("Not authorized for this workspace");
  }

  const world = await rawDb.world.create({
    data: {
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    },
  });

  redirect(`/app/worlds/${world.id}`);
}
