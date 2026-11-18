"use client";

import { useRouter } from "next/navigation";
import { useDemoAuth } from "./demo-auth-provider";

export function DemoSignOutButton() {
  const { logOut } = useDemoAuth();
  const router = useRouter();
  return (
    <button
      type="button"
      className="zuvre-app-nav-link zw-navbtn"
      onClick={() => {
        logOut();
        router.push("/");
      }}
    >
      Log out
    </button>
  );
}
