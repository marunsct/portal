import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/DocsShell";
import { docsNavigation } from "@/lib/content";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Installation, configuration, user guides and integration references for DevFlow, AgentCanvas and Matura.",
};

export default function DocsHome() {
  const groups = docsNavigation();
  return (
    <DocsShell>
      <div>
        <p className="kicker">Documentation</p>
        <h1 style={{ fontSize: "2.6rem" }}>Install it, configure it, run it.</h1>
        <p className="lede" style={{ marginTop: 14 }}>
          Each product has the same set of guides, so once you know your way around one you know them all: overview,
          quick start, installation, configuration, user guide, administration, integration, troubleshooting and
          questions.
        </p>

        <div className="grid grid--3" style={{ marginTop: 40 }}>
          {products.map((p) => (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p className="muted small" style={{ margin: "4px 0 12px" }}>
                {p.tagline}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                {groups
                  .find((g) => g.key === p.id)
                  ?.items.map((it) => (
                    <li key={it.href}>
                      <Link href={it.href}>{it.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: 56, fontSize: "1.6rem" }}>The suite</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 6 }}>
          {groups
            .find((g) => g.key === "suite")
            ?.items.map((it) => (
              <li key={it.href}>
                <Link href={it.href}>{it.title}</Link>
              </li>
            ))}
        </ul>

        <p className="notice" style={{ marginTop: 48 }}>
          Can&apos;t find it? The <Link href="/help">help centre</Link> covers common questions, and{" "}
          <Link href="/support">support</Link> answers the rest.
        </p>
      </div>
    </DocsShell>
  );
}
