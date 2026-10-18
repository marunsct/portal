# Portal plan: company vision, product positioning, site and demo architecture

Prepared 2026-10-18 from a full read of the three product repositories
(`marunsct/DevFlow` @ `harness-hardening-session`, `marunsct/AgentCanvas` @ `main`,
`marunsct/Platform` @ `main`). Facts about the products come from their code and docs;
decisions marked **proposal** are for the owner to confirm or change. Everything that
depends on a proposal (names, prices, domains, emails) lives in one file,
`site.config.ts`, so changing a decision is a one-line edit, not a rewrite.

---

## 1. The company

### 1.1 What the three products have in common

Read side by side, the three repositories are not three unrelated bets. They are three
layers of one answer to one question: **how does a developer build, run and sell AI
software without handing their code, their customers' data or their margins to a hosted
AI vendor?**

| Layer | Product | What it does, in one line | Runs on |
|---|---|---|---|
| Build | **DevFlow** | Turns a written product brief into a tested, documented software repository using a team of AI agents | your model server (LM Studio, Ollama, vLLM, llama.cpp) |
| Create | **AgentCanvas** | Draws AI agents and workflows on a canvas and compiles them to real code in ten frameworks, then runs, debugs, evaluates and publishes them | any model, local first |
| Sell | **Matura** (repo `Platform`) | Gives any application the SSO, tenancy, audit, privacy and compliance evidence enterprise buyers require, self-hosted | your servers |

Every one of them is designed so that nothing has to leave the owner's machines: DevFlow's
default provider is `local` and it budgets context for small windows; AgentCanvas ships five
local backends in its catalogue and a "Private" copilot mode; Matura "never runs your app
and never phones home". That is the thesis, and it is a real gap:

- Hosted coding agents (Devin, Cursor agents, Copilot Workspace) and hosted agent builders
  (Dify Cloud, Flowise Cloud, OpenAI Agent Builder) assume a frontier API and send code and
  data out. Teams in regulated industries, defence, healthcare, finance, public sector and
  Japan's manufacturing base often cannot use them at all.
- Open-source local tooling (Ollama, Open WebUI, LangFlow) solves *running a model* or
  *chatting with it*, not *producing a verified product* or *selling the result*.
- Nothing on the market connects "build it locally" to "sell it to an enterprise" in one
  supported stack.

### 1.2 Vision statement (proposal)

> **Everything a software team needs to build, run and sell AI software on hardware it owns.**

Mission: give independent developers and small teams the same leverage a hosted AI vendor
has, without the dependency. Models stay local. Code stays yours. Customers' data stays in
their tenant. The company sells the software and the support, never the data.

### 1.3 Positioning pillars

1. **Local by default, not local-capable.** Every product is designed around self-hosted
   models and self-hosted deployment first, with hosted APIs as the optional extra, not the
   other way round.
2. **Verified, not vibed.** DevFlow's definition of done is an independently written, locked
   acceptance suite; AgentCanvas has an evaluation studio with release gates; Matura scores
   readiness and exports evidence. Trust comes from checks the product itself runs.
3. **Own the output.** DevFlow hands over a plain git repository with CI; AgentCanvas
   exports idiomatic framework code; Matura is a contract any stack can implement. There
   is no proprietary runtime to be locked into.
4. **One stack, three doors.** A customer can start with any product and grow into the
   others: build a product with DevFlow, add an agent surface with AgentCanvas, sell both
   through Matura.

### 1.4 Company name (proposal, configurable)

The claude.ai project is called "LocalAI Company", which is a description rather than a
name. Working name used throughout the portal: **Ownstack** ("own your stack"). It is
short, says the thesis, and reads well next to the product names. Alternatives listed in
`site.config.ts` comments: *Localhost Works*, *Homeground AI*, *Keelstack*. Rename by
editing `site.config.ts` → `company.name`; nothing else references the string.

### 1.5 Audience

