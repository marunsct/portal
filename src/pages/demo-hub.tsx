import type { Page, PageContext } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { PageHeader } from "@/src/ui/PageHeader";
import { products } from "@/src/lib/products";
import { demo } from "@/site.config";
import { DemoStatusList } from "@/src/ui/DemoStatus";
import { Island } from "@/src/ui/Island";


export const demoHubPage: Page = {
  meta: {
  title: "Hosted demos",
  description: "Try DevFlow, AgentCanvas and Matura in the browser, running on our hardware with time-limited sessions.",
},
  render: (ctx: PageContext) => {
  return (
    <>
      <PageHeader
        kicker="Hosted demos"
        title="The real products, running on our hardware, for a short while."
        lede={`Each demo is the actual software in Docker behind a gateway that hands out ${demo.sessionMinutes}-minute sessions. No account needed. Pick a product to see what the demo can do before you start.`}
      />

      <section className="section">
        <div className="container">
          <Island
            name="DemoStatusList"
            component={DemoStatusList}
            props={{
              items: products.map((p) => ({
                id: p.id,
                name: p.name,
                layer: p.layer,
                tagline: p.tagline,
                expectation: p.demo.expectation,
                href: `/demo/${p.id}`,
                color: p.color,
              })),
            }}
          />
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div>
            <p className="kicker">How the demos work</p>
            <h2>Rules of the room.</h2>
          </div>
          <div className="prose">
            <ul>
              <li>
                Sessions last {demo.sessionMinutes} minutes. Start another one when it ends; there is no limit on how many
                you take, only on how many people are in at once ({demo.maxConcurrent} per product).
              </li>
              <li>
                Every demo runs against a local model on our machines. Nothing you type is sent to a hosted AI vendor.
              </li>
              <li>Demo data is wiped every night. Treat it as a scratchpad, not a workspace.</li>
              <li>
                Outbound email, external tool servers and hosted provider keys are disabled. The install guides show how
                to enable them on your own deployment.
              </li>
              <li>
                Other people use the same instance during the day. Be considerate; if you hit something that looks broken,{" "}
                <Link href="/support?topic=demo">tell us</Link>.
              </li>
            </ul>
            <p>
              Prefer to run it yourself? Each product has a quick start that goes from clone to running in under an hour:{" "}
              <Link href="/docs/devflow/quickstart">DevFlow</Link>, <Link href="/docs/agentcanvas/quickstart">AgentCanvas</Link>,{" "}
              <Link href="/docs/matura/quickstart">Matura</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
  },
};
