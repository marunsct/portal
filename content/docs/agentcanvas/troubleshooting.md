---
title: Troubleshooting
description: Symptoms you are likely to meet, what causes them in the code, and the fix.
section: AgentCanvas
order: 8
updated: 2026-10-19
---

Each entry is symptom → cause → fix. Paths in log lines are from the API container; the web container is nginx. Times in logs are UTC.

## Startup and install

**The API container exits with `AGENTCANVAS_AUTH_MODE=dev gives every request admin rights…`**
Cause: `AGENTCANVAS_ENV` is `staging` or `prod` (the production compose default) while the auth mode is still `dev`. The check in `security/auth.py` refuses to start.
Fix: set `AGENTCANVAS_AUTH_MODE=oidc` (or `matura`) with `AGENTCANVAS_OIDC_ISSUER` and `AGENTCANVAS_OIDC_AUDIENCE`. For a single-user box use `compose.local.yml`, which sets `AGENTCANVAS_ENV=dev`.

**`AGENTCANVAS_SECRET_KEY is the development default or shorter than 32 characters`**
Cause: production refuses the default key and anything under 32 characters.
Fix: `openssl rand -hex 32` into `.env.prod`. Changing the key after secrets exist breaks their decryption unless `AGENTCANVAS_KMS_KEY` is a separate master key; rotate with `AGENTCANVAS_KMS_PREVIOUS_KEYS` and `python -m agentcanvas.security.kms rewrap`.

