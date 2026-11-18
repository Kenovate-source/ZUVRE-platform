import type { ReactNode } from "react";
import { AppShellNav } from "@/components/app-shell-nav";
import { LivingBackdrop } from "@/components/landing/living-backdrop";
import { DemoSignOutButton } from "./demo-sign-out";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <div className="zuvre-app-shell zl-root">
      <LivingBackdrop quiet />
      <AppShellNav variant="demo" signOut={<DemoSignOutButton />} />
      <main className="zuvre-app-main" id="main">
        <p className="zw-ribbon" role="note">Local demo — everything here lives only in this browser. No server, no AI.</p>
        {children}
      </main>
    </div>
  );
}
