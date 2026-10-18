import { api, page, type Route } from "./router";
import { homePage } from "@/src/pages/home";
import { visionPage } from "@/src/pages/vision";
import { productsPage } from "@/src/pages/products";
import { productPage } from "@/src/pages/product";
import { demoHubPage } from "@/src/pages/demo-hub";
import { demoLaunchPage } from "@/src/pages/demo-launch";
import { demoEndedPage } from "@/src/pages/demo-ended";
import { docsHomePage } from "@/src/pages/docs-home";
import { docPage } from "@/src/pages/doc";
import { pricingPage } from "@/src/pages/pricing";
import { companyPage } from "@/src/pages/company";
import { securityPage } from "@/src/pages/security";
import { helpPage } from "@/src/pages/help";
import { helpArticlePage } from "@/src/pages/help-article";
import { supportPage } from "@/src/pages/support";
import { changelogPage } from "@/src/pages/changelog";
import { legalPage } from "@/src/pages/legal";
import * as demoStart from "@/src/api/demo-start";
import * as demoVerify from "@/src/api/demo-verify";
import * as demoStatus from "@/src/api/demo-status";
import * as demoEnd from "@/src/api/demo-end";
import * as support from "@/src/api/support";
import * as seo from "@/src/api/seo";

export const routes: Route[] = [
  page("/", homePage),
  page("/vision", visionPage),
  page("/products", productsPage),
  page("/products/:slug", productPage),
  page("/demo", demoHubPage),
  page("/demo/ended", demoEndedPage),
  page("/demo/:slug", demoLaunchPage),
  page("/docs", docsHomePage),
  page("/docs/*rest", docPage),
  page("/pricing", pricingPage),
  page("/company", companyPage),
  page("/security", securityPage),
  page("/help", helpPage),
  page("/help/:slug", helpArticlePage),
  page("/support", supportPage),
  page("/changelog", changelogPage),
  page("/legal/:slug", legalPage),

  api("/api/demo/start", { POST: demoStart.POST }),
  api("/api/demo/verify", { GET: demoVerify.GET, HEAD: demoVerify.GET }),
  api("/api/demo/status", { GET: demoStatus.GET }),
  api("/api/demo/end", { POST: demoEnd.POST }),
  api("/api/support", { POST: support.POST }),
  api("/sitemap.xml", { GET: seo.sitemap }),
  api("/robots.txt", { GET: seo.robots }),
];
