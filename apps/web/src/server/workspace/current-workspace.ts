import { cache } from "react";
import { rawDb } from "@zuvre/db";

/**
 * Phase 1 simplification, documented rather than hidden: each user has
 * exactly one (personal) workspace, created at registration (see
 * apps/web/src/server/auth/register.ts). This resolves it fresh per
 * request rather than storing it in the session cookie, since there's no
 * multi-workspace switching to justify that extra state yet. Revisit if/
 * when team workspaces ship — see ADR-0004.
 *
 * Wrapped in cache() for the same per-request-dedup reason as
 * getCurrentSession().
 */
export const getCurrentWorkspaceId = cache(async (userId: string): Promise<string | null> => {
  const membership = await rawDb.workspaceMember.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { joinedAt: "asc" },
  });
  return membership?.workspaceId ?? null;
});
