---
title: Installation
description: Production installation of DevFlow with a reverse proxy, TLS, persistence, backups and upgrades.
section: DevFlow
order: 3
updated: 2026-10-19
---

This page covers a production-shaped install on one host. For a first look, the
[Quickstart](/docs/devflow/quickstart) is shorter.

## Requirements

| Item | Minimum | Notes |
|---|---|---|
| Docker | Engine 24+, Compose v2 | The bundle uses `deploy.resources.limits`, healthcheck conditions and `extra_hosts: host-gateway`. |
| CPU | 4 cores for the stack | The compose file caps `app` at 2 CPUs and `worker` at 2 CPUs. |
| RAM | 12 GB for the stack | Limits as shipped: `db` 1 GB, `redis` 768 MB, `app` 2 GB, `worker` 8 GB. The worker's limit is the real ceiling for sandboxed commands; JavaScript test runners fork one process per CPU. |
| Disk | 20 GB to start | The image carries every language toolchain plus Chromium. Each run's workspace holds a full project with `node_modules` or a virtualenv; transcripts grow to hundreds of MB over tens of runs. |
| Postgres | 15 | Shipped as `postgres:15-alpine` in the bundle. An external Postgres 15+ works through `DB_URL` and `AUTH_DB_URL`. |
| Redis | 7 | Shipped; AOF enabled, 512 MB, `noeviction`. |
| GPU | none in the stack | The model server runs outside the compose stack, on the host or on your network. DevFlow never loads a model itself. |
| Model server | OpenAI-compatible chat completions | LM Studio, Ollama, llama.cpp, vLLM, or a hosted provider. Tool calling required. |

Nothing in the stack runs as root. The `app` and `worker` processes run as `appuser`.

## The compose bundle

`ownstack-devflow-<version>-compose.zip` unpacks to:

```
compose.yaml            the production stack: db, redis, app, worker (minio commented out)
compose.override.yaml   development conveniences; not used in production
.env.example            every variable with a comment
scripts/                backup, restore, create-user helpers
gateway/                Caddy and nginx snippets
CHECKSUMS.txt
```

Pull the images with your licence credentials rather than building them:

```bash
docker login registry.ownstack.example -u <licensee-id>
docker compose pull
```

The `app` and `worker` services use the same image,
`registry.ownstack.example/devflow/app:<version>`. The worker overrides the command to
`celery -A app.server.tasks worker --loglevel=info --concurrency=${CELERY_CONCURRENCY:-2} --max-tasks-per-child=50`.

## Secrets

Three values are required. The components, not compose, enforce them, so `docker compose
config` works without them but the stack will not start.

| Variable | Generate with | Enforced by |
|---|---|---|
| `JWT_SECRET_KEY` | `python3 -c "import secrets; print(secrets.token_hex(32))"` | `app` and `worker` at start; must be 32+ characters unless `ENV` is `development`. |
| `ADMIN_PASSWORD` | your password manager | Database initialisation on first start; seeds the `admin` account once and never overwrites it. |
| `POSTGRES_PASSWORD` | `openssl rand -base64 24` | The Postgres image refuses to initialise without it. |

Strongly recommended:

| Variable | Why |
|---|---|
| `SETTINGS_ENCRYPTION_KEY` | Encrypts provider API keys entered in Settings. Without it the key is derived from `JWT_SECRET_KEY`, so rotating the JWT secret makes stored credentials unreadable until re-entered. Generate like the JWT key. |
| `METRICS_SCRAPE_TOKEN` | Bearer token Prometheus presents to `/metrics`. Empty leaves the endpoint unauthenticated. |
| `MINIO_ROOT_PASSWORD` | Only if you enable the object store. `openssl rand -base64 24`. |

Keep `ENV=production`. Any other value than `dev`, `development`, `test` or `testing`
is treated as production; a misspelt value fails closed rather than relaxing the rules.

## Command execution

Decide this before the first run; a run is refused before its first model call when the
worker cannot run commands.

```env
ALLOW_COMMAND_EXECUTION=true
SANDBOX_EXECUTION_MODE=in-container     # or: container
# DOCKER_SOCKET=/var/run/docker.sock    # only for container mode
```

- `in-container`: commands run inside the worker as the unprivileged user, in the run's
  workspace, under rlimits (`SANDBOX_MEMORY_LIMIT`, `SANDBOX_CPU_LIMIT`,
  `SANDBOX_PIDS_LIMIT`). The host is not exposed. A command can reach what the worker
  reaches, including other runs' workspaces.
- `container`: one throwaway container per command. Strongest containment of the
  command, but it needs the Docker socket mounted into the worker, and that socket is
  root-equivalent on the host. Use it only on a dedicated worker node.

## Reverse proxy

DevFlow serves its interface and API from one origin on port 8000. The interface calls
`/api` with relative URLs and opens its WebSocket on `window.location.host`, so:

- Give it a hostname of its own (`devflow.example.com`), proxied to the root of the
  origin. Sub-path hosting (`example.com/devflow/`) is not supported.
