import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell, DocToc, PrevNext } from "@/components/DocsShell";
import { listDocs, loadDoc } from "@/lib/content";

export function generateStaticParams() {
  return listDocs("docs")
    .filter((d) => d.slug.length > 0)
    .map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = loadDoc("docs", slug);
  return doc ? { title: `${doc.title} — Docs`, description: doc.description } : {};
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const doc = loadDoc("docs", slug);
  if (!doc) notFound();
  const crumbs = [{ href: "/docs", label: "Docs" }];
  if (slug.length > 1) crumbs.push({ href: `/docs/${slug[0]}`, label: doc.section ?? slug[0] });

  return (
    <DocsShell current={slug}>
      <article>
        <p className="kicker" style={{ marginBottom: 12 }}>
          {crumbs.map((c, i) => (
            <span key={c.href}>
              <Link href={c.href}>{c.label}</Link>
              {i < crumbs.length - 1 ? " / " : ""}
            </span>
          ))}
        </p>
        <div className="prose">
          <h1>{doc.title}</h1>
          {doc.description && <p className="lede">{doc.description}</p>}
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
        {doc.updated && (
          <p className="small muted" style={{ marginTop: 32 }}>
            Last updated {doc.updated}.
          </p>
        )}
        <PrevNext current={slug} />
      </article>
      <DocToc doc={doc} />
    </DocsShell>
  );
}
