"use client";

import { useState } from "react";

const topics = [
  { value: "bug", label: "Something is broken" },
  { value: "question", label: "How do I…" },
  { value: "licence", label: "Licence or evaluation key" },
  { value: "sales", label: "Sales and pricing" },
  { value: "demo", label: "Problem with a hosted demo" },
  { value: "security", label: "Security concern" },
  { value: "other", label: "Something else" },
];

const products = [
  { value: "", label: "Not product-specific" },
  { value: "devflow", label: "DevFlow" },
  { value: "agentcanvas", label: "AgentCanvas" },
  { value: "matura", label: "Matura" },
  { value: "portal", label: "This website" },
];

export function SupportForm({
  initialTopic,
  initialPlan,
  initialProduct,
  initialMessage,
}: {
  initialTopic?: string;
  initialPlan?: string;
  initialProduct?: string;
  initialMessage?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [ticket, setTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/support", { method: "POST", body: form });
      const data = (await res.json()) as { ticket?: string; error?: string };
      if (!res.ok || !data.ticket) throw new Error(data.error ?? "The request could not be sent.");
      setTicket(data.ticket);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The request could not be sent.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="panel stack" style={{ ["--stack-gap" as string]: "0.8rem" }}>
        <p className="status status--up">Request received</p>
        <h2 style={{ fontSize: "1.5rem" }}>Ticket {ticket}</h2>
        <p>
          Keep that number. We will reply to the email address you gave; if it does not arrive within the response
          target for your plan, write to us and quote it.
        </p>
      </div>
    );
  }

  return (
    <form className="panel stack" style={{ ["--stack-gap" as string]: "1.1rem" }} onSubmit={onSubmit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999 }} />
      {initialPlan && <input type="hidden" name="plan" value={initialPlan} />}
      <div className="grid grid--2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="s-topic">What is this about?</label>
          <select id="s-topic" name="topic" className="select" defaultValue={initialTopic && topics.some((t) => t.value === initialTopic) ? initialTopic : "question"}>
            {topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="s-product">Product</label>
          <select id="s-product" name="product" className="select" defaultValue={initialProduct ?? ""}>
            {products.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid--2" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="s-name">Your name</label>
          <input id="s-name" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="s-email">Email</label>
          <input id="s-email" name="email" type="email" className="input" required autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="s-company">Company (optional)</label>
        <input id="s-company" name="company" className="input" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="s-subject">Subject</label>
        <input id="s-subject" name="subject" className="input" required maxLength={160} />
      </div>
      <div className="field">
        <label htmlFor="s-message">Details</label>
        <textarea id="s-message" name="message" className="textarea" required defaultValue={initialMessage ?? ""} maxLength={8000} />
        <span className="hint">For bugs: version, how you installed it, what you expected, what happened, and the log lines around it.</span>
      </div>
      {error && <p className="notice notice--rust">{error}</p>}
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="btn btn--primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send request"}
        </button>
        <span className="small muted">We store what you type here to answer you, and nothing else.</span>
      </div>
    </form>
  );
}
