import "server-only";
import { ownerDb } from "@zuvre/db";

/**
 * Every platform-owner administrative action (disabling a capability,
 * editing another workspace's grants, impersonating for support, etc.)
 * MUST go through this wrapper. It guarantees an AuditLog row is written
 * even if the action throws, and it's the single choke point a reviewer
 * can grep for ("withOwnerAudit(") to find every place owner power is used.
 *
 * This does not itself check `isPlatformOwner` — callers (API route
 * handlers) are expected to have already authenticated the caller as the
 * owner; this wrapper's job is auditability, not authentication.
 *
 * Structure note: `return await fn()` inside try/finally (rather than
 * assigning to a `let result: T` declared before the try) means no
 * possibly-unassigned variable and therefore no `@ts-expect-error` is
 * needed — the previous version's directive was reported as unused
 * (TS2578) by the compiler, i.e. a real build error.
 */
export async function withOwnerAudit<T>(
  params: {
    actorUserId: string;
    action: string;
    targetType?: string;
    targetId?: string;
    metadata?: Record<string, unknown>;
  },
  fn: () => Promise<T>
): Promise<T> {
  const db = ownerDb();
  let outcome: "success" | "error" = "success";
  let errorMessage: string | undefined;
  try {
    return await fn();
  } catch (err) {
    outcome = "error";
    errorMessage = err instanceof Error ? err.message : undefined;
    throw err;
  } finally {
    await db.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        actorType: "user",
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        metadata: {
          ...params.metadata,
          outcome,
          error: errorMessage,
        } as any,
      },
    });
  }
}
