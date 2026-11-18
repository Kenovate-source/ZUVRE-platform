import { constantTimeEqual, derivePasswordHash, newSalt, PASSWORD_ITERATIONS, webCryptoAvailable } from "./password";
import { clearSession, getSession, listAccounts, newId, saveAccounts, setSession, storageAvailable, type DemoAccount } from "./store";

/**
 * Pure (non-React) LOCAL DEMO MODE account logic. See config.ts for why this
 * is isolated from real authentication and why it is not production security.
 */

export type DemoField = "email" | "password" | "displayName" | "form";
export type DemoResult<T> = { ok: true; value: T } | { ok: false; error: string; field: DemoField };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export interface SignupInput { displayName: string; email: string; password: string }

/** Validation shared by the form (for live feedback) and signUp (as the authority). */
export function validateSignup(input: SignupInput): { field: DemoField; error: string } | null {
  const name = input.displayName.trim();
  if (name.length < 1) return { field: "displayName", error: "Tell us what to call you." };
  if (name.length > 80) return { field: "displayName", error: "Keep your name under 80 characters." };
  if (!EMAIL_RE.test(normalizeEmail(input.email))) return { field: "email", error: "Enter a valid email address (it stays in this browser)." };
  if (input.password.length < 8) return { field: "password", error: "Use at least 8 characters." };
  if (input.password.length > 200) return { field: "password", error: "That password is longer than 200 characters." };
  return null;
}

function environmentProblem(): string | null {
  if (!storageAvailable()) return "This browser is blocking local storage, so a local demo account can't be saved. Allow site data and try again.";
  if (!webCryptoAvailable()) return "Local demo accounts need a secure context. Open the site at http://localhost:3000 (not a LAN IP address).";
  return null;
}

export async function signUp(input: SignupInput): Promise<DemoResult<DemoAccount>> {
  const problem = environmentProblem();
  if (problem) return { ok: false, error: problem, field: "form" };
  const invalid = validateSignup(input);
  if (invalid) return { ok: false, error: invalid.error, field: invalid.field };

  const email = normalizeEmail(input.email);
  const accounts = listAccounts();
  if (accounts.some((a) => !a.guest && a.email === email)) {
    return { ok: false, error: "A local demo account with that email already exists. Log in instead.", field: "email" };
  }
  const salt = newSalt();
  const account: DemoAccount = {
    id: newId("acct"),
    email,
    displayName: input.displayName.trim(),
    guest: false,
    salt,
    hash: await derivePasswordHash(input.password, salt),
    iterations: PASSWORD_ITERATIONS,
    createdAt: new Date().toISOString(),
  };
  if (!saveAccounts([...accounts, account])) return { ok: false, error: "Couldn't save the account — local storage may be full.", field: "form" };
  setSession({ accountId: account.id, createdAt: new Date().toISOString() });
  return { ok: true, value: account };
}

export async function logIn(emailInput: string, password: string): Promise<DemoResult<DemoAccount>> {
  const problem = environmentProblem();
  if (problem) return { ok: false, error: problem, field: "form" };
  const email = normalizeEmail(emailInput);
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter the email you signed up with.", field: "email" };
  if (password.length === 0) return { ok: false, error: "Enter your password.", field: "password" };

  const account = listAccounts().find((a) => !a.guest && a.email === email);
  // Same message whether the email is unknown or the password is wrong, and the
  // hash is still derived for unknown emails so the two cases take similar time.
  const generic = "That email and password don't match a local demo account.";
  if (!account || !account.salt || !account.hash) {
    await derivePasswordHash(password, newSalt());
    return { ok: false, error: generic, field: "form" };
  }
  const candidate = await derivePasswordHash(password, account.salt, account.iterations ?? PASSWORD_ITERATIONS);
  if (!constantTimeEqual(candidate, account.hash)) return { ok: false, error: generic, field: "form" };
  setSession({ accountId: account.id, createdAt: new Date().toISOString() });
  return { ok: true, value: account };
}

/** One-click entry with no email and no password — nothing credential-like is stored. */
export function continueAsGuest(): DemoResult<DemoAccount> {
  if (!storageAvailable()) return { ok: false, error: "This browser is blocking local storage.", field: "form" };
  const accounts = listAccounts();
  const existing = accounts.find((a) => a.guest);
  const account: DemoAccount = existing ?? { id: newId("guest"), email: "", displayName: "Demo explorer", guest: true, createdAt: new Date().toISOString() };
  if (!existing && !saveAccounts([...accounts, account])) return { ok: false, error: "Couldn't save the demo guest — local storage may be full.", field: "form" };
  setSession({ accountId: account.id, createdAt: new Date().toISOString() });
  return { ok: true, value: account };
}

export function restoreSession(): DemoAccount | null {
  const session = getSession();
  if (!session) return null;
  return listAccounts().find((a) => a.id === session.accountId) ?? null;
}

export function logOut(): void {
  clearSession();
}
