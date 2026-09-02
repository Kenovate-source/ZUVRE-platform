/**
 * The ZUVRE Mark — production reconstruction, v1.
 *
 * Reconstructed from `ZUVRE Monochrome Logo Variants.png` — the one
 * canonical logo source classified as faithfully vector-viable (flat
 * shapes, no gradients/glass/chrome bevels). This is a DELIBERATELY
 * SIMPLIFIED reconstruction: the canonical monochrome mark also carries a
 * secondary interweaving curved stroke that this version omits, because I
 * cannot verify that detail's exact geometry precisely enough to
 * reconstruct it faithfully without a rendering tool to check the result
 * against the source. What's implemented here — the ring, the bold Z
 * glyph crossing it, the small accent dot — are the elements I'm
 * confident about from the canonical reference. This is a controlled
 * production reconstruction of the approved design, not a new
 * interpretation — see ZUVRE_Final_Canonical_Asset_Brand_Authority_Map.md §6
 * and ZUVRE_Implementation_Readiness_and_Brand_Integration_Plan.md §F.4.
 *
 * The full ornate gold/glass primary logo (chrome bevels, glass orbit) is
 * NOT attempted here — it requires a genuine redesign-to-spec pass with
 * visual verification tooling this environment doesn't have. That stays
 * a documented future task, not a silent substitution.
 */
export function ZuvreMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="ZUVRE"
    >
      {/* ring */}
      <circle cx="24" cy="24" r="19" stroke="var(--zuvre-accent-primary)" strokeWidth="2" />
      {/* bold Z glyph */}
      <path
        d="M15 16 H33 L15 32 H33"
        stroke="var(--zuvre-accent-primary)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* accent dot */}
      <circle cx="33.5" cy="32" r="2.4" fill="var(--zuvre-accent-primary)" />
    </svg>
  );
}
