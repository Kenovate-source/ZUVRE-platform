import { capabilityRegistry } from "@zuvre/capability-sdk";
import { rawDb, scopedDb } from "@zuvre/db";
import { bootstrapCapabilities } from "./bootstrap";

/**
 * The grant-check → execute → record logic, extracted from
 * apps/web/src/app/api/capabilities/execute/route.ts so the new chat
 * route (apps/web/src/app/api/chat/route.ts) can reuse it instead of
 * duplicating it. Behavior is unchanged from the original route — this
 * is a refactor, not a rewrite. Authorization is NOT this function's
 * job — callers must already have verified workspace access (see
 * apps/web/src/server/auth/workspace-access.ts) before calling this.
 */

export type RunCapabilityResult =
  | { ok: true; executionId: string; output: unknown }
  | { ok: false; status: 400 | 403 | 404 | 500; error: string; issues?: unknown };

export async function runCapability(params: {
  workspaceId: string;
  capabilityId: string;
  input: unknown;
}): Promise<RunCapabilityResult> {
  await bootstrapCapabilities();
  const { workspaceId, capabilityId, input } = params;
  const db = scopedDb(workspaceId);

  const grant = await db.raw.capabilityGrant.findUnique({
    where: { workspaceId_capabilityId: { workspaceId, capabilityId } },
  });
  if (!grant || !grant.isEnabled) {
    return { ok: false, status: 403, error: `Capability "${capabilityId}" is not granted to this workspace` };
  }
  if (grant.approvalPolicy === "BLOCKED") {
    return { ok: false, status: 403, error: `Capability "${capabilityId}" is blocked for this workspace` };
  }

  const capability = capabilityRegistry.getLatest(capabilityId);
  if (!capability) {
    return { ok: false, status: 404, error: `Capability "${capabilityId}" is not registered` };
  }

  const inputParse = capability.inputSchema.safeParse(input);
  if (!inputParse.success) {
    return { ok: false, status: 400, error: "Invalid capability input", issues: inputParse.error.issues };
  }

  const execution = await rawDb.capabilityExecution.create({
    data: {
      workspaceId,
      capabilityId,
      status: "RUNNING",
      input: input as any,
      startedAt: new Date(),
    },
  });

  const controller = new AbortController();

  try {
    const output = await capability.execute(inputParse.data, {
      executionId: execution.id,
      workspaceId,
      grantedScopes: (grant.grantedScopes as Record<string, unknown>) ?? {},
      signal: controller.signal,
      async reportProgress() {
        /* stub: a real implementation streams this over SSE/WebSocket */
      },
      async emitArtifact(artifact) {
        const created = await rawDb.artifact.create({
          data: {
            workspaceId,
            executionId: execution.id,
            kind: artifact.kind,
            title: artifact.title,
            storageRef: artifact.storageRef,
            metadata: (artifact.metadata ?? {}) as any,
          },
        });
        return { artifactId: created.id };
      },
      async requestPermission() {
        // A real implementation pauses execution (status AWAITING_APPROVAL)
        // and resumes via a separate approval endpoint. Foundation stub:
        return "denied";
      },
    });

    await rawDb.capabilityExecution.update({
      where: { id: execution.id },
      data: { status: "SUCCEEDED", output: output as any, finishedAt: new Date() },
    });

    return { ok: true, executionId: execution.id, output };
  } catch (err) {
    await rawDb.capabilityExecution.update({
      where: { id: execution.id },
      data: {
        status: "FAILED",
        error: { message: err instanceof Error ? err.message : String(err) },
        finishedAt: new Date(),
      },
    });
    return { ok: false, status: 500, error: "Capability execution failed" };
  }
}
