---
title: Configuration
description: Every environment variable of the API and web images, grouped, with defaults, plus the settings that live in the UI.
section: AgentCanvas
order: 4
updated: 2026-10-19
---

The API reads its settings from the environment (or a `.env` file in its working directory). Most names carry the prefix `AGENTCANVAS_`; the exceptions are called out. List values are JSON (`'["https://a.example"]'`). Booleans accept `true`/`false`.

## Core

| Variable | Default | Meaning |
|---|---|---|
| `DATABASE_URL` (no prefix) | `sqlite+aiosqlite:///./agentcanvas.db` | SQLAlchemy URL of the control database. Use `postgresql://user:pass@host:5432/agentcanvas` on a server. In `compose.prod.yml` the API connects as `agentcanvas_app`, an ordinary role, so row-level security applies. |
| `AGENTCANVAS_ENV` | `dev` | `dev`, `test`, `staging` or `prod`. `staging` and `prod` refuse `AUTH_MODE=dev`, weak secret keys, and hide the interactive API docs (`/docs`). |
| `AGENTCANVAS_EDITION` | `dev` | `dev` (self-hosted) or `hosted` (multi-tenant service). `hosted` refuses blocks that run code on the server (E041) and requires a `docker` or `langsmith` sandbox. Keep `dev` for a licensed install. |
| `AGENTCANVAS_SECRET_KEY` | `dev-only-change-me` | Signs sessions and derives the secrets master key when `KMS_KEY` is empty. 64+ random characters in production; under 32 or the default is refused in `staging`/`prod`. |
| `AGENTCANVAS_AUTO_MIGRATE` | `true` | Run `alembic upgrade head` on start. `compose.prod.yml` sets `false` and runs the `migrate` service once instead. |
| `AGENTCANVAS_SEED_DEV_DATA` | `true` | Create the default organisation, project and (in `dev` auth mode) the admin user when missing. |
| `AGENTCANVAS_PERSISTENCE_URL` | unset (= control DB) | Separate location for LangGraph checkpoints and store. `memory` is ephemeral and for tests only. |
| `AGENTCANVAS_PERSISTENCE_POOL_SIZE` | `20` | Checkpoint and store connections per API process. |
| `AGENTCANVAS_DB_POOL_SIZE` / `AGENTCANVAS_DB_MAX_OVERFLOW` | `10` / `20` | Control-database connections kept open per process, and how many more may be opened. |
| `AGENTCANVAS_WORKSPACES_DIR` | `./workspaces` (image: `/data/workspaces`) | One git repository per project. Must be shared by every API replica. |
| `AGENTCANVAS_RECURSION_LIMIT` | `50` | Default maximum number of steps per run; a workflow can set its own. |
| `AGENTCANVAS_CORS_ORIGINS` | `["http://localhost:5173"]` | JSON list of browser origins allowed to call the API. Set to the public origin. |
| `AGENTCANVAS_ADAPTERS` | all ten | Comma-separated framework adapter ids the server offers: `langchain,openai_agents,crewai,google_adk,pydantic_ai,agno,microsoft_agent_framework,strands,llamaindex,mastra`. |
| `AGENTCANVAS_IN_DOCKER` | `1` in the image | Tells setup hints to name `docker` commands instead of `make` targets. |
| `AGENTCANVAS_MASTRA_DIR` | `/opt/mastra` in the image | Where Mastra and its Node.js live. |
| `AGENTCANVAS_NODE` | `node` on PATH | Node.js 22.18+ for Mastra workflows, if not on PATH. |
| `AGENTCANVAS_CREWAI_PYTHON` | `.frameworks/crewai/bin/python` | Python interpreter of the CrewAI environment. |
| `FORWARDED_ALLOW_IPS` (no prefix) | `127.0.0.1` (compose: `*`) | Proxies whose `X-Forwarded-*` headers uvicorn trusts. `*` is safe in the compose network because only the web container reaches the API. |

## Models and LLM providers

| Variable | Default | Meaning |
|---|---|---|
| `AGENTCANVAS_LOCAL_MODELS_HOST` | unset (compose: `host.docker.internal`) | Replaces `localhost` in the default address of local providers (Ollama `:11434`, LM Studio `:1234/v1`, vLLM `:8000/v1`, llama.cpp `:8080/v1`) so the container reaches a model server on the host or on a named GPU machine. |
| `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `AZURE_OPENAI_API_KEY`, `GOOGLE_API_KEY`, `MISTRAL_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `XAI_API_KEY`, `OPENAI_COMPATIBLE_API_KEY` (no prefix) | unset | Server-wide provider keys. A project secret of the same name takes precedence; the first-run screen stores keys as project secrets, so these are optional. |
| `AZURE_OPENAI_ENDPOINT`, `OPENAI_API_VERSION` | unset | Needed by `azure_openai:<deployment>` models when not set on the block. |
| `LANGSMITH_TRACING`, `LANGSMITH_API_KEY`, `LANGSMITH_ENDPOINT` | `false`, unset | LangSmith tracing; also the credentials of the `langsmith` sandbox and of dataset sync. |

