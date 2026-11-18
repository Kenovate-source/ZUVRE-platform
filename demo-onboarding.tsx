"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ZuriPresence } from "@/components/zuri/zuri-presence";
import { KEYS, readJson, writeJson } from "@/lib/demo/store";

const STEPS = [
  { title: "Welcome to the local demo", body: "Nothing you do here leaves this browser. It's a way to feel how ZUVRE moves before the real backend is connected.", line: "Hello. I'm Zuri. Take your time." },
  { title: "Make a World", body: "A World is a named space for a thought. Create one and it's saved right here, in this browser.", line: "Give a thought somewhere to live." },
  { title: "Talk it through", body: "The conversation space keeps what you write. In demo mode no AI is connected, so it won't answer — that part needs the real product.", line: "I'll be honest: nothing replies yet." },
] as const;

export function DemoOnboarding({ accountId }: { accountId: string }) {
  const [done, setDone] = useState<boolean | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setDone(readJson<{ done?: boolean }>(KEYS.onboarding(accountId), {}).done === true);
  }, [accountId]);

  if (done === null || done) return null;
  const current = STEPS[step] ?? STEPS[0];
  const last = step === STEPS.length - 1;
  const finish = () => {
    writeJson(KEYS.onboarding(accountId), { done: true });
    setDone(true);
  };

  return (
    <section className="zw-onboarding zuvre-card" aria-labelledby="onb-title">
      <div className="zw-onboarding-zuri"><ZuriPresence size="md" nudgeKey={step} caption={current.line} /></div>
      <div className="zw-stack">
        <p className="zl-eyebrow">First time here · {step + 1} of {STEPS.length}</p>
        <h2 id="onb-title" className="zw-h2">{current.title}</h2>
        <p className="zw-note">{current.body}</p>
        <div className="zw-row">
          {step > 0 ? <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={() => setStep(step - 1)}>Back</button> : null}
          {!last ? <button type="button" className="zuvre-button-primary zuvre-focus-ring" onClick={() => setStep(step + 1)}>Next</button> : null}
          {last ? <Link href="/demo/worlds" className="zuvre-button-primary zuvre-focus-ring" onClick={finish}>Create my first World</Link> : null}
          <button type="button" className="zuvre-button-secondary zuvre-focus-ring" onClick={finish}>Skip</button>
        </div>
      </div>
    </section>
  );
}
