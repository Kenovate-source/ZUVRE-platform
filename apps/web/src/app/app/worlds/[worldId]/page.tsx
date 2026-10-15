import { notFound, redirect } from "next/navigation";
import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "@/server/auth/session";
import { getCurrentWorkspaceId } from "@/server/workspace/current-workspace";
import { ChatPanel, type ChatMessage } from "@/components/chat-panel";

export default async function WorldDetailPage({ params }: { params: { worldId: string } }) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const workspaceId = await getCurrentWorkspaceId(session.userId);
  if (!workspaceId) redirect("/login");

  const world = await rawDb.world.findUnique({ where: { id: params.worldId } });
  // Never trust the route param alone — a World from a different
  // workspace must 404, not just render, even if the id happens to be
  // guessed correctly.
  if (!world || world.workspaceId !== workspaceId) {
    notFound();
  }

  // Resume the most recently active conversation for this World, if one
  // exists — satisfies "return to your World and continue interacting"
  // rather than always starting a blank conversation.
  const latestConversation = await rawDb.conversation.findFirst({
    where: { worldId: world.id },
    orderBy: { createdAt: "desc" },
  });

  let initialMessages: ChatMessage[] = [];
  if (latestConversation) {
    const priorMessages = await rawDb.message.findMany({
      where: { conversationId: latestConversation.id },
      orderBy: { createdAt: "asc" },
    });
    initialMessages = priorMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      }));
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="zuvre-eyebrow mb-3">World</p>
      <h1 className="font-display text-3xl text-text-primary mb-2">{world.name}</h1>
      {world.description && <p className="text-text-secondary mb-8">{world.description}</p>}

      <ChatPanel
        workspaceId={workspaceId}
        worldId={world.id}
        initialConversationId={latestConversation?.id}
        initialMessages={initialMessages}
      />
    </div>
  );
}
