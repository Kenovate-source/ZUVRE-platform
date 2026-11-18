"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemoAuth } from "./demo-auth-provider";

export function DemoSettings() {
  const { account, logOut, resetEverything } = useDemoAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  if (!account) return null;
  return (
    <div className="zw-page">
      <p className="zl-eyebrow">Settings</p>
      <h1 className="zw-h1">Your local demo account</h1>

      <dl className="zuvre-card zw-panel zw-facts">
        <div><dt>Name</dt><dd>{account.displayName}</dd></div>
        <div><dt>Account type</dt><dd>{account.guest ? "Demo guest (no email, no password)" : "Local demo account"}</dd></div>
        {!account.guest ? <div><dt>Email</dt><dd>{account.email}</dd></div> : null}
      </dl>

      <section className="zuvre-card zw-panel zw-stack" aria-labelledby="what-title">
        <h2 id="what-title" className="zw-h3">What local demo mode is</h2>
        <p className="zw-note">
          A browser-only stand-in for sign-in so you can explore ZUVRE with no server. Your account, Worlds and
          messages are in this browser&apos;s local storage; passwords are hashed in the browser (PBKDF2) and never sent
          anywhere. It is <strong>not</strong> real authentication or production security.
        </p>
      </section>

      <div className="zw-row">
        <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={() => { logOut(); router.push("/"); }}>Log out</button>
        {confirming ? (
          <span className="zw-confirm" role="group" aria-label="Confirm reset">
            <button type="button" className="zw-danger zuvre-focus-ring" onClick={() => { resetEverything(); router.push("/"); }}>Yes, erase all local demo data</button>
            <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={() => setConfirming(false)}>Cancel</button>
          </span>
        ) : (
          <button type="button" className="zw-quiet-btn zuvre-focus-ring" onClick={() => setConfirming(true)}>Reset all local demo data…</button>
        )}
      </div>
    </div>
  );
}
