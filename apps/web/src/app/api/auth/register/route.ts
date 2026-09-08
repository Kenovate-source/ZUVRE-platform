import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/server/auth/register";
import { createSession } from "@/server/auth/session";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  displayName: z.string().min(1).max(80),
});

function isUniqueConstraintError(err: unknown): boolean {
  // Duck-typed rather than `instanceof Prisma.PrismaClientKnownRequestError`
  // — packages/db only re-exports `Prisma` as a type
  // (`export type { Prisma }`), not a runtime value, so `instanceof`
  // against it isn't available here without adding a direct
  // @prisma/client dependency to apps/web that isn't otherwise needed.
  return Boolean(err && typeof err === "object" && "code" in err && err.code === "P2002");
}

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const { userId, workspaceId } = await registerUser(parsed.data);
    await createSession(userId);
    return NextResponse.json({ userId, workspaceId });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "An account with that email already exists" }, { status: 409 });
    }
    console.error("Registration failed:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
