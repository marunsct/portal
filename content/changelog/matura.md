---
title: Matura 0.3.0
description: Identity and compliance release: MFA and sessions, per-tenant SSO and SCIM, agent identity, data rights, readiness and the trust page.
order: 3
updated: 2026-10-19
---

Releases are listed newest first. Versions follow semantic versioning; the Helm chart and the images share the version. Entries marked **Security** change a security property and should be applied promptly.

## 0.3.0 — 2026-10-18

Identity, agents and compliance evidence. Migrations 0011–0015 run at start-up.

- **MFA and sessions.** Tenants can require a second factor (`require_mfa`), enforced by the `matura-mfa-policy` authenticator in the realm's flows; session max age and idle timeout are checked when an app asks for a token. People list and end their sessions; owners and admins list members' sessions, sign them out and reset their MFA.
- **Per-tenant enterprise SSO.** OIDC and SAML identity providers per tenant, email-domain verification by DNS TXT record, just-in-time joining with a default role, and public home-realm discovery at `GET /v1/sso/discover`.
- **SCIM 2.0 per tenant.** Users and groups provisioned from Okta or Microsoft Entra ID with per-tenant bearer tokens; group-to-role mappings keep grants in step with group membership.
- **Agents and service accounts.** Non-human principals with their own Keycloak client, grants, expiry, kill switch and secret rotation; on-behalf-of tokens through RFC 8693 token exchange carry `act` and the intersection of permissions; RFC 9728 protected-resource metadata for apps that expose MCP servers.
- **Fine-grained permissions on OpenFGA** (optional). A syncer writes tuples from memberships and grants; apps declare an authorization model in the manifest and call `:check`, `:batch-check`, `:list-objects` and `/relations`. Endpoints answer `501` until `MATURA_OPENFGA_URL` is set.
- **Data rights and retention.** Tenant export jobs, personal data access (`GET /v1/me/export`) and erasure (`DELETE /v1/me`, which also deletes the Keycloak account), audit retention of 30–3650 days with legal hold.
- **Readiness and trust.** `matura check` scores the installation against a control catalogue mapped to SOC 2, ISO/IEC 27001:2022 and GDPR, lists each gap with its fix, exports OSCAL 1.1.2 and fills policy templates; evidence of restore tests, access reviews and vulnerability scans is recorded on the hash chain; an optional public trust page at `/trust`.
- **Keycloak realm SMTP** now comes from `MATURA_KEYCLOAK_SMTP_HOST`, `_PORT` and `_FROM` instead of a fixed host.
- **Fixed:** `maturad`'s connection pool is sized above the background leaders (nine extra connections unless `pool_max_conns` is set); on a small machine the leaders could take every connection and sign-in hung on the MFA policy call.
- **Security:** the conformance run against AgentCanvas found a role-mapping gap in the app (a role that skipped a rung mapped upward). Fixed on the AgentCanvas side in 0.27.0; Matura's catalogue and `perms` claim were correct.

## 0.2.0 — 2026-10-17

Operations, audit and the customer portal. Migrations 0008–0010.

- **Customer portal** served by `maturad` at `/portal/`: members, invitations, app access, workspaces, roles and My account, with PKCE sign-in against the `matura-console` client and a strict Content-Security-Policy.
- **Tamper-evident audit log.** Every change written with a hash chain in the same transaction, one chain per tenant plus the installation chain; per-tenant read, NDJSON export and `:verify`; streaming to signed webhook sinks. Tenant security policies: allowed email domains and IP allow-lists.
- **Operator console backend.** Tenant suspend, resume, delete with a 30-day grace period and purge; plans with limits and per-tenant overrides; time-boxed, tenant-approved, read-only support access; `/admin/v1/stats`; operator user management.
- **Helm chart** with two `maturad` and two Keycloak replicas, ingress, network policies, pod disruption budget, optional autoscaling and a ServiceMonitor; **Prometheus metrics** on a separate listener (`MATURA_METRICS_ADDR`, default `:9090`); **backup tooling** (`scripts/backup.sh` backup, verify, restore-test, restore).
- **Go SDK**, matching the Python and TypeScript SDKs; placements are now versioned on their own in the contract tables, closing a late-replay gap in the other two SDKs.
- **TypeScript SDK** `@matura/sdk` with no runtime dependencies; **conformance checker** `matura-conformance` for any app; **OpenAPI 3.1** document for every route, kept in step with the router by a test; contract SQL for PostgreSQL, MySQL/MariaDB, SQL Server and SQLite with shared test vectors.

## 0.1.0 — 2026-10-16

First control plane. Migrations 0001–0007.

- Tenants, workspaces, members with the last-owner rule; apps from manifests with a permission catalogue; roles managed in Matura (`/admin/v1/apps/{slug}/roles`), never overwritten by re-applied manifests; grants per tenant or workspace.
- Postgres row-level security on every tenant-owned table, forced and failing closed; `maturad` runs as a role without `BYPASSRLS`.
- **Token claims for apps:** `POST /internal/v1/token-context` and the Keycloak extension `matura-token-mapper` add `tid`, `tenant`, `wid`, `troles`, `roles`, `perms`, `ver` and `pmode` to access tokens and refuse non-members, disabled apps and inactive users.
- Signed CloudEvents webhooks (`Matura-Signature`, in-order delivery, 24-hour backoff), per-app change feed and snapshot for app backends authenticated with client id and secret.
- Data placement in shared, schema and database modes, provisioned by Matura on registered database servers or managed by the app.
- Invitations by email with hashed single-use links that expire after 7 days, resend and revoke, accept page with Keycloak sign-in or sign-up, default roles on joining; email outbox and SMTP mailer.
- Envelope encryption of stored secrets under `MATURA_KEK`; `Idempotency-Key` on every `POST`; `If-Match` optimistic concurrency; RFC 9457 problem responses.
- Python SDK `matura` with FastAPI helpers; Docker Compose evaluation stack with Postgres, Keycloak (realm `matura`), Mailpit and `maturad`.
