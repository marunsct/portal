---
title: Configuration
description: Every environment variable maturad, Keycloak and the CLI read, with defaults and meaning, plus the settings tenants change at runtime.
section: Matura
order: 4
updated: 2026-10-19
---

`maturad` reads its configuration from the environment once, at start-up, and validates it before opening any port. A bad value stops the process with a one-line reason. There is no configuration file.

## Core

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_ENV` | `production` | `development`, `staging` or `production`. Only `development` allows `MATURA_AUTH=dev`, plain-`http://` webhook and identity-provider URLs, and a missing `MATURA_KEK`. The readiness control `install-production` fails on `development`. |
| `MATURA_HTTP_ADDR` | `:8080` | Listener for the API, the portal and every public page. |
| `MATURA_DATABASE_URL` | required | Postgres URL for the runtime role (`matura_app`), which must not have `BYPASSRLS`. If the URL does not set `pool_max_conns`, `maturad` adds nine connections above pgx's default so the background leaders cannot starve requests. |
| `MATURA_MIGRATE_DATABASE_URL` | unset | Owner-role URL. When set, migrations run at start-up and table privileges are granted to `MATURA_RUNTIME_ROLE`. Leave it unset on replicas that must never migrate. |
| `MATURA_RUNTIME_ROLE` | `matura_app` | The role that receives table privileges after migrations. |
| `MATURA_PUBLIC_URL` | `http://localhost:8080` | The origin people reach `maturad` on. Used for invitation links, the OAuth protected-resource metadata and the `install-tls` control. |
| `MATURA_INVITE_ACCEPT_URL` | `<MATURA_PUBLIC_URL>/invitations/accept` | Page invitation links open. Set it only if you host your own accept page. |
| `MATURA_EVENT_SOURCE` | `matura://installation/main` | CloudEvents `source` on every event this installation emits. |
| `MATURA_TENANT_DELETE_GRACE` | `720h` | How long a deleted tenant can be restored before the purger removes it. A Go duration; `0` purges at the next pass. |
| `MATURA_TRUSTED_PROXIES` | unset | Comma-separated addresses or CIDRs. `X-Forwarded-For` is believed only from these, for IP allow-lists and the audit log. |
| `MATURA_PRODUCT_NAME` | `Matura` | Name shown on the trust page, in readiness reports and in the portal's `config.json`. |

## Authentication and Keycloak

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_AUTH` | `oidc` | `oidc` verifies bearer JWTs. `dev` trusts `X-Matura-Dev-User`, `-Email`, `-Name`, `-Operator`, `-Kind`, `-Act` and `-Session` headers and needs `MATURA_ENV=development`. |
| `MATURA_ISSUER` | required for `oidc` | The realm URL as the browser sees it, e.g. `https://id.example.com/realms/matura`. Tokens must carry it as `iss`; the portal signs in against it; its origin is added to the CSP. |
| `MATURA_JWKS_URL` | `<MATURA_ISSUER>/protocol/openid-connect/certs` | Where `maturad` fetches signing keys. Point it at the internal Keycloak address when the public one is not reachable from the container. |
| `MATURA_AUDIENCE` | `matura-api` | The `aud` claim `maturad` accepts on its own API. |
| `MATURA_OPERATOR_ROLE` | `matura-operator` | Realm role that grants operator scope (`/admin/v1`). |
| `MATURA_KEYCLOAK_URL` | derived from `MATURA_ISSUER` | Base URL `maturad` calls for the admin API. Use the internal address. |
| `MATURA_KEYCLOAK_CLIENT_ID` | `matura-admin` | Confidential client whose service account manages the realm. |
| `MATURA_KEYCLOAK_CLIENT_SECRET` | unset | Its secret. Unset: session, MFA, SSO and SCIM-provisioning endpoints answer `503`, agents cannot be created, and erasure cannot delete Keycloak accounts. Needs `MATURA_ISSUER`. |
| `MATURA_INTERNAL_TOKEN` | unset | Shared with the Keycloak extension for `POST /internal/v1/token-context`. At least 32 characters. Unset: the `/internal/v1` routes are off and app tokens carry no tenant claims. |
| `MATURA_PORTAL_CLIENT_ID` | `matura-console` | Public PKCE client the portal and the accept page use. |

Keycloak container variables set by the bundle:

| Variable | Meaning |
|---|---|
| `MATURA_URL` | Where the extension reaches `maturad` (`http://maturad:8080`). |
| `MATURA_INTERNAL_TOKEN`, `MATURA_KEYCLOAK_CLIENT_SECRET` | Same values as `maturad`; the realm import substitutes the client secret. |
| `MATURA_KEYCLOAK_SMTP_HOST`, `_PORT`, `_FROM` | The realm's SMTP server for verification and reset emails. Defaults `mailpit`, `1025`, `no-reply@matura.local`. |
| `KC_HOSTNAME`, `KC_HTTP_PORT`, `KC_DB`, `KC_DB_URL`, `KC_DB_USERNAME`, `KC_DB_PASSWORD`, `KC_BOOTSTRAP_ADMIN_USERNAME`, `KC_BOOTSTRAP_ADMIN_PASSWORD` | Standard Keycloak settings. The bundle uses port `8180`. |

