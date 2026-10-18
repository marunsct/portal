import type { Page, PageContext } from "@/src/server/page";
import { NotFound } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { DocsShell, DocToc, PrevNext } from "@/src/ui/DocsShell";
import { listDocs, loadDoc } from "@/src/lib/content";

export const docPage: Page = {
  meta: (ctx: PageContext) => {
  const slug = ctx.params.rest.split("/").filter(Boolean);
  const doc = loadDoc("docs", slug);
  return doc ? { title: `${doc.title} — Docs`, description: doc.description } : {};
  },
  render: (ctx: PageContext) => {
  const slug = ctx.params.rest.split("/").filter(Boolean);
  const doc = loadDoc("docs", slug);
  if (!doc) throw new NotFound();
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
  },
};
