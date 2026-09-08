"use client";

import { useState, type KeyboardEvent } from "react";

/**
 * The one interactive piece of the AI experience — kept as its own small
 * client component (matching the SpotlightButton/EcosystemConstellation
 * precedent from Phase 0) rather than converting a whole page to "use
 * client". Reused both standalone (/app/chat) and inside a World
 * (/app/worlds/[worldId]), which is why worldId is optional.
 */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
export type { ChatMessage };

export function ChatPanel({
  workspaceId,
  worldId,
  initialConversationId,
  initialMessages,
}: {
  workspaceId: string;
  worldId?: string;
  initialConversationId?: string;
  initialMessages?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? []);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, message: text, conversationId, worldId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong");
        return;
      }

      setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="zuvre-card flex flex-col gap-4 p-5">
      <div className="zuvre-chat-messages">
        {messages.length === 0 && (
          <p className="text-sm text-text-muted">
            Give thought a world — start a conversation with ZUVRE AI.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`zuvre-chat-bubble ${
              m.role === "user" ? "zuvre-chat-bubble-user" : "zuvre-chat-bubble-assistant"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-sm text-text-muted">ZUVRE AI is thinking…</p>}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <input
          className="zuvre-input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Give thought a world…"
          disabled={loading}
          aria-label="Message ZUVRE AI"
        />
        <button
          className="zuvre-button-primary zuvre-focus-ring"
          onClick={() => void send()}
          disabled={loading || input.trim().length === 0}
        >
          Send
        </button>
      </div>
    </div>
  );
}
