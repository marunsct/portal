import { NextResponse } from "next/server";
import { capacity, cookieHeader, issueSession, recordSession } from "@/lib/demo";
import { productById, type ProductId } from "@/lib/products";
import { appendJsonl, rateLimited } from "@/lib/store";
import { demo, demoUrl } from "@/site.config";

export const dynamic = "force-dynamic";

/**
 * POST /api/demo/start  (form or JSON)
 * body: product, optional name, email, company, consent
 * On success: sets the demo cookie and redirects (303) to the product's demo host.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`start:${ip}`, 20, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many demo requests from this address. Try again in a few minutes." }, { status: 429 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let fields: Record<string, string> = {};
  if (contentType.includes("application/json")) {
    fields = (await req.json()) as Record<string, string>;
  } else {
    const form = await req.formData();
    for (const [k, v] of form.entries()) fields[k] = String(v);
  }

  const product = fields.product as ProductId;
  if (!productById[product]) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  // Simple honeypot for bots.
  if (fields.website) return NextResponse.redirect(new URL(`/demo/${product}`, req.url), 303);

  const email = (fields.email ?? "").trim();
  if (demo.requireEmail) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required to start a demo." }, { status: 400 });
    }
  }

  const cap = capacity(product);
  if (cap.available === 0) {
    const url = new URL(`/demo/ended`, req.url);
    url.searchParams.set("reason", "full");
    url.searchParams.set("product", product);
    return NextResponse.redirect(url, 303);
  }

  const { session, token } = issueSession(product);
  recordSession(session);
  appendJsonl("leads.jsonl", {
    session: session.id,
    product,
    name: (fields.name ?? "").slice(0, 200),
    email: email.slice(0, 200),
    company: (fields.company ?? "").slice(0, 200),
    consent: fields.consent === "on" || fields.consent === "true",
    ip,
    ua: (req.headers.get("user-agent") ?? "").slice(0, 300),
  });

  // Back to the launch page, now in its "session active" state: it shows the
  // credentials, the first steps and the button that opens the product itself.
  const back = new URL(`/demo/${product}`, req.url);
  back.searchParams.set("started", "1");
  const res = NextResponse.redirect(back, 303);
  res.headers.append("Set-Cookie", cookieHeader(token, session.exp));
  res.headers.set("X-Demo-Target", demoUrl(productById[product].demoHostKey));
  return res;
}
