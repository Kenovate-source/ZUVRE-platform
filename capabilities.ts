/**
 * The single source of truth for what ZUVRE's landing page says about
 * capabilities. Every section that mentions a capability reads from here —
 * adding one means adding one entry, not editing six components.
 *
 * TRUTHFULNESS RULES (enforced by scripts/verify-landing.mjs):
 *  - "available" requires an `evidence` path to real, existing code, and
 *    capabilities with kind "capability" must also be registered in
 *    apps/web/src/server/capabilities/bootstrap.ts.
 *  - There is deliberately NO "in development" status: nothing in the repo
 *    documents active development of any unbuilt capability, and using it as
 *    a softer word for "not implemented" would be misleading.
 *
 * Inventory source: docs/01-product-bible.md §1 (communicate, create, learn,
 * research, build websites/apps/games, automate, agents, publish, monetize),
 * docs/09-capability-system.md (website/app/game, image/video/audio,
 * sticker, document, research, external integrations), docs/01 pillars
 * (agency with accountability, owner control center).
 */

/**
 * "in-development" exists in the vocabulary so it can be used honestly the day
 * something is genuinely being built — but NO entry uses it today, because
 * nothing in the repository documents work in progress on any unbuilt
 * capability. scripts/verify-landing.mjs fails the build of the page if an
 * "in-development" entry has no `evidence` pointing at real work-in-progress code.
 */
export type CapabilityStatus = "available" | "in-development" | "planned";

export const STATUS_LABEL: Record<CapabilityStatus, string> = {
  available: "Available now",
  "in-development": "In development",
  planned: "Planned",
};

export const STATUS_DEFINITION: Record<CapabilityStatus, string> = {
  available: "Implemented in the product and usable today.",
  "in-development": "Being built right now — not usable yet.",
  planned: "Part of the product vision — designed for, but not built yet.",
};

/** "capability" = registered execution capability; "experience" = a product surface. */
export type EntryKind = "capability" | "experience";

/** Keys of icons that exist in the canonical icon set we've built. No icon ⇒ no key. */
export type CapabilityIconKey = "ai-model" | "writing" | "image" | "video" | "website" | "ai-automation";

export interface CapabilityEntry {
  id: string;
  name: string;
  kind: EntryKind;
  status: CapabilityStatus;
  note: string;
  icon?: CapabilityIconKey;
  /** Path (repo-relative) proving an "available" entry. Required when available. */
  evidence?: string;
  /** Registered capability id, for kind "capability" entries that are available. */
  capabilityId?: string;
}

export interface CapabilityFamily {
  id: string;
  name: string;
  blurb: string;
  entries: readonly CapabilityEntry[];
}

