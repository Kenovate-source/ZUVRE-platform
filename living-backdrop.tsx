import { BackdropEffects } from "./backdrop-effects";

/**
 * One fixed environment behind the whole page. The four art layers are
 * crops of approved panels from the Background Texture reference sheet
 * (see scripts/build-brand-assets.py); AtmosphereController cross-fades
 * between them as the visitor moves through the page. `quiet` is the calmer
 * variant used behind the application and auth screens. Server component:
 * the layers are pure CSS, only the particle canvas is client code.
 */
export function LivingBackdrop({ quiet = false }: { quiet?: boolean }) {
  return (
    <div className={`zl-backdrop${quiet ? " zl-backdrop--quiet" : ""}`} aria-hidden="true">
      <div className="zl-env zl-env--deep" />
      <div className="zl-env zl-env--nebula" />
      <div className="zl-env zl-env--depth" />
      <div className="zl-env zl-env--glow" />
      <div className="zl-tint" />
      <div className="zl-vignette" />
      <BackdropEffects />
    </div>
  );
}
