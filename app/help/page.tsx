import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { listDocs, searchText } from "@/lib/content";
import { HelpBrowser } from "@/components/HelpBrowser";

export const metadata: Metadata = {
  title: "Help centre",
  description: "Answers to common questions about installing, running and licensing DevFlow, AgentCanvas and Matura.",
};

export default function HelpPage() {
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
          <HelpBrowser articles={articles} />
        </div>
      </section>
    </>
  );
}
