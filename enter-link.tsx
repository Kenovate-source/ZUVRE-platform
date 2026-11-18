"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useDemoAuth } from "@/components/demo/demo-auth-provider";

/**
 * The primary call to action. By default it goes to real registration. Only
 * when LOCAL DEMO MODE is on AND this browser already holds a demo session
 * does it become "Continue in the demo" — so a returning demo visitor isn't
 * sent back through sign-up. In production builds it can never change.
 */
export function EnterLink({ className, children = "Enter ZUVRE" }: { className?: string; children?: ReactNode }) {
  const { enabled, status } = useDemoAuth();
  if (enabled && status === "signed-in") {
    return <Link href="/demo/home" className={className}>Continue in the demo</Link>;
  }
  return <Link href="/register" className={className}>{children}</Link>;
}
