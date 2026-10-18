import { NextResponse } from "next/server";
import { capacity } from "@/lib/demo";
import { productIds, type ProductId } from "@/lib/products";

export const dynamic = "force-dynamic";

const upstreamEnv: Record<ProductId, string> = {
  devflow: "DEVFLOW_UPSTREAM",
  agentcanvas: "AGENTCANVAS_UPSTREAM",
  matura: "MATURA_UPSTREAM",
};

const healthPath: Record<ProductId, string> = {
  devflow: "/api/health",
  agentcanvas: "/", // the web container's nginx; API health is internal
  matura: "/healthz/live",
};

async function probe(product: ProductId): Promise<"up" | "down" | "unknown"> {
  const base = process.env[upstreamEnv[product]];
  if (!base) return "unknown";
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(base.replace(/\/$/, "") + healthPath[product], {
      signal: ctrl.signal,
      cache: "no-store",
      redirect: "manual",
    });
    clearTimeout(t);
    return res.status < 500 ? "up" : "down";
  } catch {
    return "down";
  }
}

let cache: { at: number; body: unknown } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.at < 10_000) return NextResponse.json(cache.body);
  const entries = await Promise.all(
    productIds.map(async (id) => {
      const health = await probe(id);
      const cap = capacity(id);
      const status = health === "down" ? "down" : cap.available === 0 ? "busy" : health;
      return [id, { status, active: cap.active, max: cap.max, available: cap.available }] as const;
    }),
  );
  const body = { products: Object.fromEntries(entries), checkedAt: new Date().toISOString() };
  cache = { at: Date.now(), body };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
