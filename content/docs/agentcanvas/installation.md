---
title: Installation
description: Install AgentCanvas on a server with the production compose bundle, sign-in, a reverse proxy, TLS, backups and upgrades.
section: AgentCanvas
order: 3
updated: 2026-10-19
---

This page covers a production install on one host with Docker Compose. A Helm chart is also shipped with the licence for Kubernetes; the same environment variables apply. For a single-user trial use the [quickstart](/docs/agentcanvas/quickstart) instead.

## Requirements

| Item | Minimum | Notes |
|---|---|---|
| CPU / RAM | 2 vCPU, 4 GB for the stack | The Helm chart requests 500m CPU and 1 GiB per API replica (limit 2 GiB) and 64–256 MiB for web. Add what your model server needs if it runs on the same host. |
| Disk | 15 GB | The API image with every framework runtime is several GB. Postgres grows with checkpoints; the default retention deletes conversations idle for 90 days. |
| Docker | Engine 24+ with Compose v2 | `docker compose version` must work; the bundle uses `--wait` and `service_completed_successfully`. |
| Postgres | 16 with the `pgvector` extension | Bundled as `pgvector/pgvector:pg16`. An external Postgres 16 with pgvector works; set `DATABASE_URL` and skip the `postgres` service. |
| GPU | optional | AgentCanvas itself needs none. Local models run in your own Ollama, vLLM, LM Studio or llama.cpp server, reachable over the network. |
| Identity provider | any OpenID Connect provider | Required in `prod`: `AGENTCANVAS_AUTH_MODE=dev` is refused when `AGENTCANVAS_ENV` is `staging` or `prod`. [Matura](/docs/matura/overview) is an alternative. |
| Git | – | Inside the API image already; project workspaces are git repositories. |

## The compose bundle

Unpack `ownstack-agentcanvas-compose.zip` and sign in to the registry with your licence credentials:

```bash
unzip ownstack-agentcanvas-compose.zip -d agentcanvas && cd agentcanvas
docker login registry.ownstack.example
```

```
infra/
  compose.prod.yml        postgres, migrate (one-shot), api ×2, web
  compose.local.yml       single-user stack, no sign-in (quickstart)
  .env.prod.example       copy to .env.prod
  .env.local.example
  nginx.conf              the web image's site (reference only; it is baked into the image)
  scripts/backup.sh       pg_dump of the compose prod database
  scripts/restore.sh      restore and migrate
  helm/agentcanvas/       Kubernetes chart
  observability/          Grafana dashboard and Prometheus alert rules
```

`compose.prod.yml` starts: `postgres` (healthcheck `pg_isready -U agentcanvas`), `migrate` (`alembic upgrade head && python -m agentcanvas.db.app_role`, creates the ordinary role `agentcanvas_app` so row-level security applies), `api` with `API_REPLICAS` replicas (default 2, `stop_grace_period: 60s`), and `web` publishing `${WEB_PORT:-8080}:8080`. Volumes: `pgdata`, `workspaces`.

## Secrets

Copy the example and fill it in. Never commit the filled-in file.

```bash
cp infra/.env.prod.example infra/.env.prod
```