Model ids are written `provider:model`, for example `ollama:llama3.3`, `lmstudio:<loaded model>`, `vllm:<served name>`, `openai_compatible:<model>` (needs a Base URL on the block, diagnostic E017).

## Authentication

| Variable | Default | Meaning |
|---|---|---|
| `AGENTCANVAS_AUTH_MODE` | `dev` | `dev` (no sign-in, every request is the seeded admin; refused in `staging`/`prod`), `oidc` (bearer JWTs from any OpenID Connect provider) or `matura`. |
| `AGENTCANVAS_OIDC_ISSUER` | unset | The token's `iss`, e.g. `https://login.example.com/realms/acme`. Required for `oidc` and `matura`. |
| `AGENTCANVAS_OIDC_AUDIENCE` | unset | The `aud` the API accepts. Required for `oidc` and `matura`. |
| `AGENTCANVAS_OIDC_CLIENT_ID` | unset | Public SPA client id, handed to the browser by `GET /v1/auth/config`. |
| `AGENTCANVAS_OIDC_JWKS_URL` | from discovery | Override the JWKS location. |
| `AGENTCANVAS_OIDC_SCOPES` | `openid profile email offline_access` | Scopes the SPA requests; `offline_access` enables silent refresh. |
| `AGENTCANVAS_OIDC_EMAIL_CLAIM` | `email` | Claim that carries the email. |
| `AGENTCANVAS_OIDC_TRUST_EMAIL` | `false` | Treat the email as verified when the provider sends no `email_verified`. Only for IdPs that own the domain. |
| `AGENTCANVAS_OIDC_JWKS_CACHE_S` / `AGENTCANVAS_OIDC_LEEWAY_S` | `3600` / `30` | Key cache lifetime and tolerated clock skew. |
| `AGENTCANVAS_BOOTSTRAP_ADMIN_EMAILS` | `[]` | Emails that become admins of the default organisation on first sign-in. |
| `AGENTCANVAS_MATURA_URL` | unset | Matura's API; with `MATURA_CLIENT_SECRET` the change feed is read at start and every `MATURA_SYNC_INTERVAL_S` (3600). |
| `AGENTCANVAS_MATURA_APP` | `agentcanvas` | The app slug registered in Matura. |
| `AGENTCANVAS_MATURA_CLIENT_SECRET` | unset | App secret for the change feed. Required when `MATURA_URL` is set. |
| `AGENTCANVAS_MATURA_WEBHOOK_SECRET` | unset | Verifies `POST /v1/matura/events`. |
| `AGENTCANVAS_MATURA_PUBLIC_URL` / `AGENTCANVAS_MATURA_PORTAL_URL` | unset | Where people reach Matura; portal links default to `<public URL>/portal/`. |
| `AGENTCANVAS_MATURA_AUDIT_URL` | unset | Where security-relevant audit entries are POSTed as signed CloudEvents. Placeholder until Matura has an audit ingest API. |

## Execution and sandbox

