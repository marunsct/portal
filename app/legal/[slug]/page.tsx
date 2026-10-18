import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listDocs, loadDoc } from "@/lib/content";

export function generateStaticParams() {
  return listDocs("legal").map((d) => ({ slug: d.slug.join("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadDoc("legal", [slug]);
  return doc ? { title: doc.title, description: doc.description, robots: { index: true } } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = loadDoc("legal", [slug]);
  if (!doc) notFound();
  const others = listDocs("legal").filter((d) => d.slug[0] !== slug);
  return (
    <section className="section">
      <div className="container article-grid">
        <article className="prose">
          <p className="kicker">Legal</p>
          <h1>{doc.title}</h1>
          {doc.description && <p className="lede">{doc.description}</p>}
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
          {doc.updated && (
            <p className="small muted" style={{ marginTop: 32 }}>
              Last updated {doc.updated}.
            </p>
          )}
        </article>
        <aside style={{ position: "sticky", top: 92 }}>
          <h4 style={{ fontSize: "0.9rem", color: "var(--graphite)", marginBottom: 10 }}>Other documents</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8, fontSize: "0.95rem" }}>
            {others.map((o) => (
              <li key={o.slug.join("/")}>
                <Link href={`/legal/${o.slug.join("/")}`}>{o.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
