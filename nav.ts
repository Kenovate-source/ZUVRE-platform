const listeners = new Set<() => void>();
export function navigate(url: string, replace = false) { history[replace ? "replaceState" : "pushState"]({}, "", url); listeners.forEach((l) => l()); }
export function subscribe(l: () => void) { listeners.add(l); window.addEventListener("popstate", l); return () => { listeners.delete(l); window.removeEventListener("popstate", l); }; }
export const getPath = () => window.location.pathname;
