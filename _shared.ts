/**
 * Shared type for every ZUVRE icon component. All icons use `currentColor`
 * for their stroke — wrap with a text-color utility (e.g. text-text-secondary,
 * text-accent-primary) to set color, matching common icon-library convention.
 * Default size/stroke matches Core ZUVRE Icon Set's construction language:
 * 24x24 grid, 1.5 stroke, round caps/joins.
 */
export interface ZuvreIconProps {
  size?: number;
  className?: string;
}
