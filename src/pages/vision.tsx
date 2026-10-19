import type { Page } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { PageHeader } from "@/src/ui/PageHeader";
import { products } from "@/src/lib/products";
import { company } from "@/site.config";

const S = {
  evilgenie: "https://arxiv.org/abs/2511.21654",
  vibecode: "https://vals.ai/benchmarks/vibe-code",
  vibench: "https://georgian.io/posts/georgian-replit-vibench",
  mic: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/pdf/n1210000.pdf",
  epoch: "https://epoch.ai/data-insights/open-closed-eci-gap",
  etr: "https://techstrong.ai/articles/open-weight-ai-models-expected-to-capture-41-of-enterprise-token-usage/",
  flowise: "https://flowiseai.com/sunset",
  agentkit: "https://openai.com/index/introducing-agentkit/",
  ds920: "https://timewell.jp/en/columns/digital-agency-generative-ai-procurement-guideline-2026",
  gennai: "https://www.issoh.co.jp/tech/details/11305/",
};

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} rel="noopener" className="small">
      {children}
    </a>
  );
}

const pillars = [
  {
    title: "Proven, not vibed",
    body: "Every DevFlow run produces a locked acceptance suite written before the code, the CI gate results, decision records and the model and version that did the work. AgentCanvas gates every release on evaluations. Matura proves tenant isolation and agent accountability from the running system.",
  },
  {
    title: "Sovereign by design, hybrid by policy",
    body: "Local and Japanese domestic models are first-class backends, not an afterthought. Where a data class permits it, a frontier model can plan or review, and that choice is written down. Buyers run hybrid estates; the product should make that safe rather than pretend it away.",
  },
  {
    title: "Own the output",
    body: "Plain git repositories, idiomatic framework code your coding agents can also edit, exportable data and offline licences that never phone home. If we disappear, escrow and a published continuity guarantee mean your software does not.",
  },
  {
    title: "One control plane",
    body: "Identity, tenancy, audit and evidence come from Matura, shared by every product, so a customer passes one security review and an SIer delivers one package.",
  },
];

const notThis = [
  "We do not claim local models match the frontier. Models you can host on one server trail it; our job is to make them reliable and to measure how far a harness closes the gap.",
  "We do not claim to be cheaper than the cloud. Hosted open-weight models are very cheap per token. We offer predictable cost, no token bill and data that stays put.",
  "We do not sell compliance. We produce evidence that makes compliance work faster; the audit stays yours.",
];

const segments = [
  {
    who: "In-house development teams at Japanese finance, healthcare and manufacturing firms",
    why: "Leakage is the top concern, development support is the most common AI use, and teams are bringing work in-house without the know-how to govern AI-written code.",
    lead: "DevFlow, with the control plane",
  },
  {
    who: "Systems integrators and DX-focused partners",
    why: "They deliver on-prem and closed-network projects and need a packaged, supportable sovereign AI development kit to sell.",
    lead: "The suite, as an on-prem kit",
  },
  {
    who: "Public bodies and municipalities buying under the Digital Agency guideline",
    why: "DS-920 asks for logging, model and version disclosure, migration design and history export, which the products produce as a by-product.",
    lead: "DevFlow evidence pack, AgentCanvas",
  },
  {
    who: "Teams stranded by hosted agent builders shutting down",
    why: "OpenAI Agent Builder closes on 30 November 2026; Flowise reached end of life in August. Their flows need a home that produces code they own.",
    lead: "AgentCanvas importers",
  },
];

const roadmap = [
  {
    when: "Now to December 2026",
    items: [
      "Publish DevFlow results on Vibe Code Bench with locally hosted models, compared with an open-source agent on the same model",
      "AgentCanvas importers for OpenAI Agent Builder exports, Flowise and Langflow, each with a generated regression eval set",
      "Free Community edition, one-command install, offline signed licences",
      "Matura conformance CLI: test any app for tenant leaks, SSO enforcement and audit integrity",
    ],
  },
  {
    when: "January to March 2027",
    items: [
      "Per-run compliance evidence pack and a DS-920 answer pack",
      "Domestic model backends (tsuzumi 2, PLaMo, ELYZA) and Japanese-language briefs",
      "Matura as the shared enterprise tier across the suite; Japan control packs and HENNGE One / Entra guides",
      "Third-party penetration test, SBOMs, signed images, escrow",
    ],
  },
  {
    when: "April to October 2027",
    items: [
      "An acceptance-lock gate that wraps any coding agent",
      "Policy-based hybrid routing with data-class rules and logging",
      "Agent register with owners and cost caps; governed private MCP/A2A registry",
      "Brownfield modernisation: pin current behaviour first, then migrate under the revert gate",
      "Enterprise-managed authorization for MCP in Matura; canvas-to-code round trip in AgentCanvas",
    ],
  },
];

