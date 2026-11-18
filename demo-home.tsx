"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { inventoryCounts } from "@/content/capabilities";
import { listWorlds, type DemoWorld } from "@/lib/demo/store";
import { useDemoAuth } from "./demo-auth-provider";
import { DemoOnboarding } from "./demo-onboarding";

export function DemoHome() {
  const { account } = useDemoAuth();
  const [worlds, setWorlds] = useState<DemoWorld[] | null>(null);
  const counts = inventoryCounts();

  useEffect(() => {
    if (account) setWorlds(listWorlds(account.id));
  }, [account]);

  if (!account) return null;
  return (
    <div className="zw-page">
      <p className="zl-eyebrow">Home</p>
      <h1 className="zw-h1">Welcome, {account.displayName}.</h1>

      <DemoOnboarding accountId={account.id} />

      <div className="zw-row">
        <Link href="/demo/worlds" className="zuvre-button-primary zuvre-focus-ring">{worlds && worlds.length > 0 ? "Open your Worlds" : "Create your first World"}</Link>
        <Link href="/demo/chat" className="zuvre-button-secondary zuvre-focus-ring">Open the conversation space</Link>
      </div>

      <section className="zuvre-card zw-panel" aria-labelledby="real-title">
        <h2 id="real-title" className="zw-h3">What&apos;s real in this demo</h2>
        <ul className="zw-list">
          <li><strong>Worlds</strong> — you can create, open and delete them; they&apos;re stored in this browser.</li>
          <li><strong>Conversations</strong> — what you write is saved per World. <strong>No AI is connected</strong> in demo mode, so nothing replies.</li>
          <li><strong>The full product</strong> — {counts.available} capability is live today (AI chat); the other {counts.planned} are planned. Real accounts and real AI chat need the server, a database and an AI key.</li>
        </ul>
      </section>

      {worlds && worlds.length > 0 ? (
        <section aria-labelledby="recent-title" className="zw-stack">
          <h2 id="recent-title" className="zl-eyebrow">Recent Worlds</h2>
          <ul className="zw-worlds zuvre-card">
            {worlds.slice(0, 5).map((w) => (
              <li key={w.id}>
                <Link href={`/demo/worlds/${w.id}`} className="zuvre-list-row zw-world-link">
                  <span className="zw-world-name">{w.name}</span>
                  {w.description ? <span className="zw-note">{w.description}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
