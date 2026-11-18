import { redirect } from "next/navigation";
import { rawDb } from "@zuvre/db";
import { getCurrentSession } from "@/server/auth/session";
import { SignOutButton } from "@/components/sign-out-button";

/**
 * Deliberately minimal — account basics and sign-out only, per
 * ZUVRE_Phase1_Implementation_Blueprint.md §6 ("Settings: Minimal only").
 * No profile editing, no preferences — those are real future work, not
 * simulated here with inputs that don't save anything.
 */
export default async function SettingsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const user = await rawDb.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="zuvre-eyebrow mb-3">Settings</p>
      <h1 className="font-display text-3xl text-text-primary mb-8">Your Account</h1>

      <div className="zuvre-card p-5 mb-6 flex flex-col gap-4">
        <div>
          <p className="zuvre-form-label">Display name</p>
          <p className="text-text-primary">{user.displayName}</p>
        </div>
        <div>
          <p className="zuvre-form-label">Handle</p>
          <p className="text-text-primary">@{user.handle}</p>
        </div>
        <div>
          <p className="zuvre-form-label">Email</p>
          <p className="text-text-primary">{user.email}</p>
        </div>
      </div>

      <SignOutButton />
    </div>
  );
}
