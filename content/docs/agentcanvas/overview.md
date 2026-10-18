---
title: AgentCanvas overview
description: What AgentCanvas is, who it is for, how it is built, and where it stands today.
section: AgentCanvas
order: 1
updated: 2026-10-19
---

## What it is

AgentCanvas is a self-hosted visual builder for AI agents and agentic workflows. You draw a workflow on a canvas: AI steps, agents, routers, tools, MCP servers, approvals, memory and safety checks, wired together through typed ports. The backend compiles that drawing into a real, readable project for the agent framework the workflow is designed for, then runs, debugs, tests, evaluates, versions and publishes it from the same screen.

The design rule that shapes everything else: **there is no hidden runtime.** The canvas is stored as a JSON document (the workflow IR). The IR is validated (about 70 rules), compiled to framework-native code you can read on the **Code** tab, and exported as a standalone project. What you export is what runs.

AgentCanvas ships as container images from the Ownstack registry and runs on your own hardware. Models can be anything: hosted providers, or Ollama, LM Studio, vLLM and llama.cpp on your own machines.

## Who it is for

- **Engineers who want framework-native code, not a proprietary engine.** A workflow targets LangGraph (the default), the OpenAI Agents SDK, CrewAI, Google ADK, Pydantic AI, Agno, the Microsoft Agent Framework, Strands, LlamaIndex or Mastra (TypeScript), and exports as an idiomatic project for that framework.
- **Teams that need the production half:** durable runs with approvals, an evaluation studio with release gates, versions and per-environment deployments, audit logs, organisation policies and roles.
- **Privacy-sensitive deployments.** Five local model backends are in the catalog, the Copilot can be pinned to local models, knowledge bases have an offline embedder, and nothing leaves the host unless you configure a hosted provider or a trace exporter.

## Vocabulary

| Term | Meaning |
|---|---|
| Organisation | Owns everything: people, projects, secrets, memory, policies, audit log. Organisations never see each other's data. |
| Project | Groups workflows that share a **workspace** (a git repository of Python code) and **secrets**. Every install starts with a *Default project*. |
| Workflow | One graph on the canvas. Has a draft, frozen **versions**, and **deployments** that serve a version behind an API key. |
| State and channels | One shared state passes from step to step; each named channel has a JSON Schema type, a reducer (`replace`, `append`, `add_messages`, `sum`, `merge`), an io mode and a storage mode. |
| Step | A node that does work: *Ask AI*, *AI Agent*, *Planning Agent*, *Choose a path*, *Run Python code*, *Ask for approval*, and so on. |
| Resource | Something steps use: a chat model, a tool, an MCP server, middleware, a memory backend. Drawn as dashed boxes and wired into typed ports. |
| Run and thread | A run executes a workflow once and may pause and resume. A thread is a conversation: consecutive runs on one thread keep their state. Every step boundary is a checkpoint. |
| Framework | The agent framework a workflow is designed for and exported to. Badges and P001–P006 diagnostics say where a workflow can run. |
| Deployment | A published version in one environment (`prod`, `staging`, `dev`, …) with its own API key. Every deployment is also an MCP server and an A2A agent. |
| Release gate | A minimum evaluation score required before a version can be published to an environment. |
| Policy | A CEL rule an organisation admin writes; enforced in the editor and at publish time. |
| Workspace | The project's git repository: `scripts/`, `tools/`, custom widgets, event handlers, `sandbox.json`. |

## Architecture

| Service | Image | Role |
|---|---|---|
| `web` | `registry.ownstack.example/agentcanvas/web:<version>` | nginx (unprivileged, port 8080) serving the React single-page app and proxying `/api/` to the API with the prefix stripped. Sends a strict Content-Security-Policy and rate-limits public endpoints. |
| `api` | `registry.ownstack.example/agentcanvas/api:<version>` | FastAPI on uvicorn, port 8000. Control plane, run engine, code generation, Copilot, evaluation jobs, retention, hand-over. Stateless; two replicas in the production compose file. |
| `migrate` | same as `api` | One-shot: `alembic upgrade head`, then creates the API's ordinary database role (production compose only). |
| `postgres` | `pgvector/pgvector:pg16` | Control tables, LangGraph checkpoints and store, memory vectors, audit log. Row-level security on 35 tables. |
| `workspaces` volume | – | One git repository per project, mounted at `/data/workspaces` and shared by API replicas. |

