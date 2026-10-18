---
title: Troubleshooting
description: Symptoms you may meet running or integrating Matura, what causes each, and the fix.
section: Matura
order: 8
updated: 2026-10-19
---

Every error from `maturad` is an `application/problem+json` body whose `type` ends in a short code (`unauthenticated`, `operator-only`, `plan-limit`, …) and whose `detail` is written for a person. Start there; most of the entries below quote the code you will see. Container times are UTC.

## maturad will not start

**`MATURA_AUTH=dev trusts request headers; it needs MATURA_ENV=development (got "production")`**
Cause: the evaluation compose file's `MATURA_AUTH: dev` was kept while `MATURA_ENV` was changed, or `MATURA_ENV` was left unset (its default is `production`).
Fix: set `MATURA_AUTH=oidc` and `MATURA_ISSUER`. Development sign-in is refused outside development by design.

**`MATURA_KEK is required outside development: 32 random bytes, base64`**
Cause: no key-encryption key in a non-development install.
Fix: `openssl rand -base64 32` into `MATURA_KEK`. Back it up away from the database dumps.

**`MATURA_INTERNAL_TOKEN must be at least 32 characters`**
Fix: `openssl rand -hex 32`, and set the same value on the Keycloak container.

**`MATURA_AUTH=oidc needs MATURA_ISSUER` or `MATURA_KEYCLOAK_CLIENT_SECRET needs MATURA_ISSUER`**
Fix: `MATURA_ISSUER=https://<keycloak host>/realms/matura`. The realm name is parsed from it.

**`maturad stopped` right after `migrations applied` with a connection error**
Cause: `MATURA_MIGRATE_DATABASE_URL` worked but `MATURA_DATABASE_URL` did not, usually a wrong `matura_app` password or a database that `init-db.sql` never created because the `pgdata` volume already existed.
Fix: check both URLs. For a fresh evaluation stack, `docker compose down -v` and start again; for an existing volume, create the roles and databases from `init-db.sql` by hand.

**`keyfunc` error at start-up, or `maturad` hangs before `listening`**
Cause: `MATURA_JWKS_URL` (or the issuer's `/protocol/openid-connect/certs`) is unreachable from the container, typically because `MATURA_ISSUER` is a public hostname the container cannot resolve.
Fix: set `MATURA_JWKS_URL=http://keycloak:8180/realms/matura/protocol/openid-connect/certs` and keep `MATURA_ISSUER` public.

## Health and proxy

**`GET /healthz/ready` answers `503 not-ready: database unreachable`**
Cause: Postgres is starting, out of connections or unreachable.
Fix: `docker compose ps postgres`; check `max_connections` against replicas × (pool size + 9) plus Keycloak.

**Portal loads a blank page, or assets return 404 behind the proxy**
Cause: the proxy rewrites `/portal` to another prefix or serves `maturad` under a sub-path. The base path is compiled into the portal and `maturad` serves it at `/portal/` only.
Fix: give `maturad` its own hostname at the root of the origin and proxy paths unchanged.

**The portal cannot be shown in a frame on your site**
Cause: `maturad` sends `Content-Security-Policy: frame-ancestors 'none'` and `X-Frame-Options: DENY` on the portal, the accept page and the trust page.
Fix: link out to it. This is not configurable.

**Sign-in from the portal fails with Keycloak's `Invalid parameter: redirect_uri`**
Cause: client `matura-console` only knows `localhost` redirect URIs from the shipped realm.
Fix: add `https://<maturad host>/portal/*` and `https://<maturad host>/invitations/accept` to the client's valid redirect URIs, `https://<maturad host>` to web origins, and the portal URL to post-logout redirect URIs.

**Browser console shows a CSP `connect-src` violation during sign-in**
Cause: the portal only allows connections to itself and to the origin of `MATURA_ISSUER`; the browser is being sent to a different Keycloak origin (often an internal hostname).
Fix: make `MATURA_ISSUER` the public Keycloak origin and move internal addresses to `MATURA_JWKS_URL` and `MATURA_KEYCLOAK_URL`.

**IP allow-list blocks everyone, or the audit log shows the proxy's address for every actor**
Cause: `MATURA_TRUSTED_PROXIES` is unset, so `X-Forwarded-For` is ignored and the client address is the proxy's.
Fix: set it to the proxy's address or CIDR. Until then an `ip-not-allowed` refusal is expected whenever the proxy's address is outside the list.

## Tokens and sign-in

**`401 unauthenticated` on every `/v1` call after switching to `oidc`**
Cause: the request still carries `X-Matura-Dev-*` headers, or the token's `aud` is not `matura-api` (an app token with `aud: notes` is for your app, not for Matura's API), or `iss` differs from `MATURA_ISSUER` by a trailing slash or scheme.
Fix: get a token for the portal client (`matura-console`) or any client with `matura-api` in its audience, and compare `iss` byte for byte.

**`403 operator-only: this endpoint is for installation operators`**
Cause: the account lacks the realm role `matura-operator`, or the token was fetched before the role was mapped, or the caller is an agent (agents are never operators).
Fix: map the role in Keycloak and fetch a new token.

