import { useSyncExternalStore } from "react";
import { navigate, subscribe, getPath } from "./nav";
export function useRouter() { return { push: (u: string) => navigate(u), replace: (u: string) => navigate(u, true), refresh: () => {}, back: () => history.back(), prefetch: () => {} }; }
export function usePathname() { return useSyncExternalStore(subscribe, getPath, () => "/"); }
export function useParams<T = Record<string, string>>(): T { const m = usePathname().match(/^\/demo\/worlds\/([^/]+)$/); return (m ? { worldId: decodeURIComponent(m[1] as string) } : {}) as T; }
export function useSearchParams() { return new URLSearchParams(window.location.search); }
