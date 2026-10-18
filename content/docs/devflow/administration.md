---
title: Administration
description: Accounts, roles and tenants, security policy, monitoring, logs, retention, backups and resource tuning for a DevFlow deployment.
section: DevFlow
order: 6
updated: 2026-10-19
---

## Accounts, roles and tenants

DevFlow keeps its own accounts in Postgres. There is no user-management screen; every
account operation is a command run inside the `app` container, on purpose: a password
reset should need access to the host, not a session.

```bash
docker compose exec app python -m app.server.manage create-user alice --role operator
docker compose exec app python -m app.server.manage create-user bob --role viewer --tenant acme
docker compose exec app python -m app.server.manage reset-password alice
docker compose exec app python -m app.server.manage set-role alice admin
docker compose exec app python -m app.server.manage disable-user bob
docker compose exec app python -m app.server.manage enable-user bob
docker compose exec app python -m app.server.manage list-users
```

`--password` sets a password; omitted, one is generated and printed once. Roles are
`admin`, `operator` and `viewer`; the default for `create-user` is `operator`.

| Role | Runs | Reviews and approvals | Settings | Scope |
|---|---|---|---|---|
| `viewer` | read, steer | no | read | own tenant |
| `operator` | create, start, pause, resume, rewind, clone, cancel, delete | yes | read | own tenant |
| `admin` | all | yes | write; model profiles; `/api/health/models` | every tenant |

**Tenants.** Every account belongs to a tenant (`default` unless `--tenant` says
otherwise). Runs, uploads and workspaces are stored per tenant
(`DATA_DIR/workspaces/<tenant>/`), and a non-admin user sees only their tenant's runs.
Tenants are a label on the account; there is no tenant object to create. Admins see
all tenants.

**The admin account.** `init_db` seeds `admin` with `ADMIN_PASSWORD` on the first start
of an empty database and never touches it again. Changing `ADMIN_PASSWORD` in `.env`
later does nothing; use `reset-password admin`. Keep `admin` for configuration and give
people operator accounts.

Every account action, sign-in, run creation, review, settings change and deletion is
written to the `audit_log` table with actor, tenant, action, subject, outcome and
detail. Read it with SQL:

```bash
docker compose exec db psql -U postgres -d langchain -c \
  "SELECT occurred_at, actor, action, subject, outcome FROM audit_log ORDER BY occurred_at DESC LIMIT 50"
```

Provider API keys never appear in the audit log or in any API response.

## Security policy

- **Secrets.** `JWT_SECRET_KEY`, `ADMIN_PASSWORD` and `POSTGRES_PASSWORD` are mandatory
  in production. Set `SETTINGS_ENCRYPTION_KEY` so provider credentials saved from
  Settings do not depend on the JWT secret. Rotate the JWT secret to invalidate every
  session at once.
- **Lock configuration.** `SETTINGS_READ_ONLY=true` makes the API refuse provider and
  credential changes, so the model configuration comes only from `.env`.
  `ALLOWED_MODEL_HOSTS` limits which hosts a base URL may name, so a settings change
  cannot redirect model traffic and its keys elsewhere.
- **Command execution.** Off by default. `in-container` keeps the host out of reach;
  `container` needs the Docker socket, which is root on the host. Run workers that
  mount the socket on dedicated nodes. Commands are argv lists with no shell, must be
  on the role's allowlist, cannot start servers or run `python -c`-style interpreter
  escapes, and run under memory, CPU, process and file-size limits.
- **Egress.** Agents may reach package registries, documentation hosts and configured
  MCP servers from the worker. Turn each off (`PACKAGE_LOOKUP_ENABLED`,
  `DOCS_LOOKUP_ENABLED`, `HARNESS_MCP_SERVERS` empty) if the worker must not talk to
  the internet. Codebase seeding clones over HTTPS from public hosts only unless
  `SEED_ALLOWED_SCHEMES` and `SEED_ALLOW_PRIVATE_HOSTS` widen it.
- **Headers.** The API sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: no-referrer` and `Cross-Origin-Opener-Policy: same-origin`. The
  interface cannot be framed.
- **Rate limiting.** 300 requests per caller per minute (`RATE_LIMIT_*`) and five
  failed sign-ins per five minutes (`LOGIN_*`), keyed by address; set
  `TRUSTED_PROXIES` so the address is the client's, not the proxy's.
- **Metrics.** Put a token on `/metrics` (`METRICS_SCRAPE_TOKEN`) or keep the path
  off the public proxy.

## Monitoring

| Endpoint | Auth | Use |
|---|---|---|
| `GET /api/health` | none | Liveness. `{"status":"ok"}` when the process is up. The container healthcheck. |
| `GET /api/health/ready` | none | Readiness: `db`, `redis`, `celery` each `ok` or `error`, and `runs.in_flight` / `runs.limit`. 503 when any dependency is down. A full worker is reported, not treated as failure. |
| `GET /api/health/models` | admin | Status of every configured model provider. Makes a real model call, so do not poll it. |
| `GET /metrics` | `Authorization: Bearer $METRICS_SCRAPE_TOKEN` if set | Prometheus text format. |

Metrics include the standard HTTP request series from the FastAPI instrumentator and
DevFlow's own: `run_total`, `stage_duration_seconds{stage}`, `defects_resolved_total`,
`defects_failed_total`. The worker records stage and defect metrics; `app` serves them
because both mount `/app/data/prometheus` (`PROMETHEUS_MULTIPROC_DIR`). If that
variable is cleared, `/metrics` shows only what the API process itself counts.

A Prometheus scrape job:

```yaml
scrape_configs:
  - job_name: devflow
    static_configs:
      - targets: ["devflow-app:8000"]
    authorization:
      credentials: "<METRICS_SCRAPE_TOKEN>"