| Variable | Default | Meaning |
|---|---|---|
| `AGENTCANVAS_SCRIPT_EXECUTION` | `inprocess` (compose: `subprocess`) | Where workspace code (scripts, Python tools, custom widgets, event handlers) runs: `inprocess`, `subprocess` (time, memory and file limits, no network by default, but the server's user and filesystem: not an isolation boundary), `docker` (a container per run from `SANDBOX_IMAGE`; needs the Docker socket), `langsmith` (LangSmith Sandbox). |
| `AGENTCANVAS_SANDBOX_IMAGE` | `python:3.12-slim` | Image for the `docker` sandbox. |
| `AGENTCANVAS_LANGSMITH_SNAPSHOT`, `AGENTCANVAS_LANGSMITH_SANDBOX_ENDPOINT`, `AGENTCANVAS_LANGSMITH_IDLE_S` | unset, unset, `600` | LangSmith sandbox options. |
| `AGENTCANVAS_ALLOW_LOCAL_MCP` | `false` | Allow `stdio` MCP servers that start a program (`npx`, `uvx`) on the API host. Off, such blocks fail validation with E042 and **Browse tools** returns 403. The API image contains `uv` but no Node.js runtime for `npx` outside `/opt/mastra`. |
| `AGENTCANVAS_RATE_LIMIT_PER_DEPLOYMENT` | `120` | Public API requests per minute per deployment key, counted across replicas. `0` disables. |
| `AGENTCANVAS_RATE_LIMIT_PER_WEBHOOK` | `120` | Per webhook trigger. |
| `AGENTCANVAS_RATE_LIMIT_PER_PROJECT` | `600` | Per project over all its deployments and webhooks. |
| `AGENTCANVAS_RATE_LIMIT_PER_SHARE_CLIENT` | `30` | Per visitor address on one share link. |
| `AGENTCANVAS_RATE_LIMIT_BY_ENVIRONMENT` | `{}` | JSON object overriding the per-deployment limit per environment, e.g. `{"dev": 30}`. |
| `AGENTCANVAS_DRAIN_GRACE_S` | `20` | On shutdown, seconds running runs get to reach a step boundary before hand-over. Keep below the orchestrator's grace period (compose: 60 s). |
| `AGENTCANVAS_HANDOVER_INTERVAL_S` / `AGENTCANVAS_ORPHAN_AFTER_S` | `10` / `60` | How often instances look for runs to continue, and after how long a run whose instance went quiet is handed over. |

The web image's nginx adds its own limit on public endpoints: 20 requests/s per client address with bursts of 40, then 429.

## Storage and retention

| Variable | Default | Meaning |
|---|---|---|
| `AGENTCANVAS_RETENTION_DAYS` | `90` | Conversations (threads, checkpoints, runs) are deleted this long after their last activity. `0` keeps them. An organisation can override it in the UI. |
| `AGENTCANVAS_RETENTION_INTERVAL_S` | `3600` | How often the retention job runs. |
| `AGENTCANVAS_AUDIT_RETENTION_DAYS` | `400` | Audit-log rows older than this are deleted. `0` keeps them. |
| `AGENTCANVAS_MEMORY_RETENTION_DAYS` | `0` | Long-term memories not updated for this long are deleted; `0` keeps them. |
| `LANGGRAPH_AES_KEY` (no prefix) | unset | Exactly 32 characters: checkpoints encrypted at rest. |
| `AGENTCANVAS_KMS_KEY` | empty (derived from the secret key) | `file:<path>`, `aws:<key ARN>` or `gcp:<key name>`: master key that wraps each organisation's data key. |
| `AGENTCANVAS_KMS_PREVIOUS_KEYS` | `[]` | Old master keys that still unwrap, during rotation. |
| `AGENTCANVAS_KNOWLEDGE_DIR` | unset | Used by exported CrewAI, ADK and Mastra projects to find knowledge-base JSONL files. |

## Observability

| Variable | Default | Meaning |
|---|---|---|
| `AGENTCANVAS_LOG_JSON` | `false` (image: `true`) | Structured JSON logs. |
| `AGENTCANVAS_METRICS_ENABLED` | `true` | Prometheus at `GET /metrics` on the API (the web image answers 404 on `/api/metrics`, so scrape the API directly). |
| `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT`, `OTEL_SERVICE_NAME` (no prefix) | unset, `agentcanvas-api` | OpenTelemetry traces for FastAPI, SQLAlchemy and httpx. |

## Web image

| Variable | Default | Meaning |
|---|---|---|
| `API_UPSTREAM` | `http://api:8000` | Where nginx proxies `/api/` (prefix stripped). |
| `TRUSTED_PROXIES` | `127.0.0.1/32` | Address or range whose `X-Forwarded-For` is believed. Set to your ingress or load balancer. |
| `OIDC_ISSUER` | unset | Its origin is added to the CSP `connect-src`. `compose.prod.yml` passes `AGENTCANVAS_OIDC_ISSUER` through. |
| `CSP_CONNECT_SRC` | origin of `OIDC_ISSUER` | Extra origins for the CSP `connect-src`, space-separated. |

## Compose-level variables

`WEB_PORT` (local 7777, prod 8080), `WEB_BIND` (local only, `127.0.0.1`), `POSTGRES_PASSWORD`, `POSTGRES_APP_PASSWORD` (prod), `POSTGRES_IMAGE`, `API_IMAGE`, `WEB_IMAGE`, `API_REPLICAS` (prod, default 2; use 1 when workflows on frameworks other than LangGraph pause for people), `FRAMEWORKS` and `WITH_MASTRA` (build arguments; irrelevant when pulling pre-built images).

## Settings in the UI

| Where | Setting | Scope |
|---|---|---|
| **Setup** (`/setup`) | Default model, provider key, server address, **Test connection** | project |
| **Setup → AI Copilot** | On/off, *Use the workflow's model* or a separate `provider:model`, *Model for questions*, **Private** (local models only), token limit per chat | project (`GET/PUT /v1/projects/{id}/copilot-settings`) |
| **Setup → Send traces to your observability tool** | Langfuse, Arize Phoenix, Datadog or any OTLP/HTTP endpoint; include or exclude inputs and outputs | project (`/v1/projects/{id}/trace-export`) |
| **Workspace → Secrets** | Named, encrypted values; names only ever leave the server | project |
| **Workspace → Sandbox policy** | `sandbox.json`: time and memory limits, outbound allow-list, injected headers | project |
| Workflow panel (click empty canvas) | Name, recursion limit, durability (`exit`, `async`, `sync`), per-run and per-thread budgets, day/month budgets and alert percentages, state channels, **Framework**, `trace_redact` | workflow |
| **Policies** (`/policies`) | CEL rules with scope, match, require, severity, environments | organisation |
| Organisation settings (`PUT /v1/org/settings`) | `retention_days` override (0–3650, `0` forever) | organisation |
| **Evaluate → Release gates** | Minimum scores and maximum pass-rate drop per environment | workflow |
