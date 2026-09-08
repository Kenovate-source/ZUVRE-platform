import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "./session";

/**
 * The single place workspace authorization is checked. Every route that
 * touches workspace-scoped data must go through this — never trust a
 * client-supplied workspaceId directly. This is the fix for the gap the
 * capability-execute route's own prior comment admitted: "authentication
 * ... is omitted here for brevity." See ADR-0004.
 *
 * Verifies both that the caller has a valid session AND that they're an
 * ACTIVE member of the specific workspace being requested — not just
 * that they're logged in as *someone*.
 */

export interface WorkspaceAccess {
  userId: string;
  workspaceId: string;
}

export interface WorkspaceAccessDenied {
  status: 401 | 403;
  message: string;
}

export async function requireWorkspaceAccess(
  workspaceId: string
): Promise<WorkspaceAccess | WorkspaceAccessDenied> {
  const session = await getCurrentSession();
  if (!session) {
    return { status: 401, message: "Not authenticated" };
  }

  const membership = await rawDb.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: session.userId } },
  });

  if (!membership || membership.status !== "ACTIVE") {
    return { status: 403, message: "Not authorized for this workspace" };
  }

  return { userId: session.userId, workspaceId };
}

export function isAccessDenied(
  result: WorkspaceAccess | WorkspaceAccessDenied
): result is WorkspaceAccessDenied {
  return "status" in result;
}
