import Link from "next/link";
import { AuthScene } from "@/components/auth/auth-scene";
import { LoginForm } from "@/components/login-form";
import { DemoLoginForm } from "@/components/demo/demo-auth-forms";
import { DEMO_MODE_ENABLED } from "@/lib/demo/config";

export default function LoginPage() {
  return (
    <AuthScene
      title={DEMO_MODE_ENABLED ? "Log in to the local demo" : "Welcome back"}
      intro={DEMO_MODE_ENABLED ? "Use a local demo account you created in this browser — or step in as a guest." : undefined}
      caption="Welcome back. Your Worlds are where you left them."
      footer={<>New to ZUVRE? <Link href="/register" className="zl-accent">Create an account</Link> · <Link href="/" className="zl-accent">Back to exploring</Link></>}
    >
      {DEMO_MODE_ENABLED ? <DemoLoginForm /> : <LoginForm />}
    </AuthScene>
  );
}
