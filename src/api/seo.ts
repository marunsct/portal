import { listDocs } from "@/src/lib/content";
import { productIds } from "@/src/lib/products";
import { company } from "@/site.config";

export function sitemap(): Response {
  const base = `https://www.${company.domain}`;
  const urls: { loc: string; priority: number }[] = [];
  const fixed = ["", "/vision", "/products", "/demo", "/docs", "/pricing", "/help", "/support", "/company", "/security", "/changelog"];
  for (const p of fixed) urls.push({ loc: base + p, priority: p === "" ? 1 : 0.7 });
  for (const id of productIds) {
    urls.push({ loc: `${base}/products/${id}`, priority: 0.9 });
    urls.push({ loc: `${base}/demo/${id}`, priority: 0.6 });
  }
  for (const d of listDocs("docs")) if (d.slug.length) urls.push({ loc: `${base}/docs/${d.slug.join("/")}`, priority: 0.5 });
  for (const d of listDocs("help")) urls.push({ loc: `${base}/help/${d.slug.join("/")}`, priority: 0.4 });
  for (const d of listDocs("legal")) urls.push({ loc: `${base}/legal/${d.slug.join("/")}`, priority: 0.2 });
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

export function robots(): Response {
  const body = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /demo/ended\nSitemap: https://www.${company.domain}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
