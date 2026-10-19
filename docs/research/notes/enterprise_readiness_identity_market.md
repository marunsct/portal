# Enterprise-readiness infrastructure and AI-agent identity: market evidence for Matura (as of October 2026)

Research date: 2026-10-19. Matura's description (self-hosted Go binary + Postgres + Keycloak, optional OpenFGA; tenants with row-level-security (RLS) isolation, per-tenant SAML/OIDC + SCIM, MFA/session policy, hash-chained audit log, export/erasure, entitlements, agents/service accounts as revocable tenant identities with on-behalf-of (OBO) tokens and MCP protected-resource metadata (PRM), readiness scorer with OSCAL export + trust page, SDKs, conformance CLI; Apache-2.0) comes from the assignment, not from research.

Method note: the shared web-search budget ran out partway through (200 searches per turn across agents). Later material came from direct fetches of vendor pages. Two URLs were blocked by permission timeouts and not read: sso.tax and keycloak.org. Many secondary sources are vendor blogs (SSOJet, Skycloak, SuperTokens, WorkOS, ComplyJet, Mycroft, Palo Alto Networks). Where a vendor has an interest in its own figures, this is flagged.

---

## 1. Competitors and adjacent products: hosting, pricing, funding, coverage

### Takeaway
Hosted developer platforms cover the identity half of "enterprise readiness" well and cheaply: WorkOS, Clerk, Frontegg, Descope, Stytch, Auth0 and PropelAuth all offer per-org SSO, SCIM, an admin portal, and increasingly MCP/agent auth. The fine-grained authorisation (FGA) engines are mature and mostly Apache-2.0. Postgres tenant isolation exists as a hosted database (Nile). No single product found covers tenancy + database-level isolation + audit + data rights + compliance evidence end to end, and none does it self-hosted. Self-hosted options (Keycloak, Zitadel, Ory, Authentik, Logto, SuperTokens) cover identity only, and the app team must build the rest.

### Cited Findings