```

Container healthchecks as shipped: `db` runs `pg_isready` every 10 s; `redis` runs
`redis-cli ping`; `app` curls `http://127.0.0.1:8000/api/health` every 30 s; `worker`
runs `celery -A app.server.tasks inspect ping` every 30 s with a 40 s start period.
`docker compose ps` is the quickest overall check.

## Logs

Both services log JSON lines to stdout with timestamp, level, logger, message and a
correlation id. Every API response carries `X-Correlation-ID`; pass one in to tie a
request to its log lines. Worker lines carry `[run stage]` so a run can be followed:

```bash
docker compose logs -f --tail 200 worker
docker compose logs worker | grep run-3f2a
```

`ACCESS_LOG_LEVEL=WARNING` quietens the request log. A deploy wipes `docker logs`, so
ship them to your log collector.

Beyond the service logs, each run keeps its own evidence under `/app/data`:

| Path | Contents |
|---|---|
| `transcripts/<run>.jsonl` | Every model request and response, tool call and result, post-middleware. The record of what the agents were told and said. |
| `ledger/` | Every command run: argv, directory, category, exit code, duration, who ran it. |
| `journal/` | Oversized tool output and compaction scratch; ages out after `CTX_JOURNAL_RETENTION_HOURS`. |

The run's own event history is at `GET /api/runs/{id}/logs?limit=500&offset=0`.

If a worker dies mid-run the run row may still say `running`. The worker's next start
recovers it (`RECOVER_ORPHANS_ON_START=true`); to do it by hand:

```bash
docker compose exec app python -m app.server.manage recover-orphans --dry-run
docker compose exec app python -m app.server.manage recover-orphans
docker compose exec app python -m app.server.manage reconcile-runs
docker compose exec app python -m app.server.manage failed-tasks --limit 20
```

`failed-tasks` lists tasks that died permanently from the dead-letter list; `--clear`
forgets them once dealt with.

## Data retention

Nothing ages out on its own except the journal and the context store (72 hours by
default). Runs, workspaces, checkpoints and transcripts are kept until a run is deleted
through the API or the interface, or until you reclaim space:

```bash
docker compose exec worker python -m app.server.manage workspaces --older-than-days 30
docker compose exec worker python -m app.server.manage checkpoints --older-than-days 30
```

Each reports size, age and run status for finished runs older than the threshold;
add `--delete` to remove them. Deleting a run removes its row, workspace, checkpoints,
events, uploads no other run shares, transcript, ledger, journal entries and object-store
copies, and keeps the audit line naming who deleted it. `RUN_DELETE_KEEPS_RECORDS=true`
keeps the transcript, ledger and journal for an audit trail.

Transcripts are the evidence of what every agent did. In a regulated environment keep
them and set the retention flag; elsewhere expect roughly 5 to 10 MB per run.

## Backups and restore

See [Installation](/docs/devflow/installation#persistence-and-backup) for what lives
where. In short: `pg_dump` the `langchain` database, tar the `appdata` volume, keep
`.env` with them. Restore in the reverse order with the stack stopped, then run
`reconcile-runs`. Redis needs no backup.

## Resource tuning

| Setting | Default | When to change |
|---|---|---|
| `worker` memory limit (compose) | 8 GB | JavaScript test runners fork one process per CPU, each allowed `SANDBOX_MEMORY_LIMIT`. The container limit is the real ceiling; a run killed with `WorkerLostError: signal 9` hit it. |
| `SANDBOX_MEMORY_LIMIT` | 1 GB | Lower it if several test workers must fit; raise it for a single heavy build. |
| `CELERY_CONCURRENCY` | 2 | Runs this worker executes at once. Against a single-slot model server, 1 is honest. |
| `MAX_CONCURRENT_RUNS` | unlimited | Global cap across workers; set it to the number of requests your model server serves in parallel. |
| `HARNESS_MAX_PARALLEL` | 6 | Agents of one run at once in parallel mode. Only useful with a multi-slot server. |
| `WEB_CONCURRENCY` | 4 | gunicorn workers. Each dashboard viewer holds a WebSocket; raise for many viewers. |
| `MODEL_REQUEST_TIMEOUT_SECONDS` | 1800 | A slow local model on a long reply can take minutes; lower it only if your server is fast. |
| `CELERY_TASK_TIME_LIMIT` | 43500 s | A whole run is one task. Lower only to reclaim a wedged worker sooner. |

Disk: budget for the image, the database, and per run a project with its dependencies
plus the transcript. Chromium is cached in the image and not copied per run.

## Scaling and single-replica constraints

- **One `app`, one `worker` per host is the tested shape.** Several workers can share
  one Postgres and Redis; the shared `appdata` volume must then be a shared filesystem,
  or `OBJECT_STORE_BUCKET` must be set so a worker on another node can fetch the
  documents the API received. The workspace itself always stays on the worker's
  filesystem.
- **Postgres is the single checkpoint store.** Keep `CHECKPOINTER_TYPE=postgres`; the
  API reads what the worker writes.
- **Runs are bound to one worker process** for their whole life. If that process dies,
  orphan recovery resumes the run on any worker from the last checkpoint, losing the
  stage in progress.
- **The model server is the bottleneck.** A server that answers one request at a time
  makes every form of parallelism queue. Measure before raising concurrency.
- **Prometheus multiprocess metrics** depend on the shared directory; with several
  hosts, scrape each `app` separately.
