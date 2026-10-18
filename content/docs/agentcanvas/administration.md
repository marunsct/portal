---
title: Administration
description: Organisations, roles and accounts, security policy, monitoring, logs, retention, backups, tuning and scaling constraints.
section: AgentCanvas
order: 6
updated: 2026-10-19
---

## Organisations, projects and roles

An **organisation** owns people, projects, secrets, memory, policies, release gates and the audit log; organisations never see each other's data. A **project** groups workflows that share a workspace and secrets. Every install starts with one organisation and a *Default project*. In Matura mode, Matura **workspaces** additionally group projects (`GET /v1/workspaces`, `GET /v1/projects?workspace_id=…`, `PUT /v1/projects/{id}/workspace`); they only group, permissions stay per organisation.

| Role | Can |
|---|---|
| `viewer` | see workflows and runs, use the Copilot in Ask mode |
| `reviewer` | also answer approvals and questions in the Inbox |
| `builder` | also build, run, test, version and publish workflows, manage project secrets |
| `admin` | also manage members, policies, release gates, organisation settings, trace export, and read the audit log |

Buttons for actions a role cannot take are hidden; the API answers 403.

## Accounts

There is no local username and password store. Who a person is comes from the auth mode.

**`dev` mode** (single-user, `compose.local.yml`): every request is the seeded admin `usr_dev` / `dev@localhost` in the default organisation. Nothing to create. Refused when `AGENTCANVAS_ENV` is `staging` or `prod`.

**`oidc` mode**: create the person in your identity provider. The first admins are listed in `AGENTCANVAS_BOOTSTRAP_ADMIN_EMAILS` and become admins of the default organisation at their first sign-in. After that, admins invite from **Members** or through the API:

```bash
# invite (or change the role of) a member; the invitation takes effect at their first sign-in with that verified email
curl -X PUT https://agentcanvas.example.com/api/v1/org/members \
  -H "Authorization: Bearer <admin access token>" -H "Content-Type: application/json" \
  -d '{"email": "dana@example.com", "role": "builder"}'

curl https://agentcanvas.example.com/api/v1/org/members -H "Authorization: Bearer <token>"
curl -X DELETE https://agentcanvas.example.com/api/v1/org/members/<user_id> -H "Authorization: Bearer <token>"
```

An organisation can never be left without an admin who has signed in. A person invited to a second organisation sees a banner on Home and accepts with `POST /v1/me/invitations/{org_id}/accept`; `GET /v1/me` shows the current user, role and organisations.

**`matura` mode**: members and roles are managed in Matura's portal. The member and invitation endpoints answer 409 and the Members page is read-only with a link to the portal. Permissions map to roles: `canvas.read` → viewer, `inbox.review` → reviewer, `workflow.build` → builder, `org.admin` → admin; the highest role whose permissions the token carries in full applies. Members are not migrated between `oidc` and `matura` modes.

### Matura mode