| Variable | Required | How to generate |
|---|---|---|
| `POSTGRES_PASSWORD` | yes | `openssl rand -hex 24`. The database owner; used only by `migrate`. |
| `POSTGRES_APP_PASSWORD` | yes | `openssl rand -hex 24`. The API's ordinary role `agentcanvas_app` (no superuser, no `BYPASSRLS`). |
| `AGENTCANVAS_SECRET_KEY` | yes | `openssl rand -hex 32` (64 characters). Production refuses the development default and anything under 32 characters. |
| `LANGGRAPH_AES_KEY` | recommended | `openssl rand -hex 16` (exactly 32 characters). Encrypts conversation checkpoints at rest. |
| `AGENTCANVAS_KMS_KEY` | optional | `file:/run/secrets/master.key`, `aws:<key ARN>` or `gcp:<key name>`. Master key that wraps each organisation's data key for project secrets. Empty derives it from `AGENTCANVAS_SECRET_KEY`. |
| `AGENTCANVAS_OIDC_ISSUER`, `AGENTCANVAS_OIDC_AUDIENCE`, `AGENTCANVAS_OIDC_CLIENT_ID` | yes in `oidc` mode | From your identity provider (below). |
| `AGENTCANVAS_BOOTSTRAP_ADMIN_EMAILS` | first install | JSON list, e.g. `["you@example.com"]`. These become admins on first sign-in. |
| `AGENTCANVAS_CORS_ORIGINS` | yes | JSON list with the public origin, e.g. `["https://agentcanvas.example.com"]`. |
| `API_IMAGE`, `WEB_IMAGE` | yes | Pin them: `registry.ownstack.example/agentcanvas/api:0.28.1`, `registry.ownstack.example/agentcanvas/web:0.28.1`. The compose default is `:latest`. |

Also decide `AGENTCANVAS_SEED_DEV_DATA` (compose defaults it to `true`, which creates the default organisation and project; fine for the first start, set `false` afterwards) and `AGENTCANVAS_SCRIPT_EXECUTION` (`subprocess` by default; `docker` for isolation, see [configuration](/docs/agentcanvas/configuration)).

## Sign-in

