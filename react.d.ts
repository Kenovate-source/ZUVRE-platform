// Faithful-enough React typings for the sandbox (no @types/react available offline). Hooks/events carry real
// signatures; JSX intrinsic ELEMENT PROPS are intentionally loose (any) — attribute typos are NOT caught here.
declare module "react" {
  export type Key = string | number;
  export type ReactNode = ReactElement | string | number | boolean | null | undefined | Iterable<ReactNode>;
  export interface ReactElement {}
  export type ComponentType<P = {}> = (props: P) => ReactElement | null;
  export interface CSSProperties { [k: string]: string | number | undefined }
  export interface RefObject<T> { current: T | null }
  export interface MutableRefObject<T> { current: T }
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export interface SyntheticEvent<T = Element> { currentTarget: T; target: EventTarget; preventDefault(): void; stopPropagation(): void; defaultPrevented: boolean }
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {}
  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> { target: EventTarget & T }
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T> { key: string; metaKey: boolean; ctrlKey: boolean }
  export interface MouseEvent<T = Element> extends SyntheticEvent<T> { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }
  export function useState<S>(initial: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useRef<T>(initial: T): MutableRefObject<T>;
  export function useRef<T>(initial: T | null): RefObject<T>;
  export function useRef<T = undefined>(): MutableRefObject<T | undefined>;
  export function useCallback<F extends (...args: never[]) => unknown>(fn: F, deps: readonly unknown[]): F;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export function useId(): string;
  export function useSyncExternalStore<S>(subscribe: (cb: () => void) => () => void, getSnapshot: () => S, getServerSnapshot?: () => S): S;
  export interface Context<T> { Provider: ComponentType<{ value: T; children?: ReactNode }> }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(ctx: Context<T>): T;
  export function cache<F extends (...args: never[]) => unknown>(fn: F): F;
}
declare namespace React { type ReactNode = import("react").ReactNode; type FormEvent<T = Element> = import("react").FormEvent<T>; type CSSProperties = import("react").CSSProperties; }
declare namespace JSX {
  interface Element extends import("react").ReactElement {}
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicAttributes { key?: import("react").Key }
  // Event handlers get real contextual types (so `(e) => …` is checked); every other attribute is loose.
  interface HTMLAttrs {
    onChange?: (e: import("react").ChangeEvent<HTMLInputElement>) => void;
    onClick?: (e: import("react").MouseEvent<any>) => void;
    onSubmit?: (e: import("react").FormEvent<HTMLFormElement>) => void;
    onKeyDown?: (e: import("react").KeyboardEvent<any>) => void;
    onPointerEnter?: () => void; onPointerLeave?: () => void; onFocus?: () => void; onBlur?: () => void;
    ref?: ((el: any) => void) | import("react").RefObject<any>;
    [attr: string]: any;
  }
  interface IntrinsicElements { [name: string]: HTMLAttrs }
}
declare module "*.css" { const c: string; export default c; }

declare const process: { env: { NODE_ENV: string; [k: string]: string | undefined } };
