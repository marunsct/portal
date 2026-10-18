---
title: Troubleshooting
description: Symptoms you may meet running DevFlow, what causes each, and how to fix it.
section: DevFlow
order: 8
updated: 2026-10-19
---

Each entry is symptom, cause, fix. Start with `docker compose ps`,
`curl -s localhost:8000/api/health/ready` and `docker compose logs --tail 200 worker`;
most problems show up in one of those.

## The stack will not start

**`app` exits at once with `JWT_SECRET_KEY must be at least 32 characters` or `JWT_SECRET_KEY is not set`.**
Cause: `ENV=production` (or any non-development value, including a typo) and the secret
is missing or short. Fix: generate one with
`python3 -c "import secrets; print(secrets.token_hex(32))"` and put it in `.env`. Do not
work around it with `ENV=development` on a real deployment.

**`app` exits with `ADMIN_PASSWORD is not set`.**
Cause: first start of an empty database with no admin password. Fix: set
`ADMIN_PASSWORD` and start again. Once the admin account exists the variable is no
longer read; change the password with `manage reset-password admin`.

**`db` restarts in a loop; its log says a password is required.**
Cause: `POSTGRES_PASSWORD` empty. Fix: set it. If the data directory was already
initialised with a different password, either restore that password or remove
`./data/postgres` (which deletes every run and account).

**`Bind for 0.0.0.0:8000 failed: port is already allocated`.**
Cause: another process on the host uses 8000. Fix: set `APP_PORT=8080` (or any free
port) in `.env`; the container keeps listening on 8000 internally. Update the proxy.

**`worker` stays `starting` or `unhealthy`.**
Cause: the healthcheck is `celery inspect ping`, which needs Redis and about 40 seconds;
a worker that cannot reach Redis never answers. Fix: check `docker compose logs redis`
and `REDIS_URL`. Wait for the start period before judging.

## Model server

**`/api/health/models` reports the local provider unreachable; the worker logs `Connection refused` to `host.docker.internal`.**
Cause: the model server is not listening on the port, or it listens on `127.0.0.1` only
and cannot be reached from a container. Fix: start the server bound to `0.0.0.0` (LM
Studio: enable "serve on local network"; llama-server: `--host 0.0.0.0`), confirm with
`curl http://<host-ip>:<port>/v1/models` from another machine, and check the base URL
in Settings ends in `/v1`.

**The server answers 403 `Host 'host.docker.internal:9090' is not allowed`.**
Cause: some servers check the `Host` header against the address they were started with.
Fix: write the base URL as `http://localhost:<port>/v1`; DevFlow rewrites `localhost`
to the Docker host and sends the `Host` header the server expects.

**The run pauses as `waiting_for_budget` though `MAX_RUN_COST_USD` is empty; the worker logs `its model provider is out of quota`.**
Cause: a hosted provider refused for want of credit; DevFlow parks the run rather than
failing it. Fix: top up or switch provider in Settings, then **Resume**.

**Replies arrive empty, or the stage is retried with "reasoning"; the log shows replies that spent their whole output budget thinking.**
Cause: a reasoning model with a reply ceiling too small for its thinking. DevFlow retries
without reasoning automatically; if it keeps happening the run is slow. Fix: set
**Thinking** to "Do not think" for the build model, or raise **Longest reply**; for
local endpoints 0 removes the cap.

## Context window

**The run dies mid-stage with a context-length error from the server, or compaction never fires.**
Cause: `MODEL_CONTEXT_WINDOW` (or the window in Settings) is larger than what the
server actually loaded. Compaction is scheduled at 80% of the configured window, which
the model never reaches. Fix: press **Detect** in Settings, or set the window to the
server's real `n_ctx`; restart the run or rewind to the stage that failed.

**Startup log shows `WARNING: the protected tail, the reply and the framing do not fit in this window`.**
Cause: the window is too small for the derived budgets (8k is the minimum accepted).
Fix: raise the window on the server and in Settings, or lower `CTX_KEEP_MESSAGES` and
`SANDBOX_MAX_OUTPUT`.

## Runs

**Start returns 202 but the run fails at once with `Command execution is turned off (ALLOW_COMMAND_EXECUTION is not true)`.**
Cause: the worker cannot run commands, so it refuses before spending a model call.
Fix: `ALLOW_COMMAND_EXECUTION=true` and a `SANDBOX_EXECUTION_MODE`; restart the
worker; start again.

**Start fails with `N of N run slots are in use ... Wait for a slot, or raise MAX_CONCURRENT_RUNS`.**
Cause: the concurrency cap. Fix: wait, cancel a stale run, or raise the cap if your
model server really serves requests in parallel.

**After a restart or upgrade a run shows `running` but nothing happens.**
Cause: its worker died; the row was not updated. Fix: the next worker start recovers
it (`RECOVER_ORPHANS_ON_START=true`). By hand:
`docker compose exec app python -m app.server.manage recover-orphans`, then
`reconcile-runs`. Check `manage failed-tasks` for the reason.

## Interface and proxy

**The dashboard shows no live activity; the browser console shows the WebSocket failing on `/api/runs/<id>/events/stream`.**
Cause: the reverse proxy does not pass the `Upgrade` header, or closes idle connections
before the 20-second ping. Fix: add the `Upgrade`/`Connection` headers and a read
timeout above 20 s (nginx snippet in [Installation](/docs/devflow/installation)). The
page falls back to polling, so stages still advance.

**The interface loads at `https://example.com/devflow/` but every API call 404s.**
Cause: the interface calls `/api` relative to the origin root. Fix: give DevFlow its
own hostname; sub-path hosting is not supported.

**Embedding the interface in another page shows a blank frame.**
Cause: `X-Frame-Options: DENY`. Fix: link to it instead; framing is refused by design.

**Development settings refused in production: `ENV=dev` does not relax anything on the server.**
Cause: the relaxed values are exactly `dev`, `development`, `test`, `testing`; the
compose file defaults `ENV` to `production`, and an unknown value fails closed. Fix: do
not relax production; for a workstation use the development override file with the
documented values.

## Metrics and logs

**`/metrics` shows request counts but `stage_duration_seconds` and `run_total` stay empty.**
Cause: `PROMETHEUS_MULTIPROC_DIR` unset, so the worker's metrics never reach `app`.
Fix: keep it at `/app/data/prometheus`, mounted by both services.
