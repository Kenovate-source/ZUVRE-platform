import { DEMO_STORAGE_PREFIX } from "./config";

/**
 * The only module that touches localStorage for demo mode. Every read is
 * defensive (storage can be unavailable, full, or hold corrupt JSON) and
 * degrades to an empty/default value rather than throwing.
 */

export interface DemoAccount {
  id: string;
  email: string;
  displayName: string;
  /** A guest account has no password and no email; it exists only to enter the demo. */
  guest: boolean;
  salt?: string;
  hash?: string;
  iterations?: number;
  createdAt: string;
}

export interface DemoWorld {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoMessage {
  id: string;
  /** Local demo conversations only ever hold what the visitor typed — no reply is ever fabricated. */
  role: "user";
  content: string;
  createdAt: string;
}

export interface DemoSession {
  accountId: string;
  createdAt: string;
}

const k = (name: string) => `${DEMO_STORAGE_PREFIX}.${name}`;
export const KEYS = {
  accounts: k("accounts"),
  session: k("session"),
  worlds: (accountId: string) => k(`worlds.${accountId}`),
  messages: (accountId: string, scope: string) => k(`messages.${accountId}.${scope}`),
  onboarding: (accountId: string) => k(`onboarding.${accountId}`),
} as const;

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const s = storage();
  if (!s) return fallback;
  try {
    const raw = s.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  const s = storage();
  if (!s) return false;
  try {
    s.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    storage()?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const storageAvailable = (): boolean => storage() !== null;

export function newId(prefix: string): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  return `${prefix}_${rand}`;
}

/** Removes every key this mode owns (and only those). Returns how many were removed. */
export function resetAllDemoData(): number {
  const s = storage();
  if (!s) return 0;
  const doomed: string[] = [];
  for (let i = 0; i < s.length; i += 1) {
    const key = s.key(i);
    if (key && key.startsWith(`${DEMO_STORAGE_PREFIX}.`)) doomed.push(key);
  }
  for (const key of doomed) s.removeItem(key);
  return doomed.length;
}

export const listAccounts = (): DemoAccount[] => readJson<DemoAccount[]>(KEYS.accounts, []);
export const saveAccounts = (accounts: DemoAccount[]): boolean => writeJson(KEYS.accounts, accounts);
export const getSession = (): DemoSession | null => readJson<DemoSession | null>(KEYS.session, null);
export const setSession = (session: DemoSession): boolean => writeJson(KEYS.session, session);
export const clearSession = (): void => removeKey(KEYS.session);

export const listWorlds = (accountId: string): DemoWorld[] => readJson<DemoWorld[]>(KEYS.worlds(accountId), []);
export const saveWorlds = (accountId: string, worlds: DemoWorld[]): boolean => writeJson(KEYS.worlds(accountId), worlds);
export const listMessages = (accountId: string, scope: string): DemoMessage[] => readJson<DemoMessage[]>(KEYS.messages(accountId, scope), []);
export const saveMessages = (accountId: string, scope: string, messages: DemoMessage[]): boolean => writeJson(KEYS.messages(accountId, scope), messages);
