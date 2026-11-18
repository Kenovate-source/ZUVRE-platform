import React from "react";
import LandingPage from "@/app/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DemoLayout from "@/app/demo/layout";
import DemoHomePage from "@/app/demo/home/page";
import DemoWorldsPage from "@/app/demo/worlds/page";
import DemoWorldPage from "@/app/demo/worlds/[worldId]/page";
import DemoChatPage from "@/app/demo/chat/page";
import DemoSettingsPage from "@/app/demo/settings/page";
import { DemoAuthProvider } from "@/components/demo/demo-auth-provider";
/** Emulates the App Router's file-based routing and the root layout's provider. */
export function pageFor(path: string): React.ReactNode {
  if (path === "/") return <LandingPage />;
  if (path === "/login") return <LoginPage />;
  if (path === "/register") return <RegisterPage />;
  if (path === "/demo/home") return <DemoLayout><DemoHomePage /></DemoLayout>;
  if (path === "/demo/worlds") return <DemoLayout><DemoWorldsPage /></DemoLayout>;
  if (/^\/demo\/worlds\/[^/]+$/.test(path)) return <DemoLayout><DemoWorldPage /></DemoLayout>;
  if (path === "/demo/chat") return <DemoLayout><DemoChatPage /></DemoLayout>;
  if (path === "/demo/settings") return <DemoLayout><DemoSettingsPage /></DemoLayout>;
  return <h1 data-testid="not-found">404 · {path}</h1>;
}
export const Root = ({ children }: { children: React.ReactNode }) => <DemoAuthProvider>{children}</DemoAuthProvider>;
