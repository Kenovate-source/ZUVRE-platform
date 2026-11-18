import { Reveal } from "./reveal";
import { ThoughtPath } from "./thought-path";

export function IdeaSection() {
  return (
    <section id="idea" className="zl-section" data-zl-section="idea" aria-labelledby="idea-title">
      <div className="zl-wrap">
        <div className="zl-idea-head">
          <p className="zl-eyebrow">The idea</p>
          <h2 id="idea-title" className="zl-h2">More than a collection of AI tools.</h2>
          <p className="zl-lede">
            A tool waits for you to pick it. ZUVRE starts from what you are trying to make, and lets conversation,
            capabilities and agents gather around it — in one place, under one set of permissions.
          </p>
        </div>
        <Reveal>
          <ThoughtPath />
        </Reveal>
      </div>
    </section>
  );
}
