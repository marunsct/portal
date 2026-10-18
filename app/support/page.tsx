import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { SupportForm } from "@/components/SupportForm";
import { company, supportTargets } from "@/site.config";

export const metadata: Metadata = {
  title: "Support",
  description: "Open a support request, ask sales a question, report a problem with a demo, or request an evaluation licence.",
};

export default async function SupportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <>
      <PageHeader
        kicker="Support"
        title="Tell us what you need. An engineer answers."
        lede="Use the form for anything: a bug, a licence, a sales question, a demo that misbehaved. It lands with the people who build the products."
      />

      <section className="section">
        <div className="container split">
          <aside className="stack" style={{ ["--stack-gap" as string]: "2rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem" }}>Before you write</h2>
              <ul style={{ paddingLeft: "1.2em", marginTop: 10, display: "grid", gap: 8 }}>
                <li>
                  The <Link href="/help">help centre</Link> answers the common questions.
                </li>
                <li>
                  Each product has a <Link href="/docs">troubleshooting guide</Link> with the errors we see most.
                </li>
                <li>
                  For a bug, include the product version, how you installed it, and the relevant log lines. The
                  troubleshooting guides say where to find them.
                </li>
              </ul>
            </div>
            <div>
              <h2 style={{ fontSize: "1.4rem" }}>Response targets</h2>
              <table className="table table--compact" style={{ marginTop: 10 }}>
                <tbody>
                  {supportTargets.map((s) => (
                    <tr key={s.plan}>
                      <th>{s.plan}</th>
                      <td>{s.firstResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 style={{ fontSize: "1.4rem" }}>Other ways</h2>
              <p style={{ marginTop: 10 }}>
                Email <a href={`mailto:${company.emails.support}`}>{company.emails.support}</a> for support,{" "}
                <a href={`mailto:${company.emails.sales}`}>{company.emails.sales}</a> for licences, and{" "}
                <a href={`mailto:${company.emails.security}`}>{company.emails.security}</a> for vulnerabilities (see the{" "}
                <Link href="/security">disclosure policy</Link>).
              </p>
            </div>
          </aside>
          <SupportForm
            initialTopic={sp.topic}
            initialPlan={sp.plan}
            initialProduct={sp.product}
            initialMessage={sp.q ? `Question: ${sp.q}` : sp.article ? `About help article: ${sp.article}\n\n` : ""}
          />
        </div>
      </section>
    </>
  );
}