1. In your identity provider create a **public** client (authorization code with PKCE) with redirect URI `https://<your app>/auth/callback`, and enable refresh tokens (`offline_access`).
2. Make the access token carry an audience for the API, for example `agentcanvas-api` (on Keycloak: an *Audience* mapper on the client's dedicated scope).
3. Set in `.env.prod`:

```env
AGENTCANVAS_AUTH_MODE=oidc
AGENTCANVAS_OIDC_ISSUER=https://login.example.com/realms/acme
AGENTCANVAS_OIDC_AUDIENCE=agentcanvas-api
AGENTCANVAS_OIDC_CLIENT_ID=agentcanvas-web
AGENTCANVAS_BOOTSTRAP_ADMIN_EMAILS=["you@example.com"]
```

The web image adds the issuer's origin to the CSP `connect-src` automatically (`OIDC_ISSUER` is passed through in the compose file). If tokens come from a different host than the issuer, list it in `CSP_CONNECT_SRC`. For Matura-backed sign-in see [administration](/docs/agentcanvas/administration#matura-mode).

## Start

```bash
docker compose -f infra/compose.prod.yml --env-file infra/.env.prod pull
docker compose -f infra/compose.prod.yml --env-file infra/.env.prod up -d --wait
```

`up --wait` returns once nginx answers on 8080 and the API's `/healthz` passes. Check readiness from the host:

```bash
curl -s http://localhost:8080/api/readyz
# {"status":"ok"}
```

## Reverse proxy

Rules that follow from how the images are built:

- **One hostname per install, served at the root of its origin.** The web app has no base path support: the router has no basename, nginx falls back to `/index.html`, and the share page checks `location.pathname.startsWith("/s/")`. Do not mount AgentCanvas under `https://portal.example.com/agentcanvas/`.
- **Proxy the whole origin to the web container's port 8080.** Do not route `/api/` to the API container yourself; the web image's nginx strips the `/api` prefix, rate-limits public endpoints and sets security headers. The API's port 8000 is not published by either compose file.
- **Streaming.** Run streams and Copilot answers are Server-Sent Events over `POST`. Disable response buffering for `/api/` and allow long-lived responses (the built-in nginx uses one hour). No WebSockets are used.
- **Request size.** The web image sets `client_max_body_size 20m`; match or exceed it upstream for knowledge uploads.
- **Client addresses.** The web image believes `X-Forwarded-For` only from `TRUSTED_PROXIES` (default `127.0.0.1/32`). Set it to your proxy's address or range so rate limits and the audit log see real clients: add `TRUSTED_PROXIES=10.0.0.0/8` under the `web` service's `environment` in a compose override. The API trusts `FORWARDED_ALLOW_IPS="*"` because only nginx reaches it.
- **CORS.** `AGENTCANVAS_CORS_ORIGINS` must contain the public origin.
- **Framing.** The app sends `frame-ancestors 'self'` and `X-Frame-Options SAMEORIGIN` on every page except `/s/`. It cannot be embedded in another site's iframe; link to it instead.

### Caddy

```caddyfile
agentcanvas.example.com {
    reverse_proxy 127.0.0.1:8080 {
        flush_interval -1
        transport http {
            read_timeout 1h
        }
    }
    request_body {
        max_size 20MB
    }
}
```

Caddy terminates TLS automatically. Set `TRUSTED_PROXIES=127.0.0.1/32` (the default) when Caddy runs on the same host, or Caddy's address otherwise.

### nginx

```nginx
server {
    listen 443 ssl http2;
    server_name agentcanvas.example.com;
    ssl_certificate     /etc/letsencrypt/live/agentcanvas.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agentcanvas.example.com/privkey.pem;
    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 1h;
        proxy_send_timeout 1h;
    }
}
server {
    listen 80;
    server_name agentcanvas.example.com;
    return 301 https://$host$request_uri;
}
```

## TLS

Terminate TLS at the proxy. The web container speaks plain HTTP on 8080 and sets `X-Forwarded-Proto` for the API, which uvicorn honours (`--proxy-headers`). The OIDC redirect URI, `AGENTCANVAS_CORS_ORIGINS` and any `AGENTCANVAS_MATURA_*` URLs must use the `https://` origin.

## Persistence and backups

| Data | Where | Backup |
|---|---|---|
| Everything relational: workflows, versions, runs, checkpoints, memory, secrets (encrypted), audit log | `pgdata` volume | `infra/scripts/backup.sh [out-file]` runs `pg_dump --format=custom` through compose; `ENV_FILE` points at your `.env.prod`. Run it nightly. |
| Project workspaces (git repositories) | `workspaces` volume at `/data/workspaces` | `docker run --rm -v agentcanvas_workspaces:/w -v $PWD:/out alpine tar czf /out/workspaces.tgz -C /w .` |
| Master key, if `AGENTCANVAS_KMS_KEY=file:…` | the file you mounted | Back it up separately; without it project secrets cannot be decrypted. |

Restore with `infra/scripts/restore.sh <file.dump>`: it stops `web` and `api`, drops and recreates the database, runs `pg_restore`, then starts `migrate`, `api` and `web` so an older dump is migrated to the running version.

With managed Postgres, rely on its point-in-time recovery and keep the dump as a portable second copy.

## Upgrades

1. Read the [changelog](/changelog/agentcanvas) for the target version; security fixes are marked.
2. Take a backup.
3. Change `API_IMAGE` and `WEB_IMAGE` in `.env.prod` to the new tag.
4. `docker compose -f infra/compose.prod.yml --env-file infra/.env.prod pull`, then `up -d --wait`. The `migrate` service runs the new migrations before any replica starts; replicas stop taking runs, let running ones reach a step boundary and hand them to a replica that is up (`stop_grace_period: 60s`).

Paused runs on frameworks other than LangGraph live in a replica's memory and do not survive the replica's restart; those runs end with an error that says to start again.

## Uninstall

```bash
docker compose -f infra/compose.prod.yml --env-file infra/.env.prod down -v   # -v deletes pgdata and workspaces
docker rmi registry.ownstack.example/agentcanvas/api:0.28.1 registry.ownstack.example/agentcanvas/web:0.28.1
```

Also delete the OIDC client in your identity provider and, if used, the app registration in Matura. Deployment API keys and share links stop working as soon as the API is down.
