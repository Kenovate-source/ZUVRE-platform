import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireWorkspaceAccess, isAccessDenied } from "@/server/auth/workspace-access";
import { runCapability } from "@/server/capabilities/run-capability";

const requestSchema = z.object({
  workspaceId: z.string(),
  capabilityId: z.string(),
  input: z.unknown(),
});

/**
 * Reference implementation of the capability execution contract
 * (docs/09-capability-system.md).
 *
 * SECURITY FIX (Phase 1): this route previously trusted whatever
 * workspaceId the client sent, with this exact comment: "authentication
 * ... is omitted here for brevity in this foundation." That gap is
 * closed here — requireWorkspaceAccess() verifies the authenticated
 * caller has an ACTIVE WorkspaceMember row for the *exact* workspace
 * being requested before anything else happens. See ADR-0004 and
 * apps/web/src/server/auth/workspace-access.ts.
 *
 * The grant-check → execute → record logic itself is unchanged from the
 * original route — it's been extracted to runCapability() so the new
 * chat route can reuse it instead of duplicating it.
 */
export async function POST(req: NextRequest) {
  const parsed = requestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { workspaceId, capabilityId, input } = parsed.data;

  const access = await requireWorkspaceAccess(workspaceId);
  if (isAccessDenied(access)) {
    return NextResponse.json({ error: access.message }, { status: access.status });
  }

  const result = await runCapability({ workspaceId, capabilityId, input });
  if (!result.ok) {
    return NextResponse.json({ error: result.error, issues: result.issues }, { status: result.status });
  }

  return NextResponse.json({ executionId: result.executionId, output: result.output });
}
