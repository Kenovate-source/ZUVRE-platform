"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { listWorlds, type DemoWorld } from "@/lib/demo/store";
import { useDemoAuth } from "./demo-auth-provider";
import { DemoConversation } from "./demo-conversation";

export function DemoWorldDetail() {
  const { account } = useDemoAuth();
  const params = useParams<{ worldId: string }>();
  const worldId = params?.worldId ?? "";
  const [state, setState] = useState<"loading" | "missing" | DemoWorld>("loading");

  useEffect(() => {
    if (!account) return;
    setState(listWorlds(account.id).find((w) => w.id === worldId) ?? "missing");
  }, [account, worldId]);

  if (!account) return null;
  if (state === "loading") return <div className="zw-page"><p className="zw-note" role="status">Opening your World…</p></div>;
  if (state === "missing") {
    return (
      <div className="zw-page">
        <h1 className="zw-h1">That World isn&apos;t here</h1>
        <p className="zw-note">It may have been deleted, or it belongs to a different local demo account.</p>
        <Link href="/demo/worlds" className="zuvre-button-primary zuvre-focus-ring zw-self-start">Back to your Worlds</Link>
      </div>
    );
  }
  return (
    <div className="zw-page">
      <p className="zl-eyebrow">World</p>
      <h1 className="zw-h1">{state.name}</h1>
      {state.description ? <p className="zw-note">{state.description}</p> : null}
      <DemoConversation scope={state.id} label={state.name} />
    </div>
  );
}
