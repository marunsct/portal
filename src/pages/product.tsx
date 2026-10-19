import type { Page, PageContext } from "@/src/server/page";
import { NotFound } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { ProductSketch } from "@/src/ui/ProductSketch";
import { productById, productIds, type ProductId } from "@/src/lib/products";
import styles from "./product.module.css";

export const productPage: Page = {
  meta: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const p = productById[slug as ProductId];
  if (!p) return {};
  return { title: `${p.name} — ${p.tagline}`, description: p.oneLiner };
  },
  render: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const p = productById[slug as ProductId];
  if (!p) throw new NotFound();
  const others = productIds.filter((id) => id !== p.id).map((id) => productById[id]);

  return (
    <>
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="container split" style={{ alignItems: "center" }}>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.2rem" }}>
            <p className="kicker" style={{ marginBottom: 0 }}>
              {p.layer} · {p.status} · version {p.version}
            </p>
            <h1 style={{ maxWidth: "16ch" }}>{p.name}</h1>
            <p className="lede">{p.tagline}</p>
            <p>{p.oneLiner}</p>
            <div className={styles.ctas}>
              <Link href={`/demo/${p.id}`} className="btn btn--primary btn--lg">
                Open the hosted demo
              </Link>
              <Link href={`/docs/${p.id}/quickstart`} className="btn btn--ghost btn--lg">
                Quick start
              </Link>
            </div>
          </div>
          <ProductSketch id={p.id} color={p.color} />
        </div>
      </section>

      <nav className={styles.subnav} aria-label="On this page">
        <div className="container">
          <a href="#overview">Overview</a>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#local">Local first</a>
          <a href="#next">Roadmap</a>
          <a href="#specs">Specifications</a>
          <a href="#compare">Compared</a>
          <a href="#faq">Questions</a>
        </div>
      </nav>

      <section className="section" id="overview">
        <div className="container split">
          <div>
            <p className="kicker">Overview</p>
            <h2>What it is</h2>
            <p className="muted" style={{ marginTop: 16 }}>
              <strong>For:</strong> {p.audience}
            </p>
          </div>
          <div className="prose">
            {p.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper" id="how">
        <div className="container">
          <p className="kicker">How it works</p>
          <h2 style={{ maxWidth: "22ch" }}>From input to output, in order.</h2>
          <ol className={styles.sequence}>
            {p.how.map((step, i) => (
              <li key={step.title} style={{ ["--step-color" as string]: p.color }}>
                <span className={styles.stepNumber}>{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <p className="kicker">Features</p>
          <h2>Everything in the product today.</h2>
          <div className={styles.features}>
            {p.features.map((f) => (
              <div key={f.title} className={styles.feature}>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--slate" id="local">
        <div className="container split">
          <div>
            <p className="kicker">Local first</p>
            <h2>What makes it a local-model product, specifically.</h2>
          </div>
          <ul className={styles.localList}>
            {p.localFirst.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="next">
        <div className="container split">
          <div>
            <p className="kicker">What it proves, and what is next</p>
            <h2>{p.proves}</h2>
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: 12 }}>On the roadmap</h3>
            <ul style={{ paddingLeft: "1.2em", margin: 0, display: "grid", gap: 10 }}>
              {p.next.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="small muted" style={{ marginTop: 16 }}>
              Intentions, not commitments. See the <Link href="/vision">vision</Link> for timing and the{" "}
              <Link href="/changelog">changelog</Link> for what shipped.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="specs">
        <div className="container split">
          <div>
            <p className="kicker">Specifications</p>
            <h2>Under the hood.</h2>
            <p className="muted" style={{ marginTop: 16 }}>
              Source: <a href={p.repo.url} rel="noopener">{p.repo.url.replace("https://", "")}</a>, branch{" "}
              <span className="mono">{p.repo.branch}</span>. Licence: {p.licence}.
            </p>
          </div>
          <div className="rows">
            {p.specs.map((s) => (
              <div key={s.label} className="row" style={{ padding: "14px 0" }}>
                <h4>{s.label}</h4>
                <p>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper" id="compare">
        <div className="container split">
          <div>
            <p className="kicker">Compared</p>
            <h2>Where it differs.</h2>
          </div>
          <div className="rows">
            {p.compare.map((c) => (
              <div key={c.against} className="row">
                <h4>{c.against}</h4>
                <p>{c.difference}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container split">
          <div>
            <p className="kicker">Questions</p>
            <h2>Things people ask first.</h2>
          </div>
          <div className={styles.faq}>
            {p.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule">
        <div className="container">
          <div className={styles.ctaBand}>
            <div>
              <h2>Next step</h2>
              <p className="muted" style={{ marginTop: 8 }}>
                Try it in the browser, or install it on your own machine.
              </p>
            </div>
            <div className={styles.ctas}>
              <Link href={`/demo/${p.id}`} className="btn btn--primary">
                Open the demo
              </Link>
              <Link href={`/docs/${p.id}`} className="btn btn--ghost">
                Documentation
              </Link>
              <Link href={`/support?topic=sales&product=${p.id}`} className="btn btn--ghost">
                Talk to us
              </Link>
            </div>
          </div>
          <p className="muted small" style={{ marginTop: 28 }}>
            Also in the suite:{" "}
            {others.map((o, i) => (
              <span key={o.id}>
                <Link href={`/products/${o.id}`}>{o.name}</Link>
                {i < others.length - 1 ? " and " : ""}
              </span>
            ))}
            .
          </p>
        </div>
      </section>
    </>
  );
  },
};
