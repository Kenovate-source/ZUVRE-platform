import Link from "next/link";
import { redirect } from "next/navigation";
import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "@/server/auth/session";
import { getCurrentWorkspaceId } from "@/server/workspace/current-workspace";
import { createWorld } from "./actions";

export default async function WorldsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  const workspaceId = await getCurrentWorkspaceId(session.userId);
  if (!workspaceId) redirect("/login");

  const worlds = await rawDb.world.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="zuvre-eyebrow mb-3">Worlds</p>
      <h1 className="font-display text-3xl text-text-primary mb-8">Your Worlds</h1>

      <div className="zuvre-card p-5 mb-10">
        <p className="zuvre-eyebrow mb-4">Create a World</p>
        <form action={createWorld} className="flex flex-col gap-4">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <div className="zuvre-form-field">
            <label className="zuvre-form-label" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" required maxLength={120} className="zuvre-input" placeholder="A new world" />
          </div>
          <div className="zuvre-form-field">
            <label className="zuvre-form-label" htmlFor="description">
              Description (optional)
            </label>
            <input
              id="description"
              name="description"
              maxLength={2000}
              className="zuvre-input"
              placeholder="What is this world about?"
            />
          </div>
          <button type="submit" className="zuvre-button-primary zuvre-focus-ring self-start">
            Create World
          </button>
        </form>
      </div>

      {worlds.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No Worlds yet — create your first one above.
        </p>
      ) : (
        <div className="zuvre-card divide-y divide-border">
          {worlds.map((world) => (
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
      )}
    </div>
  );
}
