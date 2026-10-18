---
title: FAQ
description: Short answers to the questions engineers ask when evaluating AgentCanvas.
section: AgentCanvas
order: 9
updated: 2026-10-19
---

**Do I need a hosted model or an API key to try it?**
No. Pick Ollama, LM Studio, vLLM or llama.cpp on the first-run screen. Local providers get a placeholder key and the compose file points the container at `host.docker.internal`. Runs, memory, knowledge search (with the built-in offline embedder) and the Copilot (in **Private** mode) all work without anything leaving the host. Hosted providers are there when you want them: Anthropic, OpenAI, Azure OpenAI, Google Gemini, Mistral, Groq, DeepSeek, xAI and any OpenAI-compatible endpoint.

**Is the generated code mine, and does it run without AgentCanvas?**
Yes. The canvas compiles to an idiomatic project for the workflow's framework (LangGraph by default), visible on the **Code** tab and downloadable as a zip with a Dockerfile, compose file or Helm chart, tests, `make doctor` / `make smoke` / `make gate`, and a service that answers the same `/v1/deployments/<name>/runs/*` API as a deployment. The export has no dependency on the AgentCanvas server. What it does not carry: the MCP and A2A endpoints, the Evaluation Studio, and, for exports to frameworks other than LangGraph, some blocks (the export plan lists them).

**Which frameworks are supported, and are they equal?**
Ten: LangGraph, OpenAI Agents SDK, CrewAI, Google ADK, Pydantic AI, Agno, Microsoft Agent Framework, Strands, LlamaIndex, Mastra (TypeScript). They are not equal. Only LangGraph runs every block natively with checkpoints, time travel and breakpoints. The others run on AgentCanvas's own flow engine with the framework's agents inside, and ignore node policies (retry, timeout) silently. The framework badges and P001–P006 diagnostics tell you per workflow what will and will not run. If the framework does not matter to you, stay on LangGraph.

**Can it run under a sub-path of my portal, or in an iframe?**
No to both. The web app assumes it is the root of its origin, and sends `frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN`. Give it its own hostname and link to it. The public share page (`/s/<token>`) and the `widget.js` chat button are designed to be embedded anywhere.

**Does it need WebSockets?**
No. Streams are Server-Sent Events over `POST`. Your proxy needs response buffering off and long read timeouts on the origin; nothing else.

**How are runs made durable?**
Every step boundary is a checkpoint in Postgres (encrypted at rest with `LANGGRAPH_AES_KEY`). A paused run waits indefinitely; a running run on a replica that shuts down is handed to another replica at the next step boundary. The exception is workflows on frameworks other than LangGraph, whose paused state lives in one API process's memory: run a single replica for those, and expect to restart such runs after a redeploy.

**What does the sandbox actually isolate?**
`AGENTCANVAS_SCRIPT_EXECUTION=subprocess` (the production compose default) applies time, memory and file limits and blocks network by default, but runs as the server's user on the server's filesystem. It is not an isolation boundary. For code you do not trust use `docker` (a container per run from `AGENTCANVAS_SANDBOX_IMAGE`) or `langsmith`. Since 0.28.1 every piece of workspace code, including Python tools, goes through the sandbox; the server never imports it.

**Where are API keys and secrets stored?**
As project secrets in Postgres, encrypted with a per-organisation data key that a master key wraps (`AGENTCANVAS_KMS_KEY`: a file, AWS KMS or Google Cloud KMS; otherwise derived from `AGENTCANVAS_SECRET_KEY`). Names only ever leave the server; values are masked in events and traces; exports read them from environment variables of the same names.

**How do I keep an agent from doing something irreversible?**
Turn on **Blast radius** to colour every step by its side effects. Put an **Ask for approval** step before a risky one, or list the tool under the agent's *Tools that need approval*. Use **Dry run** to stub risky tools. Make it mandatory for the organisation with the *Writes need approval* policy, which the editor and the publish checklist enforce.

**How do I know a new version is better before shipping it?**
Build a dataset (from saved test cases, past runs, CSV/JSONL), attach evaluators (exact, regex, schema, LLM judge, trajectory, code, composite, pairwise), run an experiment with the live version and the draft as targets, and set a **release gate** so a publish below the bar is refused. Online evaluators then sample production runs and raise drift alerts. A local model can be the judge.

**How does multi-tenancy work?**
Everything belongs to an organisation. On Postgres, 35 organisation-owned tables carry forced row-level security policies. In Matura mode every request sets the tenant on its transaction, so a query missing its filter returns nothing of another tenant; `dev` and `oidc` modes run in all-tenants mode and rely on the application's own filters. Only Matura's shared data mode (one database for all tenants) is supported.

**Can I bring workflows from Langflow, Flowise or n8n?**
Yes: **Import a file…** on Home takes their JSON exports (and Open Agent Spec). Components that do something become steps; a report lists what did not carry over (custom components, chat-memory components, n8n expressions beyond `$json.<field>`, webhook and schedule triggers). API keys are never read from the file.

**How do other agents and tools call my workflow?**
Every deployment is simultaneously a REST endpoint (`/runs/wait`, `/runs/stream`), a Streamable HTTP MCP server (`/mcp`, one tool plus `answer` for pauses) and an A2A 0.3 agent (`/a2a` with an agent card), all behind the deployment key. Claude Desktop connects through `mcp-remote`; Cursor, VS Code and agent frameworks take the URL and header directly.

**How big is the footprint?**
The API image with every framework runtime is several gigabytes; a LangGraph-only variant is much smaller. At runtime the Helm chart requests 1 GiB per API replica (2 GiB limit) and 64–256 MiB for the web container, plus Postgres. Your model server is separate and sized by the models you run.

**What is the upgrade story?**
Pin `API_IMAGE` and `WEB_IMAGE` to a version, take a backup, pull, `up -d --wait`. The `migrate` service runs Alembic before any replica starts; replicas drain and hand over runs. Conversations move to a newly published version only when it is resume-compatible; the **Contract** panel and the publish checklist flag breaking changes. Read the [changelog](/changelog/agentcanvas) first: security fixes are marked.

**How do I delete one person's data?**
Erase their memory namespace on the **Memory** page (or `DELETE /v1/memory/namespaces`). Conversations expire after `AGENTCANVAS_RETENTION_DAYS` (90 by default; an organisation can set its own, `0` keeps forever) and threads can be deleted with `DELETE /v1/threads/{id}`. Audit rows expire after 400 days.

**What are the known rough edges right now?**
From the project's own review notes: single-replica constraint for non-LangGraph pauses; no request body limit in the API beyond nginx's 20 MB; the share page can be framed by any site; node policies ignored outside LangGraph; the production compose defaults `SEED_DEV_DATA` to `true`; the canvas re-renders on every streamed token and keyboard access is partial. The full list is on the [overview](/docs/agentcanvas/overview#current-status-and-limitations).

**Where does it fit next to DevFlow and Matura?**
[DevFlow](/docs/devflow/overview) builds the application; AgentCanvas builds the agents the application calls; [Matura](/docs/matura/overview) optionally provides sign-in, tenants, roles and audit to both. The only hard coupling is `AGENTCANVAS_AUTH_MODE=matura`, and it is optional: any OIDC provider works, and a single workstation needs no sign-in at all.
