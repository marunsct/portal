import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { routes } from "./routes";
import { matchPattern } from "./router";
import { NotFound, Redirect, renderDocument, type PageContext, type PageMeta } from "./page";
import { notFoundPage } from "@/src/pages/not-found";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOSTNAME ?? "0.0.0.0";
const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const ASSETS_DIR = path.join(ROOT, "dist", "client");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json",
};

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const pageCache = new Map<string, { html: string; status: number }>();

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = part.slice(i + 1).trim();
  }
  return out;
}

function toWebRequest(req: http.IncomingMessage, url: URL): Request {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
    else if (v !== undefined) headers.set(k, v);
  }
  const method = req.method ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  return new Request(url, {
    method,
    headers,
    body: hasBody ? (Readable.toWeb(req) as unknown as ReadableStream) : undefined,
    // @ts-expect-error Node requires duplex for streaming bodies
    duplex: hasBody ? "half" : undefined,
  });
}

async function sendWebResponse(res: http.ServerResponse, out: Response) {
  res.statusCode = out.status;
  out.headers.forEach((v, k) => {
    if (k.toLowerCase() === "set-cookie") return;
    res.setHeader(k, v);
  });
  const cookies = out.headers.getSetCookie?.() ?? [];
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) if (!res.hasHeader(k)) res.setHeader(k, v);
  const buf = Buffer.from(await out.arrayBuffer());
  res.end(buf);
}

function serveFile(res: http.ServerResponse, file: string, cacheSeconds: number): boolean {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
  const ext = path.extname(file).toLowerCase();
  res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
  res.setHeader("Cache-Control", cacheSeconds ? `public, max-age=${cacheSeconds}` : "no-cache");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  fs.createReadStream(file).pipe(res);
  return true;
}

function sendHtml(res: http.ServerResponse, html: string, status = 200, cache = true) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", cache ? "public, max-age=60, stale-while-revalidate=600" : "no-store");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  res.end(html);
}

async function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const proto = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] ?? "http";
  const host = (req.headers["x-forwarded-host"] as string | undefined)?.split(",")[0] ?? req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `${proto}://${host}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  // Static assets
  if (pathname.startsWith("/assets/")) {
    const file = path.join(ASSETS_DIR, path.normalize(pathname.slice("/assets/".length)));
    if (file.startsWith(ASSETS_DIR) && serveFile(res, file, 31536000)) return;
  }
  if (pathname !== "/") {
    const file = path.join(PUBLIC_DIR, path.normalize(pathname));
    if (file.startsWith(PUBLIC_DIR) && serveFile(res, file, 3600)) return;
  }

  for (const route of routes) {
    const params = matchPattern(route.pattern, pathname);
    if (!params) continue;

    if (route.kind === "api") {
      const handler = route.methods[req.method ?? "GET"];
      if (!handler) {
        res.statusCode = 405;
        res.setHeader("Allow", Object.keys(route.methods).join(", "));
        return res.end("method not allowed");
      }
      try {
        const out = await handler(toWebRequest(req, url));
        return await sendWebResponse(res, out);
      } catch (err) {
        console.error(`api ${pathname}:`, err);
        res.statusCode = 500;
        return res.end("internal error");
      }
    }

    const ctx: PageContext = {
      url,
      params,
      search: Object.fromEntries(url.searchParams.entries()),
      cookies: parseCookies(req.headers.cookie),
      headers: new Headers(req.headers as Record<string, string>),
    };
    const cacheable = route.page.cache !== false && url.search === "" && process.env.NODE_ENV === "production";
    const key = pathname;
    if (cacheable && pageCache.has(key)) {
      const c = pageCache.get(key)!;
      return sendHtml(res, c.html, c.status);
    }
    try {
      const meta: PageMeta = typeof route.page.meta === "function" ? await route.page.meta(ctx) : (route.page.meta ?? {});
      const body = await route.page.render(ctx);
      const html = renderDocument(body, meta, ctx);
      const status = route.page.status ?? 200;
      if (cacheable) pageCache.set(key, { html, status });
      return sendHtml(res, html, status, cacheable);
    } catch (err) {
      if (err instanceof Redirect) {
        res.statusCode = err.code;
        res.setHeader("Location", err.location);
        return res.end();
      }
      if (err instanceof NotFound) break;
      console.error(`page ${pathname}:`, err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      return res.end("Something went wrong rendering this page.");
    }
  }

  const ctx: PageContext = { url, params: {}, search: {}, cookies: {}, headers: new Headers() };
  const html = renderDocument(await notFoundPage.render(ctx), { title: "Not found", noindex: true }, ctx);
  sendHtml(res, html, 404, false);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) res.statusCode = 500;
    res.end();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`portal listening on http://${HOST}:${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
