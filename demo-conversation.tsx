"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { KEYS, listMessages, newId, removeKey, saveMessages, type DemoMessage } from "@/lib/demo/store";
import { useDemoAuth } from "./demo-auth-provider";

/**
 * A conversation SPACE, not a chatbot: it saves what the visitor writes (per
 * World) so persistence can be seen, and it states — permanently, above the
 * transcript — that no AI is connected in local demo mode. It never invents a
 * reply.
 */
export function DemoConversation({ scope, label }: { scope: string; label: string }) {
  const { account } = useDemoAuth();
  const [messages, setMessages] = useState<DemoMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (account) setMessages(listMessages(account.id, scope));
  }, [account, scope]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  if (!account) return null;

  function send(e: FormEvent) {
    e.preventDefault();
    if (!account) return;
    const text = draft.trim();
    if (text.length === 0) return setError("Write something first.");
    if (text.length > 2000) return setError("Keep it under 2,000 characters.");
    const next = [...(messages ?? []), { id: newId("msg"), role: "user" as const, content: text, createdAt: new Date().toISOString() }];
    if (!saveMessages(account.id, scope, next)) return setError("Couldn't save — local storage may be full or blocked.");
    setMessages(next);
    setDraft("");
    setError(null);
  }

  function clear() {
    if (!account) return;
    removeKey(KEYS.messages(account.id, scope));
    setMessages([]);
  }

  return (
    <section className="zuvre-card zw-convo" aria-label={`Conversation: ${label}`}>
      <p className="zw-banner" role="note">
        <strong>No AI is connected in local demo mode.</strong> Your messages are saved in this browser so you can see
        how a conversation persists — nothing will reply.
      </p>
      <div className="zw-transcript" role="log" aria-live="polite" aria-label="Messages">
        {messages === null ? <p className="zw-note">Loading…</p> : null}
        {messages !== null && messages.length === 0 ? <p className="zw-note">Nothing here yet. Write the first line.</p> : null}
        {messages?.map((m) => (
          <div key={m.id} className="zuvre-chat-bubble zuvre-chat-bubble-user zw-bubble">
            {m.content}
            <span className="zw-bubble-meta">saved locally · {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="zw-compose" noValidate>
        <label className="zl-sr-only" htmlFor={`compose-${scope}`}>Write a message</label>
        <input id={`compose-${scope}`} className="zuvre-input zw-compose-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Give thought a world…" aria-invalid={Boolean(error)} aria-describedby={error ? `compose-error-${scope}` : undefined} />
        <button type="submit" className="zuvre-button-primary zuvre-focus-ring">Save</button>
      </form>
      {error ? <p id={`compose-error-${scope}`} className="zw-field-error" role="alert">{error}</p> : null}
      {messages && messages.length > 0 ? <button type="button" className="zw-quiet-btn zuvre-focus-ring" onClick={clear}>Clear this conversation</button> : null}
    </section>
  );
}