export const visionPage: Page = {
  meta: {
    title: "Vision",
    description: `Why ${company.name} exists: AI-built software and agents you can prove, built and governed inside your perimeter, on the models your data allows.`,
  },
  render: () => (
    <>
      <PageHeader
        kicker="Vision"
        title="Ship AI-built software and agents you can prove."
        lede="Built, tested and governed inside your perimeter, on the models your data allows. 境界の内側で、証明できるAIソフトウェアを。"
      />

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">What changed</p>
            <h2>Capable models are no longer scarce. Trust is.</h2>
          </div>
          <div className="prose">
            <p>
              The largest open-weight models are now a few months behind the closed frontier, and hosted open models
              cost a fraction of a dollar per million tokens. <Src href={S.epoch}>(Epoch AI)</Src> Access to a
              capable model is not the hard part any more.
            </p>
            <p>
              The hard part is knowing whether what an agent built is correct. Agents that can see the tests learn to
              pass them: one study found hard-coded test answers on up to 44% of ambiguous problems.{" "}
              <Src href={S.evilgenie}>(EvilGenie)</Src> Whole-app benchmarks record agents submitting without testing
              and drifting from the spec <Src href={S.vibecode}>(Vibe Code Bench)</Src>, and most models get worse
              when they extend their own code. <Src href={S.vibench}>(ViBench)</Src>
            </p>
            <p>
              The second hard part is where it happens. Information leakage is the top generative-AI concern among
              Japanese companies <Src href={S.mic}>(MIC 2026)</Src>, and the Digital Agency&apos;s DS-920 guideline
              now asks vendors for logs, model and version disclosure, migration design and history export.{" "}
              <Src href={S.ds920}>(DS-920 summary)</Src> At the same time buyers are hybrid: companies running open
              models in production are still growing their use of proprietary ones. <Src href={S.etr}>(ETR 2026)</Src>
            </p>
            <p>
              And the third: hosted tools come and go. OpenAI is closing Agent Builder on 30 November 2026{" "}
              <Src href={S.agentkit}>(OpenAI)</Src>; Flowise reached end of life in August.{" "}
              <Src href={S.flowise}>(Flowise)</Src> Users without exported code had nothing to take with them.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">What we believe</p>
          <h2 style={{ maxWidth: "24ch" }}>Four commitments, each one you can check.</h2>
          <div className="rows" style={{ marginTop: 32 }}>
            {pillars.map((p) => (
              <div key={p.title} className="row">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">What we will not claim</p>
            <h2>Plain statements, so nobody is surprised later.</h2>
          </div>
          <ul className="prose" style={{ paddingLeft: "1.2em" }}>
            {notThis.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">How the products fit</p>
          <h2 style={{ maxWidth: "26ch" }}>A software factory and an agent workbench, on one control plane.</h2>
          <div className="table-scroll" style={{ marginTop: 32 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Role</th>
                  <th>What it proves</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                    </td>
                    <td>{p.layer}</td>
                    <td>{p.proves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">Who we serve first</p>
          <h2>Japan, regulated, and the integrators who serve them.</h2>
          <div className="table-scroll" style={{ marginTop: 32 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>Why now</th>
                  <th>Where we start</th>
                </tr>
              </thead>
              <tbody>
                {segments.map((s) => (
                  <tr key={s.who}>
                    <td style={{ fontWeight: 500 }}>{s.who}</td>
                    <td>{s.why}</td>
                    <td>{s.lead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ marginTop: 20, maxWidth: "70ch" }}>
            The Digital Agency&apos;s Gennai platform selected seven domestic models, including ones that run on a single
            GPU. <Src href={S.gennai}>(Gennai)</Src> We treat them as first-class backends, because a model your
            procurement already approved is the shortest path to production.
          </p>
        </div>
      </section>

      <section className="section section--slate">
        <div className="container">
          <p className="kicker">Roadmap</p>
          <h2>Proof first, then scale.</h2>
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
            Roadmap items are intentions, not commitments. The changelog is the record of what shipped.
          </p>
        </div>
      </section>
    </>
  ),
};
