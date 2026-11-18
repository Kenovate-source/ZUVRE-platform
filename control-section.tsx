import { CONTROLS } from "@/content/capabilities";
import { Reveal } from "./reveal";
import { StatusChip } from "./status-chip";

export function ControlSection() {
  return (
    <section id="control" className="zl-section" data-zl-section="control" aria-labelledby="control-title">
      <div className="zl-wrap zl-control">
        <div className="zl-control-copy">
          <p className="zl-eyebrow">Agency &amp; control</p>
          <h2 id="control-title" className="zl-h2">Nothing acts on your behalf silently.</h2>
          <p className="zl-pull">
            Anything ZUVRE does for you passes through the same permissions, and leaves a record.
          </p>
          <p className="zl-lede">
            Here is what already protects your workspace — and, plainly labelled, what is still to come.
          </p>
        </div>
        <Reveal>
          <ul className="zl-ledger zuvre-card" aria-label="Controls and their status">
            {CONTROLS.map((control) => (
              <li key={control.id}>
                <span className="zl-ledger-name">{control.name}</span>
                <StatusChip status={control.status} />
                <p className="zl-ledger-note">{control.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
