/**
 * Product catalogue. Every claim here was checked against the product repositories
 * on 2026-10-18 (see docs/PLAN.md §2 for the sources). Keep marketing claims inside
 * what the code does.
 */

export type ProductId = "devflow" | "agentcanvas" | "matura";

export interface Product {
  id: ProductId;
  name: string;
  layer: string; // the role it plays in the stack
  proves: string; // what evidence it produces
  next: string[]; // roadmap ideas backed by the research
  tagline: string;
  oneLiner: string;
  description: string[];
  audience: string;
  status: "early access" | "beta" | "general availability";
  version: string;
  repo: { url: string; branch: string };
  port: number; // user-facing container port
  demoHostKey: "devflow" | "agentcanvas" | "matura";
  color: string; // single accent used only on the rack unit and product mark
  how: { title: string; body: string }[]; // "how it works" sequence
  features: { title: string; body: string }[];
  localFirst: string[]; // concrete local-model facts
  specs: { label: string; value: string }[];
  compare: { against: string; difference: string }[];
  faq: { q: string; a: string }[];
  demo: {
    canDo: string[];
    cannotDo: string[];
    expectation: string;
    credentials?: { label: string; value: string }[];
    firstSteps: string[];
  };
}

export const products: Product[] = [
  {
    id: "devflow",
    name: "DevFlow",
    layer: "Software factory",
    proves: "That the code meets an acceptance suite written and locked before it existed, with every decision and model call on record.",
    next: [
      "Published scorecards on Vibe Code Bench and ViBench with locally hosted models",
      "Per-run compliance evidence pack: acceptance results, decisions, model and version, SBOM",
      "An acceptance-lock gate that wraps any coding agent, not only DevFlow's own",
      "Policy-based hybrid routing: local models for bulk work, a frontier model only where data class allows",
      "Domestic model backends and Japanese-language briefs",
      "Brownfield modernisation that pins current behaviour before migrating",
    ],
    tagline: "The verification-first software factory for models you host.",
    oneLiner:
      "A brief becomes a tested repository with an audit record. QA locks the acceptance suite before any code exists, so the agents cannot grade their own work.",
    description: [
      "DevFlow is a complete software-delivery organisation in a container. A product manager reads your brief, a stack selector and architect design the system, QA writes an acceptance suite before a line of product code exists, a scrum master plans sprints, specialist developers work through work orders in parallel, and code, security and milestone reviewers gate every step.",
      "The output is not a chat transcript. It is a git repository with unit tests, a locked acceptance suite, design documents, a decision log, sprint records, a CI workflow and container files, handed over as a zip or left in place for you to keep building on.",
      "It was built around the constraints of self-hosted models: small context windows, slow single-request servers, and no assumption that a frontier API is one key away. Practitioners running local models report the same fixes DevFlow is made of: plan first, work in small pieces, test and analyse every step. An optional second 'judgement' model can review the stages that need it where your data policy allows, or be switched off so a run is entirely local.",
    ],
    audience:
      "Technical founders and product owners who want a verified codebase from a specification, and platform teams that cannot send code to a hosted coding agent.",
    status: "early access",
    version: "harness-hardening-session",
    repo: { url: "https://github.com/marunsct/DevFlow", branch: "harness-hardening-session" },
    port: 8000,
    demoHostKey: "devflow",
    color: "#1f3fc4",
    how: [
      {
        title: "Brief in",
        body: "Upload Markdown, text, PDF or Word. The product manager stage turns it into a product intake document and asks for your review if you want a gate there.",
      },
      {
        title: "Design and stack",
        body: "A stack selector picks from 33 stack packs (React, Next, Django, Spring, Axum, Rails, Laravel, ASP.NET and more). The principal architect writes the technical specification; an architecture reviewer pushes back until it holds.",
      },
      {
        title: "Acceptance first",
        body: "QA writes the acceptance suite from the specification and it is locked with checksums. From here on, 'done' means that suite passes, not that the developer says so.",
      },
      {
        title: "Sprints of work orders",
        body: "The technical lead writes work orders with files, interfaces, steps and test cases. The scrum master plans vertical-slice sprints. Developers execute in parallel with per-file ownership, or linearly if you prefer.",
      },
      {
        title: "CI gate on every batch",
        body: "Commit, unit tests, the acceptance snapshot, regression check against the last accepted state, and IDE-grade diagnostics. A fix that breaks a passing test is reverted automatically.",
      },
      {
        title: "Review and release",
        body: "Code review, security review and a milestone review that cannot accept red criteria. The release stage emits the CI workflow and container files from the same commands the harness actually ran.",
      },
    ],
    features: [
      { title: "Brief to product pipeline", body: "Thirty-plus graph stages from product intake to release, with six optional human review gates: intake, technical specification, acceptance tests, sprint, release and escalation." },
      { title: "Locked acceptance suite", body: "QA writes acceptance tests before building; the suite is locked, versioned on re-lock, and only QA can reopen it. Disputes go to a dedicated stage." },
      { title: "CI gate with revert on regression", body: "Every batch is committed and tested. Regressions against the last accepted state and TypeScript or Pyright diagnostics become defects; a bad fix is rolled back." },
      { title: "Parallel or linear execution", body: "Fan out work orders across developers with enforced file ownership, or run them one after another on a single-request model server." },
      { title: "Fast or thorough delivery", body: "Fast mode drafts files from the spec and plans one sprint for small products; thorough mode runs the full organisation." },
      { title: "33 stack packs", body: "Browser JS, React, Vue, Svelte, Angular, Node, Nest, Python HTTP, Flask, Django, Next, Go, Java Spring, Rust Axum, Ruby Rails and Sinatra, PHP Laravel and Slim, C# ASP.NET, CLIs and libraries, plus a proven custom-setup stage for anything else." },
      { title: "Decision records and change requests", body: "Every architectural decision is recorded; every change request gets its own acceptance test. The decision log ships with the product." },
      { title: "Run control for unattended work", body: "Pause, resume, rewind to an earlier point, clone, cancel. Cost and token ceilings pause a run instead of burning budget. Orphaned runs recover after a restart." },
      { title: "Live dashboard", body: "Agent activity and execution flow streamed over WebSocket, an artifacts browser, git history, the technical log, and a steering box that injects your notes into later model calls." },
      { title: "Interface checks for web products", body: "Playwright and Chromium in the image: a 375px overflow check, axe-core accessibility, and screenshots a vision-capable reviewer can read." },
      { title: "Roles, tenants, audit", body: "Admin, operator and viewer roles, per-tenant workspaces, an audit log, rate limiting, encrypted provider keys, Prometheus metrics and full transcripts of every model and tool call." },
      { title: "Benchmarked against hidden tests", body: "A benchmark harness with hidden acceptance tests the agents never see, a scorer and a mutation tester measure false acceptances rather than trusting the model's own report." },
    ],
    localFirst: [
      "Default provider is local; the default endpoint is an LM Studio address and llama.cpp, vLLM and Ollama are detected as self-hosted endpoints automatically.",
      "Context budgets, compaction and output limits are derived from the served model's real window, because local windows are small.",
      "Thinking-mode switches are sent through chat-template arguments the way local servers expect them.",
      "An optional judgement model can be hosted or local; a per-run switch keeps a run entirely on your hardware.",
      "The model server is not part of the stack: the containers reach it over the network, so your GPU box stays yours.",
    ],
    specs: [
      { label: "Runtime", value: "Python 3.12, LangGraph with Postgres checkpoints, Deep Agents, FastAPI, Celery" },
      { label: "Interface", value: "React 19 single-page app served by the API on one port" },
      { label: "Services", value: "app, worker, Postgres 15, Redis 7; optional MinIO object store" },
      { label: "Model backends", value: "LM Studio, Ollama, vLLM, llama.cpp (OpenAI-compatible); OpenAI, Anthropic, Gemini optional" },
      { label: "Toolchains in the image", value: "Node 24, Go, JDK 21, Rust, Ruby, PHP, .NET 8, Playwright + Chromium, TypeScript, Pyright" },
      { label: "Resources", value: "2 CPU / 2 GB for the API, 2 CPU / 8 GB for the worker, plus your model server" },
      { label: "Typical run", value: "Around 80 minutes for a small web product on a 35B local model" },
    ],
    compare: [
      { against: "Hosted coding agents (Devin, Copilot Workspace)", difference: "DevFlow never sends your brief or code to a vendor. The model is yours; the output is a plain repository." },
      { against: "IDE agents (Cursor, Windsurf)", difference: "DevFlow runs a whole delivery process unattended with recorded decisions, not an editor you drive line by line." },
      { against: "OpenHands, GPT-Engineer, MetaGPT", difference: "An independently written, locked acceptance suite and hidden-benchmark scoring define 'done'. The agent's own tests passing is not enough." },
      { against: "Air-gapped agents (Factory, Tabnine)", difference: "They bring agents inside the perimeter. DevFlow brings a verification process: locked acceptance, revert-on-regression, decision records and run budgets." },
    ],
    faq: [
      { q: "Which models work?", a: "Any OpenAI-compatible chat endpoint. The team runs it on local mixture-of-experts coding models in the 30B class with a 32k or larger context window; smaller models work for small briefs. The run time scales with the model's speed." },
      { q: "Do I need a GPU in the DevFlow host?", a: "No. The model server is separate. DevFlow's containers need CPU and memory for toolchains, builds and tests; the model runs wherever you serve it." },
      { q: "Can it work on an existing codebase?", a: "Yes, by seeding a run from a git URL or an archive through the API. The brownfield workflow is API-first today; the interface control is on the roadmap." },
      { q: "What do I actually receive?", a: "A git repository with the product, unit tests, the locked acceptance suite, a technical specification, decision log, sprint records, a CI workflow and container files, plus transcripts of what the agents did." },
      { q: "Is it safe to let agents run commands?", a: "Command execution is off by default. When enabled, commands run argv-only, under allow-lists and resource limits, in a sandbox that can be in-container or a separate container." },
    ],
    demo: {
      canDo: [
        "Sign in as a demo operator and explore the dashboard, settings and a completed run with its artifacts, decision log and sprint records.",
        "Start a run from one of the bundled benchmark briefs and watch the agents work live.",
        "Post steering notes and approve or request changes at review gates.",
      ],
      cannotDo: [
        "Change the model configuration; the demo is pinned to a local model on our hardware.",
        "Use hosted providers, external MCP servers or outbound email.",
        "Keep data past the nightly reset.",
      ],
      expectation:
        "A full run on a local model takes an hour or more. The demo preloads a finished run so you can see the result immediately and start your own if you have the time.",
      credentials: [
        { label: "Username", value: "demo" },
        { label: "Password", value: "shown after you start the session" },
      ],
      firstSteps: [
        "Open Runs and pick the preloaded run to see the dashboard, artifacts and sprint summaries.",
        "Open Settings to see how a local model server is configured (read-only in the demo).",
        "Go to Home, upload a short brief or choose a benchmark brief, tick 'Unattended', and start.",
      ],
    },
  },
  {
    id: "agentcanvas",
    name: "AgentCanvas",
    layer: "Agent workbench",
    proves: "That an agent still behaves as intended after every change, with evaluations gating each release and code you can take anywhere.",
    next: [
      "Rescue importers for OpenAI Agent Builder exports, Flowise and Langflow, each generating a regression eval set",
      "Agent register: an owner, a cost cap and usage telemetry for every agent",
      "Governed private MCP and A2A registry with default-deny tool policy",
      "Canvas-to-code round trip so edits from coding agents flow back to the canvas",
      "Air-gapped agent packs and Japanese workflow templates (稟議 approval, invoice audit)",
    ],
    tagline: "Own the agent code. Gate every release.",
    oneLiner:
      "A canvas that compiles agents to idiomatic framework code your coding agents can also edit, with self-hosted evaluations that gate every release.",
    description: [
      "AgentCanvas is a canvas where blocks are agents, model calls, routers, tools, MCP servers, approvals, memory and safety guards. Wire them together and the backend compiles the picture into an idiomatic project for the framework you chose: LangGraph by default, or the OpenAI Agents SDK, CrewAI, Google ADK, Pydantic AI, Agno, Microsoft Agent Framework, Strands, LlamaIndex or Mastra.",
      "There is no hidden runtime. What you export is what runs. The same canvas gives you durable runs with time travel and forking, an evaluation studio with release gates, semantic versions with drawn diffs, and one-click publishing as an API, an MCP server, an A2A agent, a share page or an embeddable widget.",
      "It imports Langflow, Flowise and n8n files, ships with 27 templates and a copilot that proposes changes you accept, and it treats local models as first-class citizens rather than a footnote. In 2026 three hosted builders shut down and their users had no code to take with them; AgentCanvas exists so that never happens to yours.",
    ],
    audience:
      "Builders and small teams who want to design agents visually but refuse to be locked into a proprietary engine, and teams that need evaluation and governance before an agent reaches production.",
    status: "beta",
    version: "0.28.1",
    repo: { url: "https://github.com/marunsct/AgentCanvas", branch: "main" },
    port: 7777,
    demoHostKey: "agentcanvas",
    color: "#3c7a3e",
    how: [
      { title: "Pick a model", body: "Choose a provider on your machine (Ollama, LM Studio, vLLM, llama.cpp) or a hosted one, test the connection, and save it as the project default." },
      { title: "Draw the workflow", body: "Start from a template, the guided build, an imported Langflow or Flowise file, or a blank canvas. Typed ports refuse wrong connections and say why." },
      { title: "Choose the framework", body: "A workflow targets one of ten frameworks. Badges and diagnostics show where each block can run; the Code tab shows the generated program as you build." },
      { title: "Run and debug", body: "Runs are durable. Pause at approvals and breakpoints, step back through the timeline, edit state, fork, and read the Explain narrative. Every step shows tokens, cost and latency." },
      { title: "Evaluate", body: "Save runs as test cases, build datasets, pick evaluators (exact, schema, LLM judge, trajectory, pairwise), run experiments and set a release gate the publish step must pass." },
      { title: "Publish or export", body: "Publish a version to an environment behind an API key. Every deployment is also an MCP server and an A2A agent. Or export the project and run it yourself." },
    ],
    features: [
      { title: "Ten frameworks, one canvas", body: "LangGraph, OpenAI Agents SDK, CrewAI, Google ADK, Pydantic AI, Agno, Microsoft Agent Framework, Strands, LlamaIndex and Mastra. Mixed flows run clashing frameworks as parts with typed contracts." },
      { title: "Readable, exportable code", body: "The graph IR is the single source of truth; generated code is idiomatic for the framework and exports as a standalone project with Dockerfile, Compose, Helm and cloud guides." },
      { title: "Block catalogue", body: "Ask AI, AI Agent, Planning Agent, routers, map/join, Python code, approvals, ask-a-person, memory recall and store, knowledge search, plus middleware for PII, retries, backup models, summarisation and self-grading." },
      { title: "MCP gallery and tools", body: "Thirty MCP connectors a click away (GitHub, Slack, Notion, Postgres, Playwright, search engines, Stripe, Jira and more), HTTP tools, Python tools from the workspace, per-tool approval gates." },
      { title: "Time-travel debugging", body: "Durable checkpoints, a timeline you can step back through, state edits, forks, pins and mocks, dry runs, blast-radius view and an Explain narrative of what happened." },
      { title: "Evaluation studio", body: "Versioned datasets, eight evaluator types, experiment grids, release gates, online evaluation with drift alerts, annotation queues and simulated users." },
      { title: "Model gateway", body: "Backup models with failover, an answer cache, day and month budgets with cost alerts." },
      { title: "Knowledge and memory", body: "Knowledge bases from PDF, Word, HTML, Markdown and web pages with BM25, cosine or hybrid search and citations; long-term memory spaces on pgvector with retention." },
      { title: "Publish everywhere", body: "Per-environment deployments with API keys, webhooks and cron triggers. Every deployment is an MCP server and an A2A agent; share pages and an embeddable chat widget are built in." },
      { title: "Safety blocks", body: "PII redaction, prompt-injection scoring, moderation and output-schema checks, with a labelled evaluation set to prove they work." },
      { title: "Import from the tools you use", body: "Langflow, Flowise (chatflow and Agentflow v2) and n8n JSON import; Open Agent Spec import and export." },
      { title: "Governance", body: "Organisations, four roles, invitations, CEL policies enforced by the editor and at publish, audit log, trace export to Langfuse, Phoenix, Datadog or OTLP, Prometheus metrics, row-level security in Postgres." },
    ],
    localFirst: [
      "Five local backends in the provider catalogue: Ollama, LM Studio, vLLM, llama.cpp and any OpenAI-compatible server.",
      "Docker plumbing that rewrites localhost to the host so containers reach the model server on your machine.",
      "A Private copilot mode that restricts the copilot to local models.",
      "An offline knowledge embedder by default; Ollama embeddings as an option.",
      "LLM-judge evaluators and simulated users accept local models too.",
    ],
    specs: [
      { label: "Runtime", value: "Python 3.12, FastAPI, SQLAlchemy, LangGraph checkpoints; framework workers as subprocesses" },
      { label: "Interface", value: "React 19, React Flow canvas, CodeMirror, served by nginx" },
      { label: "Services", value: "web, api, Postgres 16 with pgvector; SQLite when run from source" },
      { label: "Model backends", value: "Ollama, LM Studio, vLLM, llama.cpp, OpenAI-compatible; Anthropic, OpenAI, Azure, Gemini, Mistral, Groq, DeepSeek, xAI" },
      { label: "Auth", value: "No-login development mode, any OIDC provider with PKCE, or Matura" },
      { label: "Resources", value: "0.5–2 CPU and 1–2 GB for the API; the all-frameworks image is several GB, a LangGraph-only build is small" },
      { label: "Tests in repo", value: "1,400+ backend, 100+ frontend, 70+ end-to-end" },
    ],
    compare: [
      { against: "Langflow, Flowise, Dify", difference: "Those run your flow in their engine. AgentCanvas compiles to the framework's own code and exports it, and it can import their files." },
      { against: "n8n", difference: "n8n is an automation tool with AI nodes. AgentCanvas is an agent builder with evaluation, release gates and framework-native output." },
      { against: "AutoGen Studio, hosted agent builders", difference: "Debugging with time travel, an evaluation studio, MCP and A2A publishing and local-model privacy controls are built in, not external services." },
    ],
    faq: [
      { q: "Is the generated code really usable without AgentCanvas?", a: "Yes. Exports are standalone projects with their own dependencies, tests, a smoke command and deployment guides. The LangGraph target runs every block; other targets are documented block by block." },
      { q: "Can I bring my own OIDC provider?", a: "Yes: Keycloak, Okta, Entra, Auth0 and Google are supported through standard OIDC with PKCE. First administrators are bootstrapped from an environment variable." },
      { q: "How does it reach a model on my laptop from Docker?", a: "The local-models host setting rewrites localhost to the Docker host, so an Ollama or LM Studio server on your machine works without changes." },
      { q: "Does it phone home?", a: "No. There is no telemetry endpoint. Trace export goes only to the observability tools you configure." },
    ],
    demo: {
      canDo: [
        "Open templates, draw and edit workflows, run them against a local model, and inspect the timeline, Explain view and generated code.",
        "Switch a workflow's framework and watch the generated program change.",
        "Build a dataset from runs and execute an evaluation experiment.",
      ],
      cannotDo: [
        "Add provider keys for hosted models.",
        "Reach external MCP servers or the public internet from tools.",
        "Publish to a persistent environment; demo deployments are wiped nightly.",
      ],
      expectation: "The canvas is instant. Model responses depend on the demo model and are usually a few seconds per step.",
      firstSteps: [
        "On Home, open the template gallery and choose 'Classify and route' or 'Chat assistant'.",
        "Press Run, type a message, and watch blocks light up with tokens and timing.",
        "Open the Code tab, then change Framework in the workflow settings to CrewAI or Pydantic AI.",
        "Open Timeline, step back to an earlier state, edit it and fork the run.",
      ],
    },
  },
  {
    id: "matura",
    name: "Matura",
    layer: "Control plane",
    proves: "Tenant isolation and agent accountability, from the running system: who acted, for whom, in which tenant, on whose authority.",
    next: [
      "Free conformance CLI that tests any app, on any identity provider, for tenant leaks and audit integrity",
      "Shared enterprise tier for DevFlow and AgentCanvas: one installer, one security review",
      "Japan control packs (ISMS, ISMAP, 3省2, FISC, DS-920) and tested HENNGE One and Entra guides",
      "Enterprise-managed authorization (ID-JAG) for MCP servers with tenant-scoped agent revocation",
      "Evidence connectors to Vanta and Drata",
    ],
    tagline: "Prove isolation and agent accountability from the running system.",
    oneLiner:
      "The control plane under the suite and under your own apps: tenants isolated in your Postgres, people and agents as revocable identities, and a hash-chained audit trail that produces evidence on demand.",
    description: [
      "Building a product is now easy. Selling it to a business is not. The first enterprise customer asks for SSO, data separation, an audit trail, deletion on request, backups and a SOC 2 story, and every answer is weeks of work unrelated to what your product does.",
      "Matura answers those questions once, for every app you build. Add one SDK and a set of services you run yourself, and your application gets tenants and workspaces with database-level isolation, Keycloak-backed sign-in with per-tenant enterprise SSO and SCIM, fine-grained permissions, a tenant admin portal, a tamper-evident audit log, data export and erasure, entitlements, and a readiness score with exportable evidence.",
      "Matura never runs your app and never phones home. It is the layer that lets a DevFlow-built product or an AgentCanvas agent be sold to a bank.",
    ],
    audience:
      "Independent developers and small teams with a working application who need to pass enterprise procurement, and AI products that must treat agents as governed, revocable identities.",
    status: "early access",
    version: "0.1 (M6)",
    repo: { url: "https://github.com/marunsct/Platform", branch: "main" },
    port: 8080,
    demoHostKey: "matura",
    color: "#b8791b",
    how: [
      { title: "Register your app", body: "Describe your app in a manifest: a permission catalogue and roles. Matura becomes the place where tenants enable it and assign roles." },
      { title: "Sign-in and tenants", body: "Users sign in through Keycloak. Tokens carry the tenant, roles and permissions your app needs, verified offline with the SDK." },
      { title: "Isolate data", body: "Shared database with forced row-level security, a schema per tenant, or a database per tenant, provisioned by Matura on your Postgres servers." },
      { title: "Hand admins a portal", body: "Tenant owners invite members, set security policy (MFA, sessions, allowed domains, IP allow-lists), connect SSO and SCIM, and create agents with their own revocable credentials." },
      { title: "Keep the evidence", body: "A hash-chained audit log per tenant, data export and erasure workflows, and a readiness check that scores your installation against SOC 2, ISO 27001, ISO 42001, GDPR and EU AI Act controls." },
      { title: "Prove it", body: "Run the conformance CLI against your app in CI to prove token refusal, tenant isolation and signature handling. Publish a trust page." },
    ],
    features: [
      { title: "Tenants, workspaces, members", body: "Owner, admin and member tenant roles with a last-owner rule; workspaces that group projects; invitations by email with single-use tokens." },
      { title: "Isolation that fails closed", body: "Forced Postgres row-level security with a runtime role that cannot bypass it; schema-per-tenant and database-per-tenant placements provisioned automatically." },
      { title: "Enterprise sign-in", body: "Keycloak with Matura extensions: tenant claims in every token, MFA policy, per-tenant SAML and OIDC brokering, domain verification, home-realm discovery." },
      { title: "SCIM 2.0 per tenant", body: "Users, groups and group-to-role mappings for Okta and Entra directory sync." },
      { title: "Fine-grained permissions", body: "Optional OpenFGA integration with a syncer from memberships and grants, for 'can edit this document' questions." },
      { title: "Agents as identities", body: "AI agents and service accounts as confidential clients owned by a tenant, with roles, expiry, a kill switch, secret rotation and on-behalf-of tokens; OAuth protected-resource metadata for MCP servers." },
      { title: "Tamper-evident audit log", body: "Hash chain written in the same transaction as the change; per-tenant read, export and verification; streaming to external sinks." },
      { title: "Data rights", body: "Tenant export, user access and erasure that also removes the identity, and retention policies run by a privacy worker." },
      { title: "Entitlements", body: "Plan limits for members, workspaces, agents, apps and features with per-tenant overrides." },
      { title: "Readiness and evidence", body: "A CLI that scores an installation, OSCAL export, policy templates and an optional public trust page." },
      { title: "SDKs and conformance", body: "Python, TypeScript and Go SDKs, contract SQL for four databases, signed CloudEvents webhooks and a change feed, and a conformance CLI that black-box tests any app." },
      { title: "Tenant admin portal", body: "Members, invitations, apps, workspaces, roles and My account, embedded in the single binary." },
    ],
    localFirst: [
      "Everything runs on your servers: one Go binary, Postgres and Keycloak. There is no hosted component and no telemetry.",
      "Agents built on local models become governed identities with revocable credentials and an audit trail, which ISO 42001 and the EU AI Act ask for.",
      "Readiness evidence is produced where the data lives and exported in OSCAL to your own GRC tooling.",
    ],
    specs: [
      { label: "Runtime", value: "Single Go 1.24 binary (maturad), five direct dependencies, background workers elected with Postgres advisory locks" },
      { label: "Identity", value: "Keycloak 26 with a Matura extension (token mapper, MFA and SSO authenticators)" },
      { label: "Data", value: "Postgres 16 with forced row-level security; optional OpenFGA" },
      { label: "Interface", value: "React 19 tenant portal embedded in the binary at /portal" },
      { label: "SDKs", value: "Python (FastAPI), TypeScript (zero runtime dependencies), Go; conformance CLI; OpenAPI 3.1" },
      { label: "Deploy", value: "Docker Compose or Helm (two maturad, two Keycloak, ingress, network policy, autoscaling)" },
      { label: "Resources", value: "maturad 128 MB; Keycloak 1–2 GB" },
    ],
    compare: [
      { against: "WorkOS, Frontegg, Clerk", difference: "Hosted SSO is cheap and good. Matura is not competing on SSO: it adds database-level isolation, agent accountability and evidence, on your servers." },
      { against: "Entra Agent ID, Okta for AI agents", difference: "Those govern your workforce's agents. Matura governs the agents inside your product, per customer tenant, with each action on a tamper-evident record." },
      { against: "Keycloak, Zitadel, Authentik alone", difference: "Identity providers stop at sign-in. Matura adds tenancy, isolation, audit, data rights, entitlements and readiness on top of an unforked Keycloak." },
      { against: "Vanta, Drata", difference: "Compliance platforms check that controls exist. Matura adds the controls to your app and produces the evidence." },
    ],
    faq: [
      { q: "Does Matura make my product SOC 2 compliant?", a: "No product can. Matura implements many of the technical controls auditors look for and exports evidence for them. The audit, policies and organisational controls remain yours." },
      { q: "Can I use my existing Keycloak?", a: "Yes, with the Matura extension installed. The realm import and the extension jar are part of the distribution." },
      { q: "Does my app have to wait on Matura at runtime?", a: "No. Your app verifies tokens offline and keeps a local copy of tenant data fed by signed webhooks and a change feed. If Matura is down, your app keeps serving." },
      { q: "What about billing and metering?", a: "Entitlements and plan limits are built in; usage metering and billing adapters are on the roadmap." },
    ],
    demo: {
      canDo: [
        "Sign in to a demo tenant and explore the tenant portal: members, invitations, apps, workspaces, roles.",
        "Create a tenant, invite a user and watch the invitation email arrive in the demo mailbox.",
        "Call the API with the demo headers and read the audit log and readiness score.",
      ],
      cannotDo: [
        "Send real email, connect a real identity provider, or register SCIM clients against a live directory.",
        "Keep data past the nightly reset.",
      ],
      expectation: "The portal and API respond instantly. The demo runs in development authentication mode so you can pick a user without a password.",
      firstSteps: [
        "On the sign-in page choose the demo owner and open Overview.",
        "Open Members, invite a colleague with the member role, then open the demo mailbox link to see the invitation.",
        "Open Apps and enable the AgentCanvas app for the tenant; assign yourself the builder role.",
        "Use the API console link to fetch the tenant's audit log and verify the hash chain.",
      ],
    },
  },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<ProductId, Product>;
export const productIds = products.map((p) => p.id);
