import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release notes for DevFlow, AgentCanvas and Matura.",
};

export default function ChangelogPage() {
  const entries = listDocs("changelog");
  return (
    <>
      <PageHeader
        kicker="Changelog"
        title="What shipped, product by product."
        lede="Release notes are the record of what actually changed. Security fixes are marked and also sent to licensed customers by email."
      />
      <section className="section">
        <div className="container" style={{ display: "grid", gap: 48 }}>
          {entries.map((e) => (
            <article key={e.slug.join("/")} className="split">
              <div>
                <h2 style={{ fontSize: "1.6rem" }}>{e.title}</h2>
                {e.description && (
                  <p className="muted" style={{ marginTop: 8 }}>
                    {e.description}
                  </p>
                )}
              </div>
              <div className="prose" dangerouslySetInnerHTML={{ __html: e.html }} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
