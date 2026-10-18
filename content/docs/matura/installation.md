---
title: Installation
description: A production install of Matura on Docker Compose: requirements, secrets, reverse proxy, TLS, persistence, upgrades and removal.
section: Matura
order: 3
updated: 2026-10-19
---

This page covers a single-host production install from the compose bundle. For Kubernetes, the Helm chart is published to the same registry as an OCI artifact; its values follow the same variables described here, and the notes in [Administration](/docs/matura/administration) on replicas apply.

## Requirements

| Item | Minimum | Notes |
|---|---|---|
| CPU, RAM | 2 vCPU, 4 GB | Keycloak requests 500m CPU / 1 GiB and may use 2 GiB; `maturad` runs in 128 MiB and is capped at 512 MiB; OpenFGA 128–512 MiB. |
| Disk | 10 GB | Postgres data. The audit log grows with every change; see retention. |
| Docker | Engine 24+, Compose v2 | `docker compose` (not `docker-compose`). |
| Postgres | 16 | Bundled, or bring your own 16. `maturad` needs two roles: an owner for migrations and a runtime role without `BYPASSRLS`. |
| Java | none | The Keycloak extension is already in the image. |
| GPU | none | Matura does not run models. |
| DNS | two hostnames | One for `maturad` (API and portal), one for Keycloak. The portal path `/portal` is fixed; sub-path hosting is not supported. |
| Outbound | SMTP | Invitation, verification and reset emails. Without SMTP, invitation links are returned by the API and shown once in the portal. |

## The bundle

`ownstack-matura-compose.zip` unpacks to:

```
compose.yaml           production stack: postgres, keycloak, openfga-migrate, openfga, maturad
compose.override.yaml  evaluation extras: Mailpit, published 8081, development secrets
init-db.sql            creates databases matura, keycloak, openfga and their roles
keycloak/realm/        matura-realm.json, imported on first start
.env.example           every variable with a comment
scripts/backup.sh      logical backup, verify, restore-test, restore
gateway/               Caddyfile and nginx.conf for the two hostnames
CHECKSUMS.txt
```

Images are pulled with your licence credentials; nothing is built locally.

```bash
docker login registry.ownstack.example -u <licensee-id>
docker compose pull
```

Service names, ports and healthchecks inside the stack:

| Service | Image | Published | Healthcheck |
|---|---|---|---|
| `postgres` | `postgres:16` | none | `pg_isready -U postgres`, every 2 s, 30 retries |
| `keycloak` | `registry.ownstack.example/matura/keycloak:<version>` | `8180:8180` | Keycloak's own, when `KC_HEALTH_ENABLED=true` |
| `openfga-migrate` | `openfga/openfga:v1.22.0` | none | runs `migrate` and exits |
| `openfga` | `openfga/openfga:v1.22.0` | `8081:8080` | started after `openfga-migrate` completes |
| `maturad` | `registry.ownstack.example/matura/maturad:<version>` | `8080:8080` | `GET /healthz/live` (204), `GET /healthz/ready` (204, or 503 when the database is unreachable) |

`maturad` starts after Postgres is healthy and OpenFGA has started. The metrics listener on 9090 is not published by the compose file; scrape it on the compose network or publish it to a private interface only.

## Secrets

Every value below must be changed from the evaluation defaults. Generate them once, put them in `.env`, and keep the KEK somewhere other than the database backups.

| Secret | Where | Generate |
|---|---|---|
| Postgres passwords for `matura_owner`, `matura_app`, `keycloak`, `openfga` | `init-db.sql` and the `*_DATABASE_URL`, `KC_DB_PASSWORD`, `OPENFGA_DATASTORE_URI` values | `openssl rand -hex 24` each |
| `MATURA_KEK` | `maturad` | `openssl rand -base64 32`. Required outside development. Encrypts app secrets, webhook signing keys, database-server passwords and SSO client secrets. Losing it makes those unreadable. |
| `MATURA_INTERNAL_TOKEN` | `maturad` and `keycloak` (same value) | `openssl rand -hex 32`. At least 32 characters; Keycloak's extension presents it on `/internal/v1/*`. |
| `MATURA_KEYCLOAK_CLIENT_SECRET` | `maturad` and `keycloak` (same value) | `openssl rand -hex 32`. The secret of the confidential client `matura-admin`, which `maturad` uses for sessions, MFA, SSO and SCIM provisioning. The realm import reads it from the environment. |
| `OPENFGA_AUTHN_PRESHARED_KEYS` / `MATURA_OPENFGA_TOKEN` | `openfga` and `maturad` (same value) | `openssl rand -hex 32` |
| `KC_BOOTSTRAP_ADMIN_USERNAME`, `KC_BOOTSTRAP_ADMIN_PASSWORD` | `keycloak` | A long password. Create a permanent admin after first sign-in and remove the bootstrap account. |
| `MATURA_SMTP_USER`, `MATURA_SMTP_PASSWORD` | `maturad` | From your mail provider. |

`init-db.sql` runs only when the `pgdata` volume is empty, so set the passwords before the first `up`.

## Production environment

The minimum `maturad` environment for a public install, with `matura.example.com` for the API and portal and `id.example.com` for Keycloak:

