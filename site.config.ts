/**
 * Everything the owner is likely to change lives here: names, domains, emails,
 * prices, demo limits. Nothing else in the codebase hard-codes these strings.
 *
 * Values that must differ between deployments (secrets, hostnames) are read from
 * environment variables at runtime with the defaults below. See .env.example.
 */

// Works in the browser bundle too, where `process` does not exist.
const env: Record<string, string | undefined> = typeof process !== "undefined" ? process.env : {};

export const company = {
  // Working name. Alternatives considered: "Localhost Works", "Homeground AI", "Keelstack".
  name: "Ownstack",
  legalName: "Ownstack K.K.",
  tagline: "Ship AI-built software you can prove.",
  shortPitch:
    "Self-hosted, offline-licensed software that builds, tests and governs AI-written code and agents inside your perimeter, on the models your data allows, with proof at every step.",
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
  domain: env.PUBLIC_DOMAIN ?? "ownstack.example",
};

/** Demo hosts: one hostname per product, under the demo sub-zone. */
export const demo = {
  zone: env.DEMO_ZONE ?? `demo.${company.domain}`,
  scheme: env.DEMO_SCHEME ?? "https",
  sessionMinutes: Number(env.DEMO_SESSION_MINUTES ?? 45),
  maxConcurrent: Number(env.DEMO_MAX_CONCURRENT ?? 5),
  requireEmail: (env.DEMO_REQUIRE_EMAIL ?? "false") === "true",
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
    id: "community",
    name: "Community",
    price: "Free",
    period: "single node, single user",
    summary: "Run any product yourself to learn it. Hard limits, no time limit, community help.",
    includes: [
      "One node and one user per product",
      "Every feature except SSO, SCIM, audit export and HA",
      "Hosted demos and the help centre",
      "30–45 day evaluation licence on request for a full POC",
    ],
    cta: { label: "Start with the demos", href: "/demo" },
  },
  {
    id: "team",
    name: "Team",
    price: "from ¥180,000",
    period: "per product, per node, per year",
    summary: "One product on one GPU node, for a team that wants updates and an engineer to email.",
    includes: [
      "One product on one GPU node, up to 10 users",
      "Images from the private registry; offline licence file",
      "Updates and security fixes for the term",
      "Email support in Japanese or English, two business days",
    ],
    cta: { label: "Request a licence", href: "/support?topic=licence&plan=team" },
  },
  {
    id: "business",
    name: "Business",
    price: "from ¥900,000",
    period: "per year, suite",
    summary: "The suite on up to three nodes, with one control plane for identity, tenancy, audit and evidence.",
    includes: [
      "DevFlow and AgentCanvas on up to three GPU nodes",
      "Matura control plane: SSO/SCIM, tenants, hash-chained audit",
      "Per-run evidence packs: acceptance results, decisions, model provenance",
      "Priority support, next business day, named engineer",
    ],
    featured: true,
    cta: { label: "Talk to sales", href: "/support?topic=sales&plan=business" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "from ¥2,500,000",
    period: "per year",
    summary: "Regulated and public-sector deployments: air-gapped, high availability, procurement-ready.",
    includes: [
      "Unlimited nodes, HA, dev and staging licences",
      "DS-920 and Japan control packs (ISMS, 3省2, FISC)",
      "Air-gapped bundle, source review under NDA, escrow",
      "Contractual SLA, 24/7 for severity 1; SIer delivery available",
    ],
    cta: { label: "Contact us", href: "/support?topic=sales&plan=enterprise" },
  },
] as const;

export const supportTargets = [
  { plan: "Community", channel: "Help centre, support form", firstResponse: "Best effort" },
  { plan: "Team", channel: "Email, support form", firstResponse: "2 business days" },
  { plan: "Business", channel: "Email, named engineer, video call", firstResponse: "Next business day" },
  { plan: "Enterprise", channel: "Dedicated channel, phone for severity 1", firstResponse: "Per contract, 24/7 for S1" },
];
