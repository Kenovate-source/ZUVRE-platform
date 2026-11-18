import React, { useSyncExternalStore } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { pageFor, Root } from "./routes";
import { subscribe, getPath } from "./nav";
function App() { const path = useSyncExternalStore(subscribe, getPath, () => "/"); return <Root>{pageFor(path)}</Root>; }
const el = document.getElementById("root")!;
if (el.hasChildNodes()) hydrateRoot(el, <App />); else createRoot(el).render(<App />);