- Primary: technical founders and platform/ML engineers at 5–200 person companies who
  already run local models (LM Studio, Ollama, vLLM) and want to ship products on them.
- Secondary: engineering leaders in regulated or data-sovereign environments evaluating
  "can we do agentic development in-house?".
- Tertiary: ISVs who have an app and need to pass enterprise procurement (Matura alone).

---

## 2. Product positioning (grounded in the code)

### 2.1 DevFlow — "A software company that runs on your GPU."

What a customer gets: upload a brief (`.md/.txt/.pdf/.docx`); a product manager, stack
selector, architect, QA, scrum master, technical lead, developers and reviewers turn it into
a repository with unit tests, a **locked acceptance suite**, design documents, a decision
log, sprint records, a CI workflow and container files. Runs unattended ("auto mode") or
pauses at six human review points.

Headline features for the site (each verified in `src/app`):
- Brief → product pipeline with 33+ graph stages and six optional review gates
- Acceptance suite written by QA *before* building, locked as the definition of done
- CI gate per batch with revert-on-regression and IDE-grade diagnostics as defects
- Parallel or linear sprint execution; fast or thorough delivery mode
- 33 stack packs across JS/TS, Python, Go, Java, Rust, Ruby, PHP, C#
- Decision records and change requests, each with its own acceptance test
- Pause, resume, rewind, clone; cost and token ceilings; orphan recovery
- Live dashboard over WebSocket: agent activity, execution flow, artifacts, git changes,
  steering notes injected into later calls
- Built for self-hosted models: endpoint-kind detection, context budgeting, optional
  frontier "judgement" tier with a per-run 100% local switch
- Roles (admin/operator/viewer), tenants, audit log, Prometheus metrics, full transcripts

Competitive framing: vs Devin / Cursor agents / OpenHands / GPT-Engineer. Difference:
independent locked acceptance suite + hidden benchmarks; a whole organisational process
with recorded decisions; built around small local windows; release files by construction.

### 2.2 AgentCanvas — "Draw the agent. Own the code. Run it on any model."

Visual builder (React Flow) whose JSON IR compiles to idiomatic projects for LangGraph
(default), OpenAI Agents SDK, CrewAI, Google ADK, Pydantic AI, Agno, Microsoft Agent
Framework, Strands, LlamaIndex and Mastra. Runs, debugs (time travel, fork, explain,
pins/mocks), evaluates (datasets, evaluators, experiments, release gates, online eval),
versions and publishes (API key, MCP server, A2A agent, share page, widget). Imports
Langflow, Flowise and n8n files. 27 templates, AI copilot with a local-only "Private" mode.

Competitive framing: vs n8n / Flowise / Langflow / Dify / AutoGen Studio. Difference: no
hidden runtime; ten-framework codegen and export; debugging depth; built-in evaluation
with gates; every deployment is an MCP server and an A2A agent; local-first privacy.

### 2.3 Matura — "From prototype to procurement-ready."

Self-hosted control plane: tenants, workspaces, members, invitations; Postgres row-level
security that fails closed; Keycloak-issued tokens enriched with tenant claims; per-tenant
SSO (SAML/OIDC) and SCIM; MFA and session policy; hash-chained audit log with export;
data export and erasure; entitlements; agents and service accounts as revocable tenant
principals with on-behalf-of tokens and MCP resource metadata; readiness score with OSCAL
export and a trust page; SDKs for Python, TypeScript, Go and a conformance CLI.

Competitive framing: vs WorkOS / Frontegg / Clerk (hosted, per-connection pricing), Keycloak
alone (identity only), Vanta / Drata (check controls but do not add them). Matura adds the
controls *and* produces the evidence, on your servers.

**Open decision for the owner:** the `Platform` repository is licensed Apache-2.0 and its
README and ADR 0002 say "everything is open source". The portal is written for a
closed-source commercial suite as instructed. Three options, in order of recommendation:
1. Keep Matura's *core* open (it is the trust layer; buyers audit it) and sell the
   enterprise connectors, support and hosting. This is the Keycloak/HashiCorp pattern.
