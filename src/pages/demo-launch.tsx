import type { Page, PageContext } from "@/src/server/page";
import { NotFound } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { capacity, verifyToken } from "@/src/lib/demo";
import { productById, type ProductId } from "@/src/lib/products";
import { demo, demoUrl } from "@/site.config";
import { SessionTimer } from "@/src/ui/SessionTimer";
import { Island } from "@/src/ui/Island";
import styles from "./launch.module.css";

const demoPasswordEnv: Partial<Record<ProductId, string>> = {
  devflow: "DEVFLOW_DEMO_PASSWORD",
};

export const demoLaunchPage: Page = {
  meta: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const p = productById[slug as ProductId];
  return p ? { title: `${p.name} demo`, description: `Start a ${demo.sessionMinutes}-minute hosted session of ${p.name}.` } : {};
  },
  cache: false,
  render: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const sp = ctx.search;
  const p = productById[slug as ProductId];
  if (!p) throw new NotFound();

  const session = verifyToken(ctx.cookies[demo.cookieName]);
  const active = session && session.product === p.id ? session : null;
  const cap = capacity(p.id);
  const target = demoUrl(p.demoHostKey);

  const credentials =
    p.demo.credentials?.map((c) => {
      if (c.label === "Password") {
        const envName = demoPasswordEnv[p.id];
        const value = envName ? process.env[envName] : undefined;
        return { label: c.label, value: active ? (value ?? "not configured on this host") : "shown once your session starts" };
      }
      return c;
    }) ?? [];

  return (
    <>
      <section className="section" style={{ paddingBottom: 32 }}>
        <div className="container">
          <p className="kicker">
            <Link href="/demo">Hosted demos</Link> / {p.name}
          </p>
          <h1 style={{ maxWidth: "18ch" }}>{active ? `Your ${p.name} session is live.` : `Try ${p.name}.`}</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            {active
              ? "Open the product in a new tab. Come back here for the credentials and the suggested first steps."
              : p.oneLiner}
          </p>
        </div>
      </section>

      {sp.reason === "expired" && !active && (
        <div className="container">
          <p className="notice notice--amber">Your previous session ended. Start a new one below.</p>
        </div>
      )}
      {sp.reason === "other" && !active && (
        <div className="container">
          <p className="notice">You have a live session for a different product. Starting one here replaces it.</p>
        </div>
      )}
      {sp.reason === "none" && !active && (
        <div className="container">
          <p className="notice">The demo address needs a session. Start one here and you will be let through.</p>
        </div>
      )}

      <section className="section">
        <div className="container split">
          <aside className="stack" style={{ ["--stack-gap" as string]: "1.4rem" }}>
            {active ? (
              <div className={`panel ${styles.sessionPanel}`}>
                <Island name="SessionTimer" component={SessionTimer} props={{ exp: active.exp }} />
                <a href={target} target="_blank" rel="noopener" className="btn btn--primary btn--lg" style={{ justifyContent: "center" }}>
                  Open {p.name} in a new tab
                </a>
                <p className="small muted mono" style={{ wordBreak: "break-all" }}>
                  {target}
                </p>
                {credentials.length > 0 && (
                  <dl className={styles.creds}>
                    {credentials.map((c) => (
                      <div key={c.label}>
                        <dt>{c.label}</dt>
                        <dd className="mono">{c.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <form action="/api/demo/end" method="post">
                  <button type="submit" className="btn btn--ghost" style={{ width: "100%", justifyContent: "center" }}>
                    End my session
                  </button>
                </form>
              </div>
            ) : (
              <div className={`panel ${styles.sessionPanel}`}>
                <p className={`status ${cap.available === 0 ? "status--busy" : "status--up"}`}>
                  {cap.available === 0 ? `All ${cap.max} seats are in use` : `${cap.available} of ${cap.max} seats free`}
                </p>
                <form action="/api/demo/start" method="post" className="stack" style={{ ["--stack-gap" as string]: "1rem" }}>
                  <input type="hidden" name="product" value={p.id} />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999 }} />
                  {demo.requireEmail && (
                    <>
                      <div className="field">
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" className="input" autoComplete="name" />
                      </div>
                      <div className="field">
                        <label htmlFor="email">Work email</label>
                        <input id="email" name="email" type="email" required className="input" autoComplete="email" />
                        <span className="hint">We use it to follow up once, and to send your evaluation licence if you ask for one.</span>
                      </div>
                      <div className="field">
                        <label htmlFor="company">Company</label>
                        <input id="company" name="company" className="input" autoComplete="organization" />
                      </div>
                      <label className="small" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <input type="checkbox" name="consent" />
                        <span>You may contact me about {p.name}.</span>
                      </label>
                    </>
                  )}
                  <button type="submit" className="btn btn--primary btn--lg" style={{ justifyContent: "center" }} disabled={cap.available === 0}>
                    Start a {demo.sessionMinutes}-minute session
                  </button>
                  <p className="small muted">
                    Starting a session sets one cookie so the demo gateway can recognise you. Nothing else is stored unless you fill in the form.
                  </p>
                </form>
                {credentials.length > 0 && (
                  <dl className={styles.creds}>
                    {credentials.map((c) => (
                      <div key={c.label}>
                        <dt>{c.label}</dt>
                        <dd className="mono">{c.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
          </aside>

          <div className="stack" style={{ ["--stack-gap" as string]: "2.4rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem" }}>What to expect</h2>
              <p style={{ marginTop: 10 }}>{p.demo.expectation}</p>
            </div>
            <div className="grid grid--2">
              <div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: 10 }}>In the demo you can</h3>
                <ul className={styles.list}>
                  {p.demo.canDo.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", marginBottom: 10 }}>Not in the demo</h3>
                <ul className={`${styles.list} ${styles.listMuted}`}>
                  {p.demo.cannotDo.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem" }}>Suggested first steps</h2>
              <ol className={styles.steps}>
                {p.demo.firstSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
            <div className="notice">
              Want this on your own machine? The <Link href={`/docs/${p.id}/quickstart`}>quick start</Link> takes you from clone to
              running, and the <Link href={`/docs/${p.id}/installation`}>installation guide</Link> covers production settings.
            </div>
          </div>
        </div>
      </section>
    </>
  );
  },
};
