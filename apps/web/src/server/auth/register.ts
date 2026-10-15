import { randomBytes } from "node:crypto";
import { rawDb } from "@zuvre/db";
import { hashPassword, DEFAULT_ROLE_PERMISSIONS } from "@zuvre/auth/server";
import { bootstrapCapabilities } from "../capabilities/bootstrap";

/**
 * Implements the schema's own long-standing comment: "A personal account
 * is a single-member Workspace created automatically at signup." Nothing
 * did this before Phase 1 — the User/Workspace/Role/WorkspaceMember
 * models all existed, but no code ever wired them together at
 * registration time. See ADR-0004.
 *
 * Simplification, documented rather than hidden: the generated `handle`
 * and workspace `slug` always append a random suffix rather than
 * retrying on collision — acceptable for Phase 1, worth revisiting if
 * human-readable/predictable handles become a requirement later.
 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function withRandomSuffix(base: string): string {
  const cleanBase = base || "zuvre-user";
  return `${cleanBase}-${randomBytes(3).toString("hex")}`;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export interface RegisterResult {
  userId: string;
  workspaceId: string;
}

/**
 * Depends on a Plan row with id "spark" existing in the database
 * (seeded by packages/db/prisma/seed.ts) — a real deployment dependency
 * this function cannot itself guarantee.
 */
const DEFAULT_PLAN_ID = "spark";

/**
 * Capabilities every new workspace is granted at registration. Without a
 * CapabilityGrant row, runCapability() (apps/web/src/server/capabilities/
 * run-capability.ts) returns 403 "not granted to this workspace" — i.e. a
 * freshly registered user's very first chat message would fail. Explicit
 * allow-list rather than "everything registered", so a future expensive or
 * external-facing capability is never silently granted to every new account.
 */
const DEFAULT_GRANTED_CAPABILITY_IDS = ["ai.chat"] as const;

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const passwordHash = await hashPassword(input.password);
  const base = slugify(input.displayName);
  const handle = withRandomSuffix(base);
  const workspaceSlug = withRandomSuffix(base);

  // CapabilityGrant.capabilityId is a foreign key to CapabilityDefinition.id;
  // bootstrapCapabilities() upserts those definition rows (idempotent), so it
  // must run before the grants below can be created.
  await bootstrapCapabilities();

  return rawDb.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        displayName: input.displayName,
        handle,
      },
    });

    const workspace = await tx.workspace.create({
      data: {
        slug: workspaceSlug,
        name: `${input.displayName}'s Workspace`,
        kind: "PERSONAL",
        ownerId: user.id,
        planId: DEFAULT_PLAN_ID,
      },
    });

    const ownerRole = await tx.role.create({
      data: {
        workspaceId: workspace.id,
        key: "owner",
        label: "Owner",
        permissions: DEFAULT_ROLE_PERMISSIONS.owner,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        roleId: ownerRole.id,
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    for (const capabilityId of DEFAULT_GRANTED_CAPABILITY_IDS) {
      await tx.capabilityGrant.create({
        data: {
          workspaceId: workspace.id,
          capabilityId,
          grantedScopes: {},
          approvalPolicy: "AUTO",
          isEnabled: true,
          grantedByUserId: user.id,
        },
      });
    }

    return { userId: user.id, workspaceId: workspace.id };
  });
}
