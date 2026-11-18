import type { ReactNode } from "react";
import { DemoGate } from "@/components/demo/demo-gate";
import { DemoShell } from "@/components/demo/demo-shell";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoGate>
      <DemoShell>{children}</DemoShell>
    </DemoGate>
  );
}