1. Register AgentCanvas in Matura with the `matura/manifest.json` shipped in the bundle (four permissions, four starter roles). Matura creates the public client `agentcanvas`; add `https://<your app>/*` to its redirect URIs.
2. In Matura create an app secret and a webhook to `https://<your app>/api/v1/matura/events`.
3. Set `AGENTCANVAS_AUTH_MODE=matura`, `AGENTCANVAS_OIDC_ISSUER` (Matura's realm), `AGENTCANVAS_OIDC_AUDIENCE` and `AGENTCANVAS_OIDC_CLIENT_ID` (`agentcanvas`), `AGENTCANVAS_MATURA_URL`, `AGENTCANVAS_MATURA_CLIENT_SECRET`, `AGENTCANVAS_MATURA_WEBHOOK_SECRET`, `AGENTCANVAS_MATURA_PUBLIC_URL`.

Only Matura's **shared** data mode is supported; a token with `pmode` `schema` or `database` gets 503. In Matura mode the API refuses to start in `staging`/`prod` on a Postgres role that bypasses row-level security, which is why `compose.prod.yml` connects as `agentcanvas_app`. Behind PgBouncer in transaction pooling mode, startup options are not passed on: use session pooling or `ALTER ROLE agentcanvas_app SET agentcanvas.all_tenants = 'on'`. See [Matura](/docs/matura/overview).

## Security policy

- **Secrets** are project-scoped, encrypted with a per-organisation data key wrapped by the master key (`AGENTCANVAS_KMS_KEY`, or derived from `AGENTCANVAS_SECRET_KEY`). Names only ever leave the server; values are masked `***` in events and traces. A key typed straight into a setting fails validation (E050). Rotate the master key by setting the new `AGENTCANVAS_KMS_KEY`, keeping the old one in `AGENTCANVAS_KMS_PREVIOUS_KEYS`, and running `python -m agentcanvas.security.kms rewrap` inside an API container.
- **Checkpoints** are encrypted at rest when `LANGGRAPH_AES_KEY` (32 characters) is set.
- **Workspace code** runs where `AGENTCANVAS_SCRIPT_EXECUTION` says. `subprocess` applies time, memory and file limits and blocks network by default, but runs as the server's user on the server's filesystem. Use `docker` for code you do not trust. Every run passes the security gate first (E041, E042, E043, E080), including runs started by cron, webhooks, events and hand-over.
- **Local MCP servers** (`stdio`) start programs on the API host and are off by default (`AGENTCANVAS_ALLOW_LOCAL_MCP`).
- **Policies** (`/policies`, `GET/POST/PUT/DELETE /v1/org/policies`) are CEL rules enforced by the editor and at publish time. Presets: *Writes need approval* (`node.effects.all(e, e.effect != "external_write" || e.gated)`) and *Approved models in prod*. Names available: `node` (`type`, `config`, `effects`, `ungated`, `models`, `tools`), `resource`, `workflow`, `env`.
- **Release gates** per environment refuse a publish that scores below the bar; admin overrides need a reason and are audited.
- **Public endpoints** (deployment keys, webhook signatures, share links) are rate-limited per key, webhook, project and share visitor in the API, and per client address in nginx (20 r/s, burst 40).
- **Headers**: strict CSP (`script-src 'self'`, no eval, `frame-ancestors 'self'`), `X-Frame-Options SAMEORIGIN`, `nosniff`, `Referrer-Policy strict-origin-when-cross-origin`. Share pages under `/s/` allow any framing site; there is no allow-list for that yet.
- **Audit log** (`/audit`, `GET /v1/org/audit`): every change with who, what, when and the client address; approvals record a hash of what was approved. Security-relevant entries also go to the audit sink (`AGENTCANVAS_MATURA_AUDIT_URL`, best effort).

## Monitoring

| Endpoint | On | Meaning |
|---|---|---|
| `GET /healthz` | API `:8000`, also `/api/healthz` through web | Liveness: `{"status":"ok"}`. |
| `GET /readyz` | API, `/api/readyz` through web | Readiness: control database and run store answer within 2 s; 503 with `{"status":"draining"}` during shutdown. |
| `GET /metrics` | API only; the web image returns 404 on `/api/metrics` | Prometheus text format. Scrape the API container directly. |

Metric names: `agentcanvas_http_requests_total`, `agentcanvas_http_request_duration_seconds`, `agentcanvas_runs_started_total`, `agentcanvas_runs_finished_total`, `agentcanvas_run_duration_seconds`, `agentcanvas_tokens_total`, `agentcanvas_cost_usd_total`, `agentcanvas_model_cache_hits_total`, `agentcanvas_model_fallbacks_total`, `agentcanvas_cost_alerts_total`, `agentcanvas_eval_alerts_total`, `agentcanvas_threads_expired_total`.

`infra/observability/` in the bundle has a Grafana dashboard and Prometheus rules: `AgentCanvasHighErrorRate`, `AgentCanvasRunsFailing`, `AgentCanvasSlowRequests`, `AgentCanvasApiDown`, `AgentCanvasEvaluationDrift`, `AgentCanvasCostAlert`, `AgentCanvasModelFailover`.

Traces: `OTEL_EXPORTER_OTLP_ENDPOINT` for server-side OpenTelemetry; per project, **Setup → Send traces** exports every run as one trace (OpenTelemetry GenAI and OpenInference conventions) to Langfuse, Phoenix, Datadog or any OTLP/HTTP collector, in the background and dropped when the destination is down.

## Logs

The API logs structured JSON (`AGENTCANVAS_LOG_JSON=true` in the image) to stdout; every request carries the `X-Request-Id` nginx assigns. Cost alerts, dropped traces and refused startups are logged at warning or error.

```bash
docker compose -f infra/compose.prod.yml --env-file infra/.env.prod logs -f api
docker compose -f infra/compose.prod.yml --env-file infra/.env.prod logs --tail 200 web
```

Startup failures are explicit: `AGENTCANVAS_AUTH_MODE=dev gives every request admin rights…`, `AGENTCANVAS_SECRET_KEY is the development default or shorter than 32 characters…`, `the database role bypasses row-level security…`.

## Data retention

| Data | Rule | Setting |
|---|---|---|
| Conversations (threads, checkpoints, runs) | deleted `retention_days` after last activity; the hourly job counts `agentcanvas_threads_expired_total` | `AGENTCANVAS_RETENTION_DAYS` (90), per-organisation override `PUT /v1/org/settings {"retention_days": n}` |
| Audit log | rows older than `audit_retention_days` deleted | `AGENTCANVAS_AUDIT_RETENTION_DAYS` (400) |
| Long-term memory | kept unless `memory_retention_days` > 0 | `AGENTCANVAS_MEMORY_RETENTION_DAYS` (0) |
| One end user's memories | erase the namespace on the **Memory** page or `DELETE /v1/memory/namespaces` | – |
| Model answer cache | in process memory, 1,000 entries per project, gone on restart | per block, *Reuse answers for (s)* |

## Backups and restore

Nightly: `ENV_FILE=infra/.env.prod infra/scripts/backup.sh /backups/agentcanvas-$(date -u +%F).dump` (a `pg_dump --format=custom --no-owner` through compose), plus a tar of the `workspaces` volume and a copy of the master key file if you use one. Restore: `infra/scripts/restore.sh <file.dump>` stops `web` and `api`, recreates the database, restores, and starts `migrate`, `api`, `web` so an older dump is migrated. Details in [installation](/docs/agentcanvas/installation#persistence-and-backups).

## Resource tuning

- **Database connections.** Each API process keeps `AGENTCANVAS_DB_POOL_SIZE` (10) control connections plus up to `AGENTCANVAS_DB_MAX_OVERFLOW` (20) more, and `AGENTCANVAS_PERSISTENCE_POOL_SIZE` (20) for checkpoints and the store. Size Postgres `max_connections` for replicas × 50 plus headroom.
- **Memory.** Helm requests 1 GiB per API replica with a 2 GiB limit; the web container needs 64–256 MiB. Knowledge search runs in memory (up to 50,000 chunks per knowledge base), the answer cache holds 1,000 entries per project, and paused non-LangGraph runs are held in memory.
- **Run limits.** Set per-workflow budgets (tokens, USD, seconds, per run and per thread; day and month in USD with alerts) so a loop cannot run away; the recursion limit (50 by default) bounds steps per run.
- **Shutdown.** `AGENTCANVAS_DRAIN_GRACE_S` (20) must stay below the orchestrator's grace period (compose `stop_grace_period: 60s`; uvicorn gives streams 30 s).
- **Uploads.** nginx allows 20 MB bodies; knowledge upload is 20 files × 20 MB.

## Scaling and single-replica constraints

The API is stateless for LangGraph workflows: `API_REPLICAS=2` (or more) share Postgres and the `workspaces` volume, nginx balances across them, cron fires once per minute however many replicas run, and a replica that shuts down hands running runs to another at a step boundary (`/readyz` returns 503 while draining).

What does not scale out yet:

- **Paused runs of workflows on CrewAI, Google ADK, Pydantic AI, Agno, the Microsoft Agent Framework, Strands, LlamaIndex, Mastra and the OpenAI Agents SDK** live in one API process's memory. With two replicas an approval may be answered on the wrong one. Use `API_REPLICAS=1` when such workflows pause for people. A replica restart ends those runs with an error that says to start again.
- A fresh run on a thread is guarded in-process only, so two replicas can start runs on one thread at the same time.
- One framework worker process per framework per API process serves all its runs; it starts on first use (a few seconds) and is restarted if it dies.
- Workspace saves run git and ruff synchronously; knowledge indexing is per server.

Workspaces must be on a volume every replica mounts (`/data/workspaces`); on Kubernetes that means a `ReadWriteMany` volume or a single replica.
