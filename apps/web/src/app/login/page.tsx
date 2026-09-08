import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { ZuvreWordmark } from "@/components/zuvre-wordmark";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <ZuvreWordmark withTagline />
      </div>
      <div className="zuvre-card p-6">
        <h1 className="font-display text-2xl text-text-primary mb-6">Welcome back</h1>
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-text-secondary">
        New to ZUVRE?{" "}
        <Link href="/register" className="text-accent-primary">
          Create an account
        </Link>
      </p>
    </main>
  );
}