```env
MATURA_ENV=production
MATURA_AUTH=oidc
MATURA_HTTP_ADDR=:8080
MATURA_DATABASE_URL=postgres://matura_app:<pw>@postgres:5432/matura?sslmode=disable
MATURA_MIGRATE_DATABASE_URL=postgres://matura_owner:<pw>@postgres:5432/matura?sslmode=disable
MATURA_ISSUER=https://id.example.com/realms/matura
MATURA_JWKS_URL=http://keycloak:8180/realms/matura/protocol/openid-connect/certs
MATURA_KEYCLOAK_URL=http://keycloak:8180
MATURA_KEYCLOAK_CLIENT_SECRET=<secret>
MATURA_INTERNAL_TOKEN=<token>
MATURA_KEK=<base64>
MATURA_PUBLIC_URL=https://matura.example.com
MATURA_TRUSTED_PROXIES=172.16.0.0/12
MATURA_SMTP_ADDR=smtp.example.com:587
MATURA_SMTP_FROM=no-reply@example.com
MATURA_SMTP_USER=<user>
MATURA_SMTP_PASSWORD=<password>
MATURA_OPENFGA_URL=http://openfga:8080
MATURA_OPENFGA_TOKEN=<key>
```

And for `keycloak`:

```env
KC_HOSTNAME=https://id.example.com
KC_HTTP_ENABLED=true
KC_PROXY_HEADERS=xforwarded
KC_HTTP_PORT=8180
MATURA_URL=http://maturad:8080
MATURA_INTERNAL_TOKEN=<same token>
MATURA_KEYCLOAK_CLIENT_SECRET=<same secret>
MATURA_KEYCLOAK_SMTP_HOST=smtp.example.com
MATURA_KEYCLOAK_SMTP_PORT=587
MATURA_KEYCLOAK_SMTP_FROM=no-reply@example.com
```

`MATURA_ISSUER` is the URL the browser reaches, so it must be the public Keycloak origin. `MATURA_JWKS_URL` and `MATURA_KEYCLOAK_URL` may stay on the internal network. `maturad` refuses to start with `MATURA_AUTH=dev` unless `MATURA_ENV=development`, and refuses to start without `MATURA_KEK` outside development.

### Redirect URIs

The realm export only knows `localhost`. Before the first start, edit `keycloak/realm/matura-realm.json` so client `matura-console` has redirect URIs `https://matura.example.com/portal/*` and `https://matura.example.com/invitations/accept`, web origin `https://matura.example.com`, and post-logout redirect `https://matura.example.com/portal/*`. After the first import, change them in the Keycloak admin console instead; the import does not overwrite an existing realm.

## Reverse proxy

Rules that follow from the code:

- Proxy by hostname, at the root of the origin. `/portal/`, `/v1/`, `/admin/v1/`, `/invitations/`, `/trust`, `/scim/`, `/.well-known/` all go to `maturad:8080`. Do not rewrite paths.
- Keycloak gets its own hostname, proxied to `keycloak:8180`, with `X-Forwarded-*` headers (`KC_PROXY_HEADERS=xforwarded`).
- `maturad` uses plain request/response HTTP. No WebSocket or server-sent events are needed; `GET /v1/tenants/{tid}/audit/export` streams NDJSON, so do not buffer responses with a short timeout.
- Set `MATURA_TRUSTED_PROXIES` to the proxy's address or CIDR. Only then is `X-Forwarded-For` believed for IP allow-lists and the audit log's client address.
- The portal is same-origin with the API and needs no CORS. The CSP allows `connect-src` to self and the issuer origin only.
- `frame-ancestors 'none'` and `X-Frame-Options: DENY` are set by `maturad`; the portal cannot be embedded in a frame.

### Caddy

```caddyfile
matura.example.com {
    reverse_proxy maturad:8080
}

id.example.com {
    reverse_proxy keycloak:8180
}
```

Caddy terminates TLS with automatic certificates and forwards `X-Forwarded-For` and `X-Forwarded-Proto`.

### nginx

```nginx
server {
    listen 443 ssl http2;
    server_name matura.example.com;
    ssl_certificate     /etc/ssl/matura.crt;
    ssl_certificate_key /etc/ssl/matura.key;

    location / {
        proxy_pass http://maturad:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 300s;      # audit export streams
        proxy_buffering off;
    }
}

server {
    listen 443 ssl http2;
    server_name id.example.com;
    ssl_certificate     /etc/ssl/id.crt;
    ssl_certificate_key /etc/ssl/id.key;

    location / {
        proxy_pass http://keycloak:8180;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;
    }
}
```

## TLS

`maturad` and Keycloak do not terminate TLS; the proxy does. The readiness control `install-tls` passes when `MATURA_PUBLIC_URL` starts with `https://`. Webhook endpoints registered for apps must be `https://` outside development, and so must tenant SSO identity-provider URLs.

## Persistence and backups

The only volume is `pgdata`, holding the `matura`, `keycloak` and `openfga` databases. The realm JSON is bind-mounted read-only and only read on first start.

```bash
export MATURA_BACKUP_URL=postgres://postgres:<pw>@localhost:5432
scripts/backup.sh backup /backups/$(date +%F)
scripts/backup.sh restore-test /backups/2026-10-19 --report https://matura.example.com
```

Run `backup` daily and `restore-test` weekly. With `MATURA_TOKEN` set to an operator token, `--report` records the result as evidence for the `install-restore-test` control. The KEK is not in the dumps; back it up separately. Full procedure, including a real restore: [Administration](/docs/matura/administration).

## Upgrades

1. Read the release notes on the [changelog](/changelog); security fixes are marked.
2. Take a backup.
3. Change the image tags in `.env` and run `docker compose pull && docker compose up -d`.
4. `maturad` applies pending migrations at start-up under an advisory lock, then logs `migrations applied`. Keycloak upgrades its own schema.

Patch releases need nothing else. Minor releases may add migrations; major releases have an upgrade page. Do not downgrade `maturad` past a migration; restore the backup instead.

## Uninstall

```bash
docker compose down            # keeps pgdata
docker compose down -v         # also deletes every database
```

Revoke any SSO client secrets you registered with external identity providers and the SCIM tokens pasted into Okta or Entra, and remove the registry credentials with `docker logout registry.ownstack.example`.
