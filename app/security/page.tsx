import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { company } from "@/site.config";

export const metadata: Metadata = {
  title: "Security and trust",
  description: "How the products keep data on your infrastructure, how we handle vulnerability reports, and what we do not claim.",
};

const facts = [
  {
    title: "No hosted component",
    body: "Every product is a set of containers you run. There is no control plane of ours in the request path, no licence server consulted at runtime, and no telemetry endpoint.",
  },
  {
    title: "Model traffic goes where you point it",
    body: "DevFlow and AgentCanvas call the inference endpoint you configure. The defaults are local addresses. Hosted providers require you to add a key; none ship with the product.",
  },
  {
    title: "Secrets at rest",
    body: "DevFlow encrypts provider keys in its database with a key you hold. AgentCanvas stores project secrets with envelope encryption and a rotatable key ring. Matura uses AES-256-GCM envelope encryption under your key.",
  },
  {
    title: "Tenant isolation that fails closed",
    body: "Matura and AgentCanvas use Postgres row-level security with a runtime role that cannot bypass it. A missing tenant context returns nothing rather than everything.",
  },
  {
    title: "Audit you can verify",
    body: "Matura's audit log is hash-chained and written in the same transaction as the change. Tenants can export and verify their own chain. DevFlow keeps full transcripts and a command ledger per run.",
  },
  {
    title: "Sandboxed execution, with honest limits",
    body: "Agent-run commands in DevFlow are argv-only under allow-lists and resource limits, in a container or a dedicated sandbox container. AgentCanvas offers in-process, subprocess and Docker sandboxes; the subprocess mode applies limits but is not isolation, and the documentation says so.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        kicker="Security and trust"
        title="The architecture is the privacy policy."
        lede="We do not ask you to trust a data-processing agreement. The products are designed so there is nothing of yours for us to process."
      />

      <section className="section">
        <div className="container rows">
          {facts.map((f) => (
            <div key={f.title} className="row">
              <h3 style={{ fontSize: "1.2rem" }}>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div>
            <p className="kicker">Responsible disclosure</p>
            <h2>Found something? Tell us first.</h2>
          </div>
          <div className="prose">
            <p>
              Email <a href={`mailto:${company.emails.security}`}>{company.emails.security}</a> with enough detail to
              reproduce the issue. We acknowledge within two business days, keep you informed, and credit you in the
              advisory if you want to be credited.
            </p>
            <p>
              Please do not test against the hosted demos in ways that affect other visitors, and do not access data
              that is not yours. Good-faith research under these terms will not be met with legal action.
            </p>
            <p>
              Security fixes ship as patch releases with an advisory in the <Link href="/changelog">changelog</Link> and
              by email to licensed customers.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">What we do not claim</p>
            <h2>Plain statements, so nobody is surprised later.</h2>
          </div>
          <div className="prose">
            <ul>
              <li>
                Matura does not make your product SOC 2, ISO 27001 or GDPR compliant. It implements technical controls
                and exports evidence. Audits, policies and organisational controls remain yours.
              </li>
              <li>
                The products are young. Each one was built quickly and is hardened continuously. We publish known
                limitations on the product pages and in the documentation rather than in the small print.
              </li>
              <li>
                We have not yet completed a third-party penetration test or a SOC 2 audit of our own. Both are planned
                for the first year of commercial availability; the dates will be on this page.
              </li>
              <li>
                This website sets one cookie, and only when you start a demo session. It loads fonts from Google Fonts
                unless the operator self-hosts them. There are no analytics or advertising scripts.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
