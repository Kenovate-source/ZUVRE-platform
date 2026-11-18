"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_MODE_ENABLED } from "@/lib/demo/config";
import { continueAsGuest, logIn as doLogIn, logOut as doLogOut, restoreSession, signUp as doSignUp, type DemoResult, type SignupInput } from "@/lib/demo/auth";
import { KEYS, resetAllDemoData, type DemoAccount } from "@/lib/demo/store";

/**
 * Client-side session state for LOCAL DEMO MODE. When the mode is off
 * (always the case in a production build) this provider does nothing: it
 * reports status "disabled" and never reads localStorage.
 */

type Status = "disabled" | "loading" | "signed-out" | "signed-in";

interface DemoAuthContextValue {
  enabled: boolean;
  status: Status;
  account: DemoAccount | null;
  signUp: (input: SignupInput) => Promise<DemoResult<DemoAccount>>;
  logIn: (email: string, password: string) => Promise<DemoResult<DemoAccount>>;
  guest: () => DemoResult<DemoAccount>;
  logOut: () => void;
  resetEverything: () => number;
}

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  // Identical on server and first client render → no hydration mismatch.
  const [status, setStatus] = useState<Status>(DEMO_MODE_ENABLED ? "loading" : "disabled");
  const [account, setAccount] = useState<DemoAccount | null>(null);

  const apply = useCallback((next: DemoAccount | null) => {
    setAccount(next);
    setStatus(next ? "signed-in" : "signed-out");
  }, []);

  useEffect(() => {
    if (!DEMO_MODE_ENABLED) return;
    apply(restoreSession());
    // Keep other tabs in step (log out in one tab → signed out in all).
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === KEYS.session || e.key === KEYS.accounts) apply(restoreSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  const value = useMemo<DemoAuthContextValue>(
    () => ({
      enabled: DEMO_MODE_ENABLED,
      status,
      account,
      signUp: async (input) => {
        const r = await doSignUp(input);
        if (r.ok) apply(r.value);
        return r;
      },
      logIn: async (email, password) => {
        const r = await doLogIn(email, password);
        if (r.ok) apply(r.value);
        return r;
      },
      guest: () => {
        const r = continueAsGuest();
        if (r.ok) apply(r.value);
        return r;
      },
      logOut: () => {
        doLogOut();
        apply(null);
      },
      resetEverything: () => {
        const n = resetAllDemoData();
        apply(null);
        return n;
      },
    }),
    [status, account, apply]
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth(): DemoAuthContextValue {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) throw new Error("useDemoAuth must be used inside <DemoAuthProvider> (mounted in the root layout).");
  return ctx;
}
