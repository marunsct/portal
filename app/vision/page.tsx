import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { products } from "@/lib/products";
import { company } from "@/site.config";

export const metadata: Metadata = {
  title: "Vision",
  description: `Why ${company.name} exists, what it believes, and where the three products are going.`,
};

const principles = [
  {
    title: "Local by default, not local-capable",
    body: "Plenty of tools can be pointed at Ollama. Ours are designed around it: context budgets sized to small windows, single-request servers tolerated, no vendor key assumed anywhere. Hosted APIs are the optional extra.",
  },
  {
    title: "Verified, not vibed",
    body: "An agent saying 'done' is not evidence. DevFlow's definition of done is an acceptance suite written independently and locked. AgentCanvas gates publishing on evaluations. Matura scores readiness and exports the proof.",
  },
  {
    title: "You own the output",
    body: "DevFlow hands over a plain git repository. AgentCanvas exports idiomatic framework code. Matura is a documented contract any stack can implement. If you stop paying us, your software still runs.",
  },
  {
    title: "Nothing phones home",
    body: "No telemetry, no licence server you depend on at runtime, no analytics scripts on this website. The licence check is an offline signature.",
  },
  {
    title: "Honest about maturity",
    body: "These are young products built at speed. Each product page says what works, what is measured, and what is still on the roadmap. We would rather lose a sale than a reputation.",
  },
];

const roadmap = [
  { when: "Now", items: ["Hosted demos and evaluation licences", "DevFlow: medium-size briefs measured against hidden benchmarks", "AgentCanvas 0.28: Matura tenancy, row-level security", "Matura: tenants, SSO, SCIM, audit, agents, readiness CLI"] },
  { when: "Next", items: ["Offline licence keys in all three products", "Private registry delivery and signed SBOMs", "Matura portal pages for SSO, SCIM, agents and audit", "DevFlow brownfield seeding from the interface", "AgentCanvas native graphs for more frameworks"] },
  { when: "Later", items: ["Usage metering and billing adapters in Matura", "Air-gapped installer bundles", "Managed deployments on customer cloud accounts", "Suite-wide single sign-on through Matura for DevFlow"] },
];

export default function VisionPage() {
  return (
    <>
      <PageHeader
        kicker="Vision"
        title="Everything a software team needs to build, run and sell AI software on hardware it owns."
        lede="That sentence is the company. Three products, one thesis, no dependency on a hosted AI vendor."
      />

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">The problem</p>
            <h2>Capability moved to local models. The tooling did not follow.</h2>
          </div>
          <div className="prose">
            <p>
              Two years ago, the only way to get frontier-class help writing software was a
              hosted API. Today a 30B-parameter model on a workstation writes credible code,
              follows a plan and uses tools. The capability gap is closing month by month.
            </p>
            <p>
              The software around the model has not caught up. Coding agents, agent builders and
              identity platforms are built as cloud services first, with self-hosting as an
              afterthought or a sales conversation. For teams that cannot send code and data out,
              which includes most of finance, healthcare, defence, public sector and a large part
              of industrial Japan, that means doing without.
            </p>
            <p>
              Open-source local tooling solves pieces: running a model, chatting with it, drawing
              a flow. Nothing connects <em>build it locally</em> to <em>sell it to an
              enterprise</em> in one supported stack. That is the gap.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">The answer</p>
          <h2 style={{ maxWidth: "24ch" }}>Three layers that compose into a product business.</h2>
          <div className="table-scroll" style={{ marginTop: 36 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Product</th>
                  <th>Job</th>
                  <th>Replaces</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.layer}</td>
                    <td>
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                    </td>
                    <td>{p.oneLiner}</td>
                    <td>{p.compare.map((c) => c.against).join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ marginTop: 20, maxWidth: "70ch" }}>
            A customer can start at any layer. A consultancy might buy DevFlow alone; an ISV with a
            working app might buy Matura alone. The suite is for teams that want to go from brief
            to procurement without changing vendors.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">Principles</p>
          <h2>What we will not compromise on.</h2>
          <div className="rows" style={{ marginTop: 32 }}>
            {principles.map((p) => (
              <div key={p.title} className="row">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--slate">
        <div className="container split">
          <div>
            <p className="kicker">Who it is for</p>
            <h2>Teams that run their own models and want to ship.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.2rem" }}>
            <p className="lede">
              Technical founders and platform engineers at companies of 5 to 200 people who already
              have a model server and want to build products on it rather than experiments.
            </p>
            <p>
              Engineering leaders in regulated or data-sovereign environments who are asked "can we
              do agentic development in-house?" and need a serious answer.
            </p>
            <p>
              Independent software vendors with a working application who keep losing deals at the
              security questionnaire.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">Roadmap</p>
          <h2>Where the products are going.</h2>
          <div className="grid grid--3" style={{ marginTop: 32 }}>
            {roadmap.map((r) => (
              <div key={r.when}>
                <h3 style={{ marginBottom: 14 }}>{r.when}</h3>
                <ul style={{ paddingLeft: "1.2em", margin: 0, display: "grid", gap: 8 }}>
                  {r.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="muted small" style={{ marginTop: 28 }}>
            Roadmap items are intentions, not commitments. Release notes are the record of what shipped.
          </p>
        </div>
      </section>
    </>
  );
}
