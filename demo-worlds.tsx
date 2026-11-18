"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ZuriPresence } from "@/components/zuri/zuri-presence";
import { listWorlds, newId, saveWorlds, KEYS, removeKey, type DemoWorld } from "@/lib/demo/store";
import { useDemoAuth } from "./demo-auth-provider";

export function DemoWorlds() {
  const { account } = useDemoAuth();
  const [worlds, setWorlds] = useState<DemoWorld[] | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (account) setWorlds(listWorlds(account.id));
  }, [account]);

  if (!account) return null;

  function create(e: FormEvent) {
    e.preventDefault();
    if (!account) return;
    const trimmed = name.trim();
    if (trimmed.length === 0) return setError("Give your World a name.");
    if (trimmed.length > 120) return setError("Keep the name under 120 characters.");
    if (description.length > 500) return setError("Keep the description under 500 characters.");
    const now = new Date().toISOString();
    const next: DemoWorld = { id: newId("world"), name: trimmed, description: description.trim(), createdAt: now, updatedAt: now };
    const all = [next, ...(worlds ?? [])];
    if (!saveWorlds(account.id, all)) return setError("Couldn't save — local storage may be full or blocked.");
    setWorlds(all);
    setName("");
    setDescription("");
    setError(null);
  }

  function remove(id: string) {
    if (!account) return;
    const all = (worlds ?? []).filter((w) => w.id !== id);
    saveWorlds(account.id, all);
    removeKey(KEYS.messages(account.id, id));
    setWorlds(all);
    setConfirmId(null);
  }

  return (
    <div className="zw-page">
      <p className="zl-eyebrow">Worlds</p>
      <h1 className="zw-h1">Your Worlds</h1>

      <form onSubmit={create} className="zuvre-card zw-panel zw-stack" noValidate aria-labelledby="create-title">
        <h2 id="create-title" className="zw-h3">Create a World</h2>
        <div className="zuvre-form-field">
          <label className="zuvre-form-label" htmlFor="w-name">Name</label>
          <input id="w-name" className="zuvre-input" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} aria-invalid={Boolean(error)} aria-describedby={error ? "w-error" : undefined} placeholder="A new world" />
        </div>
        <div className="zuvre-form-field">
          <label className="zuvre-form-label" htmlFor="w-desc">What is it about? (optional)</label>
          <input id="w-desc" className="zuvre-input" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
        </div>
        {error ? <p id="w-error" className="zw-field-error" role="alert">{error}</p> : null}
        <button type="submit" className="zuvre-button-primary zuvre-focus-ring zw-self-start">Create World</button>
      </form>

      {worlds === null ? (
        <p className="zw-note" role="status">Loading your Worlds…</p>
      ) : worlds.length === 0 ? (
        <div className="zw-empty zuvre-card">
          <ZuriPresence size="sm" />
          <p className="zw-note">No Worlds yet. Name one above and it will appear here.</p>
        </div>
      ) : (
        <ul className="zw-worlds zuvre-card" aria-label="Your Worlds">
          {worlds.map((w) => (
            <li key={w.id}>
              <Link href={`/demo/worlds/${w.id}`} className="zuvre-list-row zw-world-link">
                <span className="zw-world-name">{w.name}</span>
                {w.description ? <span className="zw-note">{w.description}</span> : null}
              </Link>
              {confirmId === w.id ? (
                <span className="zw-confirm" role="group" aria-label={`Delete ${w.name}?`}>
                  <button type="button" className="zw-danger zuvre-focus-ring" onClick={() => remove(w.id)}>Delete for good</button>
                  <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={() => setConfirmId(null)}>Keep</button>
                </span>
              ) : (
                <button type="button" className="zw-quiet-btn zuvre-focus-ring" onClick={() => setConfirmId(w.id)} aria-label={`Delete ${w.name}`}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