- Pass WebSocket upgrades on `/api/runs/*/events/stream`. The server pings every 20
  seconds; set proxy read timeouts above that. A polling fallback exists at
  `GET /api/runs/{id}/events?since=N` but the dashboard uses the socket.
- Allow long requests: `GET /api/runs/{id}/handover` streams a zip, and uploads are
  up to 5 MB per document and 200 MB per codebase archive
  (`client_max_body_size` in nginx).
- Set `TRUSTED_PROXIES` to the proxy's CIDR so `X-Forwarded-For` is honoured for rate
  limiting. Without it every request counts against the proxy's address, and the
  default budget of 300 requests per 60 seconds is shared by all users.
- Leave `ALLOWED_ORIGINS` empty. It is only needed when the interface is served from
  a different origin than the API, which the bundle does not do. If you set it, list
  exact origins; credentials are enabled only with an explicit list.

The application adds `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: no-referrer` and `Cross-Origin-Opener-Policy: same-origin` itself. It
cannot be embedded in an iframe.

### Caddy

```caddyfile
devflow.example.com {
	encode gzip
	request_body {
		max_size 256MB
	}
	reverse_proxy devflow-app:8000 {
		transport http {
			read_timeout 600s
		}
	}
}
```

Caddy proxies WebSocket upgrades without extra configuration and provisions TLS from
Let's Encrypt for the hostname.

### nginx

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 443 ssl http2;
    server_name devflow.example.com;

    ssl_certificate     /etc/ssl/devflow.pem;
    ssl_certificate_key /etc/ssl/devflow.key;

    client_max_body_size 256m;

    location / {
        proxy_pass http://devflow-app:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
    }

    location /metrics {
        allow 10.0.0.0/8;
        deny all;
        proxy_pass http://devflow-app:8000;
    }
}
```

With a proxy in front, remove the published port or bind it to loopback in
`compose.yaml`: `ports: ["127.0.0.1:${APP_PORT:-8000}:8000"]`.

## TLS

Terminate TLS at the proxy. The application speaks plain HTTP on 8000 and never
redirects or builds absolute URLs, so it does not need to know the external scheme; the
interface uses `wss://` automatically when the page is served over HTTPS. The compose
network between the services is
unencrypted by design; keep it on one host or on a private network. If you enable
MinIO, `OBJECT_STORE_SECURE=false` is correct inside the compose network.

## Persistence and backup

| Data | Where | Backup |
|---|---|---|
| Postgres (runs, users, audit log, settings, encrypted keys, checkpoints) | bind mount `${PGDATA_DIR:-./data/postgres}` | `docker compose exec db pg_dump -U postgres langchain > devflow-$(date +%F).sql` |
| Workspaces, transcripts, ledger, journal, uploads, Prometheus files | named volume `appdata` at `/app/data` | `docker run --rm -v devflow_appdata:/v -v $PWD:/b alpine tar czf /b/appdata-$(date +%F).tgz -C /v .` |
| Redis (queue and event history) | named volume `redisdata` | Not needed; it is rebuilt. In-flight runs resume from Postgres checkpoints. |
| `.env` | the bundle directory | Back it up with the database: the settings table's encrypted keys are useless without `SETTINGS_ENCRYPTION_KEY`. |

The database is a bind-mounted directory, not a named volume, so `docker compose down -v`
cannot remove it. Set `PGDATA_DIR` to put it on a different disk.

Restore: stop the stack, restore `./data/postgres` or load the SQL dump into an empty
database, restore the `appdata` tarball into the volume, start the stack. Run
`docker compose exec app python -m app.server.manage reconcile-runs --dry-run` to see
any run row that disagrees with its checkpoint, then without `--dry-run` to fix it.

Disk grows with runs. Reclaim it with the two reporting commands, each with a flag to
delete what it reports:

```bash
docker compose exec worker python -m app.server.manage workspaces --older-than-days 30
docker compose exec worker python -m app.server.manage workspaces --older-than-days 30 --delete
docker compose exec worker python -m app.server.manage checkpoints --older-than-days 30 --delete
```

Transcripts under `/app/data/transcripts` are the evidence of what every run did; delete
a run through the API (`DELETE /api/runs/{id}`) to remove its transcript with it, or set
`RUN_DELETE_KEEPS_RECORDS=true` to keep transcript, ledger and journal as an audit trail.

## Upgrades

1. Read the [changelog](/changelog) entry; security fixes are marked.
2. Finish or pause live runs. A deploy restarts the worker; orphan recovery resumes any
   `running` run afterwards, but you lose the stage in progress.
3. `docker compose pull && docker compose up -d app worker`.
4. Schema changes run at start-up; there is no separate migration command.
5. `curl -s localhost:8000/api/health/ready` and check `docker compose ps`.

Downgrading is not supported across a release that changed the schema; restore the
database backup taken before the upgrade instead.

## Uninstall

```bash
docker compose down -v          # containers, redisdata and appdata volumes
rm -rf ./data/postgres          # the database, deliberately not removed by -v
docker rmi registry.ownstack.example/devflow/app:<version>
```

Remove the proxy site and the DNS record, and revoke the registry token from the
support page if the host is being retired.
