"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Registration failed");
        return;
      }
      router.push("/app/home");
      router.refresh();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="zuvre-form-field">
        <label className="zuvre-form-label" htmlFor="displayName">
          Display name
        </label>
        <input
          id="displayName"
          className="zuvre-input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          maxLength={80}
        />
      </div>
      <div className="zuvre-form-field">
        <label className="zuvre-form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="zuvre-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="zuvre-form-field">
        <label className="zuvre-form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="zuvre-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" className="zuvre-button-primary zuvre-focus-ring" disabled={submitting}>
        {submitting ? "Creating your account…" : "Enter ZUVRE"}
      </button>
    </form>
  );
}
