import type { MetadataRoute } from "next";
import { company } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/demo/ended"] }],
    sitemap: `https://www.${company.domain}/sitemap.xml`,
  };
}
