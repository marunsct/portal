import type { Page, PageContext } from "@/src/server/page";
import { NotFound } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { listDocs, loadDoc } from "@/src/lib/content";

export const helpArticlePage: Page = {
  meta: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const doc = loadDoc("help", [slug]);
  return doc ? { title: `${doc.title} — Help`, description: doc.description } : {};
  },
  render: (ctx: PageContext) => {
  const { slug } = ctx.params;
  const doc = loadDoc("help", [slug]);
  if (!doc) throw new NotFound();
  const related = listDocs("help").filter((d) => d.section === doc.section && d.slug[0] !== slug).slice(0, 5);
  return (
    <section className="section">
      <div className="container article-grid">
        <article>
          <p className="kicker">
            <Link href="/help">Help centre</Link> / {doc.section}
          </p>
          <div className="prose">
            <h1>{doc.title}</h1>
            {doc.description && <p className="lede">{doc.description}</p>}
            <div dangerouslySetInnerHTML={{ __html: doc.html }} />
          </div>
          <div className="notice" style={{ marginTop: 48, maxWidth: "66ch" }}>
            Did this answer it? If not, <Link href={`/support?topic=question&article=${slug}`}>ask support</Link> and mention this article.
          </div>
        </article>
        {related.length > 0 && (
          <aside style={{ position: "sticky", top: 92, alignSelf: "start" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--graphite)", marginBottom: 10 }}>More in {doc.section}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: "0.95rem" }}>
              {related.map((r) => (
                <li key={r.slug.join("/")}>
                  <Link href={`/help/${r.slug.join("/")}`}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
  },
};
