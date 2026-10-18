import type { Page, PageContext } from "@/src/server/page";
import Link from "@/src/ui/Link";
import { productById, type ProductId } from "@/src/lib/products";
import { demo } from "@/site.config";


export const demoEndedPage: Page = {
  meta: { title: "Demo session", robots: { index: false } },
  cache: false,
  render: (ctx: PageContext) => {
  const sp = ctx.search;
  const p = sp.product ? productById[sp.product as ProductId] : undefined;
  const reason = sp.reason ?? "ended";

  const copy =
    reason === "full"
      ? {
          title: "Every seat is taken right now.",
          body: `Up to ${demo.maxConcurrent} people can use each demo at once and all seats are busy. Sessions last ${demo.sessionMinutes} minutes, so one usually frees up within a few minutes.`,
        }
      : {
          title: "Your demo session has ended.",
          body: "Thanks for trying it. Start another session whenever you like, or install the product on your own machine with the quick start.",
        };

  return (
    <section className="section">
      <div className="container stack" style={{ ["--stack-gap" as string]: "1.4rem", maxWidth: 720 }}>
        <p className="kicker">Hosted demos</p>
        <h1>{copy.title}</h1>
        <p className="lede">{copy.body}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {p ? (
            <>
              <Link href={`/demo/${p.id}`} className="btn btn--primary">
                {reason === "full" ? `Try ${p.name} again` : `Start another ${p.name} session`}
              </Link>
              <Link href={`/docs/${p.id}/quickstart`} className="btn btn--ghost">
                Install {p.name} yourself
              </Link>
            </>
          ) : (
            <Link href="/demo" className="btn btn--primary">
              Back to the demos
            </Link>
          )}
          <Link href="/support?topic=sales" className="btn btn--ghost">
            Ask for an evaluation licence
          </Link>
        </div>
      </div>
    </section>
  );
  },
};