**App tokens carry no `tid`, `roles` or `perms`**
Cause: the Matura extension did not reach `maturad`, or `MATURA_INTERNAL_TOKEN` differs between the two containers, or the app's Keycloak client has no token mapper. Registering a manifest does not create a Keycloak client for the app; in the shipped realm only `agentcanvas` carries the mapper. (Agent clients, by contrast, are created by Matura with the mapper attached.)
Fix: create the app's client in Keycloak with the client id from the manifest, attach the `matura-token-mapper` protocol mapper, and check the Keycloak log for the call to `/internal/v1/token-context`.

**Keycloak refuses the token with `access_denied` for a member who was invited**
Cause: `token-context` refused: the person is not an active member of the tenant, the app is not enabled there, the account is deactivated, or the tenant is suspended.
Fix: enable the app on the Apps page, check Members, or restore the tenant.

**`503 keycloak-not-configured` on sessions, MFA, SSO or agents**
Cause: `MATURA_KEYCLOAK_CLIENT_SECRET` is unset.
Fix: set it to the secret of client `matura-admin`, the same value the Keycloak container received at realm import.

**Sign-in hangs or times out when `require_mfa` is on**
Cause: on a small machine the default pgx pool was exhausted by the background leaders, leaving no connection for the MFA policy call. Fixed in the current release, which adds nine connections above the default unless `pool_max_conns` is set.
Fix: upgrade; or set `pool_max_conns` explicitly in `MATURA_DATABASE_URL`.

**A deactivated user keeps working for up to a minute, or an agent for up to five**
Cause: profiles are cached per replica for a minute, and access tokens live up to 5 minutes. Instant revocation is not built yet.
Fix: none needed; end their sessions with `POST …/members/{uid}:sign-out` to stop refreshes.

## Invitations and email

**Invitation created but no email arrives**
Cause: `MATURA_SMTP_ADDR` is unset, so emails are queued and never sent; `maturad` logs a warning at start-up.
Fix: configure SMTP, or use the `accept_url` returned once by the API and shown once in the portal. Check `matura_emails_pending` and `matura_email_oldest_pending_seconds` on `/metrics` for a relay that accepts but is slow.

**`422 invalid: temporary passwords are not available yet; use delivery link`**
Cause: `delivery: temp_password` is on the roadmap.
Fix: use the default link delivery.

**`403 wrong-invitee: sign in as the invited person`**
Cause: the person accepting signed in with a different email than the invitation names.
Fix: sign out of Keycloak and sign in or up with the invited address.

## Plans, webhooks and secrets

**`402 plan-limit`**
Cause: the tenant reached `max_members`, `max_workspaces` or `max_agents`, or the app is not in the plan's `apps`. Deactivated members hold a seat.
Fix: raise the limit with `PUT /admin/v1/tenants/{tid}/plan` overrides, or remove members.

**Webhook endpoint shows `status: failing`, `matura_webhooks_failing` is 1**
Cause: the app answered non-2xx or timed out for 24 hours; events for that endpoint after the cut-off are counted in `dropped`.
Fix: repair the receiver, then `PATCH /admin/v1/apps/{slug}/webhooks/{id} {"status":"active"}`; the app catches up the gap from `GET /v1/apps/{app}/changes`.

**`422 invalid: webhook url must be an https:// URL without credentials`**
Cause: plain `http://` endpoints are only allowed with `MATURA_ENV=development`.
Fix: put TLS in front of the receiver.

**`410 cursor-expired` from the change feed**
Fix: take `GET /v1/apps/{app}/snapshot` and continue from its `cursor`. The SDKs do this on their own.

**Stored secrets stop working after a restart (webhook signatures fail, SSO breaks, DB-server test fails)**
Cause: `MATURA_KEK` changed, or was unset in development so a random key was used for the previous run.
Fix: restore the original KEK. There is no recovery without it; re-issue every secret under the new key.

## Data placement

**Tenant stays in `placement: requested`, app never receives `matura.placement.provisioned`**
Cause: no database server registered, or the registered server's test fails, or the plan requires a mode the app does not offer.
Fix: `POST /admin/v1/db-servers/{id}/test`; compare the plan's `data_mode_required` with the manifest's `tenancy.modes`. The provisioner retries failed steps and logs each attempt.

**`501` from `:check`, `:batch-check`, `:list-objects` or `/relations`**
Cause: `MATURA_OPENFGA_URL` is unset, or the manifest has no `authorization.model` (`409 no-authorization-model`).
Fix: run OpenFGA and set the URL and token, and declare a model.

## Readiness

**`matura check` exits 2 with `401 … (set MATURA_TOKEN to an operator's access token)`**
Fix: fetch a token for an account with `matura-operator` and export `MATURA_TOKEN`; on a development install set `MATURA_DEV_USER` instead.

**`install-audit-chain` or `tenant-audit-chain` fails**
Cause: a row in the audit table was changed outside `maturad`, which only the owner role or a superuser can do, or a restore mixed two backups.
Fix: the report names the first broken link. Investigate the database access, then restore from a backup whose `restore-test` passed.

**`install-restore-test` fails although backups run nightly**
Cause: the control reads evidence, not files. No `restore-test` was reported in the last 35 days.
Fix: run `scripts/backup.sh restore-test <dir> --report <maturad URL>` weekly with `MATURA_TOKEN` set.