```
 browser ──HTTPS──▶ your reverse proxy ──▶ web (nginx :8080)
                                             │  /           → SPA (index.html)
                                             │  /s/<token>  → public share page
                                             │  /widget.js  → chat widget loader
                                             └─ /api/…  ───▶ api (uvicorn :8000)  /v1/…  /healthz  /readyz  /metrics
                                                                 │
                                                  ┌──────────────┼──────────────────┐
                                                  ▼              ▼                  ▼
                                            postgres 16     /data/workspaces    framework workers
                                            + pgvector      (git per project)   (CrewAI, ADK, …, Node for Mastra)
                                                                                    │ model bridge
                                                  ◀─────── model providers ◀────────┘
                                         (Ollama / LM Studio / vLLM / llama.cpp / hosted APIs)
```

Communication is JSON REST under `/v1/…` with RFC 9457 `problem+json` errors. Run streams are **Server-Sent Events over POST**; the web image's nginx turns buffering off and allows one-hour read timeouts on `/api/`. Framework workers other than LangGraph are subprocesses that speak JSON lines and route model calls back through a local model bridge, so traces, costs and approvals work the same for every framework.

Non-LangGraph frameworks run in their own Python environments inside the API image (or Node.js for Mastra). The image built with every framework is several gigabytes; `FRAMEWORKS=none` builds a LangGraph-and-OpenAI-Agents-SDK-only image.

## How it fits with DevFlow and Matura

- **[DevFlow](/docs/devflow/overview)** builds software from a brief. AgentCanvas builds the agents that software calls. Both reach the same model server, and a DevFlow-generated service can call an AgentCanvas deployment over its REST, MCP or A2A endpoint.
- **[Matura](/docs/matura/overview)** is the optional identity and tenancy layer. With `AGENTCANVAS_AUTH_MODE=matura`, an AgentCanvas organisation is a Matura tenant, roles come from Matura, members are managed in Matura's portal, and Postgres row-level security enforces the tenant boundary. Without Matura, AgentCanvas works with any OpenID Connect provider, or with no sign-in on a single workstation.

## Current status and limitations

Version 0.28.1 (2026-10-18). The product moves fast: 36 release lines since the first MVP in early October 2026. The following come from the project's own handover and review notes and are worth knowing before you evaluate.

- **Framework fidelity is uneven.** Only LangGraph runs every block. Strands, LlamaIndex, the Microsoft Agent Framework, Pydantic AI, Agno and Mastra run on AgentCanvas's own "superstep" flow engine rather than the framework's native graph. Node policies (retry, timeout, error route) are ignored without a warning outside LangGraph. Mastra prompt templates use Nunjucks and differ from Jinja in places.
- **Paused runs on non-LangGraph frameworks live in one API process's memory.** Run `API_REPLICAS=1` for those until paused state moves to the database. Flow engines run parallel branches one after another.
- **The `subprocess` sandbox is limits only, not isolation.** It is the production default. Use `AGENTCANVAS_SCRIPT_EXECUTION=docker` for code you do not trust. Workers inherit the server environment and have no run timeout.
- **No request body size limit in the API** beyond nginx's `client_max_body_size 20m`.
- **No sub-path hosting.** The web app assumes it is the root of its origin. Give it its own hostname. The strict CSP (`frame-ancestors 'self'`) means the app cannot be embedded in another site's iframe; only `/s/<token>` share pages allow framing.
- **Members are not migrated between `oidc` and `matura` modes.**
- **Known web-app gaps:** hand-written response types, canvas re-renders on every streamed token, partial keyboard access.
- The production compose file defaults to `AGENTCANVAS_SEED_DEV_DATA=true` and `AGENTCANVAS_EDITION=dev`; set them deliberately.

The [troubleshooting](/docs/agentcanvas/troubleshooting) page lists the symptoms each of these produces. Start with the [quickstart](/docs/agentcanvas/quickstart) to see it run, then the [installation](/docs/agentcanvas/installation) page for a server.