2. Make Matura source-available (BSL/FSL) so customers can read and build it but not
   compete with it.
3. Close it fully, which requires removing the Apache licence and the "open source"
   claims from the repo and ADRs.
The portal currently describes Matura as "source-available to licensed customers"
(option 2 wording), which is true under either 1 or 2 and can be edited in one place.

---

## 3. How the products are serviced without open-sourcing them

Closed source does not mean closed off. The model below is the standard one for
self-hosted commercial software (GitLab EE, Sentry self-hosted, Grafana Enterprise):

| Offer | What the customer gets | How it is delivered |
|---|---|---|
| **Evaluation** (free, 30 days) | Hosted demo on this portal + a time-limited licence key for a self-hosted trial | Demo gateway on the portal; key from the Support page |
| **Team** | Self-hosted licence for one product, N seats, email support, updates for 12 months | Private container registry (`registry.<domain>`) with per-customer pull credentials; licence key checked at start |
| **Business** | All three products, SSO, priority support, named engineer, quarterly roadmap call | Same registry; Helm charts and Compose bundles; signed SBOMs |
| **Enterprise** | Air-gapped installer (tarball of images + charts), source escrow, custom SLAs, on-site enablement | Offline bundle; source escrow agreement |
| **Managed** (later) | Ownstack runs the stack on the customer's cloud account or on rented GPUs | Not built yet; listed as "talk to us" |

Mechanics to implement later (documented on the site now):
- **Licence keys**: signed JSON (product, customer, seats, expiry) verified offline by each
  product at start. None of the three products check keys today; this is a small change
  per product and is on the roadmap page.
- **Private registry**: images are pushed to a registry only paying customers can pull from.
- **Source access**: Business/Enterprise customers can get read access to the repositories
  under NDA (source-available), which is how customers audit security without the code
  being public.
- **Updates**: semantic versions, a changelog page on the portal, security advisories by
  email.
- **Support**: tickets from the portal Support page, a knowledge base (Help section),
  response-time targets per plan.

Prices on the Pricing page are placeholders marked as such ("from"), configurable in
`site.config.ts`.

---

## 4. Portal architecture

### 4.1 The hosting constraint that decides the design

All three products are built to be served at the **root of their own origin**, and all
three **refuse to be iframed**:

| Product | User port (container) | API wiring | Sub-path support | Iframe |
|---|---|---|---|---|
| DevFlow | 8000 (UI + API same origin) | `axios baseURL '/api'`, WebSocket on `window.location.host` | none (no router basename, no `VITE_*` API var) | not set, but same-origin assumptions |
| AgentCanvas | web 8080 (host 7777), API 8000 internal | `API_BASE = "/api/v1"`, nginx proxies to `API_UPSTREAM` | none (`BrowserRouter` without basename, no Vite `base`) | CSP `frame-ancestors 'self'` |
| Matura | 8080 (API + portal at `/portal/`), Keycloak 8180 | same origin, `/portal/config.json` | `/portal` hard-coded; cannot be re-prefixed | CSP `frame-ancestors 'none'` |

Therefore the portal does **not** mount the demos under `/demo/devflow/`. It routes by
**hostname**, which is also how every serious product site does it:

```
https://www.ownstack.example           → portal (this repo)
https://devflow.demo.ownstack.example  → DevFlow  (upstream :8000)
https://canvas.demo.ownstack.example   → AgentCanvas web (upstream :7777)
https://matura.demo.ownstack.example   → Matura (upstream :8080)
https://id.demo.ownstack.example       → Keycloak for Matura (upstream :8180)
```

Locally the same layout works with no DNS changes using `*.localhost`, which browsers
resolve to 127.0.0.1: `http://www.localhost`, `http://devflow.demo.localhost`, etc.