**`the database role bypasses row-level security`** at startup in Matura mode
Cause: the API connects as the Postgres superuser (the official image's `POSTGRES_USER`) in `staging`/`prod`.
Fix: use the production compose file, which runs `python -m agentcanvas.db.app_role` in the `migrate` service and connects the API as `agentcanvas_app` with `POSTGRES_APP_PASSWORD`. With an external database, create an ordinary role without `SUPERUSER` or `BYPASSRLS` and run migrations as the owner with `AGENTCANVAS_AUTO_MIGRATE=false`.

**`port is already allocated` on 7777 or 8080**
Cause: another process holds the host port.
Fix: `WEB_PORT=7778` in `.env.local` or `.env.prod`. The API's 8000 is never published, so a vLLM server on host port 8000 does not collide with it; it collides only when you run the API from source.

## Models

**Test connection to Ollama or LM Studio fails with a connection error**
Cause: inside the container `localhost` is the container itself. Default local addresses are rewritten with `AGENTCANVAS_LOCAL_MODELS_HOST` (`host.docker.internal` in compose); on Linux the `extra_hosts` mapping to `host-gateway` does that. The model server may also be bound to `127.0.0.1` only, which `host.docker.internal` cannot reach.
Fix: start the server (`ollama serve`) and bind it to all interfaces (`OLLAMA_HOST=0.0.0.0` for Ollama; the server toggle in LM Studio). For a GPU box elsewhere set `AGENTCANVAS_LOCAL_MODELS_HOST=gpu-box` or the block's Base URL. Make the first request from inside the container: `docker compose exec api python -c "import urllib.request;print(urllib.request.urlopen('http://host.docker.internal:11434').read())"`.

**`model 'openai_compatible:…' needs a base URL`, diagnostic E017**
Cause: the `openai_compatible` provider has no default address (`base_url_required` in the provider catalog).
Fix: set **Base URL** on the AI model block, e.g. `https://openrouter.ai/api/v1`, and a key secret if the gateway needs one (`OPENAI_COMPATIBLE_API_KEY`).

**The run stops with a context-length or `maximum context` error from the model server**
Cause: a long `messages` history or a large knowledge passage exceeds the local model's context window; AgentCanvas does not truncate for you.
Fix: add the **Summarisation** agent add-on (`mw.*`) or a channel with `storage: delta`, lower `top_k` on **Search knowledge**, reduce the Planning Agent's notes, or raise the server's context size (`num_ctx` in Ollama, `--max-model-len` in vLLM).

**`stopped after 50 steps without reaching END (GraphRecursionError)`**
Cause: a cycle with no exit, or an agent that keeps calling tools.
Fix: add a router exit, a call-limit add-on, or raise the recursion limit in the workflow panel. Budgets (`budget exceeded: … USD for this workflow this day`) stop runs the same way; check **Spending**.

## Proxy, browser and network

**Runs show nothing until they finish; Copilot answers arrive all at once**
Cause: a proxy in front of the web container buffers responses. Run streams are Server-Sent Events over `POST` on `/api/v1/…/runs/stream`.
Fix: disable buffering and raise read timeouts for the whole origin (Caddy `flush_interval -1`, nginx `proxy_buffering off; proxy_read_timeout 1h`), and make sure nothing between (a CDN, an API gateway) re-buffers. No WebSocket upgrade is needed.

**The app loads at `https://portal.example.com/agentcanvas/` but every route is blank or 404**
Cause: no sub-path support. The SPA router has no basename, the bundle references `/assets/…`, nginx falls back to `/index.html`, and the share page checks `location.pathname.startsWith("/s/")`.
Fix: serve AgentCanvas on its own hostname at the root of the origin.

**Embedding the app in an iframe shows a blank frame; the console says the request was blocked by `frame-ancestors`**
Cause: the app sends `Content-Security-Policy: … frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` on every page except `/s/`.
Fix: link to the app instead of framing it. Share pages (`/s/<token>`) and the `widget.js` chat button are the supported embeds.

**Sign-in page loads, then the browser console shows CSP `connect-src` violations**
Cause: the identity provider's token endpoint is on a host the CSP does not list. `connect-src` allows `'self'` plus the origin of `OIDC_ISSUER`.
Fix: set `CSP_CONNECT_SRC="https://login.example.com https://tokens.example.com"` on the web container.

**Browser calls fail with CORS errors after moving to a new hostname**
Cause: `AGENTCANVAS_CORS_ORIGINS` (default `["http://localhost:5173"]`) does not include the public origin.
Fix: `AGENTCANVAS_CORS_ORIGINS='["https://agentcanvas.example.com"]'` on the API and restart. Unrelated but often mistaken for it: `/api/metrics` returns 404 by design; scrape the API container's `:8000/metrics` directly.

**Every public API call comes from the same address in the audit log; one client exhausts the rate limit for everyone**
Cause: the web image believes `X-Forwarded-For` only from `TRUSTED_PROXIES` (`127.0.0.1/32`), so behind a load balancer all callers look like the balancer.
Fix: `TRUSTED_PROXIES=<load balancer CIDR>` on the web container.

**429 `Too many requests` on a deployment**
Cause: per-deployment (120/min), per-project (600/min), per-webhook (120/min) or per-share-visitor (30/min) limits, or nginx's 20 r/s per address.
Fix: honour `Retry-After`; raise `AGENTCANVAS_RATE_LIMIT_PER_*`, or `AGENTCANVAS_RATE_LIMIT_BY_ENVIRONMENT='{"prod": 600}'`.

## Editor and runs

**`E042` on an App connector, or **Browse tools** returns 403 `local (stdio) MCP servers are disabled`**
Cause: the connector starts a program (`uvx`, `npx`) on the API host and `AGENTCANVAS_ALLOW_LOCAL_MCP` is `false`.
Fix: prefer an HTTP connector. If you need stdio servers, set `AGENTCANVAS_ALLOW_LOCAL_MCP=true`; the image has `uv`/`uvx` but no system Node.js, so `npx`-based connectors need a custom image or a remote MCP server.

**A workflow's run stops with *… is not installed on this server*, or the Framework setting says *not set up*; P001/P006 in Problems**
Cause: the API image was pulled without that framework's runtime, or `AGENTCANVAS_ADAPTERS` leaves it out.
Fix: pull the full image variant from the registry (the default `api` tag includes every framework); check `GET /api/v1/frameworks` for `ready` and `setup`. Workflows can still be designed and exported without the runtime.

**An approval answered in the Inbox does nothing, or the run says the pause was already decided (non-LangGraph workflow)**
Cause: paused runs on CrewAI, ADK, Pydantic AI, Agno, the Microsoft Agent Framework, Strands, LlamaIndex, Mastra and the OpenAI Agents SDK live in one API process's memory; with two replicas the answer may land on the other one, and a replica restart loses the pause.
Fix: `API_REPLICAS=1` for those workflows; after a restart, start the run again.

**Saving a workflow reports a conflict (409)**
Cause: optimistic concurrency with `ETag`/`If-Match`: someone else saved first.
Fix: the editor re-applies your queued edits on the latest version and tells you when they no longer fit. Through the API, `GET` the workflow, take the new `ETag`, retry.

**Memory recall by meaning returns poor matches; migrations fail on `vector`**
Cause: semantic memory search needs Postgres with pgvector; an external Postgres without the extension cannot create the vector columns. SQLite (only when the API runs outside the images) has no row-level security either.
Fix: use the bundled `pgvector/pgvector:pg16` image, or run `CREATE EXTENSION vector;` as a superuser on your external Postgres 16 before the first `migrate`.
