import { STATUS_LABEL, type CapabilityStatus } from "@/content/capabilities";

/** Status is always conveyed in words, never by colour alone. */
export function StatusChip({ status }: { status: CapabilityStatus }) {
  return <span className={`zl-chip zl-chip--${status}`}>{STATUS_LABEL[status]}</span>;
}
