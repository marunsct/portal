import type { Page, PageContext } from "@/src/server/page";
import { PageHeader } from "@/src/ui/PageHeader";
import { listDocs, searchText } from "@/src/lib/content";
import { HelpBrowser } from "@/src/ui/HelpBrowser";
import { Island } from "@/src/ui/Island";


export const helpPage: Page = {
  meta: {
  title: "Help centre",
  description: "Answers to common questions about installing, running and licensing DevFlow, AgentCanvas and Matura.",
},
  render: (ctx: PageContext) => {
  const articles = listDocs("help").map((d) => ({
    slug: d.slug.join("/"),
    title: d.title,
    description: d.description ?? "",
    section: d.section ?? "General",
    text: searchText(d).slice(0, 4000),
  }));
  return (
    <>
      <PageHeader
        kicker="Help centre"
        title="Answers, grouped by what you are trying to do."
        lede="Short articles for the questions that come up most. For anything deeper, the documentation has the full guides; for anything specific to your deployment, open a support request."
      />
      <section className="section">
        <div className="container">
          <Island name="HelpBrowser" component={HelpBrowser} props={{ articles }} />
        </div>
      </section>
    </>
  );
  },
};
