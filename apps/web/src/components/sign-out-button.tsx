"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button
      onClick={() => void handleSignOut()}
      disabled={pending}
      className="zuvre-app-nav-link w-full text-left"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
