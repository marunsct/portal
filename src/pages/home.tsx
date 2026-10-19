import type { Page, PageContext } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { Rack } from "@/src/ui/Rack";
import { Island } from "@/src/ui/Island";
import { products } from "@/src/lib/products";
import styles from "./home.module.css";

const pillars = [
  {
    title: "Proven, not vibed",
    body: "An acceptance suite written by a separate QA role and locked before any code exists, a CI gate that reverts regressions, and decision records for every design choice. Each run ends with evidence, not a claim.",
  },
  {
    title: "Sovereign by design, hybrid by policy",
    body: "Local and domestic models are first-class. Frontier models are allowed per data class when your policy says so, and every call records which model and version handled what.",
  },
  {
    title: "Own the output",
    body: "Plain git repositories, idiomatic framework code, exportable data and offline licences. If you stop paying us, your software and your agents keep running.",
  },
  {
    title: "One control plane",
    body: "Identity, tenancy, audit and evidence come from one layer shared by every product, so a security review happens once.",
  },
];

export const homePage: Page = {
  render: (ctx: PageContext) => {
  const units = products.map((p) => ({
    id: p.id,
    name: p.name,
    layer: p.layer,
    line: p.tagline,
    port: p.port,
    href: `/products/${p.id}`,
    color: p.color,
  }));

  return (
    <>
      <section className={`section ${styles.hero}`}>
        <div className="container split" style={{ alignItems: "center" }}>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.4rem" }}>
            <h1 className="rise">Ship AI-built software you can prove.</h1>
            <p className="lede rise rise--2">
              Ownstack builds, tests and governs AI-written code and agents inside your perimeter: on local
              and domestic models where your data requires them, on any model where your policy allows.
              Every run leaves evidence an auditor can read.
            </p>
            <div className={`${styles.ctas} rise rise--3`}>
              <Link href="/demo" className="btn btn--primary btn--lg">
                Try the hosted demos
              </Link>
              <Link href="/vision" className="btn btn--ghost btn--lg">
                Read the vision
              </Link>
            </div>
            <p className={`small muted rise rise--3`}>
              Self-hosted. Offline licence. Runs on LM Studio, Ollama, vLLM, llama.cpp and Japan&apos;s domestic models.
            </p>
          </div>
          <Island name="Rack" component={Rack} props={{ units }} />
        </div>
      </section>

      <section className="section section--rule">
        <div className="container split">
          <div>
            <p className="kicker">Why this exists</p>
            <h2>Writing code got cheap. Trusting it did not.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
            <p className="lede">
              Coding agents that can see the tests learn to pass the tests. In one 2026 study they hard-coded
              answers on up to 44% of ambiguous problems. Whole-app benchmarks name the same failure: agents
              submit without testing and drift from the spec.
            </p>
            <p>
              Meanwhile the data question has not gone away. Information leakage is the top generative-AI concern
              of Japanese companies, and the Digital Agency&apos;s procurement guideline now asks vendors for
              logs, model and version disclosure and a migration path. Teams need AI-built software that is
              correct, attributable and governed, and they need it where their data lives.
            </p>
            <p className="small muted">
              Sources:{" "}
              <a href="https://arxiv.org/abs/2511.21654" rel="noopener">EvilGenie (arXiv 2511.21654)</a>,{" "}
              <a href="https://vals.ai/benchmarks/vibe-code" rel="noopener">Vals Vibe Code Bench</a>,{" "}
              <a href="https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/pdf/n1210000.pdf" rel="noopener">
                MIC ICT White Paper 2026
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">What we stand on</p>
          <h2 style={{ maxWidth: "22ch" }}>Four commitments, each one checkable.</h2>
          <div className="rows" style={{ marginTop: 32 }}>
            {pillars.map((p) => (
              <div key={p.title} className="row">
                <h3 style={{ fontSize: "1.25rem" }}>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">The products</p>
          <h2 style={{ maxWidth: "24ch" }}>A software factory, an agent workbench, and the control plane under both.</h2>
          <div className="rows" style={{ marginTop: 40 }}>
            {products.map((p) => (
              <article key={p.id} className={`row ${styles.productRow}`}>
                <div>
                  <p className="kicker" style={{ marginBottom: 6 }}>
                    {p.layer}
                  </p>
                  <h3>
                    <Link href={`/products/${p.id}`} className={styles.productLink}>
                      {p.name}
                    </Link>
                  </h3>
                  <p className="muted" style={{ marginTop: 6 }}>
                    {p.tagline}
                  </p>
                </div>
                <div className="stack">
                  <p>{p.oneLiner}</p>
                  <ul className={styles.proof}>
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f.title}>{f.title}</li>
                    ))}
                  </ul>
                  <p className={styles.rowLinks}>
                    <Link href={`/products/${p.id}`}>Product details</Link>
                    <Link href={`/demo/${p.id}`}>Open the demo</Link>
                    <Link href={`/docs/${p.id}/quickstart`}>Quick start</Link>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--slate">
        <div className="container">
          <div className="split">
            <div>
              <p className="kicker">What leaves your network</p>
              <h2>Only what your policy allows, and it is logged.</h2>
              <p className="lede" style={{ marginTop: 16 }}>
                Local by default for the data that needs it. Hybrid by policy for the rest. Never silently.
              </p>
            </div>
            <div className="table-scroll">
              <table className={`table ${styles.slateTable}`}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Where it stays</th>
                    <th>How</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Your brief and your code</td>
                    <td>Your DevFlow workspace</td>
                    <td>A git repository on your volume. Model calls go to the endpoint each data class allows.</td>
                  </tr>
                  <tr>
                    <td>Prompts, tools and conversations</td>
                    <td>Your AgentCanvas database</td>
                    <td>Local and domestic backends first-class, a copilot mode restricted to local models, no telemetry.</td>
                  </tr>
                  <tr>
                    <td>Identities, tenants and the audit trail</td>
                    <td>Your Postgres and your Keycloak</td>
                    <td>Row-level isolation that fails closed; a hash-chained log covering people and agents.</td>
                  </tr>
                  <tr>
                    <td>The model</td>
                    <td>Your GPU, unless policy says otherwise</td>
                    <td>A hosted model is used only for data classes you permit, and every such call is recorded with model and version.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">Proof, in public</p>
            <h2>We publish our numbers before we quote them.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
            <p className="lede">
              Models you can host on one server trail the frontier. Our claim is that a disciplined harness narrows
              that gap. We are testing it the way anyone can check.
            </p>
            <ul className={styles.steps}>
              <li>
                DevFlow on Vibe Code Bench and ViBench with locally hosted models, against the same models in an
                open-source agent, so the harness effect is measured separately from the model.
              </li>
              <li>Cost, wall-clock time and a failure taxonomy for every run, not just a score.</li>
              <li>Results, scripts and the exact model versions published on this site.</li>
            </ul>
            <p className="small muted">
              Until the first results are up, this site makes no benchmark claims about DevFlow.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="container split">
          <div>
            <p className="kicker">Try before you install</p>
            <h2>Hosted demos, on our hardware, with time limits.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.2rem" }}>
            <p className="lede">
              Each product runs in Docker on a local model in our office, behind a gateway that hands out short
              sessions. Then install the free Community edition on your own machine.
            </p>
            <p>
              <Link href="/demo" className="btn btn--primary">
                Go to the demos
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="container split">
          <div>
            <p className="kicker">How it is sold</p>
            <h2>Self-hosted, offline-licensed, supported in Japanese.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
            <p className="lede">
              Free Community edition, then annual licences priced per GPU node rather than per token or per seat.
              Licences are signed files checked offline, so nothing phones home and nothing stops working at expiry.
            </p>
            <p>
              Regulated and public-sector customers can buy through a systems integrator, with air-gapped bundles,
              source review under NDA and escrow. <Link href="/pricing">See plans and licensing</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
  },
};
