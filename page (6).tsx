import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { getCurrentWorkspaceId } from "@/server/workspace/current-workspace";
import { ChatPanel } from "@/components/chat-panel";

export default async function ChatPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const workspaceId = await getCurrentWorkspaceId(session.userId);
  if (!workspaceId) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="zuvre-eyebrow mb-3">Chat</p>
      <h1 className="font-display text-3xl text-text-primary mb-8">ZUVRE AI</h1>
      <p className="text-sm text-text-secondary mb-6">
        This conversation isn't organized into a World yet — you can start
        one from your Worlds page any time.
      </p>
      <ChatPanel workspaceId={workspaceId} />
    </div>
  );
}
