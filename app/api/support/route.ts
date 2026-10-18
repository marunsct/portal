import { NextResponse } from "next/server";
import { appendJsonl, rateLimited } from "@/lib/store";
import { company } from "@/site.config";

export const dynamic = "force-dynamic";

/**
 * POST /api/support — stores a ticket in /data/tickets.jsonl and, when SMTP is
 * configured, forwards it by email. Returns { ticket }.
 *
 * SMTP is optional on purpose: a fresh install works with just the file, and the
 * operator can tail it or import it into a helpdesk later (docs/OPERATIONS.md).
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`support:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests from this address. Please wait a few minutes." }, { status: 429 });
  }

  const form = await req.formData();
  const get = (k: string, max = 500) => String(form.get(k) ?? "").trim().slice(0, max);

  if (get("website")) return NextResponse.json({ ticket: fakeTicket() }); // honeypot: pretend success

  const name = get("name", 200);
  const email = get("email", 200);
  const subject = get("subject", 160);
  const message = get("message", 8000);
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Name, email, subject and details are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "That email address does not look valid." }, { status: 400 });
  }

  const ticket = newTicketId();
  const record = {
    ticket,
    topic: get("topic", 40),
    product: get("product", 40),
    plan: get("plan", 40),
    name,
    email,
    company: get("company", 200),
    subject,
    message,
    ip,
    ua: (req.headers.get("user-agent") ?? "").slice(0, 300),
  };
  appendJsonl("tickets.jsonl", record);

  try {
    await forwardByEmail(record);
  } catch (err) {
    console.error("support: email forwarding failed", err);
  }

  return NextResponse.json({ ticket });
}

function newTicketId() {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OS-${ymd}-${rand}`;
}
function fakeTicket() {
  return newTicketId();
}

/**
 * Minimal SMTP forwarding without a dependency: if SUPPORT_WEBHOOK_URL is set we
 * POST the ticket as JSON (works with Zapier, n8n, a Slack incoming webhook, or
 * your own helpdesk); SMTP via a webhook relay keeps this image dependency-free.
 */
async function forwardByEmail(record: Record<string, string>) {
  const url = process.env.SUPPORT_WEBHOOK_URL;
  if (!url) return;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      to: company.emails.support,
      subject: `[${record.ticket}] ${record.subject}`,
      text: `${record.name} <${record.email}> ${record.company ? `(${record.company})` : ""}\nTopic: ${record.topic} Product: ${record.product} Plan: ${record.plan}\n\n${record.message}`,
      record,
    }),
  });
}
