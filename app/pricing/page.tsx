import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { plans, supportTargets } from "@/site.config";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing and licensing",
  description: "Self-hosted licences for DevFlow, AgentCanvas and Matura: evaluation, team, business and enterprise plans.",
};

const delivery = [
  {
    title: "A licence key, verified offline",
    body: "Your licence is a signed file naming the product, your organisation, the seat count and the expiry. The product checks the signature at start and never contacts us to do it.",
  },
  {
    title: "Images from a private registry",
    body: "Container images are published to a registry only licensed customers can pull from, with per-customer credentials you can rotate. Helm charts and Compose bundles come from the same place.",
  },
  {
    title: "Updates on your schedule",
    body: "Releases follow semantic versions with a public changelog. Security advisories go to the contacts on your account. You decide when to upgrade.",
  },
  {
    title: "Source access for review",
    body: "Business and Enterprise customers can read the source under NDA to run their own security review. Enterprise adds escrow so the code is available if we are not.",
  },
  {
    title: "Air-gapped installs",
    body: "Enterprise customers receive an offline bundle: images, charts, documentation and checksums, installable on a network with no internet access.",
  },
  {
    title: "Your customers are never metered",
    body: "Licences count your named users, not your tenants, your end users or your model calls. Matura in particular is priced so that growing your customer base costs you nothing extra.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        kicker="Pricing and licensing"
        title="Commercial software you run yourself."
        lede="No hosted tier, no per-call metering, no telemetry. You licence the software, install it on your servers, and we support it. Prices shown are starting points; final quotes depend on seats and support level."
      />

      <section className="section">
        <div className={`container ${styles.plans}`}>
          {plans.map((p) => (
            <div key={p.id} className={`${styles.plan} ${"featured" in p && p.featured ? styles.featured : ""}`}>
              <h2>{p.name}</h2>
              <p className={styles.price}>
                <span>{p.price}</span>
                {p.period && <span className={styles.period}>{p.period}</span>}
              </p>
              <p className={styles.summary}>{p.summary}</p>
              <ul className={styles.includes}>
                {p.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link href={p.cta.href} className={`btn ${"featured" in p && p.featured ? "btn--primary" : "btn--ghost"}`}>
                {p.cta.label}
              </Link>
            </div>
          ))}
        </div>
        <p className="container muted small" style={{ marginTop: 20 }}>
          Prices in Japanese yen, excluding tax. Academic, non-profit and open-source maintainer discounts are available on request.
        </p>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">How a closed-source product is delivered and kept honest</p>
          <h2 style={{ maxWidth: "24ch" }}>What you get besides the software.</h2>
          <div className="rows" style={{ marginTop: 32 }}>
            {delivery.map((d) => (
              <div key={d.title} className="row">
                <h3 style={{ fontSize: "1.2rem" }}>{d.title}</h3>
                <p>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">Support</p>
            <h2>Response targets by plan.</h2>
          </div>
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Channel</th>
                  <th>First response</th>
                </tr>
              </thead>
              <tbody>
                {supportTargets.map((s) => (
                  <tr key={s.plan}>
                    <td>{s.plan}</td>
                    <td>{s.channel}</td>
                    <td>{s.firstResponse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="container split">
          <div>
            <p className="kicker">Questions about licensing</p>
            <h2>The short answers.</h2>
          </div>
          <div className="prose">
            <h3>Is the source code available?</h3>
            <p>
              The products are not open source. Business and Enterprise customers can read the source under NDA for
              security review, and Enterprise agreements include escrow. The Matura integration contract (SDKs, SQL,
              webhooks, conformance tests) is published so that any application can implement it.
            </p>
            <h3>What happens when a licence expires?</h3>
            <p>
              The software keeps running. You lose access to new images and to support until it is renewed. We do not
              build kill switches into products our customers depend on.
            </p>
            <h3>Can I run it for more than one customer?</h3>
            <p>
              Yes. Matura exists precisely so one installation serves many tenants. Service providers running the suite
              for their own clients need a reseller agreement; ask sales.
            </p>
            <h3>Do you offer managed hosting?</h3>
            <p>
              Not yet. The products are designed to run on your infrastructure. Managed deployments on a customer&apos;s
              own cloud account are on the roadmap for larger agreements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
