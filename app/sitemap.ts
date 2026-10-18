import type { MetadataRoute } from "next";
import { listDocs } from "@/lib/content";
import { productIds } from "@/lib/products";
import { company } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://www.${company.domain}`;
  const fixed = ["", "/vision", "/products", "/demo", "/docs", "/pricing", "/help", "/support", "/company", "/security", "/changelog"];
  const urls: MetadataRoute.Sitemap = fixed.map((p) => ({ url: base + p, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
  for (const id of productIds) {
    urls.push({ url: `${base}/products/${id}`, changeFrequency: "weekly", priority: 0.9 });
    urls.push({ url: `${base}/demo/${id}`, changeFrequency: "monthly", priority: 0.6 });
  }
  for (const d of listDocs("docs")) if (d.slug.length) urls.push({ url: `${base}/docs/${d.slug.join("/")}`, changeFrequency: "monthly", priority: 0.5 });
  for (const d of listDocs("help")) urls.push({ url: `${base}/help/${d.slug.join("/")}`, changeFrequency: "monthly", priority: 0.4 });
  for (const d of listDocs("legal")) urls.push({ url: `${base}/legal/${d.slug.join("/")}`, changeFrequency: "yearly", priority: 0.2 });
  return urls;
}
