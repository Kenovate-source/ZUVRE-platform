import React from "react";
import { navigate } from "./nav";
export default function Link({ href, children, onClick, ...rest }: any) {
  return <a href={href} {...rest} onClick={(e) => { onClick?.(e); if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; if (typeof href === "string" && href.startsWith("/")) { e.preventDefault(); navigate(href); } }}>{children}</a>;
}