### 4.2 Components

```
                 ┌──────────────────────────────────────────────────────┐
  browser ──────▶│ Caddy (gateway)  :80/:443  automatic TLS              │
                 │  www.*       → portal:3000                            │
                 │  *.demo.*    → forward_auth portal:3000/api/demo/verify│
                 │                 then reverse_proxy to the product     │
                 └───────────┬───────────────────────┬──────────────────┘
                             │                       │
                   ┌─────────▼────────┐    ┌─────────▼──────────────────────────┐
                   │ portal (Next.js) │    │ products (your docker containers)   │
                   │ pages, docs,     │    │ devflow:8000  canvas:7777  matura:8080│
                   │ demo sessions,   │    │ (host ports, or the optional        │
                   │ support tickets  │    │  docker-compose.products.yml stack) │
                   │ /data volume     │    └─────────────────────────────────────┘
                   └──────────────────┘
```

- **Caddy** terminates TLS (Let's Encrypt, automatic for named hosts; wildcard via DNS
  challenge optional), routes by host, and asks the portal whether a request to a demo
  host carries a valid demo session (`forward_auth`). WebSockets and SSE pass through
  (Caddy streams by default; `flush_interval -1` set for the API paths).
- **Portal** is a Next.js 15 app (`output: standalone`, ~150 MB image): marketing pages,
  product pages, documentation rendered from Markdown in `content/`, help centre, support
  form, pricing, legal, changelog, and the demo launcher API.
- **Products** run wherever the owner runs them. Default upstreams point at
  `host.docker.internal:<port>` so the three products can keep their own compose files.
  `docker-compose.products.yml` is an optional overlay that builds and runs all three
  from their git repositories with demo settings, for a one-command full stack.

### 4.3 Demo session flow ("limited demo")

1. Visitor clicks **Try DevFlow** on the portal. The launch page explains what the demo
   can and cannot do, shows the session length and the demo credentials, and (optionally,
   `DEMO_REQUIRE_EMAIL=true`) asks for name, email and company.
2. `POST /api/demo/start` checks the concurrency cap (`DEMO_MAX_CONCURRENT`, default 5
   per product), records the lead in `/data/leads.jsonl`, and sets a signed, `HttpOnly`
   cookie `ownstack_demo` on the parent domain (`.ownstack.example`) containing
   `{product, exp, id}` with an HMAC (`DEMO_SESSION_SECRET`). TTL `DEMO_SESSION_MINUTES`
   (default 45).
3. Browser is redirected to `https://devflow.demo.ownstack.example/`. Caddy calls
   `GET portal/api/demo/verify` with the original headers; the portal validates the cookie
   for that host's product and returns 200, or 401 with a `Location` back to the launch
   page. Caddy copies the redirect, so an expired session lands on "Your demo session
   ended — start another".
4. The product itself is reached directly. For products with their own login (DevFlow)
   the launch page shows a demo operator account that an init script creates. AgentCanvas
   and Matura run in their no-password development auth modes for the demo stack.
5. `scripts/reset-demo.sh` recreates the product volumes so demo data does not
   accumulate; the optional `demo-reset` service runs it on a schedule
   (`DEMO_RESET_CRON`, default nightly).

What "limited" means in practice, and what the launch pages say:
- Time-boxed sessions, concurrency cap, nightly reset.
- DevFlow demo is capped by `MAX_RUN_COST_USD`/`MAX_RUN_TOKENS` and runs on the owner's
  model server; the page sets expectations that a full run takes an hour or more.
- No outbound email, no external MCP servers, no Docker-socket sandbox in demo mode.
- Hosted provider keys are not configured; local models only (the thesis, demonstrated).

### 4.4 Site map

