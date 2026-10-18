import type { Page, PageContext } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { PageHeader } from "@/src/ui/PageHeader";
import { company } from "@/site.config";


export const companyPage: Page = {
  meta: {
  title: "Company",
  description: `About ${company.name}: who we are, how we work, and how to reach us.`,
},
  render: (ctx: PageContext) => {
  return (
    <>
      <PageHeader
        kicker="Company"
        title={`${company.name} makes software for teams that run their own models.`}
        lede={`Founded in ${company.founded} in ${company.location}. Small, technical, and built on the belief that the most capable AI tooling should not require sending your work to someone else's servers.`}
      />

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">How we work</p>
            <h2>Build in the open with our customers, ship closed, support in person.</h2>
          </div>
          <div className="prose">
            <p>
              We use our own products to build our products. DevFlow writes a good part of the code you are evaluating;
              AgentCanvas runs the agents behind our support tooling; Matura is the tenancy and identity layer under
              AgentCanvas. When something is awkward, we feel it first.
            </p>
            <p>
              The products are commercial and closed source, because that is how a small company funds years of
              unglamorous hardening work. The <em>contracts</em> are open: Matura&apos;s SDKs, SQL and conformance tests,
              AgentCanvas&apos;s exported projects, DevFlow&apos;s handover format. Nothing you build with us is locked to us.
            </p>
            <p>
              Support is done by the engineers who wrote the code. There is no tier of first-line support reading from a
              script. Business and Enterprise customers get a named engineer who knows their deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="container split">
          <div>
            <p className="kicker">Where the products come from</p>
            <h2>Three repositories, one thesis.</h2>
          </div>
          <div className="prose">
            <p>
              DevFlow began as an experiment: could a team of agents on a local model produce a clean, tested product
              from a brief, measured against hidden tests rather than its own opinion? Seventy runs later the answer was
              no, and the redesign that followed, with a locked acceptance suite and an organisational process, is the
              product today.
            </p>
            <p>
              AgentCanvas came from frustration with visual agent builders that trap the flow in their own runtime. The
              rule from the first commit was that the canvas compiles to real code in the framework of your choice, and
              that what you export is what runs.
            </p>
            <p>
              Matura was the question every ISV eventually faces: the product works, the first enterprise customer wants
              SSO, tenancy, an audit trail and a SOC 2 story, and none of that is the product. It is the layer that lets
              the other two be sold.
            </p>
            <p>
              <Link href="/vision">Read the full vision</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker">Contact</p>
            <h2>Talk to a person.</h2>
          </div>
          <div className="rows">
            <div className="row">
              <h4>General</h4>
              <p>
                <a href={`mailto:${company.emails.hello}`}>{company.emails.hello}</a>
              </p>
            </div>
            <div className="row">
              <h4>Sales and licensing</h4>
              <p>
                <a href={`mailto:${company.emails.sales}`}>{company.emails.sales}</a> or the{" "}
                <Link href="/support?topic=sales">sales form</Link>
              </p>
            </div>
            <div className="row">
              <h4>Support</h4>
              <p>
                <a href={`mailto:${company.emails.support}`}>{company.emails.support}</a> or the{" "}
                <Link href="/support">support form</Link>
              </p>
            </div>
            <div className="row">
              <h4>Security reports</h4>
              <p>
                <a href={`mailto:${company.emails.security}`}>{company.emails.security}</a>. See the{" "}
                <Link href="/security">disclosure policy</Link>.
              </p>
            </div>
            <div className="row">
              <h4>Office</h4>
              <p>{company.location}. Visits by appointment.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  },
};
