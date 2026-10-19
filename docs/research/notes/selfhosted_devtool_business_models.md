# Business models, pricing, licensing and go-to-market for small vendors of self-hosted commercial developer/AI tooling (Japan focus, as of October 2026)

Research note scope: comparable company playbooks, licence/delivery mechanics, 2026 price benchmarks, Japan GTM and subsidies, packaging, trust-building, risks, and an options list for a Tsukuba-based founder with three products (brief-to-code agent platform, visual agent builder, enterprise-readiness/identity layer) planned as closed source, self-hosted, Docker/Helm, private registry, licence keys, hosted demos.

Method caveat: the shared web-search budget ran out partway through, so several items were filled by fetching vendor pricing pages directly. Some planned lookups (POC conversion benchmarks, 請求書払い norms, ICONIQ/Bessemer ACV figures, Docker's current prices, GitLab Ultimate list price, Supabase/Airbyte/Nextcloud/Gitea/Forgejo/Tailscale/JetBrains specifics, Japanese vendor case studies) could not be completed. They are listed under Gaps. One URL (docs.replicated.com/vendor/licenses-about) was blocked by a permission prompt and not read. Prices quoted from third-party aggregators are marked as such. Dates are the page's own date or "fetched 2026-10-19".

## 1. Comparable company playbooks (self-hosting combined with closed or source-available licensing)

### Takeaway
Vendors that make money from self-hosted software almost all follow the same pattern. A free tier (open source, source-available or "Community") drives adoption. A commercial licence key then unlocks enterprise features: SSO/SAML, RBAC, audit logs, multiple workspaces, HA, retention controls and an SLA. Pricing is either per seat (GitLab, Metabase, Mattermost, authentik, Coder) or per infrastructure unit (Portainer per node, Teleport per protected resource plus MAU, n8n flat tier plus executions). Public list prices are rare above the mid tier; "contact sales" with an annual minimum ($16K–$25K) is the norm. A purely closed product with no free self-hostable tier is the exception among the comparables found. JetBrains and Docker Desktop are the main closed-source examples, and both rely on huge existing install bases.

### Cited Findings
**GitLab (open core, per seat, same price for self-managed and SaaS)**
- Premium costs $29 per user per month, billed annually, on both SaaS and self-managed. Ultimate is "contact us". Each Premium user includes $12/month in GitLab Credits for AI, and each Ultimate user includes $24. Credits are $1 each at list price. Self-managed Free has no 5-user limit. Users added mid-term are prorated, and true-ups are charged otherwise. All users in an instance must be on the same plan. — [GitLab pricing](https://about.gitlab.com/pricing/) (fetched 2026-10-19)
- In January 2021 GitLab removed its $4/user Bronze/Starter tier because it "does not meet the hurdle rate that GitLab expects from a tier". Premium was $19 at the time. Existing customers with up to 25 users were offered a staggered path: $6, then $9, then $15 per user over three years. — [The Register, 2021-01-27](https://www.theregister.com/2021/01/27/gitlab_removes_starter_tier/)
- GitLab's Premium price therefore rose from $19 (2021) to $29 (2026). (Inference from the two sources above; the date of the $29 change was not verified.)

**Sentry (Fair Source / FSL)**
- Sentry adopted the "Fair Source" label in August 2024 for its Functional Source License (FSL). The source is public, use is permitted with restrictions that protect the business model, and publication as open source is delayed (DOSP). Compliance teams at more than 10,000 organisations have approved running Sentry internally under this licence. Sentry cites more than 100,000 cloud customers and $100M in annual revenue, and says self-hosting has not undermined it economically. — [Sentry blog, 2024-08-06](https://blog.sentry.io/sentry-is-now-fair-source)
- Note: the Sentry post does not state the two-year conversion period. Keygen's FCL post does (see below). The FSL's two-year conversion to Apache/MIT comes from background knowledge and was not verified in this session.

**Keygen (solo-founder licensing vendor, Fair Core License)**
- Keygen is founded by Zeke Gabrielse. In August 2024 it moved from ELv2 to the Fair Core License (FCL), which converts to Apache 2.0 after two years and bans "Competing Use" and circumventing licence keys. The stated reason: under ELv2, buyers feared losing access to EE features if Keygen LLC shut down. The founder considered the workaround, perpetual licences, "predatory". FCL also lets Keygen sell two-year contracts. Keygen EE (self-hosted) had been selling for about a year, "well". — [Keygen blog, 2024-08-06](https://keygen.sh/blog/keygen-is-now-fair-source/)
- Keygen CE is free to self-host, including commercially. Keygen EE adds an OCI/Docker registry, audit logs, SAML/SSO, custom permissions and self-hosting support, and is activated with a licence file (`ee.lic`). Keygen Relay handles node-locked licences in offline and air-gapped environments. — [keygen.sh](https://keygen.sh/)
- Pricing: Dev 1 is free (100 active licensed users, 10 releases, hard limits). Std 1–5 includes 8x5 email support with a 24-hour response. Ent 1–3 adds SSO, a 99.99% SLA and 12x5 support with an 8-hour response. A flat-rate single-player EE licence is available but unpriced, and a 30-day EE trial is available on request. Add-ons: Whitelabel at $995/year and Premium Support SLA at $995/month. Tier prices did not render on the page. — [Keygen pricing](https://keygen.sh/pricing/)

**n8n (Sustainable Use License, fair-code)**
- Cloud prices billed annually: Starter €20/month (2.5K executions), Pro €50/month (10K), Business €667/month (40K executions; the pricing page says it is self-hosted only). Business self-hosted (€667/month, about €8K/year) includes SSO/LDAP, 6 shared projects, multiple environments, queue mode and Git version control. Enterprise self-hosted is contact-sales and adds unlimited projects, 200+ concurrency, external secrets, log streaming, 365-day insights and an SLA. The Business trial is 14 days and requires a credit card. — [n8n pricing](https://n8n.io/pricing/) (fetched 2026-10-19)
- Third party: the Business tier adds €4,000 per extra 300K executions. Enterprise buyers above 250K executions per month reportedly negotiate 20–30% off, and multi-year deals add another 10–20%. The Sustainable Use License allows internal and client use but bans reselling n8n as a competing platform. — [Toolradar, updated 2026-10-17](https://toolradar.com/blog/n8n-pricing-2026) (aggregator; discount figures unsourced)

**Dify (open source with conditions + commercial Enterprise)**
- Community edition is free under the "Dify Open Source License" and limited to one workspace with 30-day log history. Enterprise has custom pricing and is self-hosted. Enterprise unlocks multiple workspaces, SSO, role customisation, HA, branding, maintained vector DB integrations, unlimited log history, a SOC 2 Type II report and negotiated SLAs. A licence key activates paid features for the licensed period. **SLAs are delivered by Dify Partners**, a partner-delivered support model. Discounts are offered for education and OSS. — [Dify Enterprise pricing](https://dify.ai/pricing/dify-enterprise)

**Langfuse (MIT core + EE)**
- All core features are free to self-host under MIT "without any limitations". Enterprise self-hosted is custom-priced and adds the Admin/Instance Management APIs, project-level RBAC, data retention, audit logs, SCIM, SOC 2/ISO reports, billing through AWS Marketplace or invoice, and a support SLA with a named engineer and a private Slack or Teams channel. Startups get 50% off the first year. — [Langfuse self-host pricing](https://langfuse.com/pricing-self-host)
- Third party: Cloud Pro is $199/month and Cloud Enterprise has a $2,499/month base. No self-hosted EE price is public. — [ZenML, 2026-09-28](https://www.zenml.io/blog/langfuse-pricing)

**PostHog (retreat from paid self-hosting)**
- In February 2023 PostHog sunset its Kubernetes/Helm deployment and the paid supported self-hosted version that launched alongside it about two years earlier. Only about 3.5% of users ran Kubernetes. The "small infrastructure team" spent disproportionate time on long debugging calls spanning Kafka, ClickHouse, Postgres and Redis. "Even something as simple as a full disk would cause their instance of PostHog to be down for hours or days." "The tools to do that automation just don't exist." Customers had to be vetted for Kubernetes skills. Only the MIT Docker Compose "hobby" deploy remains, with no guarantee. — [PostHog blog, 2023-02-08](https://posthog.com/blog/sunsetting-helm-support-posthog)
- Sacra paraphrases PostHog as saying supporting paid self-hosted "was complex", and that free self-hosting worked as a distribution channel feeding the cloud. — [Sacra](https://sacra.com/chat/h/4520c485-376b-47ca-bc6d-d11e04e18170/)

**Portainer (closed Business Edition, per node)**
- Portainer is "priced by the node, not the seat" (node size measured in vCPUs). Starter is $1,045/year for 5–15 nodes of up to 16 vCPU each, with community support, online purchase only, and one licence per company. Scale is $2,095/year for 5–25 nodes of up to 24 vCPU, with 9x5 next-business-day support, sold through resellers. Enterprise is custom and includes a support engineer, a security assessment report and compliance certificates. All tiers include every Business feature. "Start free: 3 nodes." — [Portainer pricing](https://www.portainer.io/pricing)

**Metabase (AGPL core, commercial self-hosted Pro/Enterprise)**
- Pro is $575/month or $6,210/year for 10 users, plus $12/user/month or $130/user/year, and is offered cloud or self-hosted. Enterprise starts at $20,000/year. Self-hosted runs under a "commercial license". A dev-instance token costs $100/month and covers multiple non-production instances. Annual billing saves about 10%. — [Metabase pricing](https://www.metabase.com/pricing.md)

**Mattermost (seat-based, per-server licence keys)**
- Prices are not published. Plans are prepaid annual seat subscriptions, and overages are billed quarterly on a prorated "true forward" basis. Each server, including non-production, needs its own licence key, and Premier Support customers get up to 4 non-production keys. Air-gapped deployments with offline installation packages are an Enterprise Advanced feature. — [Mattermost pricing](https://mattermost.com/pricing/)

**Grafana Labs (AGPL + Enterprise)**
- Enterprise is "cloud or self-hosted" with a $25,000/year minimum. Visualization Pro starts at $8 per active user, or $55 with Enterprise Plugins. No self-managed per-user price is listed. — [Grafana pricing](https://grafana.com/pricing/)

**Coder (open-source core, Premium per user)**
- Community is free. Premium is billed "annually per user" but no price is shown. AI Premium is custom and adds unlimited agents, headless agents and network-isolated agent workspaces. Community and Premium are capped at 5 active Coder Agents. — [Coder pricing](https://coder.com/pricing)

**Plane**
- Pricing per seat per month: Free (12 users), Pro $6, Business $13. Enterprise Grid is quote-only. Cloud, self-hosted (Commercial Edition) and air-gapped editions are offered, but self-hosted prices are not listed. — [Plane pricing](https://plane.so/pricing)

**Teleport (per-resource + MAU)**
- Enterprise is usage-based on two metrics: MAU and Teleport Protected Resources (servers, Kubernetes clusters, databases, MCP servers and others, measured as an hourly average). Priority Support is always included for self-hosted deployments. — [Teleport pricing guide](https://goteleport.com/pricing/guide/)
- Third party: Team plan pricing is about $12–18 per resource per month, verified 2026-06-12. — [Iden SCIM tax index](https://www.idenhq.com/scim-tax/teleport) (vendor-published)

**Docker Desktop (closed, licence-change monetisation)**
- From 2021-08-31, companies with more than 250 employees **and** more than $10M revenue needed a paid subscription, with enforcement by 2022-01-31. Prices at the time were Pro $5, Team $7 (minimum 5 seats) and Business $21 per user per month. Business added invoice billing. Docker said about 10% of its 5M monthly users would be affected. — [TechTarget, 2021-08-31](https://www.techtarget.com/it-infrastructure/news/252506055/Docker-Desktop-pricing-changes-in-bid-to-boost-revenue)

**Relicensing outcomes (the risk side)**
- Terraform moved MPL→BSL on 2023-08-10, and OpenTofu forked on 2023-08-25 (31 people from 11 organisations made 5+ contributions in year one). Redis moved BSD→RSAL/SSPL on 2024-03-20. Every external company contributor with more than 5 commits (Amazon, Alibaba, Tencent, Huawei, Ericsson) stopped within six months, and the Valkey fork had 29 contributors from 10 companies within six months. Elastic moved to SSPL in 2021, but Elastic employees made more than 95% of changes both before and after. Elastic added AGPL as an option on 2024-08-29. — [The New Stack / CHAOSS, 2024-12-27](https://thenewstack.io/what-happens-to-relicensed-open-source-projects-and-their-forks/)
- Redis 8 was relicensed under AGPLv3 in May 2025. MongoDB stays on SSPL with no significant fork. — [aiwithash, 2026-05-29](https://www.aiwithash.com/blog/licensing-open-source-relicensing-wave)

**a16z framing**
- The main open-source models are support/services, open core and SaaS, and hybrids are common. Open core suits on-prem software where security and integration features can stay closed without hurting adoption. The main risk is a fork. Paid value sits in reliability, security, tooling, auditing and services. The source uses 5% free-to-paid conversion as an illustrative modelling figure. — [a16z](https://a16z.com/open-source-from-community-to-commercialization/)

### Inferences
- The "enterprise feature gate" is remarkably consistent across Dify, Langfuse, n8n, Keygen, Mattermost, Coder and authentik: SSO/SAML/SCIM, RBAC, audit logs, multi-workspace or tenancy, HA, retention, compliance reports and an SLA. A closed product can reuse the same gate for its paid tier and offer a constrained free or evaluation tier.
- The founder's planned stack (licence key, private registry, self-hosted) matches the EE half of these companies. What is missing is the free top-of-funnel that most of them rely on. Source-available or fair-source licensing (FSL/FCL) is a middle path that preserves "no competing hosting" protection while giving buyers inspectability and continuity guarantees.
- Because the founder starts closed, there is no relicensing backlash risk. Backlash happens when a project with an outside contributor community changes terms (Redis, Terraform). Going source-available later is low-risk; going from open to closed is high-risk.
- Flat tier pricing with a usage gauge (n8n €667/month, Portainer about $1–2K/year, Metabase $6.2K/year) gives small vendors predictable mid-market revenue without sales negotiation. "Contact sales from $16–25K/year" is the enterprise anchor.

### Gaps
- No verified data on Supabase's self-hosted commercial terms, Airbyte ELv2 enterprise pricing, Nextcloud Enterprise per-user prices, Gitea Enterprise/Forgejo, Tailscale, JetBrains current per-seat prices or Docker's current 2026 prices (search budget exhausted).
- GitLab Ultimate list price and the date Premium went to $29 are not verified.
- No public revenue figures for n8n, Dify or Langfuse were gathered in this session.

## 2. Licence-key and delivery mechanics for self-hosted software

### Takeaway
For a 1–3-person company, an off-the-shelf licensing API (Keygen, Cryptlex, LicenseSpring) costs $0–$750/month and supports signed offline/air-gapped licence files. Replicated is the most complete "enterprise distribution" platform, covering a proxy registry, Helm/KOTS/Embedded Cluster installers, support bundles, preflights and compatibility testing. At $2,000–$3,000/month base plus $50–$200 per customer licence per month, it is only affordable once there are several enterprise customers. Keygen EE stands out because it bundles licensing with an OCI registry and distribution, and it can itself be self-hosted.

### Cited Findings
- **Replicated pricing:** Builders is $2,000/month plus $50/licence/month with 2TB egress, covering Helm, the SDK and your own installer. Business is $3,000/month plus $200/licence/month with 5TB egress, adding UI installers and the Kubernetes installer. Enterprise is custom with 10TB. Compatibility Matrix is a $500/month add-on, and extra egress is $25/TB. The free 21-day POC cannot ship to customers, but free trial, dev and community licences are available. Inconsistency: the page lists air-gap installers under Builders while the FAQ says air gap is Enterprise-only. — [Replicated pricing](https://www.replicated.com/pricing) (fetched 2026-10-19)
- **Replicated product:** KOTS is a GUI install into an existing Kubernetes cluster. Embedded Cluster is a "single binary for your application and a Kubernetes cluster". The product also includes Helm installs, a proxy registry for private images, support bundles, telemetry, the Vendor Portal for licences and channels, the Compatibility Matrix, and SecureBuild zero-CVE base images. — [Replicated product](https://www.replicated.com/product)
- **Keygen:** a Distribution API and an OCI/Docker container registry in EE, node-locked offline licences via Relay, and EE activated by a licence file. — [keygen.sh](https://keygen.sh/); pricing in §1.
- **Cryptlex:** Starter costs $100/month for 1,000 activations, 3 products and offline activations. Growth costs $300/month for 5,000 activations and adds hosted floating licences and releases. Business costs $600/month for 10,000 activations and adds on-prem floating licences, resellers and audit logs. Enterprise includes self-hosting and SSO, price on request. — [Cryptlex pricing](https://cryptlex.com/pricing)
- **LicenseSpring:** the Free tier is $0 for 1 product and 100 licences and includes node-locked, offline and floating licences. Business Starter costs $199/month for 1,000 licences. Business Plus costs $750/month for 10,000 licences. Enterprise is custom and includes self-hosting, air-gapped workflows and an on-prem floating server. A startup programme gives up to 75% off Business Plus for two years. — [LicenseSpring pricing](https://licensespring.com/pricing)
- **Per-server key pattern:** Mattermost requires a key per server, including dev and staging, and HA sharing one database counts as one server. — [Mattermost pricing](https://mattermost.com/pricing/). Metabase sells a $100/month dev token covering multiple non-production instances. — [Metabase pricing](https://www.metabase.com/pricing.md)
- **Enterprise extras vendors advertise:** a security assessment report and compliance certificates (Portainer Enterprise) — [Portainer](https://www.portainer.io/pricing). SOC 2 Type II and ISO 27001 reports (Dify, Langfuse) — [Dify](https://dify.ai/pricing/dify-enterprise), [Langfuse](https://langfuse.com/pricing-self-host). Zero-CVE base images (Replicated SecureBuild) — [Replicated](https://www.replicated.com/product).

### Inferences
- A cheap and credible stack for a small vendor: Ed25519-signed licence files verified offline, with expiry, seat/node and feature entitlements. Keygen CE/EE (self-hosted) or LicenseSpring/Cryptlex Free–Starter can provide this, or it can be built in-house. Images go to a private registry (Keygen EE OCI, GitHub Packages or Harbor) and are signed with cosign. SBOMs (Syft/SPDX) and vulnerability scans (Trivy/Grype) are published per release, and an air-gap tarball (images, Helm chart, licence) is published per release. The tooling names cosign/Syft/Trivy/Harbor come from background knowledge and were not researched in this session.
- Replicated is worth considering once 5–10 enterprise self-hosted customers each pay at least $20K/year. At $3K/month plus $200 per licence, its fixed cost is about $36K/year before customer fees.
- Licence enforcement should be soft (warn, degrade enterprise features) rather than hard-kill. Keygen paid tiers use soft limits (see §1). Japanese enterprise buyers in particular will not accept production outages caused by a licence server. (Inference.)

### Gaps
- The Replicated licence documentation (signing, air-gap licence checks) could not be read because a permission prompt blocked docs.replicated.com.
- No quantified data on what share of enterprise RFPs require SBOMs or signed images, and no Cloudsmith, Harbor or GitHub Packages pricing gathered.

## 3. Pricing benchmarks 2026 (AI coding/agent platforms, agent builders, identity/enterprise-readiness)

### Takeaway
Self-hosted AI coding tools cluster at $39–$59 per user per month (Tabnine) with annual minimums around $16K (Sourcegraph). Agent builders are priced as flat tiers plus usage (n8n €667/month Business) or as custom enterprise deals (Dify, Langflow, Flowise; no public numbers found). Identity layers are priced per connection (WorkOS $125/SSO connection/month, falling to $65), per user (authentik $5 per internal user, $0.02 per external user) or by minimum annual contract (ZITADEL, authentik Enterprise Plus from $20K). An identity add-on for self-hosted products is a crowded, cheap market.

### Cited Findings
**AI coding / agent platforms**
- **Tabnine:** last published plans were Code Assistant at $39/user/month and Agentic Platform at $59/user/month, both annual-only. Both support SaaS, VPC, on-prem or air-gapped deployment, and individual plans were retired. Tricentis acquired Tabnine on 2026-07-30, and the pricing page now redirects to a contact form. — [eesel.ai, edited 2026-10-06](https://www.eesel.ai/blog/tabnine-pricing) (third party)
- **Sourcegraph:** Enterprise "starts at $16K" as a minimum annual contract, scaling with team size. AI credits are included per user and can be pooled. Self-hosted is listed as a deployment option. — [Sourcegraph pricing](https://sourcegraph.com/pricing)
- **OpenHands:** Open Source and Individual are free, with LLM usage at cost and no markup. Enterprise (SaaS or self-hosted in a VPC) is custom-priced and includes SAML/SSO, unlimited conversations, the Large Codebase SDK and priority support with a shared Slack channel. — [OpenHands pricing](https://openhands.dev/pricing)
- **Coder AI Premium:** custom. — [Coder](https://coder.com/pricing)
- **GitLab:** Premium at $29/user/month bundles $12/month of AI credits, and Duo Agent Platform runs self-managed on version 18.8 or later. — [GitLab](https://about.gitlab.com/pricing/)

**Agent builders**
- **n8n:** see §1 (Business €667/month self-hosted; Enterprise custom). — [n8n](https://n8n.io/pricing/)
- **Dify Enterprise:** custom, delivered by partners. — [Dify](https://dify.ai/pricing/dify-enterprise)

**Identity / enterprise-readiness**
- **WorkOS:** SSO is $125/connection/month for connections 1–15, $100 for 16–30, $80 for 31–50 and $65 for 51–100. Directory Sync uses the same tiers. AuthKit is free up to 1M MAU, then $2,500 per extra 1M. Audit log streaming is $125/month per SIEM connection. — [WorkOS pricing](https://workos.com/pricing)
- **Auth0 B2B:** Essentials $150/month (3 SSO connections), Professional $800/month (5 connections). **Okta Workforce:** $6–$17/user/month with a $1,500 annual minimum. — [SSOJet, 2026-07-29](https://ssojet.com/blog/enterprise-authentication-pricing-2026) (competitor-published)
- **authentik (source-available enterprise):** Enterprise is $5 per internal user per month and $0.02 per external user per month, billed annually. Enterprise Plus starts at $20K/year. Ticket support is included for subscriptions over $1K. — [authentik pricing](https://goauthentik.io/pricing/)
- **ZITADEL:** self-hosted Enterprise uses a commercial licence that replaces AGPL3. Users, tenants and instances are unlimited with no MAU pricing. Billing is by IdP, LDAP and SCIM connections, policies and workflows, against a minimum annual contract value. Base support is 24/7 with an 8-hour response. — [ZITADEL pricing metrics](https://help.zitadel.com/zitadel-enterprise-pricing-metrics)
- **Frontegg:** Pay-as-you-go is $0 base and includes 7,500 MAU and 5 SSO/SCIM connections. Enterprise is custom. — [Frontegg pricing](https://frontegg.com/pricing)

### Inferences
- For the brief-to-code platform, the self-hosted anchors are $39–$59 per user per month (Tabnine) and roughly $16K/year minimum (Sourcegraph). Cursor, Devin, Augment and Qodo enterprise numbers were not gathered (gap).
- For the identity/enterprise-readiness layer, open-source competitors (authentik at $5/user, ZITADEL, Keycloak) set a very low price ceiling for a standalone closed product. It is likely more valuable bundled into the other two products, as the "enterprise tier" feature set, than sold separately.
- For the visual agent builder, n8n and Dify have large free communities. A closed competitor needs a differentiator, for example being local-model-first, Japanese-language first, or air-gapped by default.

### Gaps
- No verified 2026 prices for Cursor Enterprise, Devin Enterprise, Augment, Qodo, Langflow/IBM watsonx Orchestrate, Flowise Enterprise, Clerk Enterprise SSO or Ory Enterprise (search budget exhausted).
- No community-reported ranges for Dify or n8n Enterprise ACV.

## 4. Japan go-to-market

### Takeaway
About 80% of SaaS in Japan was sold directly as of 2022, but large enterprises depend heavily on SIers and IT distributors because most IT talent sits in IT vendors rather than user companies. Resellers typically buy at 70–80% of list (掛け), and referral partners get 20–30% of annual revenue. The national SME subsidy (now "デジタル化・AI導入補助金2026") covers up to ¥4.5M at 1/2–2/3. It requires the tool to be pre-registered by an IT導入支援事業者 (registered vendor) who co-files the application, and AI-tool classification appears to favour cloud/SaaS delivery. Tsukuba offers low-cost facilities and free expert consultations but no large city cash grants were found.

### Cited Findings
**Channels and margins**
- An SB C&S survey found about 80% of SaaS in Japan is sold direct and about 20% through resellers. Citing IPA 2017 data, about 72% of Japan's IT talent works at IT companies, so user companies without IT staff need partners to adopt systems. SB C&S's ClouDX vendor–reseller platform served about 150 vendors. — [ITmedia, 2022-07-23](https://www.itmedia.co.jp/news/article/2207/22/1220722129/)
- In 再販 (resale), the partner contracts with the end customer, and wholesale is "一般的には80%~70%掛け" (70–80% of list). IT distributors must supply secondary resellers at 70% or below. In 取次 (referral), the vendor contracts directly and the partner gets about 20–30% of annual recurring revenue, excluding initial fees. For large enterprises, SIers are essential but rarely open new vendor accounts, so new products often reach SIers through IT distributors. A partner exhibition can cost more than ¥1M per event. — [Rocket Boys](https://rocket-boys.co.jp/security-measures-lab/btob-saas-agency-strategy/)
- **Coverity's Japan entry (JETRO case study):** Coverity started with direct sales to NTT DoCoMo and Mitsubishi plus a small value-add distributor, which white-labelled the product and declined to sell it under Coverity's name. A 2007 trade show (Embedded Systems Conference Japan) gave 250 leads, and Coverity went direct. It localised manuals, contracts, quotes (in yen), the website and booth staff. Japanese customers were reluctant to sign NDAs before evaluation, and references beat testimonials. Japan revenue grew 80–100% a year, from about 6% to more than 20% of company revenue, with a team of 2 growing to 8. — [JETRO / Coverity](https://www.jetro.go.jp/ext_images/usa/coverity.pdf) (dated case, about 2007–2009)
- **Dify's model:** SLAs are delivered by Dify Partners. In Japan this is a known pattern of partner-delivered enterprise support. — [Dify](https://dify.ai/pricing/dify-enterprise)

**Subsidies and government demand**
- The 2026 successor to IT導入補助金 is **デジタル化・AI導入補助金2026** (中小企業デジタル化・AI導入支援事業). Its frames are 通常枠, インボイス枠 (two types), セキュリティ対策推進枠 and 複数者連携デジタル化・AI導入枠. IT導入支援事業者 and ITツール registration opened on 2026-03-30. Changes were announced on 2026-10-09 for the 7th call onward. — [it-shien.smrj.go.jp](https://it-shien.smrj.go.jp/) (official portal, fetched 2026-10-19)
- 通常枠 covers up to ¥4.5M at 1/2, or 2/3 if the minimum-wage condition is met. Only pre-registered IT tools are eligible, and joint application with an IT導入支援事業者 is mandatory. The 5th deadline was 2026-09-29 and the **6th deadline is 2026-10-30**, with the grant decision expected 2026-11-09 and the implementation/report deadline 2027-04-30. ものづくり補助金 covers up to ¥40M (AI product development is an example). 省力化投資補助金 一般型 covers up to ¥100M for bespoke AI systems. — [補助金ポータル, updated 2026-09-01](https://hojyokin-portal.jp/columns/ai-agent-hojyo)
- インボイス枠 software covers 3/4 of the first ¥500K (4/5 for small businesses) and 2/3 of ¥500K–¥3.5M. Standalone ChatGPT/OpenAI API use is not eligible, but tools registered as "生成AI機能付きツール" can be. — [Uravation, modified 2026-09-22](https://uravation.com/media/ai-digital-subsidy-guide-2026/)
- One secondary source describes an "AI category" requiring cloud delivery with SaaS monthly/annual billing. This would exclude self-hosted products from the AI bonus, but the source is AI-drafted and cites no official text, so it is **low reliability**. — [atsoho](https://atsoho.com/blog/it-subsidy-ai-tools-2026)
- **GENIAC (METI/NEDO):** the 4th period (FY2026) subsidises compute for foundation-model development, with 16 themes selected (announced 2026-06-04). This is foundation-model R&D, not tooling procurement. — [METI press release](https://www.meti.go.jp/press/2026/06/20260604003/20260604003.html). GENIAC-PRIZE 2026 is a prize programme with about ¥1B in total. — [J-Net21](https://j-net21.smrj.go.jp/news/nskto60000020fh6.html) (title only seen); [NEDO call](https://www.nedo.go.jp/koubo/CD2_100446.html) (not fetched)

**Government cloud (ISMAP)**
- ISMAP is the government cloud security evaluation scheme, started June 2020, with 68 services listed as of 2024-05-13. Many applications took more than 9 months, and some took only a few months after the October 2023 revision. External audit cost is called a "major burden", but no figures are given. ISMAP-LIU, a low-impact variant, launched in 2022. Scope is cloud service providers, so on-prem software is likely outside it, but the source does not confirm this. — [KPMG Japan, 2024-05](https://kpmg.com/jp/ja/insights/2024/05/ismap-revision-overview.html)

**Tsukuba / Ibaraki**
- Tsukuba City set up a Startup Promotion Office in April 2018 and published its first strategy in December 2018; it is now on its second strategy. Tsukuba Startup Park offers half-price coworking and meeting rooms for local researchers, students and startups, free business consultations, and information on NEDO and JST grants. Tsukuba has 29 national research institutes and about 150 research organisations. The University of Tsukuba ranks around 3rd–5th nationally for university spinouts. — [Startup Class, 2024-07-17, updated 2025-07-31](https://startupclass.co.jp/article/2024/07/17/tsukubacity/)
- Tsukuba Startup Park is run by 株式会社つくば研究支援センター at 吾妻2-5-1, 5 minutes from Tsukuba station. It offers free consultations: research-grant consultations every Tuesday, founding consultations every Wednesday and Thursday, monthly legal, labour, IP, tax and registration experts, and an IPO consultant. Events include STAPA Finance Day on 2026-10-28, and 2nd-floor incubation rooms were being offered from 2026-09-04. Fees are not listed. — [tsukuba-stapa.jp](https://tsukuba-stapa.jp/)
- Ibaraki Prefecture, Tsukuba City, universities and research institutes formed the Tsukuba Startup Ecosystem Consortium. Its activities include demonstration fields (実証), attracting capital and talent, and linking with other hubs. No grant amounts are stated. — [Ibaraki Prefecture](https://www.pref.ibaraki.jp/shokorodo/sangi/documents/setsuritsusyushi.pdf)

### Inferences
- Large Japanese enterprises usually buy through an SIer or distributor that issues the invoice (請求書払い) on standard 月末締め翌月末払い terms and absorbs procurement paperwork. A small vendor can sell at about 70–80% of list via a distributor (for example SB C&S, Daiwabo, or a DX-focused SIer) rather than set up enterprise billing itself. The invoice and payment-term norms come from general knowledge; the specific search was blocked.
- Being an IT導入支援事業者 (or partnering with one) and registering a cloud/hosted variant of a product could unlock 1/2–2/3 subsidies for SME customers. Self-hosted-only delivery may be disadvantaged. This needs checking against the official 公募要領.
- Self-hosted delivery is attractive to Japanese manufacturers and the public sector because data stays on-prem, and on-prem software sidesteps ISMAP. The trade-off is that self-hosted support is expected in Japanese, often with on-site or remote-session help.

### Gaps
- Official IT導入支援事業者 requirements (corporate age, financials, Japanese entity) could not be fetched because the vendor pages errored. Whether on-prem licence fees are eligible in 2026 is unconfirmed.
- No sourced data on 請求書払い expectations, credit-card hostility, JP-language support SLAs, or small Japanese dev-tool vendor case studies (Findy, Cybozu kintone ecosystem, Sakura AI, ELYZA, PFN PLaMo, Sakana AI pricing). DX認定, J-Startup and Tsukuba city cash grants were not researched (search budget exhausted).

## 5. Pricing psychology, packaging, POC conversion and ACV

### Takeaway
The evidence supports three packaging levers. First, a free or evaluation tier with hard limits (users, nodes, workspaces). Second, a self-serve mid tier at a published flat price ($1K–$8K/year). Third, an enterprise tier from about $16K–$25K/year carrying SSO, audit, HA and the SLA, plus dev/staging licence handling. Reliable 2026 benchmarks for POC conversion, ACV by segment and professional services share were not obtained.

### Cited Findings
- Enterprise minimums seen: Sourcegraph from $16K/year ([Sourcegraph](https://sourcegraph.com/pricing)); Metabase Enterprise from $20K/year ([Metabase](https://www.metabase.com/pricing.md)); Grafana Enterprise $25K/year minimum ([Grafana](https://grafana.com/pricing/)); authentik Enterprise Plus from $20K/year ([authentik](https://goauthentik.io/pricing/)).
- Self-serve flat tiers seen: Portainer $1,045–$2,095/year ([Portainer](https://www.portainer.io/pricing)); Metabase Pro $6,210/year ([Metabase](https://www.metabase.com/pricing.md)); n8n Business €667/month ([n8n](https://n8n.io/pricing/)).
- Units seen: per seat (GitLab, Metabase, Mattermost, Tabnine, Plane); per node or vCPU (Portainer); per resource plus MAU (Teleport); per connection (WorkOS, ZITADEL); flat tier plus executions (n8n). — sources in §1–3.
- Support SLA tiers seen: Keygen at 8x5/24-hour versus 12x5/8-hour, plus a $995/month premium SLA ([Keygen](https://keygen.sh/pricing/)); Portainer at community versus 9x5 next business day versus 24/7 ([Portainer](https://www.portainer.io/pricing)); ZITADEL at 24/7 with an 8-hour base, down to a 30-minute add-on ([ZITADEL](https://help.zitadel.com/zitadel-enterprise-pricing-metrics)).
- Evaluation terms seen: n8n's Business trial is 14 days ([n8n](https://n8n.io/pricing/)); Keygen EE's trial is 30 days ([Keygen](https://keygen.sh/pricing/)); Portainer Enterprise offers 15 nodes for 45 days ([Portainer](https://www.portainer.io/pricing)); Replicated's POC is 21 days ([Replicated](https://www.replicated.com/pricing)).
- Benchmark context: NRR is about 109% for public SaaS and for the ICONIQ $100M+ ARR bucket. Contract lengths are getting shorter. — [OnlyCFO summary of ICONIQ 2026 State of GTM, 2026-03-25](https://www.onlycfo.io/p/2026-state-of-gtm-gtm-benchmarks)
- a16z uses 5% free-to-paid as an illustrative figure. — [a16z](https://a16z.com/open-source-from-community-to-commercialization/)

### Inferences
- For AI agent products running on the customer's own GPUs and local models, self-hosting removes vendor compute cost risk entirely. Pricing per seat or per instance is then safe. Hosted demos are the only compute exposure (see §7).
- The yen-denominated annual licence, invoiced, with a 30–45 day POC licence, matches both Japanese procurement and the observed trial lengths.

### Gaps
- No sourced POC-to-paid conversion rates, ACV medians by segment (SMB vs enterprise dev tools), or professional services share of revenue for small vendors. The ICONIQ, Bessemer and OpenView figures were in chart images or not reached.

## 6. Trust-building for a closed-source small vendor

### Takeaway
A one-to-three-person vendor can credibly offer source-code escrow (about $1.7K–$3.1K/year with Codekeeper, versus more than $1K per beneficiary per year with traditional agents) and a third-party pen test ($8K–$15K for a web app with login). It can also publish SBOMs and signed images and offer NDA source review. A two-year fair-source conversion clause (the FCL model) is a cheaper continuity guarantee than escrow. SOC 2 costs and timelines were only obtainable as relative figures. For self-hosted products, buyers mainly need product security evidence rather than vendor SOC 2, although Dify and Langfuse still advertise SOC 2 reports to enterprise buyers.

### Cited Findings
- **Codekeeper escrow:** Single costs $139/month annual (about $1,668/year) or $179/month monthly, for 1 agreement. Multi costs $259/month annual (about $3,108/year) for up to 5 agreements. All plans have a $249 setup fee. Verification is an add-on, and release processing is $199/hour. — [Codekeeper pricing](https://codekeeper.co/pricing/software-escrow)
- A client email cited by Codekeeper (single anecdote): the Codekeeper Business plan cost $3,120 for 30 beneficiaries, versus a traditional competitor at more than $1,000 per beneficiary per year (about $30–35K) plus $9–10K per verification. — [Codekeeper article, updated 2026-07-02](https://codekeeper.co/articles/how-much-does-software-escrow-cost) (vendor-published)
- **Pen test costs:** a dynamic web app with login costs $8–15K. A complex custom app costs $15–35K or more. An API test costs $6–18K. A cloud review costs $10–25K. A small-business annual budget is $8–20K. — [Compass IT Compliance, dated 2025-06-03](https://www.compassitc.com/blog/how-much-does-penetration-testing-cost)
- **SOC 2:** Big 4 fees run 3–5 times specialised firms. A Type I+II bundle saves 10–20%. Type I takes about 3 months. Total cost is about 1–4% of revenue at seed, and renewals are 20–40% cheaper. — [Agency blog, 2026-02-24](https://blog.getagency.com/articles/soc-2-audit-cost-for-startups) (no absolute $ figures)
- **Continuity through licensing:** FCL's two-year Apache conversion was explicitly chosen to address buyer shutdown risk instead of offering perpetual licences. — [Keygen](https://keygen.sh/blog/keygen-is-now-fair-source/)
- **Japan-specific:** customers were reluctant to sign NDAs before evaluation, and references matter more than testimonials. — [JETRO Coverity](https://www.jetro.go.jp/ext_images/usa/coverity.pdf)
- **ISMAP:** applies to cloud services, takes often more than 9 months, and carries burdensome audit costs. — [KPMG](https://kpmg.com/jp/ja/insights/2024/05/ismap-revision-overview.html)

### Inferences
- Realistic for a solo founder in year 1: escrow (about ¥250–500K/year), one external pen test per major release (about ¥1.2–2.3M at ¥150/$), a security whitepaper, SBOMs, signed images and a vulnerability-disclosure policy. Japanese buyers will often ask for an answered チェックシート (security questionnaire), which is free but time-consuming. Japanese pen-test vendors were not priced (gap).
- SOC 2 or ISO 27001 (ISMS) is worth pursuing only once a hosted offering exists or enterprise deals stall on it. In Japan, ISMS/ISO 27001 (and Pマーク for personal data) is often more recognised than SOC 2. This is background knowledge, not sourced here.

### Gaps
- No absolute SOC 2 or ISO 27001 audit costs for 2026, no Japanese ISMS certification costs, and no Iron Mountain or NCC Group escrow list prices.

## 7. Risks and anti-patterns

### Takeaway
The largest documented risks for this founder are the self-hosted support burden, multiplied across three products (PostHog's experience), and Kubernetes-based delivery in customer environments. Others are low-tier pricing that never covers its cost to serve (GitLab Starter), unbounded compute on hosted demos, and licence choices that block community contribution or trust. Relicensing backlash is mainly a risk for projects that start open.

### Cited Findings
- PostHog dropped paid Kubernetes self-hosting because a small infrastructure team was consumed by multi-component debugging. Only 3.5% of users chose it, customers needed Kubernetes skills, and simple issues like a full disk caused outages lasting days. — [PostHog, 2023-02-08](https://posthog.com/blog/sunsetting-helm-support-posthog)
- GitLab removed a $4 tier that did not meet its "hurdle rate". — [The Register](https://www.theregister.com/2021/01/27/gitlab_removes_starter_tier/)
- Relicensing from open source triggered forks and contributor exodus (Redis, Terraform). — [The New Stack](https://thenewstack.io/what-happens-to-relicensed-open-source-projects-and-their-forks/)
- Buyers worry about vendor shutdown with source-available or closed EE features. — [Keygen](https://keygen.sh/blog/keygen-is-now-fair-source/)
- Replicated's own product exists because Kubernetes compatibility testing across customer environments is hard (Compatibility Matrix, support bundles). — [Replicated](https://www.replicated.com/product)
- Demo-abuse controls in comparables: n8n's cloud trial caps executions at 1,000, concurrency at 5 and timeouts at 180 seconds. — [n8n](https://n8n.io/pricing/). OpenHands passes LLM costs through "at cost". — [OpenHands](https://openhands.dev/pricing)

### Inferences
- Shipping one opinionated Docker Compose install (with an "embedded cluster" style single-node option) before offering Helm reduces support load. Requiring support bundles and diagnostics from day one also helps.
- Hosted demos of agent products should run on capped quotas, time-boxed sandboxes and the founder's own local model, with sign-up gating. Hosted demo compute is the only unbounded-cost surface if the product is otherwise self-hosted.
- Three products from one person risks spreading effort thin. Sharing one platform core (identity, licensing, audit, installer) across all three, and selling the identity layer as the shared enterprise tier rather than a separate product, keeps the support surface to one installer and one licensing system.

### Gaps
- Founder write-ups from HN, Indie Hackers, Gergely Orosz and Lenny's on solo self-hosted businesses were not retrieved (search budget exhausted). This remains anecdotal and unsourced.

## Options for this founder (pros and cons; not a single recommendation)

**Option A — Fully closed source, self-hosted, licence key, direct sales (current plan)**
- Pros: maximum IP protection and no fork risk. Simple story. Price anchors exist (Tabnine $39–59/user/month, Sourcegraph from $16K/year, Portainer per node). Fits on-prem-minded Japanese manufacturers and the public sector, and avoids ISMAP.
- Cons: no free top-of-funnel. Most successful comparables (n8n, Dify, Langfuse, Sentry, Grafana, Keygen) rely on one. Trust burden for a tiny vendor requires escrow, pen tests and references. Japanese large-enterprise procurement without an SIer is slow.

**Option B — Source-available / fair source (FSL or FCL) with a commercial EE key**
- Pros: inspectable code eases security review and NDA friction. The two-year Apache conversion addresses shutdown risk (Keygen's stated reason) and replaces escrow. Sentry reports 10,000+ organisations approved it, with $100M revenue. It bans competing hosted offerings. Low backlash risk because the product starts this way.
- Cons: competitors can read the code. Requires care in licence-key enforcement. Some enterprises' legal teams still treat source-available as non-standard.

**Option C — Open core (free Community edition, closed enterprise features)**
- Pros: proven funnel (Dify, Langfuse, n8n, Coder, Plane). The enterprise gate (SSO, RBAC, audit, multi-workspace, HA, SLA) is a well-understood list.
- Cons: the free edition creates support demand (PostHog). It competes with very strong free incumbents (n8n, Dify). Moving later from open to more restrictive terms risks backlash.

**Option D — Japan channel-first (SIer/distributor resale, yen invoices)**
- Pros: SIers and distributors handle 請求書払い, procurement, and often first-line Japanese support. Resale at 70–80% of list, or referral at 20–30% of ARR, is a known structure. Fits large enterprises without IT staff.
- Cons: 20–30% margin loss. Large SIers rarely onboard tiny vendors directly, so a distributor is needed. Risk of white-labelling (the Coverity distributor hid its name). Slower feedback loops.

**Option E — Subsidy-aligned SME offering (register as, or partner with, an IT導入支援事業者)**
- Pros: SME buyers get 1/2–2/3 off, up to ¥4.5M (通常枠). The 6th deadline is 2026-10-30 and the programme recurs. AI-embedded tools are eligible when registered.
- Cons: appears biased toward cloud/SaaS tools (low-reliability source, unverified). Paperwork and registration obligations. Vendor eligibility requirements are unverified. SME ACVs are small.

**Option F — Use Replicated (or Keygen EE) as the distribution layer**
- Pros: Replicated gives a professional installer, proxy registry, air gap, support bundles and compatibility testing. Keygen EE is cheap, self-hostable, and covers licensing plus an OCI registry.
- Cons: Replicated costs $2–3K/month plus $50–200 per licence per month, which suits only once there are paying enterprises. Keygen and Cryptlex/LicenseSpring require building the installer, SBOM and signing pipeline yourself.

**Option G — Narrow to one lead product; fold the identity layer into the others as the enterprise tier**
- Pros: one installer, one licence system and one support surface. The identity market is crowded and cheap (WorkOS $65–125/connection, authentik $5/user, ZITADEL, Keycloak), so the layer adds more value as the "enterprise-ready" gate than as a standalone SKU.
- Cons: delays revenue from the other products, and the brand remains a "suite" story only in the long run.

**Option H — Hybrid: hosted demo/SaaS for SMEs plus self-hosted enterprise licence**
- Pros: SaaS may qualify for the AI subsidy category, gives self-serve conversion and creates a funnel. Self-hosted serves enterprises with data-sovereignty needs (the Metabase/GitLab model of the same price for both).
- Cons: makes the vendor an operator, which raises SOC 2/ISMS, uptime and compute-cost exposure (agent workloads). Needs demo abuse controls. Doubles the operational surface for a one-to-three-person team.

**Pricing-unit sub-options (any of the above)**
- Per seat (GitLab, Tabnine): familiar to buyers. Can penalise broad adoption of agent tools.
- Per instance or node (Portainer, Mattermost per server): easy to enforce offline. Fits GPU-box deployments. Needs a dev/staging licence policy (Metabase dev token, Mattermost 4 free non-production keys).
- Flat annual tiers with a usage gauge (n8n, Portainer): predictable. Fits Japanese annual budgets (年間予算) and 稟議.
- Per tenant or connection (WorkOS, ZITADEL): suits the identity layer if sold to ISVs.
