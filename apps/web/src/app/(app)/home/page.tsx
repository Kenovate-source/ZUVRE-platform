import Link from "next/link";
import { redirect } from "next/navigation";
import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "@/server/auth/session";
import { getCurrentWorkspaceId } from "@/server/workspace/current-workspace";

/**
 * "What do I do next?" — per
 * ZUVRE_Phase1_Implementation_Blueprint.md §Phase 1.3. Deliberately
 * small: recent Worlds (if any) and two honest entry points (start a
 * conversation, create a World). No capability browsing, no fake
 * "recommended for you" — there's one real capability, so this page
 * doesn't pretend there's more to discover yet.
 */
export default async function HomePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const workspaceId = await getCurrentWorkspaceId(session.userId);
  if (!workspaceId) redirect("/login");

  const recentWorlds = await rawDb.world.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="zuvre-eyebrow mb-3">Home</p>
      <h1 className="font-display text-3xl text-text-primary mb-8">
        Give thought a world.
      </h1>

      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/app/chat" className="zuvre-button-primary zuvre-focus-ring">
          Start a conversation
        </Link>
        <Link href="/app/worlds" className="zuvre-button-secondary zuvre-focus-ring">
          {recentWorlds.length > 0 ? "View your Worlds" : "Create your first World"}
        </Link>
      </div>

      {recentWorlds.length > 0 && (
        <section>
          <p className="zuvre-eyebrow mb-4">Recent Worlds</p>
          <div className="zuvre-card divide-y divide-border">
            {recentWorlds.map((world) => (
              <Link
                key={world.id}
                href={`/app/worlds/${world.id}`}
                className="zuvre-list-row flex flex-col gap-1 px-5 py-4"
              >
                <span className="font-display text-base text-text-primary">{world.name}</span>
                {world.description && (
                  <span className="text-sm text-text-secondary">{world.description}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
