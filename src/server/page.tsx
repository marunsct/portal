import "@/src/styles/globals.css";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { Island } from "@/src/ui/Island";
import { Nav } from "@/src/ui/Nav";
import { Footer } from "@/src/ui/Footer";
import { company } from "@/site.config";

export interface PageContext {
  url: URL;
  params: Record<string, string>;
  search: Record<string, string | undefined>;
  cookies: Record<string, string>;
  headers: Headers;
}

export interface PageMeta {
  title?: string; // without the site suffix
  description?: string;
  noindex?: boolean;
  canonical?: string;
}

export interface Page {
  meta?: PageMeta | ((ctx: PageContext) => PageMeta | Promise<PageMeta>);
  render: (ctx: PageContext) => ReactNode | Promise<ReactNode>;
  /** force a response status (e.g. 404) */
  status?: number;
  cache?: boolean; // default true for pages without cookies/search dependence
}

export class NotFound extends Error {}
export class Redirect extends Error {
  constructor(
    public location: string,
    public code = 302,
  ) {
    super("redirect");
  }
}

export const ASSET_VERSION = process.env.ASSET_VERSION ?? String(Date.now());

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderDocument(body: ReactNode, meta: PageMeta, ctx: PageContext): string {
  const title = meta.title ? `${meta.title} — ${company.name}` : `${company.name} — ${company.tagline}`;
  const description = meta.description ?? company.shortPitch;
  const canonical = meta.canonical ?? `https://www.${company.domain}${ctx.url.pathname}`;
  const html = renderToString(
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Island name="Nav" component={Nav} props={{ pathname: ctx.url.pathname }} />
      <main id="main" style={{ flex: 1 }}>
        {body}
      </main>
      <Footer />
    </>,
  );
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${escape(canonical)}">
${meta.noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escape(company.name)}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(canonical)}">
<meta name="theme-color" content="#f4f5f1">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=${ASSET_VERSION}">
<script type="module" src="/assets/client.js?v=${ASSET_VERSION}" defer></script>
</head>
<body style="display:flex;flex-direction:column;min-height:100dvh">
${html}
</body>
</html>
`;
}
