import { DemoConversation } from "@/components/demo/demo-conversation";

export default function Page() {
  return (
    <div className="zw-page">
      <p className="zl-eyebrow">Chat</p>
      <h1 className="zw-h1">The conversation space</h1>
      <p className="zw-note">Not organised into a World yet — you can move your thinking into one from the Worlds page.</p>
      <DemoConversation scope="general" label="General" />
    </div>
  );
}
