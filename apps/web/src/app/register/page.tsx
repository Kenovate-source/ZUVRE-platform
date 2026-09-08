import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { ZuvreWordmark } from "@/components/zuvre-wordmark";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <ZuvreWordmark withTagline />
      </div>
      <div className="zuvre-card p-6">
        <h1 className="font-display text-2xl text-text-primary mb-6">Enter ZUVRE</h1>
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-primary">
          Sign in
        </Link>
      </p>
    </main>
  );
}
