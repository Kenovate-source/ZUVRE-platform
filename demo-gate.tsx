"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDemoAuth } from "./demo-auth-provider";

/**
 * Everything under /demo needs a local demo session — the PUBLIC site (the
 * landing page, /login, /register) never does. This is the single place that
 * rule is enforced for the demo app.
 */
export function DemoGate({ children }: { children: ReactNode }) {
  const { enabled, status } = useDemoAuth();
  const router = useRouter();

  useEffect(() => {
    if (enabled && status === "signed-out") router.replace("/login");
  }, [enabled, status, router]);

  if (!enabled) {
    return (
      <main className="zw-gate zl-root">
        <div className="zw-gate-card zuvre-card">
          <h1 className="zw-auth-title">Local demo mode is off</h1>
          <p className="zw-note">
            The local demo runs only in development, and only when <code>NEXT_PUBLIC_ZUVRE_LOCAL_DEMO=1</code> is set
            (see <code>.env.example</code>). It can never be enabled in a production build — real accounts use the real
            sign-in.
          </p>
          <div className="zw-row">
            <Link href="/" className="zuvre-button-primary zuvre-focus-ring">Back to the landing page</Link>
            <Link href="/login" className="zuvre-button-secondary zuvre-focus-ring">Real sign-in</Link>
          </div>
        </div>
      </main>
    );
  }

  if (status !== "signed-in") {
    return (
      <main className="zw-gate zl-root" role="status">
        <p className="zw-note">{status === "signed-out" ? "No local demo session — taking you to log in…" : "Restoring your local demo session…"}</p>
      </main>
    );
  }
  return <>{children}</>;
}