export const FAMILIES: readonly CapabilityFamily[] = [
  {
    id: "converse",
    name: "Converse & Learn",
    blurb: "Where most ideas begin: talking something through, asking, researching, learning.",
    entries: [
      {
        id: "ai-chat",
        name: "AI chat",
        kind: "capability",
        status: "available",
        note: "Hold a conversation with ZUVRE AI. Conversations are saved and can be continued inside a World.",
        icon: "ai-model",
        evidence: "apps/web/src/server/capabilities/ai-chat.ts",
        capabilityId: "ai.chat",
      },
      { id: "research", name: "Research workflows", kind: "capability", status: "planned", note: "Sources, comparisons and structured findings — able to work outside ZUVRE when you allow it." },
      { id: "learning", name: "Learning & guidance", kind: "experience", status: "planned", note: "Ways to learn with ZUVRE, described in the product vision but not yet designed in detail." },
    ],
  },
  {
    id: "create",
    name: "Create",
    blurb: "Giving an idea a form: words, pictures, motion, sound, documents.",
    entries: [
      { id: "writing", name: "Writing & text", kind: "capability", status: "planned", note: "Rewrite, improve, summarize and expand — a dedicated capability, separate from chat.", icon: "writing" },
      { id: "image", name: "Image generation", kind: "capability", status: "planned", note: "Pictures from a description, produced through the same capability pipeline.", icon: "image" },
      { id: "video", name: "Video generation", kind: "capability", status: "planned", note: "Moving images from an idea.", icon: "video" },
      { id: "audio", name: "Audio & music", kind: "capability", status: "planned", note: "Voice, sound and music creation." },
      { id: "stickers", name: "Sticker creation", kind: "capability", status: "planned", note: "Stickers that are made, not just used." },
      { id: "documents", name: "Document creation", kind: "capability", status: "planned", note: "Structured documents produced and kept as artifacts." },
    ],
  },
  {
    id: "build",
    name: "Build",
    blurb: "Turning an idea into something people can use or play.",
    entries: [
      { id: "website", name: "Website generation", kind: "capability", status: "planned", note: "Websites built from a conversation.", icon: "website" },
      { id: "app", name: "Application generation", kind: "capability", status: "planned", note: "Applications built from a conversation." },
      { id: "game", name: "Game generation", kind: "capability", status: "planned", note: "Games — the capability contract supports it; no game capability ships yet." },
    ],
  },
  {
    id: "act",
    name: "Act & Automate",
    blurb: "Work that continues without you watching — always inside a permission model you can see.",
    entries: [
      { id: "agents", name: "Agents", kind: "capability", status: "planned", note: "Agents that act across ZUVRE and, only with your explicit permission, outside it." },
      { id: "automation", name: "Automation workflows", kind: "capability", status: "planned", note: "Repeatable, intelligent workflows.", icon: "ai-automation" },
      { id: "integrations", name: "External integrations", kind: "capability", status: "planned", note: "Connections to the tools and services you already use." },
    ],
  },
  {
    id: "share",
    name: "Share & Collaborate",
    blurb: "Sending what you make into the world, and making it with other people.",
    entries: [
      { id: "publishing", name: "Publishing & sharing", kind: "experience", status: "planned", note: "Links and QR codes for what you create. The data model exists; the feature does not yet." },
      { id: "monetization", name: "Monetization", kind: "experience", status: "planned", note: "The product vision includes eventually monetizing what you make. Payment integration is a later phase." },
      { id: "collaboration", name: "Communication & collaboration", kind: "experience", status: "planned", note: "Working with other people inside shared Worlds." },
    ],
  },
] as const;

/** The product surface everything gathers in — shown as the explorer's centre. */
export const WORLDS_HUB: { id: "worlds"; name: string; blurb: string; entries: readonly CapabilityEntry[] } = {
  id: "worlds",
  name: "Worlds",
  blurb: "A World is where thought gathers: a named space that holds your conversations and, in time, everything you create from them.",
  entries: [
    {
      id: "worlds",
      name: "Worlds",
      kind: "experience",
      status: "available",
      note: "Create a World, give it a name and a purpose, and keep its conversations together.",
      evidence: "apps/web/src/app/app/worlds/page.tsx",
    },
    {
      id: "persistent-conversations",
      name: "Persistent conversations",
      kind: "experience",
      status: "available",
      note: "Leave and come back — your conversation with ZUVRE AI inside a World is exactly where you left it.",
      evidence: "apps/web/src/app/api/chat/route.ts",
    },
    {
      id: "accounts",
      name: "Accounts & private workspaces",
      kind: "experience",
      status: "available",
      note: "Registration creates your own workspace. Every request is checked against your membership of it.",
      evidence: "apps/web/src/server/auth/register.ts",
    },
  ],
};

export interface InventoryCounts { available: number; planned: number; total: number; families: number }

export function inventoryCounts(): InventoryCounts {
  let available = 0;
  let planned = 0;
  for (const family of FAMILIES) {
    for (const entry of family.entries) {
      if (entry.status === "available") available += 1;
      else planned += 1;
    }
  }
  return { available, planned, total: available + planned, families: FAMILIES.length };
}

/* ------------------------------------------------------------------ */
/* Thought → Movement → Form → Creation → World                       */
/* ------------------------------------------------------------------ */

export interface PhilosophyStage {
  id: string;
  name: string;
  line: string;
  today: string;
  status: CapabilityStatus;
  /** id of the evidenced entry that makes an "available" claim true (checked by scripts/verify-landing.mjs). */
  backedBy?: string;
}

