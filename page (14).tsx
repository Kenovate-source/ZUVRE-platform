import Link from "next/link";
import { AuthScene } from "@/components/auth/auth-scene";
import { RegisterForm } from "@/components/register-form";
import { DemoSignupForm } from "@/components/demo/demo-auth-forms";
import { DEMO_MODE_ENABLED } from "@/lib/demo/config";

export default function RegisterPage() {
  return (
    <AuthScene
      title={DEMO_MODE_ENABLED ? "Create a local demo account" : "Enter ZUVRE"}
      intro={DEMO_MODE_ENABLED ? "Nothing leaves this browser. Your password is hashed locally and never sent anywhere." : undefined}
      caption="Come in. Give a thought somewhere to live."
      footer={<>Already have an account? <Link href="/login" className="zl-accent">Log in</Link> · <Link href="/" className="zl-accent">Back to exploring</Link></>}
    >
      {DEMO_MODE_ENABLED ? <DemoSignupForm /> : <RegisterForm />}
    </AuthScene>
  );
}
