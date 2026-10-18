import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { demo } from "@/site.config";
import type { ProductId } from "./products";
import { readJsonl, appendJsonl } from "./store";

/**
 * Demo sessions are signed, stateless cookies scoped to the parent domain so the
 * gateway can verify them for every demo host. A small append-only log gives us
 * concurrency limits and a lead list without a database.
 *
 * Cookie value: base64url(payload).base64url(hmac)
 * payload: { id, product, iat, exp }
 */

export interface DemoSession {
  id: string;
  product: ProductId;
  iat: number; // seconds
  exp: number; // seconds
}

function secret(): string {
  const s = process.env.DEMO_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("DEMO_SESSION_SECRET must be set (32+ characters) in production");
  }
  return "development-only-demo-secret-change-me-0123456789";
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString("base64url");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueSession(product: ProductId, minutes = demo.sessionMinutes): { session: DemoSession; token: string } {
  const now = Math.floor(Date.now() / 1000);
  const session: DemoSession = {
    id: randomBytes(9).toString("base64url"),
    product,
    iat: now,
    exp: now + minutes * 60,
  };
  const payload = b64url(JSON.stringify(session));
  return { session, token: `${payload}.${sign(payload)}` };
}

export function verifyToken(token: string | undefined | null): DemoSession | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DemoSession;
    if (typeof session.exp !== "number" || session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

/** Which product does a demo hostname belong to? */
export function productForHost(host: string | null): ProductId | "id" | null {
  if (!host) return null;
  const bare = host.split(":")[0].toLowerCase();
  const zone = demo.zone.toLowerCase();
  if (!bare.endsWith(`.${zone}`)) return null;
  const label = bare.slice(0, -(zone.length + 1));
  for (const [key, value] of Object.entries(demo.hosts)) {
    if (value === label) return key as ProductId | "id";
  }
  return null;
}

/** Cookie domain: the registrable parent shared by the portal and the demo hosts. */
export function cookieDomain(): string | undefined {
  const explicit = process.env.DEMO_COOKIE_DOMAIN;
  if (explicit) return explicit;
  // demo.zone is "demo.<domain>"; the cookie must cover <domain> and *.demo.<domain>.
  const parts = demo.zone.split(".");
  if (parts[0] === "demo" && parts.length > 1) {
    const parent = parts.slice(1).join(".");
    // Chromium rejects cookies scoped to "localhost"; host-only cookies still let
    // the launch page work locally (the demo hosts then need DEMO_GATE_DISABLED).
    if (parent === "localhost") return undefined;
    return "." + parent;
  }
  return undefined;
}

export function cookieHeader(token: string, expSeconds: number): string {
  const attrs = [
    `${demo.cookieName}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${new Date(expSeconds * 1000).toUTCString()}`,
  ];
  const domain = cookieDomain();
  if (domain) attrs.push(`Domain=${domain}`);
  if (demo.scheme === "https") attrs.push("Secure");
  return attrs.join("; ");
}

export function clearCookieHeader(): string {
  const attrs = [`${demo.cookieName}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  const domain = cookieDomain();
  if (domain) attrs.push(`Domain=${domain}`);
  return attrs.join("; ");
}

export function readCookie(cookieHeaderValue: string | null, name = demo.cookieName): string | null {
  if (!cookieHeaderValue) return null;
  for (const part of cookieHeaderValue.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

/* ---- concurrency accounting ------------------------------------------- */

interface SessionRecord {
  id: string;
  product: ProductId;
  iat: number;
  exp: number;
  ended?: boolean;
}

const SESSIONS_FILE = "sessions.jsonl";

export function activeSessions(product?: ProductId): SessionRecord[] {
  const now = Math.floor(Date.now() / 1000);
  const records = readJsonl<SessionRecord>(SESSIONS_FILE);
  const ended = new Set(records.filter((r) => r.ended).map((r) => r.id));
  const live = new Map<string, SessionRecord>();
  for (const r of records) {
    if (r.ended) continue;
    if (ended.has(r.id)) continue;
    if (r.exp <= now) continue;
    if (product && r.product !== product) continue;
    live.set(r.id, r);
  }
  return [...live.values()];
}

export function recordSession(s: DemoSession) {
  appendJsonl(SESSIONS_FILE, { id: s.id, product: s.product, iat: s.iat, exp: s.exp });
}

export function endSession(id: string, product: ProductId) {
  appendJsonl(SESSIONS_FILE, { id, product, iat: 0, exp: 0, ended: true });
}

export function capacity(product: ProductId) {
  const active = activeSessions(product).length;
  return { active, max: demo.maxConcurrent, available: Math.max(0, demo.maxConcurrent - active) };
}
