import fs from "node:fs";
import path from "node:path";

/**
 * Append-only JSON-lines storage on the /data volume. Enough for demo sessions,
 * leads and support tickets at portal scale; swap for Postgres when the volume of
 * tickets justifies it (see docs/OPERATIONS.md).
 */

export function dataDir(): string {
  const dir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function appendJsonl(file: string, record: unknown) {
  const line = JSON.stringify({ ...(record as object), at: new Date().toISOString() }) + "\n";
  fs.appendFileSync(path.join(dataDir(), file), line, { encoding: "utf8", mode: 0o600 });
}

export function readJsonl<T>(file: string): T[] {
  const p = path.join(dataDir(), file);
  if (!fs.existsSync(p)) return [];
  return fs
    .readFileSync(p, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l) as T;
      } catch {
        return null;
      }
    })
    .filter((x): x is T => x !== null);
}

/** Very small per-IP rate limiter for form endpoints (in-memory, per process). */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimited(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  b.count += 1;
  return b.count > limit;
}