export const PHILOSOPHY_STAGES: readonly PhilosophyStage[] = [
  { id: "thought", name: "Thought", line: "It starts as an idea — half-formed, maybe just a sentence.", today: "You can type it into a conversation with ZUVRE AI right now.", status: "available", backedBy: "ai-chat" },
  { id: "movement", name: "Movement", line: "The idea moves: questioned, reshaped, pushed further.", today: "Conversations are saved, so an idea can keep moving across days.", status: "available", backedBy: "persistent-conversations" },
  { id: "form", name: "Form", line: "Capabilities give it shape — words, images, sound, structure.", today: "Not yet. Today the only live capability is chat; the rest are planned.", status: "planned" },
  { id: "creation", name: "Creation", line: "Agents and capabilities build alongside you.", today: "Not yet. Agents and creation capabilities are designed for, not built.", status: "planned" },
  { id: "world", name: "World", line: "Everything gathers somewhere that is yours.", today: "Worlds exist: create one, name it, and keep its conversations together.", status: "available", backedBy: "worlds" },
] as const;

/* ------------------------------------------------------------------ */
/* Agency & control                                                   */
/* ------------------------------------------------------------------ */

export interface ControlEntry {
  id: string;
  name: string;
  note: string;
  status: CapabilityStatus;
  evidence?: string;
}

export const CONTROLS: readonly ControlEntry[] = [
  { id: "membership", name: "Workspace-scoped access", note: "Every request is checked against your active membership of the exact workspace it names — not merely that you are signed in.", status: "available", evidence: "apps/web/src/server/auth/workspace-access.ts" },
  { id: "grants", name: "Capability grants", note: "A capability only runs if it has been granted to your workspace, and can be blocked.", status: "available", evidence: "apps/web/src/server/capabilities/run-capability.ts" },
  { id: "records", name: "Execution records", note: "Every capability run is recorded — what ran, with what input, and how it ended.", status: "available", evidence: "apps/web/src/server/capabilities/run-capability.ts" },
  { id: "sessions", name: "Revocable sessions", note: "Signing out revokes your session on the server, not just in your browser.", status: "available", evidence: "apps/web/src/server/auth/session.ts" },
  { id: "agent-permissions", name: "Agent permissions", note: "Agents will act only inside permissions you can see and revoke.", status: "planned" },
  { id: "owner-center", name: "Owner control center", note: "Platform-level oversight, built to be far more capable than an ordinary admin panel.", status: "planned" },
] as const;

/* ------------------------------------------------------------------ */
/* Today                                                              */
/* ------------------------------------------------------------------ */

/**
 * `href` is a union of literal route strings, not `string`: this project
 * enables Next's `typedRoutes`, under which <Link href={string}> fails the
 * type-check. Each literal below is checked against the real route table.
 */
export type TodayHref = "/register" | "/app/worlds" | "/app/chat" | "/app/home";

export interface TodayStep { id: string; title: string; body: string; href: TodayHref; cta: string; needsAccount: boolean }

export const TODAY_STEPS: readonly TodayStep[] = [
  { id: "account", title: "Create your account", body: "Registration gives you a private workspace of your own.", href: "/register", cta: "Create an account", needsAccount: false },
  { id: "world", title: "Create a World", body: "Name it, say what it is for, and step inside.", href: "/app/worlds", cta: "Open Worlds", needsAccount: true },
  { id: "talk", title: "Talk with ZUVRE AI", body: "Think out loud inside your World. The conversation is saved as you go.", href: "/app/chat", cta: "Open chat", needsAccount: true },
  { id: "return", title: "Come back and continue", body: "Return to the World and the conversation is where you left it.", href: "/app/home", cta: "Go to Home", needsAccount: true },
] as const;

/* ------------------------------------------------------------------ */
/* Zuri's captions — authored, static, and truthful                   */
/* ------------------------------------------------------------------ */

/** Keyed by explorer node id. Zuri comments; it never claims to understand or decide anything. */
export const ZURI_LINES: Record<string, string> = {
  worlds: "A World is where it all gathers. You can make one today.",
  converse: "Most ideas start here, in conversation — and it's the part that works today.",
  create: "Words, pictures, sound, motion. All planned — none of it built yet.",
  build: "Websites, apps, games. The contract is ready; the capabilities aren't.",
  act: "Agents will only ever act inside permissions you can see.",
  share: "Sharing and working together come after the rest exists.",
};
