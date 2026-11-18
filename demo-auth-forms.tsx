"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { validateSignup, type DemoField } from "@/lib/demo/auth";
import { useDemoAuth } from "./demo-auth-provider";

/**
 * Local demo login / signup. Explicit about being browser-only; failures are
 * announced to assistive tech and tied to their fields via aria-describedby.
 */

type FieldErrors = Partial<Record<DemoField, string>>;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="zuvre-form-field">
      <label className="zuvre-form-label" htmlFor={id}>{label}</label>
      {children}
      {error ? <p id={`${id}-error`} className="zw-field-error">{error}</p> : null}
    </div>
  );
}

function AlreadyIn() {
  const { account, logOut } = useDemoAuth();
  return (
    <div className="zw-stack" role="status">
      <p className="zw-note">You&apos;re already in the local demo as <strong>{account?.displayName}</strong>.</p>
      <Link href="/demo/home" className="zuvre-button-primary zuvre-focus-ring">Continue to the demo</Link>
      <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={logOut}>Log out</button>
    </div>
  );
}

function GuestButton({ onDone }: { onDone: () => void }) {
  const { guest } = useDemoAuth();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="zw-stack">
      <button
        type="button"
        className="zuvre-button-secondary zuvre-focus-ring"
        onClick={() => {
          const r = guest();
          if (r.ok) onDone();
          else setError(r.error);
        }}
      >
        Continue as a demo guest
      </button>
      <p className="zw-note">No email, no password — just a local session so you can look around.</p>
      {error ? <p className="zw-field-error" role="alert">{error}</p> : null}
    </div>
  );
}

export function DemoLoginForm() {
  const router = useRouter();
  const { status, logIn } = useDemoAuth();
  const uid = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  if (status === "signed-in") return <AlreadyIn />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    const r = await logIn(email, password);
    setBusy(false);
    if (r.ok) router.push("/demo/home");
    else setErrors({ [r.field]: r.error });
  }

  const eId = `${uid}-email`;
  const pId = `${uid}-password`;
  return (
    <div className="zw-stack">
      <form onSubmit={onSubmit} className="zw-stack" noValidate>
        <Field id={eId} label="Email" error={errors.email}>
          <input id={eId} type="email" autoComplete="email" className="zuvre-input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${eId}-error` : undefined} required />
        </Field>
        <Field id={pId} label="Password" error={errors.password}>
          <input id={pId} type="password" autoComplete="current-password" className="zuvre-input" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? `${pId}-error` : undefined} required />
        </Field>
        {errors.form ? <p className="zw-form-error" role="alert">{errors.form}</p> : null}
        <button type="submit" className="zuvre-button-primary zuvre-focus-ring" disabled={busy}>{busy ? "Checking…" : "Log in to the local demo"}</button>
      </form>
      <div className="zw-or"><span>or</span></div>
      <GuestButton onDone={() => router.push("/demo/home")} />
    </div>
  );
}

export function DemoSignupForm() {
  const router = useRouter();
  const { status, signUp } = useDemoAuth();
  const uid = useId();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  if (status === "signed-in") return <AlreadyIn />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const invalid = validateSignup({ displayName, email, password });
    if (invalid) {
      setErrors({ [invalid.field]: invalid.error });
      return;
    }
    setErrors({});
    setBusy(true);
    const r = await signUp({ displayName, email, password });
    setBusy(false);
    if (r.ok) router.push("/demo/home");
    else setErrors({ [r.field]: r.error });
  }

  const nId = `${uid}-name`;
  const eId = `${uid}-email`;
  const pId = `${uid}-password`;
  return (
    <div className="zw-stack">
      <form onSubmit={onSubmit} className="zw-stack" noValidate>
        <Field id={nId} label="What should we call you?" error={errors.displayName}>
          <input id={nId} autoComplete="nickname" className="zuvre-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} aria-invalid={Boolean(errors.displayName)} aria-describedby={errors.displayName ? `${nId}-error` : undefined} maxLength={80} required />
        </Field>
        <Field id={eId} label="Email (stays in this browser)" error={errors.email}>
          <input id={eId} type="email" autoComplete="email" className="zuvre-input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${eId}-error` : undefined} required />
        </Field>
        <Field id={pId} label="Password (at least 8 characters)" error={errors.password}>
          <input id={pId} type="password" autoComplete="new-password" className="zuvre-input" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? `${pId}-error` : undefined} required />
        </Field>
        {errors.form ? <p className="zw-form-error" role="alert">{errors.form}</p> : null}
        <button type="submit" className="zuvre-button-primary zuvre-focus-ring" disabled={busy}>{busy ? "Creating your demo account…" : "Create a local demo account"}</button>
      </form>
      <div className="zw-or"><span>or</span></div>
      <GuestButton onDone={() => router.push("/demo/home")} />
    </div>
  );
}
