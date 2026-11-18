/// <reference path="./routes.d.ts" />
declare module "next" { export type Metadata = Record<string, unknown>; export type Viewport = Record<string, unknown>; export type Route = import("./routes").AppRoute }
declare module "next/image" {
  type AriaProps = { [K in `aria-${string}`]?: string | boolean };
  export interface ImageProps extends AriaProps { src: string; alt: string; width: number; height: number; className?: string; sizes?: string; priority?: boolean; style?: import("react").CSSProperties; draggable?: boolean; loading?: "lazy" | "eager" }
  export default function Image(props: ImageProps): JSX.Element;
}
declare module "next/link" {
  import type { AppRoute } from "./routes";
  type AriaProps = { [K in `aria-${string}`]?: string | boolean };
  // typedRoutes: href must be a known route (or URL). A plain `string` is a TYPE ERROR, exactly as on Vercel.
  export default function Link(props: AriaProps & { href: AppRoute | URL; className?: string; title?: string; children?: import("react").ReactNode; onClick?: (e: import("react").MouseEvent<HTMLAnchorElement>) => void }): JSX.Element;
}
declare module "next/navigation" {
  import type { AppRoute } from "./routes";
  export function useRouter(): { push(href: AppRoute): void; replace(href: AppRoute): void; refresh(): void; back(): void; prefetch(href: AppRoute): void };
  export function usePathname(): string | null;
  export function useParams<T extends Record<string, string> = Record<string, string>>(): T | null;
  export function useSearchParams(): URLSearchParams | null;
  export function redirect(url: string): never;
  export function notFound(): never;
}
declare module "next/font/google" {
  interface FontResult { className: string; variable: string; style: { fontFamily: string } }
  export function Cormorant_Garamond(o: Record<string, unknown>): FontResult;
  export function Inter(o: Record<string, unknown>): FontResult;
  export function IBM_Plex_Mono(o: Record<string, unknown>): FontResult;
}