```
/                      Home: thesis, the stack, three product doors, demo CTA, how it is sold
/vision                The company: problem, vision, principles, who it is for, roadmap
/products              Overview and comparison of the three
/products/devflow      Detail: hero, how it works (pipeline), features, screens, specs, FAQ
/products/agentcanvas  Detail
/products/matura       Detail
/demo                  Demo hub: what you can try, rules, three launch cards
/demo/devflow          Launch page (+ credentials, expectations, start button)
/demo/agentcanvas      Launch page
/demo/matura           Launch page
/demo/ended            Session ended / cap reached pages
/docs                  Documentation home
/docs/<product>/...    overview, quickstart, installation, configuration, user guide,
                       administration, integration/API, troubleshooting, faq
/docs/suite/...        architecture of the suite, licensing & delivery, security model
/pricing               Plans and what "self-hosted, closed source" means for the buyer
/help                  Help centre: searchable articles grouped by topic
/support               Support form (writes /data/tickets.jsonl, optional SMTP), SLAs, status
/company               About, principles, contact
/security              Security & trust: how data stays local, disclosure policy
/changelog             Release notes per product (seeded from the repos' CHANGELOGs)
/legal/terms, /legal/privacy, /legal/eula
```

### 4.5 Technology choices

| Choice | Why |
|---|---|
| Next.js 15 (App Router, TypeScript) | Static marketing pages + a few server routes (demo, support) in one deployable; `output: standalone` gives a small Docker image |
| Markdown content in `content/` rendered with `marked` + `shiki`-free highlighting | Docs editable without touching React; no CMS to run |
| Caddy 2 as the gateway | Hostname routing, automatic TLS, `forward_auth` in six lines; no Lua, no nginx auth_request boilerplate |
| JSON-lines files on a `/data` volume | Leads and tickets without a database; trivially backed up; upgrade path to Postgres noted |
| No analytics scripts, no third-party fonts at runtime by default | Consistent with the "nothing leaves your machines" message; fonts are self-hosted in `public/fonts` |

### 4.6 Design direction

Subject: a workshop of machines you own. The one bold element is the **rack**: the home
hero draws the three products as units in a server rack that the visitor's hardware
"powers", with live-looking status marks that reflect which demos are up (polled from
`/api/status`). Everything else is quiet: left-aligned, wide measure, two typefaces
(Bricolage Grotesque for display, IBM Plex Sans/Mono for text and code), a cool chalk
background with ink text and one cobalt signal colour. No cards-with-shadows grid, no
gradient washes, no all-caps eyebrows.

Tokens (in `app/globals.css`): chalk `#F4F5F1`, paper `#FFFFFF`, ink `#15181D`,
graphite `#5B6470`, rule `#D8DCD4`, cobalt `#1F3FC4`, cobalt-dark `#182F96`,
moss (status) `#3C7A3E`, amber (status) `#B8791B`, slate band `#1C2129`.

---

## 5. Build plan

| Step | Output | Done when |
|---|---|---|
| 1 | Next.js app scaffold, tokens, layout, nav, footer | `npm run build` passes |
| 2 | Home, vision, products (overview + 3), pricing, company, security | pages render with real content |
| 3 | Docs engine + content for each product (9 pages each) + suite docs | `/docs/**` renders, sidebar, prev/next |
| 4 | Demo launcher: launch pages, start/verify/status routes, ended page | `curl` tests of the verify route |
| 5 | Help centre + support form + tickets store + legal + changelog | form writes a ticket |
| 6 | Dockerfile (multi-stage), `docker-compose.yml` (portal + caddy), `Caddyfile`, `.env.example`, `docker-compose.products.yml`, demo init/reset scripts | `docker compose up` serves the portal; gateway routes to upstreams |
| 7 | README, OPERATIONS.md (hosting runbook), verification, push to `main` | repo pushed |

Out of scope for this pass (listed on the roadmap page): licence-key enforcement inside the
products, private registry automation, payment, managed hosting, product screenshots
(placeholders drawn as UI sketches until real screenshots are added to `public/screens`).