## Secrets and encryption

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_KEK` | required outside development | 32 random bytes, base64. Key-encryption key for envelope encryption (AES-256-GCM) of webhook signing keys, database-server passwords, SSO client secrets and audit-sink secrets; app secrets, invitation and SCIM tokens are stored hashed instead. In development a random key is used per run and stored secrets stop opening after a restart. |

## Email

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_SMTP_ADDR` | unset | `host:port` of the relay. Unset: emails are queued, never sent, and invitation links are returned by the API instead. |
| `MATURA_SMTP_FROM` | `no-reply@matura.local` | Must contain `@` when `MATURA_SMTP_ADDR` is set. |
| `MATURA_SMTP_USER`, `MATURA_SMTP_PASSWORD` | unset | Relay credentials. |

## Fine-grained permissions (OpenFGA)

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_OPENFGA_URL` | unset | OpenFGA HTTP API, e.g. `http://openfga:8080`. Unset: the `:check`, `:batch-check`, `:list-objects` and `/relations` endpoints answer `501` and the syncer does not run. |
| `MATURA_OPENFGA_TOKEN` | unset | Preshared key, if OpenFGA requires one. |
| `MATURA_OPENFGA_STORE` | `matura` | Name of the installation's store; created if missing. |

## Observability and public pages

| Variable | Default | Meaning |
|---|---|---|
| `MATURA_METRICS_ADDR` | `:9090` | Separate listener for `GET /metrics`. Set to an empty string to turn it off (which fails the `install-metrics` control). |
| `MATURA_TRUST_PAGE` | `off` | `on` serves `/trust` and `/trust.json`; anything else than `on`/`off`/`true`/`false`/`1`/`0` is an error. |
| `MATURA_SECURITY_CONTACT` | unset | Address shown on the trust page for security reports. |

## Execution and sandboxing

Matura runs no user code and has no sandbox settings. The `maturad` image is a static binary on a distroless base running as `nonroot`; the Helm chart adds a read-only root filesystem, no capabilities and the runtime-default seccomp profile. Request timeouts are fixed in the binary: 10 s to read headers, 30 s read and write, 120 s idle, 20 s graceful shutdown.

## CLI and tooling

| Variable | Used by | Meaning |
|---|---|---|
| `MATURA_URL` | `matura check`, `scripts/backup.sh --report` | `maturad`'s address (default `http://localhost:8080`). |
| `MATURA_TOKEN` | `matura check`, `backup.sh --report` | An operator's access token. |
| `MATURA_DEV_USER` | `matura check` | Development installs only: a UUID sent as `X-Matura-Dev-User` with `X-Matura-Dev-Operator: true`. |
| `MATURA_BACKUP_URL` | `scripts/backup.sh` | Superuser or owner URL without a database name. |
| `MATURA_BACKUP_DATABASES` | `scripts/backup.sh` | Space-separated list, default `matura keycloak`. |
| `MATURA_ISSUER`, `MATURA_AUDIENCE`, `MATURA_WEBHOOK_SECRET` | your app under `matura-conformance` | Printed by the checker when it starts its test issuer. |

Model or inference variables: none. Matura has no connection to a model server.

## Runtime settings

These are stored in the database and changed through the API (and, where noted, the portal). None needs a restart.

| Setting | Scope | Where | Values |
|---|---|---|---|
| Organisation name | tenant | portal Overview, `PATCH /v1/tenants/{tid}` | free text |
| Security policy | tenant | `PUT /v1/tenants/{tid}/security-policy` | `require_mfa` (bool); `session_max_age` 300 s to 90 days; `idle_timeout` 60 s to 30 days and not longer than the max age; `allowed_email_domains` (list); `ip_allowlist` (CIDRs; empty allows all) |
| Audit retention | tenant | `PUT /v1/tenants/{tid}/retention` | `retention_days` 30 to 3650 (default 400); `legal_hold` with `legal_hold_reason` |
| Audit sinks | tenant | `POST /v1/tenants/{tid}/audit/sinks` | `kind: webhook`, `url` (https), `backfill` |
| Enabled apps | tenant | portal Apps, `PUT`/`DELETE /v1/tenants/{tid}/apps/{app}` | per app |
| App roles | installation | portal Roles (operators), `/admin/v1/apps/{slug}/roles` | name, description, permissions from the catalogue |
| Plans | installation | `PUT /admin/v1/plans/{id}` | `name`, `data_mode_required`, `data_mode_default`, `limits` (`max_members`, `max_workspaces`, `max_agents`, `apps`, `features`) |
| Tenant plan and overrides | tenant | `PUT /admin/v1/tenants/{tid}/plan` | `plan`, `overrides` with the same keys as limits |
| Database servers | installation | `/admin/v1/db-servers` | `name`, `host`, `port`, `admin_user`, `admin_password`, `sslmode`, `region`, `dedicated`, `labels`, `status` |
| Webhook endpoints | per app | `/admin/v1/apps/{slug}/webhooks` | `url` (https), `status` |

The portal has no settings page of its own. Theme (light, dark, system) is per browser.
