import { redirect } from "next/navigation";
import { getCurrentSession } from "@/server/auth/session";
import { getCurrentWorkspaceId } from "@/server/workspace/current-workspace";
import { AppShellNav } from "@/components/app-shell-nav";

/**
 * The authoritative session gate — middleware.ts only checks the JWT
 * signature (Edge runtime, no DB access); this layout does the real,
 * DB-backed check via getCurrentSession(), which also catches revoked/
 * expired sessions middleware can't see. See ADR-0004.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const workspaceId = await getCurrentWorkspaceId(session.userId);
  if (!workspaceId) {
    // Shouldn't happen — registration always creates a personal
    // workspace — but fail safe rather than let a page crash on a null
    // workspaceId if it somehow does.
    redirect("/login");
  }

  return (
    <div className="zuvre-app-shell">
      <AppShellNav />
      <main className="zuvre-app-main">{children}</main>
    </div>
  );
}
