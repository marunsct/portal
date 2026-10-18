import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "DevFlow, AgentCanvas and Matura: what each one does, who it is for, and how they fit together.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        kicker="Products"
        title="Three products. One rule: it runs on your hardware."
        lede="Each product stands alone. Together they take a team from a written brief to a product an enterprise can buy."
      />

      <section className="section">
        <div className="container rows">
          {products.map((p) => (
            <article key={p.id} className="row" style={{ padding: "40px 0" }}>
              <div>
                <p className="kicker" style={{ marginBottom: 6 }}>
                  {p.layer} · {p.status}
                </p>
                <h2 style={{ fontSize: "2rem" }}>
                  <Link href={`/products/${p.id}`} style={{ color: "var(--ink)" }}>
                    {p.name}
                  </Link>
                </h2>
                <p className="muted" style={{ marginTop: 8 }}>
                  {p.tagline}
                </p>
                <p style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href={`/products/${p.id}`} className="btn btn--primary">
                    Details
                  </Link>
                  <Link href={`/demo/${p.id}`} className="btn btn--ghost">
                    Demo
                  </Link>
                </p>
              </div>
              <div className="stack" style={{ ["--stack-gap" as string]: "1rem" }}>
                <p className="lede" style={{ fontSize: "1.1rem" }}>
                  {p.oneLiner}
                </p>
                <p>
                  <strong>For:</strong> {p.audience}
                </p>
                <ul style={{ paddingLeft: "1.2em", margin: 0, columns: 2, columnGap: 32 }}>
                  {p.features.slice(0, 8).map((f) => (
                    <li key={f.title} style={{ breakInside: "avoid", marginBottom: 6 }}>
                      {f.title}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">Side by side</p>
          <h2>How they compare.</h2>
          <div className="table-scroll" style={{ marginTop: 32 }}>
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  {products.map((p) => (
                    <th key={p.id}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Layer</th>
                  {products.map((p) => (
                    <td key={p.id}>{p.layer}</td>
                  ))}
                </tr>
                <tr>
                  <th>Input</th>
                  <td>A product brief</td>
                  <td>A workflow you draw or import</td>
                  <td>Your application and its users</td>
                </tr>
                <tr>
                  <th>Output</th>
                  <td>A tested git repository with CI and container files</td>
                  <td>Framework-native code, a deployment, an MCP/A2A endpoint</td>
                  <td>Tenants, SSO, audit trail, readiness evidence</td>
                </tr>
                <tr>
                  <th>Model use</th>
                  <td>Heavy: hours of local inference per run</td>
                  <td>Interactive: seconds per step</td>
                  <td>None; governs agents, does not run them</td>
                </tr>
                <tr>
                  <th>Stack</th>
                  <td>Python, LangGraph, FastAPI, Celery, Postgres, Redis</td>
                  <td>Python, FastAPI, React Flow, Postgres + pgvector</td>
                  <td>Go, Postgres, Keycloak, optional OpenFGA</td>
                </tr>
                <tr>
                  <th>Status</th>
                  {products.map((p) => (
                    <td key={p.id}>
                      {p.status} · {p.version}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>Default port</th>
                  {products.map((p) => (
                    <td key={p.id} className="mono">
                      {p.port}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
