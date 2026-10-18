import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listDocs, loadDoc } from "@/lib/content";

export function generateStaticParams() {
  return listDocs("help").map((d) => ({ slug: d.slug.join("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadDoc("help", [slug]);
  return doc ? { title: `${doc.title} — Help`, description: doc.description } : {};
}

export default async function HelpArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = loadDoc("help", [slug]);
  if (!doc) notFound();
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
}