**Identity / auth platforms (hosted)**
- WorkOS publishes per-connection pricing for SSO: 1–15 connections at $125 each, 16–30 at $100, 31–50 at $80, 51–100 at $65, and contact sales above 100. Directory Sync (SCIM) uses the same bands. AuthKit is free up to 1M users, then $2,500/mo per extra 1M. Audit Logs cost $125/mo per SIEM stream plus $99/mo per million events retained. Radar (bot/abuse detection) is free for the first 1,000 checks, then $100/mo per 50k. A custom domain is $99/mo. The Admin Portal is included. Vault (EKM) and Pipes are listed without prices. — [WorkOS pricing](https://workos.com/pricing)
- An SSOJet article (verified 2026-07-28; SSOJet is a competitor) reads the WorkOS bands as extending to $50 for connections 101–200. It estimates WorkOS at about $1,250/mo for 10 connections, $4,975 for 50 and $13,225 for 200. SSOJet's own price is $49.50 per connection on a $99/mo base, with SCIM included. — [SSOJet pricing 2026](https://ssojet.com/blog/enterprise-authentication-pricing-2026)
- Auth0 B2B Essentials costs $150/mo with 3 enterprise connections. B2B Professional costs $800/mo with 5. Extra connections are priced by sales. Okta Workforce costs $6–17 per user per month with a $1,500 annual minimum. — [SSOJet pricing 2026](https://ssojet.com/blog/enterprise-authentication-pricing-2026)
- WorkOS raised a $100M Series C at a $2B valuation on 2026-03-02, led by Meritech and Sapphire. Named AI customers include OpenAI, Anthropic, xAI, Cursor, Perplexity, Replit and Vercel. Its post says: "From day one, buyers expect SSO, SCIM, permissions, and auditability", and "Next come agents." — [WorkOS Series C blog](https://workos.com/blog/series-c)
- A WorkOS article (2026-05-06) claims "more than 2,000 other companies" use WorkOS. Its enterprise-readiness checklist has ten items: SSO; MCP/agent auth; SCIM; RBAC/FGA; audit logs (immutable, SIEM streaming, tenant-scoped UI, agent activity); MFA; a self-serve admin portal; multi-tenant org modelling; bot detection; and secrets/encryption (per-tenant keys, BYOK/HYOK). Data residency is not mentioned. — [WorkOS enterprise readiness checklist 2026](https://workos.com/blog/enterprise-readiness-checklist-2026)
- WorkOS acquired Warrant, a Zanzibar-style FGA product, in 2024. The acquisition post itself was not readable; the date comes from a third-party changelog. — [WorkOS acquires Warrant](https://workos.com/blog/workos-acquires-warrant); [CIAM Compass changelog](https://guptadeepak.com/ciam-compass/changelog/workos-acquires-warrant-2024/)
- **Clerk** pricing:
  - Plans: Hobby is free for 50k monthly retained users (MRU) per app. Pro is $20/mo annual or $25 monthly. Business is $250/mo annual. MRU overage is $0.02 down to $0.012 per user.
  - Enterprise SSO: 1 connection included, then $75/mo each for connections 2–15 and $60 for 16–100.
  - Directory Sync (SCIM) uses the same tiers, counted separately. Billing for it starts 2027-01-01.
  - The B2B Enhanced add-on is $100/mo (or $85 annual). It includes 100 monthly retained orgs, then $1 down to $0.60 per org.
  - Billing add-on: 0.7% of volume.
  - Source: [Clerk pricing](https://clerk.com/pricing)
- Clerk's SCIM reached GA in April 2026. Self-serve Directory Sync shipped on 2026-09-30, and SSO bypass on 2026-09-29. — [Skycloak, Clerk vs WorkOS (2026-10-14)](https://skycloak.io/blog/clerk-vs-workos/). A PropelAuth article from April 2026 said Clerk SCIM was "roadmap only". That was outdated by Clerk's own pricing page and the later Skycloak article. — [PropelAuth](https://www.propelauth.com/post/6-auth-platforms-enterprise-sso-support)
- SuperTokens' example Clerk bills include $675/mo for 40k MRU, 500 orgs and 3 SAML customers. Org fees alone are $900/mo at 1,000 orgs. — [SuperTokens Clerk pricing guide](https://supertokens.com/blog/clerk-pricing-the-complete-guide)
- **Frontegg** (pricing page last modified 2026-02-04):
  - "Pay as you go" is $0 with 7,500 MAU, 5 enterprise (SSO/SCIM) connections and unlimited organisations. Enterprise is custom.
  - Features listed: entitlements, ReBAC, audit-log streaming, "Private deployments", and an MCP server with agent-activity auditability. A separate product, Agen.co, is also promoted.
  - Source: [Frontegg pricing](https://frontegg.com/pricing)
- **Descope**:
  - Free: 7,500 MAU, 10 tenants, 3 SSO connections, no SCIM.
  - Pro: from $249/mo, with 10k MAU, 35 tenants and 5 SSO connections, plus $50 per extra connection. No SCIM.
  - Growth: from $799/mo, with 25k MAU, 100 tenants, 10 connections and SCIM.
  - Agentic Identity Hub 3.0 is promoted. Agent-related usage is metered as M2M exchanges ($2 per 1,000 over), Monthly Active Consents for MCP/inbound apps ($0.05) and Monthly Active Tokens for outbound connections ($0.05).
  - FedRAMP High is a paid add-on.
  - Source: [Descope pricing](https://www.descope.com/pricing)
- **Stytch**: pay-as-you-go at $0 includes 10,000 "monthly active users and AI agents", unlimited orgs, 5 SSO/SCIM connections and 1,000 M2M tokens. Extra connections are $125 each. — [Stytch pricing](https://stytch.com/pricing)
- **PropelAuth**: "All paid plans include unlimited SSO connections with no per-connection fees." SCIM is on Growth Plus. **Kinde** has no per-connection fees and is free to 10,500 MAU. — [PropelAuth (2026-04-09)](https://www.propelauth.com/post/6-auth-platforms-enterprise-sso-support)
- **Auth0 for AI Agents**: launched in Developer Preview on 2025-04-08. It comprises user auth for agents, Token Vault (federated token exchange to Gmail/Slack/GitHub), async authorisation via CIBA, and FGA for RAG. — [Auth0 blog](https://auth0.com/blog/introducing-auth0-for-ai-agents/); [Okta press release 2025-04-09](https://www.okta.com/newsroom/press-releases/auth0-platform-innovation/). The current auth0.com/ai page markets "AI Identity for B2B / Commerce" without stated GA status or pricing. — [Auth0 AI](https://auth0.com/ai)

**Self-hosted / open-source identity**
- **Keycloak**:
  - Licence: Apache-2.0, with no per-user fees.
  - Organizations (single-realm multi-tenancy, per-org IdP linking and domains) has been stable since Keycloak 26.
  - Native SCIM: experimental in 26.6, preview in 26.7, supported in 26.8. It is inbound only, with no bulk operations or sorting.
  - Gaps: no off-the-shelf customer admin portal, no self-service tenant onboarding, no billing.
  - Ops are a recurring cost: frequent releases and patching. Sizing is about 1 vCPU per 15 password logins/s.
  - Source: [Skycloak, Is Keycloak right for B2B SaaS (updated 2026-10-15)](https://skycloak.io/blog/is-keycloak-right-for-b2b-saas/)
- Keycloak 26.5 (January 2026) shipped preview support for the JWT authorization grant (ID-JAG), consumption side only. — [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)
- **Phase Two** (managed Keycloak) adds Organizations, an IdP self-serve SSO wizard, a customer-safe Admin Portal, SCIM and a CockroachDB option. Its Starter cluster tier starts at $149/mo. It claims "Most teams save 80%+" moving from Auth0, which is unsupported. — [Phase Two blog (updated 2026-09-08)](https://phasetwo.io/blog/keycloak-for-startups-cost/). Other managed Keycloak hosts are Cloud-IAM, Skycloak, Clever Cloud and Elestio; their prices were not obtained. — [Skycloak](https://skycloak.io/blog/is-keycloak-right-for-b2b-saas/)
- **Zitadel** moved from Apache-2.0 to AGPL-3.0 starting with v3 (FAQ dated 2025-08-29), "to ensure Zitadel's long-term sustainability". It also added a CLA. SDKs and proto definitions stay Apache-2.0. A commercial licence is available for those who cannot use AGPL. — [Zitadel licensing FAQ](https://help.zitadel.com/zitadel-licensing-faqs); commentary dated 2025-05-05 at [CIAM Weekly](https://ciamweekly.substack.com/p/the-zitadel-relicense). No evidence was found of a later switch back to Apache. The assignment's "AGPL→Apache 2.0" wording appears reversed: the documented move is Apache→AGPL.
- **Ory Network** pricing:
  - Production tier: $770/yr, then $0.14 per average daily active user, $0.007 per M2M token and $0.00009 per permission check.
  - Growth tier: $9,350/yr. B2B SSO on Growth is OIDC only.
  - SAML SSO, SCIM and Directory Sync are Enterprise-only.
  - The Ory Enterprise License (self-hosted) is custom-priced. Ory Polis is listed as "B2B Federation".
  - Source: [Ory pricing](https://www.ory.com/pricing)
- **Authentik**: open source is free and includes SAML and SCIM. Enterprise is $5 per internal user per month, external users are $0.02/mo, and service accounts are free. Enterprise Plus starts at $20k/yr. Its promise: "we will not move any features from the open source version to the enterprise version." — [Authentik pricing](https://goauthentik.io/pricing). The licence (assumed MIT) was not confirmed on the page.
- **Logto** Cloud: free to 50k MAU; Pro from $24/mo. Enterprise SSO costs $48 per connector, and Organizations and MFA are $48 add-ons each. The self-hosted licence was not stated on the pricing page. — [Logto pricing](https://logto.io/pricing)
- **SuperTokens**: self-hosted core is free with no user limit. Managed is free under 5k MAU, then $0.02 per MAU. Multi-tenancy is a paid add-on. — [SuperTokens](https://supertokens.com/blog/clerk-pricing-the-complete-guide)

**Authorisation engines**
- **OpenFGA**: CNCF Sandbox from 2022, Incubating from 2025-10-28 (announced 2025-11-11). It had 37 public production adopters, 4,300+ GitHub stars and 96 core contributors. It is the "foundation for the Auth0 FGA commercial offering". Maintainers are from Okta, Grafana Labs and GitPod. — [CNCF blog](https://www.cncf.io/blog/2025/11/11/openfga-becomes-a-cncf-incubating-project/); [OpenFGA project](https://openfga.dev/project)
- **SpiceDB / AuthZed**: Apache-2.0. Cloud is usage-based ("from $2/hr"). The self-hosted enterprise licence is priced per region and per vCPU. AuthZed raised a $12M Series A. — [AuthZed pricing](https://authzed.com/pricing); [SecurityWeek](https://securityweek.com/authzed-raises-12-million-for-permissions-management-technology)
- **Cerbos**:
  - The policy decision point (PDP) is open source and free. Cerbos Hub has four paid levels: proof of concept is $0 for 100 monthly active principals (MAP); Development from $25/mo; Production from $933/mo with 5,000 MAP; Enterprise adds self-hosted Hub and SSO.
  - Principals include non-human identities, and Cerbos markets authorisation for AI agents and MCP servers. — [Cerbos pricing](https://www.cerbos.dev/pricing)
  - Funding: $7.5M extended seed, $11M total (2023). — [SecurityWeek](https://www.securityweek.com/cerbos-raises-7-5-million-for-authorization-platform/)
- **Permit.io**:
  - Community tier: free for 1,000 MAU and 20 tenants. Enterprise is custom, with on-prem deployment, a SOC 2 report and a HIPAA BAA.
  - Pricing counts "humans, services, and agents". MCP Gateway and AI Access Control products are listed.
  - Source: [Permit pricing](https://www.permit.io/pricing)
  - Funding: $14M total, including an $8M Series A on 2024-02-15. — [CB Insights](https://www.cbinsights.com/company/permitio/financials)
  - A June 2026 roundup cites Permit from about $150/mo and Oso Cloud from about $149/mo. — [guptadeepak.com](https://guptadeepak.com/tools/top-5-authorization-pbac-tools-2026/)

**Data layer**
- **Nile** (Postgres "tenant virtualization"):
  - Funding: $11.6M seed led by Benchmark, 2024-01-30. Founders are from Confluent's Kafka/cloud teams. — [TechCrunch](https://techcrunch.com/2024/01/30/nile-raises-11-6m-in-seed-funding-to-build-a-postgres-powered-data-layer-for-saas-applications)
  - Pricing: Free; Pro $15/mo; Scale $350/mo; Enterprise for "Millions of Tenants". Tenant isolation is included on all tiers.
  - Provisioned/dedicated compute, tenant-level backups and multi-region placement are all "coming soon". — [Nile pricing](https://thenile.dev/pricing)

**Compliance automation / trust centres**
- **Vanta**: Series D of $150M at a $4.15B valuation (2025-07-24), $504M raised in total. It has 12,000+ customers in 58 countries and AI agents for questionnaires. — [SecurityWeek](https://www.securityweek.com/grc-firm-vanta-raises-150-million-at-4-15-billion-valuation/)
- **Drata** bought **SafeBase** (trust centre and AI questionnaire automation, 1,000+ customers) for $250M on 2025-02-12. Drata then had 7,000+ customers, was "nearing $100M ARR", and was adding about 650 customers per quarter. — [TechCrunch](https://techcrunch.com/2025/02/12/security-compliance-firm-drata-acquires-safebase-for-250m)
- Vanta prices (checked 2026-10-15):
  - AWS Marketplace list prices for 1–20 employees: Essentials $14,000/yr, Plus $21,500, Professional $23,000.
  - Trust Center add-on: $6,000/yr; Trust Center Advanced: $10,000.
  - Questionnaire Automation: $10,000 (144 per year).
  - Vendr's data on 374 purchases: $7.5k–$57k/yr, median $20k.
  - Secureframe Fundamentals starts at $7,500/yr.
  - Source: [SOC2Auditors.org Vanta pricing](https://soc2auditors.org/insights/vanta-pricing/)
- **Oneleet** costs $15k–$50k/yr and often bundles the audit, a manual pentest and a trust page. It quotes about 4–6 months to a Type II report. This comes from a competitor's blog (ComplyJet, 2026-03-13). — [ComplyJet](https://www.complyjet.com/blog/oneleet-vs-vanta)
- Not researched for lack of budget: Conveyor, Sprinto, Enzoic, Topaz/Aserto, Oso funding, Propel Auth funding, enterpriseready.io content, and SaaS boilerplates. Aserto has a CB Insights page that was not read.

### Inferences
- **Coverage map.** Identity (per-org SSO/SCIM/MFA/admin portal) is commoditised: hosted vendors give 1–5 connections free and charge $48–$125 per extra connection. Some (PropelAuth, Kinde) charge nothing per connection. FGA is commoditised in open source. Compliance automation is a separate, well-funded GRC category (Vanta $4.15B; Drata about $100M ARR). The integrated "tenant + RLS isolation + audit chain + data rights + entitlements + evidence" bundle, self-hosted, has no direct competitor found.
- **Closest analogues.** Frontegg (identity + entitlements + audit + private deployments) and WorkOS (identity + FGA + audit logs + Vault + MCP auth) are the closest hosted analogues; neither does database-level isolation or compliance evidence. Phase Two and Keycloak are the closest self-hosted base, and Matura sits on top of Keycloak, which overlaps with Phase Two's value-add (org wizard, admin portal).
- **Price pressure.** Pricing for the identity half is low and falling: Clerk at $75 and $60 per connection, and SCIM free until 2027. Matura cannot monetise SSO/SCIM per connection. The monetisable value is the self-hosted bundle plus evidence.

### Gaps
- The Keycloak release/licence page (keycloak.org) was blocked, so Keycloak facts come from Skycloak's secondary article.
- No adoption or usage numbers for Frontegg, Descope, Stytch or Clerk were found. Clerk funding was not retrieved.
- WorkOS FGA pricing is not shown on its pricing page.
- Cloud-IAM and Skycloak prices were not obtained.

---

## 2. Buyer evidence: SSO tax, questionnaires, SOC 2/ISO costs, AI-governance demand, Japan

### Takeaway
Vendor-sourced data consistently shows that SSO, SCIM and audit logs gate enterprise deals: SSO is near-universal above $15M ARR, and audit logs are demanded by about 84% of prospects in one survey. But much of the evidence is vendor-published. A small startup's first-year SOC 2 Type II costs about $20k–45k in total. In Japan, ISMS (8,470 orgs) and P-Mark (17,788) are the established trust signals, and ISO 42001/AIMS is just starting (11 Japanese certifications by August 2026). That points to a Japan-specific evidence story built on ISMS/ISMAP mappings rather than SOC 2.

### Cited Findings
- The SSOJet 2026 survey (340 B2B SaaS companies, Sep–Dec 2025; vendor-published, with some internal inconsistencies) reported:
  - Enterprise SSO support in 2025: 47% at $2–5M ARR, 81% at $5–15M (54% in 2022), 94% at $15–50M, 98–99% above $50M.
  - SCIM support overall: 48% in 2025 (32% in 2024).
  - 42% cite "They had SSO, you didn't" as a competitive loss reason (average deal $67,300).
  - Win rate: 18.7% with no SSO vs 64.2% with SSO + SCIM (1,247 deals).
  - Prospect requirements: SAML 94%, OIDC 78%, audit logs 84%, MFA 77%, session management 61%.
  - Share of buyers requiring SSO by industry: financial services 94%, healthcare 91%, government 89%. By region: APAC 58% vs Europe 78%.
  - Source: [SSOJet Enterprise SSO Adoption 2026](https://ssojet.com/research-reports/enterprise-sso-adoption-2026)
- WorkOS: "From day one, buyers expect SSO, SCIM, permissions, and auditability." — [WorkOS Series C](https://workos.com/blog/series-c)
- SOC 2 cost and effort:
  - The Q3 2026 median SOC 2 Type 2 audit for 1–10 employees is $9,000. With Vanta Essentials, the rough first year is about $23k, excluding pentest and internal time. — [SOC2Auditors.org](https://soc2auditors.org/insights/vanta-pricing/)
  - A competitor estimates a Vanta first-year SOC 2 at $22k–45k and Oneleet at $15k–30k including audit and pentest. Pentests cost $5k–15k. — [ComplyJet](https://www.complyjet.com/blog/oneleet-vs-vanta)
  - First engagement takes 2–5 months platform-assisted and 4–9 months DIY. Startup internal effort is 100–200 hours. Auditor fees are 30–40% of the budget. A second framework such as ISO 27001 adds 20–40% to platform cost. — [Agency blog 2026](https://blog.getagency.com/articles/how-much-does-soc-2-compliance-cost-2026)
- EU AI Act timing. Regulation (EU) 2026/1744 (the Digital Omnibus on AI) entered into force on 2026-07-27. It defers Annex III high-risk obligations from 2026-08-02 to 2027-12-02, and Annex I (product-embedded) to 2028-08-02. Already in force:
  - Article 50 transparency duties (from 2026-08-02);
  - GPAI obligations (from 2025-08-02);
  - prohibited practices (from 2025-02-02).
  - Source: [CSA research note 2026-08-01](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/)
- ISO 42001: about 40% of EU and about 25% of North American enterprise AI-vendor RFPs reportedly include an ISO 42001 question by mid-2026, and ISO 42001 maps to roughly 60–70% of AI Act documentation. Certification takes 9–15 months with an existing ISO 27001 ISMS. All of these figures are unsourced claims on a low-quality vendor page. — [ExamCert](https://www.examcert.app/blog/iso-42001-ai-management-certification-2026/)
- Japan, certification counts:
  - As of 2026-03-31: 8,470 ISMS (ISO 27001) certified organisations (+418 year on year); 773 ISMS cloud-security (27017) certifications (+129); 38 accredited certification bodies.
  - The AIMS (ISO 42001) scheme had 2 accredited bodies (since 2026-01-14) and 4 certified organisations. — [ISMS-AC Business Report 2025](https://isms.jp/ov/i1tqjm00000034f9-att/BusinessReport2025(ISMS-AC).pdf)
  - AIMS certifications in Japan reached 11 by 2026-08-05. JIS Q 42001 was issued on 2025-08-20; JIS Q 42005 and 42006 on 2026-08-20. ISMS-AC became an APAC AIMS MRA signatory in June 2026. — [innovatopia](https://innovatopia.jp/ai/ai-news/116644/)
  - ISMS passed 8,000 registrations in December 2024. — [ScanNetSecurity](https://scan.netsecurity.ne.jp/article/2025/01/14/52147.html)
  - Privacy Mark: 17,788 certified businesses at 2026-03-31, flat since 2022 (17,793 in 2024), 9,833 of them in Tokyo. — [JIPDEC P-Mark data](https://privacymark.jp/certification_info/data/g7ccig0000000gll-att/pmark_data_20260331.pdf)
- ISMAP: operations started in December 2019, and the first cloud service list was published in June 2020. Registration repeats annually and audit bodies renew every two years. — [MIC "はじめてのISMAP"](https://www.soumu.go.jp/main_content/001002781.pdf). Registration is rare for smaller vendors: Ryobi Systems' 2025-06-30 listing was the only one from the Chugoku-Shikoku region. — [Impress Cloud Watch](https://cloud.watch.impress.co.jp/docs/news/2030510.html)
- Medical (3省2ガイドライン). The MHLW guideline v6.0 (2023-05-31) is in four parts: overview, governance, management and control. The MIC/METI provider guideline v1.1 (2023-07-07) is risk-based and stresses a contractual split of responsibilities between providers and medical institutions, ransomware preparedness and risk communication. — [AWS Japan blog](https://aws.amazon.com/jp/blogs/news/japan-security-guidelines-for-medical-information-systems-2023-06)
- Finance (FISC): the FISC 安全対策基準 itself must be purchased from FISC, and financial institutions must meet it before using cloud. — [Google Cloud JP blog](https://cloud.google.com/blog/ja/topics/financial-services/google-cloud-security-reference-for-financial-institutions)
- HENNGE One passed 3 million contracted users, with 3,731 contracted companies (about 20% of TSE-listed companies) at end-March 2026. It holds the top share of Japan's IDaaS market (ITR) and targets ARR of ¥20bn by FY2029/9. — [PR Times 2026-05-28](https://prtimes.jp/main/html/rd/p/000000326.000007098.html). HENNGE One continually adds SSO integrations with Japanese SaaS. — [ScanNetSecurity](https://scan.netsecurity.ne.jp/article/2025/12/10/54193.html)

### Inferences
- **Deal-gating.** Directionally, SSO/SCIM/audit gate deals, especially in finance, healthcare and government, which are Matura's regulated target sectors. The evidence base is mostly vendor surveys, so the writer should present percentages as indicative.
- **Matura's role in compliance.** With SOC 2 at $20–45k in year one and GRC platforms at $7.5k–23k/yr before add-ons, compliance is a budgeted line item. Matura's readiness scorer and trust page compete with roughly $6k/yr trust-centre add-ons, not with the audit. It can reduce effort but cannot replace auditors.
- **Japan.** The large ISMS and P-Mark installed bases, plus the brand-new AIMS scheme, suggest an opening for pre-built control mappings for ISMS, ISMAP, 3省2 and FISC. Matura's HENNGE One/Entra connector testing would match how Japanese enterprises actually sign in, given HENNGE's reach among TSE-listed firms.
- **AI Act timing.** The deferral to December 2027 reduces urgency for high-risk conformity in 2026. Transparency and GPAI duties already apply, so AI-governance evidence is a 2027 buying cycle more than a 2026 one.

### Gaps
- No independent (non-vendor) data was found on deal-stall frequency. The a16z "SSO tax" pieces and sso.tax were not retrieved (sso.tax was blocked).
- SIG Lite and CAIQ question contents were not researched.
- No reliable ISO 27001 cost figures for Japan, or ISMAP registration cost and duration, were found.
- The current FISC edition (第12版?) and its specific SaaS controls were not confirmed.
- No data was found on Japanese enterprises' SCIM expectations, or on Entra vs Okta vs OneLogin share in Japan.
- No global ISO 42001 certification count was found.

---

## 3. Agent identity and governance

### Takeaway
By October 2026 the large platforms have moved fast: Microsoft Entra Agent ID (GA), Okta for AI Agents and Cross App Access, Google Cloud Agent Identity (SPIFFE-based), SailPoint Agentic Fabric (GA August 2026), Auth0 Token Vault, and WorkOS/Descope/Stytch MCP auth. The MCP spec now mandates PRM (RFC 9728), resource indicators and Client ID Metadata Documents, and its Enterprise-Managed Authorization extension (ID-JAG) is stable. Agent identity is therefore becoming commodity at the IdP and workforce layer. What remains open is tenant-scoped agent identities inside B2B apps, with per-tenant revocation, OBO token chains and per-action audit, self-hosted. That is a narrower differentiator, but it is real.

### Cited Findings
- MCP authorization spec (2026-07-28 revision):
  - MCP servers **MUST** implement OAuth 2.0 Protected Resource Metadata (RFC 9728). Clients **MUST** use it for authorisation-server discovery.
  - Client ID Metadata Documents are **SHOULD**; Dynamic Client Registration is **MAY** and "deprecated and retained for backwards compatibility".
  - Clients **MUST** send RFC 8707 `resource`. Servers **MUST** validate audience and "MUST NOT accept or transit any other tokens".
  - Also covered: RFC 9207 `iss` validation, step-up scope challenges, and authorization extensions in a separate ext-auth repository.
  - Source: [MCP spec 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization); earlier versions: [2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization), [2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- MCP Enterprise-Managed Authorization (ID-JAG; Okta brands it "Cross App Access") became stable on 2026-06-18:
  - The IdP issues a signed assertion at SSO, and the MCP server's authorisation server issues scoped tokens with no consent screen.
  - Support: Okta is the only shipping IdP. Clients are Claude, Claude Code and Cowork, plus VS Code. Services include Asana, Atlassian, Canva, Figma, Linear and Supabase.
  - The IdP decides which servers can be reached but not whether a given action is allowed, which "is left to policy engines and gateways".
  - Source: [The New Stack 2026-06-18](https://thenewstack.io/mcp-gets-its-missing-enterprise-authorization-layer/)
- Anthropic made enterprise-managed auth for MCP connectors GA on 2026-08-24. WorkOS AuthKit accepts ID-JAG assertions for MCP server builders. — [WorkOS blog 2026-08-26](https://workos.com/blog/enterprise-managed-auth-ga-mcp-server-builders)
- ID-JAG is an IETF OAuth WG draft (rev 04, 2026-05-21), not yet an RFC. — [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)
- **Microsoft Entra Agent ID**:
  - Objects: agent blueprints, blueprint principals, agent identities and optional agent users. Flows: autonomous, OBO, and the agent's user account.
  - Status: GA, with Conditional Access and Identity Protection for agents.
  - Licensing: Agent 365 at $15 per user per month; Microsoft 365 E7 at $99 per user includes it. Licensing is per human, not per agent.
  - Weaknesses: Microsoft-centric reach for third-party SaaS. Audit logs do not distinguish agent identities by default. Deleted agents' user accounts linger and need manual cleanup.
  - Source: [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)
  - Security research (2026-06-09) found that a blueprint credential compromise affects all child agents. Blueprint owners can take over agents, and two attack paths lead to Global Admin. Of 1,041 Graph permissions tested, 944 were allowed for agents. — [Compass Security](https://blog.compass-security.com/2026/06/entra-agent-id-from-a-security-perspective/)
- **Okta for AI Agents**:
  - Features: agents are registered in Universal Directory. Agent Gateway brokers short-lived credentials (research release). Agent-to-Agent Connections is GA. Resource Access Certifications for agents are in early access. Deactivation acts as a kill switch.
  - Cross App Access was announced on 2026-06-23. Pricing is quote-only.
  - Okta is acquiring Permiso (NHI threat detection) for about $200M (reported 2026-07-30).
  - Source: [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)
- **SailPoint Agentic Fabric** (GA 2026-08-04) governs rather than issues: discovery across AWS, Azure, GCP, Salesforce and Copilot Studio; human owners; certifications; a kill switch. Pricing is per identity, counting humans and machines. — [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)
- **Google Cloud Agent Identity**:
  - Identity: a per-agent SPIFFE ID with auto-rotated 24-hour X.509 certificates, certificate-bound tokens and DPoP. Agent identities are not impersonable and have no long-lived keys.
  - Delegation: OBO via 3-legged OAuth in the Agent Identity auth manager. Logs record both agent and user, and access is revocable.
  - Source: [Google Cloud docs, updated 2026-10-13](https://docs.cloud.google.com/iam/docs/agent-identity-overview)
- **Palo Alto Networks** (Idira) promotes SPIFFE plus OAuth for agents (2026-07-20). This is a vendor post with no adoption data. — [PANW blog](https://www.paloaltonetworks.com/blog/identity-security/ai-agent-security-spiffe-machine-identity/)
- **Auth0**: Token Vault, CIBA async approval and FGA for RAG (Developer Preview from April 2025). — [Auth0 blog](https://auth0.com/blog/introducing-auth0-for-ai-agents/)
- **Hosted dev platforms now meter agents**: Stytch counts "monthly active users and AI agents"; Descope meters MCP consents and token exchanges; Permit and Cerbos count agents as principals. — [Stytch](https://stytch.com/pricing); [Descope](https://www.descope.com/pricing); [Permit](https://www.permit.io/pricing); [Cerbos](https://www.cerbos.dev/pricing)
- **NHI market**:
  - Meticulous Research (February 2026) sizes non-human identity access management at $12.2B in 2026, rising to $38.8B by 2036 (12.2% CAGR). It cites machine:human identity ratios "exceeding 100:1". Analyst-firm figure, methodology not reviewed. — [Meticulous Research](https://www.meticulousresearch.com/product/non-human-identity-access-management-market-6482)
  - A CSA survey (383 respondents, commissioned by Oasis Security) found 78% have no documented policy for creating or removing AI identities, and 14% have automated that lifecycle. — via [Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)

### Inferences
- **Commodity.** Workforce-side agent identity (an enterprise's own agents in Entra or Okta) is now provided by incumbents. MCP OAuth plumbing (PRM, audience validation, CIMD) is spec-mandated and offered by WorkOS, Stytch, Descope and Auth0. Matura's "MCP PRM metadata" is table stakes, not a differentiator.
- **Still open.** The ISV side is less served: an app that must represent customer-tenant agents as first-class, tenant-scoped, revocable identities, with OBO chains (user → agent → tool) recorded in a tamper-evident audit log the tenant can export.
  - The incumbents' gaps point here: Entra's audit doesn't distinguish agents, and the IdP doesn't decide per-action authorisation.
  - A self-hosted, tenant-scoped agent registry + OBO + hash-chained audit + FGA check is a defensible niche, especially for regulated or on-prem buyers and local-model deployments.
- **To-do for Matura.** Matura should accept ID-JAG / Enterprise-Managed Authorization assertions as an authorisation server, since Keycloak's support is consumption-only preview. Otherwise customers' Okta-governed Claude/VS Code users cannot reach MCP servers built on Matura without consent friction.

### Gaps
- Not researched for lack of budget: AWS (Bedrock AgentCore Identity), Cloudflare, Ping, CyberArk (including its acquisition status by Palo Alto Networks), and Strata/Permiso NHI research.
- Gartner machine-identity figures were not obtained.
- Auth0 for AI Agents' current GA status and pricing are unconfirmed.

---

## 4. Compliance-evidence products: OSCAL, AI governance, trust pages

### Takeaway
OSCAL is becoming mandatory in the US federal market (FedRAMP 20x machine-readable packages, with new authorisations due around September 2026 per one source). There is no evidence that commercial SaaS buyers ask for OSCAL. Trust centres are an established paid category (SafeBase $250M exit; Vanta Trust Center about $6k/yr). In-product evidence generation is plausible, but not demonstrated as a buyer demand.

### Cited Findings
- FedRAMP 20x:
  - RFC-0024 requires Rev5 cloud service providers to submit machine-readable packages. New authorisations must comply by 2026-09-30 and existing ones by 2027-09-30. The same vendor's FAQ contradicts this, citing January 2027.
  - Phase 2 (Moderate) pilot ran November 2025–March 2026 with 13 participants. The FedRAMP PMO: "most CSPs... were not fully ready".
  - Some platforms' OSCAL output fails schema validation.
  - Source: [Mycroft blog (vendor)](https://diogenesclub.mycroft.io/blog/fedramp-20x-platform-readiness-oscal-export-guide)
- Trust centres: Drata/SafeBase deal for $250M. — [TechCrunch](https://techcrunch.com/2025/02/12/security-compliance-firm-drata-acquires-safebase-for-250m). Vanta Trust Center add-on is $6k/yr (Advanced $10k). — [SOC2Auditors.org](https://soc2auditors.org/insights/vanta-pricing/). Oneleet bundles a trust page. — [ComplyJet](https://www.complyjet.com/blog/oneleet-vs-vanta)
- ISO 42001 in Japan: 11 AIMS certifications as of August 2026. — [innovatopia](https://innovatopia.jp/ai/ai-news/116644/). The CSA points to its AI Controls Matrix v1.1 for EU AI Act mapping. — [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-eu-ai-act-high-risk-deadline-omnibus-20260/)

### Inferences
- **OSCAL value.** OSCAL export matters mainly for US federal and FedRAMP-adjacent sales, and as an interchange format to feed GRC tools. For SMB ISVs it is a "nice to have".
- **Positioning.** Position Matura's evidence as feeding Vanta, Drata or auditors (control-test results from the running system: RLS on, SSO enforced, audit chain intact) rather than replacing GRC. "Evidence-as-code from the product itself" is a differentiated angle that GRC tools, which pull from cloud APIs and HR tools, don't natively cover at the app-tenant level.

### Gaps
- No data was found on which GRC vendors export or import OSCAL, on NIST AI RMF adoption, or on buyer preference for in-product vs separate-tool evidence.

---

## 5. Licensing and go-to-market lessons for trust-layer software

### Takeaway
Identity and authorisation infrastructure is dominated by permissive or OSI licences: Keycloak, OpenFGA, SpiceDB, Cerbos and Ory are Apache, and Authentik pledges never to move features out of open source. The notable licence move in identity, Zitadel, was toward AGPL plus a commercial licence, not toward BSL. Redis's reversal to AGPL after the Valkey fork shows that source-available relicensing of infrastructure can backfire. For Matura, staying Apache-2.0, or AGPL with a commercial licence, plus paid enterprise features and support, fits category norms better than BSL or FSL.

### Cited Findings
- Zitadel: Apache-2.0 → AGPL-3.0 at v3 (2025), for sustainability, plus a CLA and a commercial licence. SDKs stay Apache. — [Zitadel FAQ](https://help.zitadel.com/zitadel-licensing-faqs)
- Redis:
  - History: BSD → RSALv2/SSPL (March 2024, Redis 7.4) → AGPLv3 option from Redis 8 (May 2025).
  - Fork: the SSPL change produced Valkey, backed by the Linux Foundation, AWS, Google and Oracle.
  - CEO Rowan Trollope: "There hasn't been any movement towards really accepting SSPL as a valid open source license."
  - Elastic and Grafana also use AGPL.
  - Source: [The Register 2025-05-01](https://www.theregister.com/2025/05/01/redis_returns_to_open_source/)
- FSL (Sentry, Fair Source) converts code to Apache or MIT after 2 years. Armin Ronacher argues it limits the vendor's long-term power more than single-vendor AGPL with a CLA does. — [Ronacher 2024-09-23](https://lucumr.pocoo.org/2024/9/23/fsl-agpl-open-source-businesses/)
- Licences in this category:
  - Apache-2.0: OpenFGA (CNCF Incubating; [CNCF](https://www.cncf.io/blog/2025/11/11/openfga-becomes-a-cncf-incubating-project/)), SpiceDB ([AuthZed](https://authzed.com/pricing)), Keycloak ([Skycloak](https://skycloak.io/blog/is-keycloak-right-for-b2b-saas/)).
  - Open-core enterprise models: Authentik at $5 per user per month ([Authentik](https://goauthentik.io/pricing)); Ory Enterprise License ([Ory](https://www.ory.com/pricing)); Cerbos open PDP + paid Hub ([Cerbos](https://www.cerbos.dev/pricing)); AuthZed self-hosted licence per vCPU ([AuthZed](https://authzed.com/pricing)).
  - Closed/hosted: WorkOS, Clerk, Frontegg, Descope, Stytch and Permit. Permit's PDP and OPAL engine are open source. — pricing pages above.

### Inferences
- **Revenue model.** Revenue in this category comes from (a) hosted convenience, as with WorkOS's $2B valuation, or (b) self-hosted enterprise licences priced per user, per vCPU or flat. Apache cores do not prevent this. The proven self-hosted price anchors are Authentik's $5 per user per month and $20k+ Enterprise Plus, and AuthZed's per-vCPU licence.
- **Licence advice.** A switch to BSL/SSPL would likely hurt adoption among the security-sensitive buyers Matura targets, since the category norm is Apache or AGPL. If protection is needed, AGPL plus a commercial licence (Zitadel model) or FSL (converts after 2 years) are the defensible options. Keeping Apache plus an open-core "enterprise pack" is lowest-friction.

### Gaps
- No survey evidence was found that security buyers insist on source availability for identity components. This remains an assertion.
- Not researched: Logto's licence (MPL) and Authentik's licence (MIT), both unconfirmed on the pricing pages; HashiCorp BSL → IBM details; OpenTofu and Valkey adoption figures; and fair.io membership.

---

## 6. Pricing patterns and willingness to pay

### Takeaway
Market price points for the identity half:
- per connection: $48 (Logto), $50 (Descope), $60–75 (Clerk), $65–125 (WorkOS), $125 (Stytch), $49.50 (SSOJet), or free (PropelAuth/Kinde);
- per org: Clerk $0.60–1 per retained org;
- per user: Authentik $5 per internal user per month; Okta workforce $6–17;
- per principal: Cerbos;
- flat self-hosted: Authentik Enterprise Plus $20k+, AuthZed per vCPU.

Compliance tooling runs about $7.5k–23k/yr, plus a trust centre at about $6k.

### Cited Findings
- See section 1 for the per-vendor prices. A WorkOS bill reaches about $1,250/mo at 10 connections and about $5k/mo at 50 connections, per SSOJet's estimate. — [SSOJet](https://ssojet.com/blog/enterprise-authentication-pricing-2026)
- WorkOS lists $100 per connection as its estimate of the cost to build in-house. — [WorkOS pricing](https://workos.com/pricing)
- SSOJet's ROI model assumes $15k/yr spend (vendor-biased). — [SSOJet report](https://ssojet.com/research-reports/enterprise-sso-adoption-2026)

### Inferences
- **Matura pricing anchor.** A plausible anchor is a flat self-hosted licence ($10k–30k/yr), positioned below "WorkOS at 20+ connections + a Vanta trust centre + audit-log retention", with the Apache core free.
- **Value metric.** Per-tenant pricing aligns with Matura's model. Per-connection pricing is a race to zero.

### Gaps
- No Y Combinator or startup-spend data on enterprise-readiness tooling was found. No independent case studies of SMB ISV willingness to pay were found.

---

## 7. Differentiation verdict, product ideas, risks

### Takeaway
Most individual Matura features are already covered: SSO/SCIM, MFA/session policy, entitlements, FGA, audit-log streaming, MCP PRM, and trust pages. Matura's differentiation is the self-hosted integration, plus three items no surveyed product combines:
1. database-level (Postgres RLS) tenant isolation tied to identity;
2. a tamper-evident (hash-chained) audit log covering humans and agents with OBO chains;
3. evidence generated from the running app (readiness score, OSCAL, conformance CLI).

### Cited Findings (basis)
- **Covered by existing products:**
  - per-org SSO/SCIM: WorkOS, Clerk, Frontegg, Descope, Stytch, Auth0, Keycloak Organizations + SCIM 26.8, Phase Two;
  - MFA: all of the above;
  - entitlements: Frontegg;
  - FGA: OpenFGA, SpiceDB, Cerbos, Permit, WorkOS;
  - audit-log streaming: WorkOS, Frontegg;
  - MCP auth: WorkOS, Descope, Stytch, Auth0;
  - trust pages: Vanta, SafeBase/Drata, Oneleet;
  - tenant DB isolation: Nile (hosted, its own Postgres).
  - Sources: sections 1, 3 and 4.
- Agent audit gaps at incumbents: Entra's audit doesn't distinguish agents by default ([Beri.net](https://www.beri.net/article/okta-vs-entra-agent-id-vs-sailpoint-agent-identity-2026)). The MCP IdP layer doesn't decide per-action authorisation ([The New Stack](https://thenewstack.io/mcp-gets-its-missing-enterprise-authorization-layer/)). The MCP 2026 roadmap names audit trails and enterprise-managed auth as enterprise gaps ([WorkOS checklist](https://workos.com/blog/enterprise-readiness-checklist-2026)).
- Keycloak gaps (no customer admin portal or self-serve onboarding, inbound-only SCIM) are what Phase Two monetises. — [Skycloak](https://skycloak.io/blog/is-keycloak-right-for-b2b-saas/); [Phase Two](https://phasetwo.io/blog/keycloak-for-startups-cost/)

### Inferences — product ideas
1. **ID-JAG / Enterprise-Managed Authorization issuer and acceptor for app MCP servers**, with tenant-scoped agent registry, revocation and OBO chain recorded in the hash-chained audit. This targets the gap between IdP-level governance and per-action authorisation.
2. **Japan control packs.** Map Matura's readiness checks to ISMS (27001/27017), ISMAP, the 3省2 provider guideline (responsibility matrix, ransomware readiness) and FISC. Ship tested SAML/SCIM setup guides for HENNGE One and Entra ID. HENNGE serves about 20% of TSE-listed firms.
3. **Evidence connectors.** Push Matura control-test results into Vanta and Drata, and export OSCAL for FedRAMP-bound customers. Position against "trust centre add-on $6k/yr" rather than against GRC.
4. **Conformance CLI as a free funnel.** Let any app (even one on Auth0 or WorkOS) test tenant isolation, SSO enforcement, SCIM deprovisioning latency and audit integrity, and output a readiness score. This lets Matura sell to developers while producing artefacts for security teams.
5. **Tenant-isolation proof.** Automated cross-tenant leak tests against Postgres RLS, with signed reports. Nile does isolation but sells a hosted database; Matura can prove isolation on the customer's own Postgres.
6. **Local-model and agent fit (company vision).** Self-hosted agent identities and audit for on-prem LLM deployments, where hosted IdPs and cloud agent IDs (Google, Entra) don't reach.

### Inferences — risks
- **Keycloak dependency.** Ops burden and frequent releases; SCIM support only since 26.8; ID-JAG consumption only, in preview.
- **Competitive pressure.** Hosted vendors keep lowering prices. Clerk SCIM is free until 2027 and connections are $60–75, so developers may never feel enough pain to self-host.
- **Buyer split.** Developers adopt; security and compliance teams pay. Matura needs artefacts (reports, OSCAL, trust page) that the second group values.
- **Incumbent expansion.** Microsoft, Okta and Google own the workforce agent-identity story. Matura must stay ISV- and tenant-focused.
- **Channel.** Selling through ISVs means Matura's buyer is a small vendor with little budget. Regulated verticals and Japan, with self-hosting requirements, may support higher prices.

### Gaps
- No direct competitor was found offering self-hosted tenancy + RLS + audit + evidence. This may reflect limited search budget rather than absence; a targeted search for "SaaS boilerplate enterprise-ready", BoxyHQ-style kits and similar is recommended.
- There is no quantitative evidence of demand for "database-level isolation as a service" outside Nile's funding.
