import Link from "next/link";
import { Rack } from "@/components/Rack";
import { products } from "@/lib/products";
import { company } from "@/site.config";
import styles from "./home.module.css";

export default function HomePage() {
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
            <h1 className="rise">
              Build, run and sell AI software on hardware you own.
            </h1>
            <p className="lede rise rise--2">
              Three self-hosted products that take a team from a written brief to a product
              enterprises can buy. Every model call stays on machines you control.
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
              Runs against LM Studio, Ollama, vLLM or llama.cpp. No vendor API required.
            </p>
          </div>
          <Rack units={units} />
        </div>
      </section>

      <section className="section section--rule">
        <div className="container split">
          <div>
            <p className="kicker">Why this exists</p>
            <h2>Hosted AI tooling has a price that is not on the invoice.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
            <p className="lede">
              Coding agents want your repository. Agent builders want your prompts and your
              customers&apos; conversations. Identity vendors want to sit between you and every
              login. For a growing number of teams, in regulated industries, in public sector
              work, in companies whose code <em>is</em> the company, that is not a trade they can make.
            </p>
            <p>
              Local models closed most of the capability gap. What has been missing is the
              software around them: something that turns a local model into a delivery process
              you can trust, agents you can ship, and a product a procurement team will sign off.
              {" "}{company.name} builds exactly that, and nothing that needs to phone home.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container">
          <p className="kicker">One stack, three doors</p>
          <h2 style={{ maxWidth: "22ch" }}>Start with the product you need. Grow into the others.</h2>
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
              <h2>Nothing, by design.</h2>
              <p className="lede" style={{ marginTop: 16 }}>
                This is not a privacy setting. It is how the products are built.
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
                    <td>Model calls go to the endpoint you configure, local by default. The output is a git repository on your volume.</td>
                  </tr>
                  <tr>
                    <td>Prompts, tools and conversations</td>
                    <td>Your AgentCanvas database</td>
                    <td>Five local backends in the catalogue, a copilot mode restricted to local models, an offline embedder, no telemetry.</td>
                  </tr>
                  <tr>
                    <td>Your customers&apos; identities and audit trail</td>
                    <td>Your Postgres and your Keycloak</td>
                    <td>Matura is a single binary beside your app. Row-level security that fails closed; evidence exported to your own tooling.</td>
                  </tr>
                  <tr>
                    <td>The model</td>
                    <td>Your GPU</td>
                    <td>None of the products bundle a model or a vendor key. They reach the server you already run.</td>
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
            <p className="kicker">Try before you install</p>
            <h2>Hosted demos, on our hardware, with time limits.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.2rem" }}>
            <p className="lede">
              Each product runs in Docker on a box in our office, behind a gateway that hands out
              short sessions. Start one, follow the first steps on the launch page, and see the
              real interface rather than a video of it.
            </p>
            <ol className={styles.steps}>
              <li>
                <strong>Pick a product.</strong> The launch page tells you what the demo can and
                cannot do, and how long you have.
              </li>
              <li>
                <strong>Start the session.</strong> You are redirected to the product on its own
                demo address. Credentials, where needed, are on the launch page.
              </li>
              <li>
                <strong>Install it yourself.</strong> When you are ready, the quick start takes you
                from clone to running in under an hour on your own machine.
              </li>
            </ol>
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
            <h2>Self-hosted, licensed, supported.</h2>
          </div>
          <div className="stack" style={{ ["--stack-gap" as string]: "1.1rem" }}>
            <p className="lede">
              The products are commercial software you run yourself. You pull images from a
              private registry with your licence, install them on your servers, and we support
              the deployment. Larger customers get source access under NDA, air-gapped bundles and
              escrow.
            </p>
            <p>
              There is no usage metering of your customers, no per-seat surprise at renewal, and no
              hosted component you depend on. <Link href="/pricing">See plans and licensing</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
