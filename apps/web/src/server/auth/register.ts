import { randomBytes } from "node:crypto";
import { rawDb } from "@zuvre/db";
import { hashPassword, DEFAULT_ROLE_PERMISSIONS } from "@zuvre/auth/server";

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

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const passwordHash = await hashPassword(input.password);
  const base = slugify(input.displayName);
  const handle = withRandomSuffix(base);
  const workspaceSlug = withRandomSuffix(base);

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

    return { userId: user.id, workspaceId: workspace.id };
  });
}
