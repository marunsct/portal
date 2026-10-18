/**
 * Everything the owner is likely to change lives here: names, domains, emails,
 * prices, demo limits. Nothing else in the codebase hard-codes these strings.
 *
 * Values that must differ between deployments (secrets, hostnames) are read from
 * environment variables at runtime with the defaults below. See .env.example.
 */

export const company = {
  // Working name. Alternatives considered: "Localhost Works", "Homeground AI", "Keelstack".
  name: "Ownstack",
  legalName: "Ownstack K.K.",
  tagline: "Build, run and sell AI software on hardware you own.",
  shortPitch:
    "Three self-hosted products that take a software team from a written brief to a product enterprises can buy, with every model call staying on machines you control.",
  founded: 2026,
  location: "Tsukuba, Japan",
  // Public contact addresses. Change these before going live.
  emails: {
    hello: "hello@ownstack.example",
    sales: "sales@ownstack.example",
    support: "support@ownstack.example",
    security: "security@ownstack.example",
  },
  github: "https://github.com/marunsct",
  // Public domain the portal is served from. Used in canonical links and metadata.
  domain: process.env.PUBLIC_DOMAIN ?? "ownstack.example",
};

/** Demo hosts: one hostname per product, under the demo sub-zone. */
export const demo = {
  zone: process.env.DEMO_ZONE ?? `demo.${company.domain}`,
  scheme: process.env.DEMO_SCHEME ?? "https",
  sessionMinutes: Number(process.env.DEMO_SESSION_MINUTES ?? 45),
  maxConcurrent: Number(process.env.DEMO_MAX_CONCURRENT ?? 5),
  requireEmail: (process.env.DEMO_REQUIRE_EMAIL ?? "false") === "true",
  cookieName: "ownstack_demo",
  hosts: {
    devflow: "devflow",
    agentcanvas: "canvas",
    matura: "matura",
    // Keycloak for the Matura demo; not a product, but needs a host of its own.
    id: "id",
  } as const,
};

export function demoUrl(product: keyof typeof demo.hosts): string {
  return `${demo.scheme}://${demo.hosts[product]}.${demo.zone}/`;
}

/** Plans shown on /pricing. Prices are placeholders until the owner sets them. */
export const plans = [
  {
    id: "evaluation",
    name: "Evaluation",
    price: "Free",
    period: "30 days",
    summary: "Try the hosted demos, then run a time-limited trial on your own machines.",
    includes: [
      "Hosted demos of all three products",
      "30-day self-hosted trial licence for one product",
      "Community help centre",
    ],
    cta: { label: "Start with the demos", href: "/demo" },
  },
  {
    id: "team",
    name: "Team",
    price: "from ¥180,000",
    period: "per product, per year",
    summary: "One product, self-hosted, for a team that wants updates and someone to email.",
    includes: [
      "Self-hosted licence for one product, up to 10 named users",
      "Container images from the private registry",
      "Updates and security fixes for the licence term",
      "Email support, two business days",
    ],
    cta: { label: "Request a licence", href: "/support?topic=licence&plan=team" },
  },
  {
    id: "business",
    name: "Business",
    price: "from ¥900,000",
    period: "per year",
    summary: "The whole stack, single sign-on across it, and a named engineer who knows your deployment.",
    includes: [
      "All three products, up to 50 named users",
      "Matura-backed SSO, tenancy and audit for the suite",
      "Helm charts, Compose bundles, signed SBOMs",
      "Priority support, next business day, named engineer",
      "Source access under NDA for security review",
    ],
    featured: true,
    cta: { label: "Talk to sales", href: "/support?topic=sales&plan=business" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    summary: "Air-gapped installation, source escrow, contractual SLAs and on-site enablement.",
    includes: [
      "Unlimited users, offline installer bundle",
      "Source escrow and custom licence terms",
      "Contractual response times, 24/7 for severity 1",
      "Architecture review and on-site enablement",
    ],
    cta: { label: "Contact us", href: "/support?topic=sales&plan=enterprise" },
  },
] as const;

export const supportTargets = [
  { plan: "Evaluation", channel: "Help centre, support form", firstResponse: "Best effort" },
  { plan: "Team", channel: "Email, support form", firstResponse: "2 business days" },
  { plan: "Business", channel: "Email, named engineer, video call", firstResponse: "Next business day" },
  { plan: "Enterprise", channel: "Dedicated channel, phone for severity 1", firstResponse: "Per contract, 24/7 for S1" },
];
