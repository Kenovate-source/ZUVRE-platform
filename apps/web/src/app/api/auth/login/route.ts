import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rawDb } from "@zuvre/db";
import { verifyPassword } from "@zuvre/auth";
import { createSession } from "@/server/auth/session";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await rawDb.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.passwordHash) {
    // Same generic message whether the email doesn't exist or the
    // password was wrong — don't leak which one it was.
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await createSession(user.id);

  // Phase 1 users have exactly one (personal) workspace, created at
  // registration — resolved fresh here rather than stored in the
  // session, since there's no multi-workspace switching yet to justify
  // that extra state. Revisit if/when team workspaces ship.
  const membership = await rawDb.workspaceMember.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    orderBy: { joinedAt: "asc" },
  });

  return NextResponse.json({ userId: user.id, workspaceId: membership?.workspaceId ?? null });
}
