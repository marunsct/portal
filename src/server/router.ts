import type { Page } from "./page";

export interface ApiHandler {
  (req: Request): Promise<Response> | Response;
}

interface PageRoute {
  kind: "page";
  pattern: string;
  page: Page;
}
interface ApiRoute {
  kind: "api";
  pattern: string;
  methods: Record<string, ApiHandler>;
}
export type Route = PageRoute | ApiRoute;

/**
 * Patterns: literal segments, ":name" for one segment, "*name" for the rest.
 * Routes are matched in order; put specific ones first.
 */
export function matchPattern(pattern: string, pathname: string): Record<string, string> | null {
  const p = pattern.split("/").filter(Boolean);
  const u = pathname.split("/").filter(Boolean).map((s) => decodeURIComponent(s));
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    const seg = p[i];
    if (seg.startsWith("*")) {
      params[seg.slice(1)] = u.slice(i).join("/");
      return params;
    }
    if (i >= u.length) return null;
    if (seg.startsWith(":")) params[seg.slice(1)] = u[i];
    else if (seg !== u[i]) return null;
  }
  return u.length === p.length ? params : null;
}

export function page(pattern: string, page: Page): PageRoute {
  return { kind: "page", pattern, page };
}
export function api(pattern: string, methods: Record<string, ApiHandler>): ApiRoute {
  return { kind: "api", pattern, methods };
}
