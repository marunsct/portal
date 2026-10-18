---
title: Administration
description: Accounts and roles, security policy, monitoring, logs, retention, backup and restore, resource tuning and scaling for a Matura installation.
section: Matura
order: 6
updated: 2026-10-19
---

## Accounts, roles and tenants

Matura has three layers of authority.

| Layer | Who | Granted by |
|---|---|---|
| Installation operator | realm role `matura-operator` (`MATURA_OPERATOR_ROLE`) | Keycloak admin console or admin API |
| Tenant role | `owner`, `admin`, `billing`, `member` | Owners and admins in the portal; owners for the owner role |
| App role | roles from the app's manifest or created in Matura | Grants, invitations, SCIM group mappings, the app's default role |

Operators are not automatically members of any tenant. They see every tenant in the portal switcher and may change tenants through `/admin/v1`, but they see a tenant's own admin views only with support access the tenant's owner approved, and then read-only.

### Creating accounts

People normally self-register on Keycloak's sign-in page (`registrationAllowed` and email verification are on in the shipped realm) or arrive through an invitation link. To create an account yourself:

```bash
AT=$(curl -s https://id.example.com/realms/master/protocol/openid-connect/token \
  -d grant_type=password -d client_id=admin-cli -d username=<admin> -d password=<password> | jq -r .access_token)

curl -s -X POST https://id.example.com/admin/realms/matura/users -H "Authorization: Bearer $AT" \
  -H 'Content-Type: application/json' -d '{"username":"ana@acme.com","email":"ana@acme.com",
  "firstName":"Ana","lastName":"Owner","enabled":true,"emailVerified":true,
  "credentials":[{"type":"password","value":"<temporary>","temporary":true}]}'
```

To make that person an operator, map the realm role:

```bash
UID=$(curl -s "https://id.example.com/admin/realms/matura/users?email=ana@acme.com" -H "Authorization: Bearer $AT" | jq -r '.[0].id')
ROLE=$(curl -s https://id.example.com/admin/realms/matura/roles/matura-operator -H "Authorization: Bearer $AT")
curl -s -X POST "https://id.example.com/admin/realms/matura/users/$UID/role-mappings/realm" \
  -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "[$ROLE]"
```

Matura records a user the first time a valid token arrives, and re-reads the profile when it changes or every minute. A deactivated account (`PATCH /admin/v1/users/{uid} {"status":"deactivated"}`) is refused with `403 user-inactive` within a minute even if its token is still valid. Deleting through `DELETE /admin/v1/users/{uid}` keeps the row anonymised so audit references resolve; erasure through `DELETE /v1/me` additionally deletes the Keycloak account when `MATURA_KEYCLOAK_CLIENT_SECRET` is set.

To create a tenant for a customer, call `POST /v1/tenants` with `owner_id` as an operator, or let the customer create it on first sign-in.

### Machine credentials

There are no personal API keys. Long-lived credentials are: app backend secrets (operator-issued, HTTP Basic, `POST /admin/v1/apps/{slug}/secrets`, revocable, `last_used_at` tracked), tenant agents and service accounts (owner-issued, Keycloak confidential clients, rotatable), and tenant SCIM tokens. Each is shown once and stored hashed or encrypted.

## Security policy

Per-tenant policy (`PUT /v1/tenants/{tid}/security-policy`) covers MFA, session limits, allowed invitation domains and an IP allow-list; see the [User guide](/docs/matura/user-guide). Installation-wide rules are configuration:

- `MATURA_ENV=production` refuses development sign-in and plain-HTTP webhook and identity-provider URLs.
- `MATURA_KEK` encrypts every stored secret. Rotation is not automated: to rotate, re-issue the secrets under a new key (webhooks, SSO connections, DB servers, audit sinks) and then change the variable.
- `MATURA_TRUSTED_PROXIES` limits who may set the client address.
- Keycloak's own password policy, brute-force detection and passkeys are configured in the realm as usual; Matura does not fork or override them.
- Access tokens live up to 5 minutes; revocation of a deactivated user or agent takes effect on the next token, not instantly.

Record evidence for the controls software cannot see: quarterly access reviews and monthly vulnerability scans of the images.

```bash
curl -s -X POST $MATURA/admin/v1/evidence -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"kind":"access-review","passed":true,"details":{"reviewer":"ana@acme.com","removed":2}}'
```

## Monitoring

### Health

| Endpoint | Port | Answer |
|---|---|---|
| `GET /healthz/live` | 8080 | `204` while the process runs |
| `GET /healthz/ready` | 8080 | `204`, or `503 application/problem+json` with `not-ready` when the database does not answer a ping |

Use `live` for liveness and `ready` for readiness and load-balancer checks. Migrations run before the listener opens, so a long migration shows as not yet listening rather than unready; the Helm chart uses a startup probe for that.

### Metrics

`GET /metrics` on `MATURA_METRICS_ADDR` (default `:9090`, a separate listener so it is never exposed through the proxy by accident) in Prometheus text format:

| Metric | Type | Labels | Meaning |
|---|---|---|---|
| `matura_http_requests_total` | counter | `method`, `route`, `code` (class, e.g. `2xx`) | Requests served per route pattern |
| `matura_http_request_duration_seconds` | histogram | `method`, `route` | Time to serve |
| `matura_events_unsequenced` | gauge | | Changes not yet given a change-feed position |
| `matura_webhook_lag_events` | gauge | | Events the furthest-behind active webhook endpoint has not received |
| `matura_webhooks_failing` | gauge | | Endpoints in the `failing` state |
| `matura_emails_pending` | gauge | | Emails waiting to be sent |
| `matura_email_oldest_pending_seconds` | gauge | | Age of the oldest queued email |

Alert on `matura_webhooks_failing > 0`, `matura_webhook_lag_events` growing for more than a few minutes, and `matura_email_oldest_pending_seconds > 600`. Keycloak exposes its own metrics with `KC_METRICS_ENABLED=true`.

### Readiness

`GET /admin/v1/readiness`, or `matura check`, recomputes every control from live state, including a full re-verification of every audit hash chain. Run it against staging after each deploy with `--min-score` and, in production, on a schedule rather than on every request; the trust page caches its result for five minutes.

## Logs

`maturad` writes structured JSON to stdout, one object per line, with `level`, `msg` and key-value fields. Collect it with `docker compose logs` or your log shipper. Every response carries `X-Request-Id`, which also appears in audit entries as `request_id`. There is no log-level setting; warnings are reserved for configuration that weakens security (`MATURA_AUTH=dev`, missing KEK, missing SMTP, missing Keycloak secret).

Keycloak logs to stdout as well. The Matura extension logs refusals from `/internal/v1/token-context` (non-members, disabled apps, inactive users, expired sessions) at the Keycloak level.

## Audit and data retention

The audit log is Matura's system of record for who did what. Two chains exist: the installation chain (apps, roles, plans, operator actions, evidence) and one per tenant. Each entry hashes the previous one, in the same transaction as the change, so it cannot be edited or deleted through the API, and only a database superuser or the owner role could touch it underneath. `GET /admin/v1/audit:verify` and `GET /v1/tenants/{tid}/audit:verify` recompute the chains.

| Data | Retention | Set by |
|---|---|---|
| Tenant audit events | `retention_days`, 30–3650, default 400; `legal_hold` suspends deletion | `PUT /v1/tenants/{tid}/retention` |
| Deleted tenants | restorable for `MATURA_TENANT_DELETE_GRACE` (default 720 h), then purged | configuration |
| Invitations | links expire after 7 days; rows kept with their state | fixed |
| Idempotency keys | 24 hours | fixed |
| Webhook retries | 24 hours of backoff, then the endpoint is `failing` and events are dropped from that endpoint (the change feed keeps them) | fixed |
| Tenant exports | kept until `expires_at` on the export | fixed |
| Emails | until sent; retried with backoff | fixed |

The privacy worker applies retention and erasure requests on one replica at a time.

## Backup and restore

State lives in Postgres: the `matura` and `keycloak` databases, and `openfga` if you use fine-grained permissions. Apps keep their own data; an app restored to an older point catches up from the change feed on its next sync.

```bash
export MATURA_BACKUP_URL=postgres://postgres:<pw>@localhost:5432     # no database name
export MATURA_BACKUP_DATABASES="matura keycloak openfga"
scripts/backup.sh backup /backups/$(date +%F)          # pg_dump custom format, row counts, SHA-256 sums, manifest
scripts/backup.sh verify /backups/2026-10-19           # checksums
MATURA_TOKEN=<operator token> scripts/backup.sh restore-test /backups/2026-10-19 --report https://matura.example.com
```

`restore-test` restores into throwaway databases, compares row counts with the manifest, and with `--report` posts `restore-test` evidence that the `install-restore-test` control reads (it must be at most 35 days old to pass). Copy the directory to object storage with object lock.

To restore for real: stop `maturad` and Keycloak, recreate the empty databases and their owners as `init-db.sql` does, then run `scripts/backup.sh restore <dir> matura matura` and the same for `keycloak`. Dumps leave out privileges; `maturad` grants its runtime role the table privileges again at start-up. The KEK is not in the dumps and must be restored with them.

For point-in-time recovery use pgBackRest with WAL archiving on the database server; on Kubernetes, CloudNativePG scheduled backups.

## Resource tuning

| Component | Request | Limit | Notes |
|---|---|---|---|
| `maturad` | 100m CPU, 128 MiB | 512 MiB | CPU scales with request rate; memory is flat. |
| Keycloak | 500m CPU, 1 GiB | 2 GiB | Start-up takes 30–60 s. |
| OpenFGA | 100m CPU, 128 MiB | 512 MiB | |
| Postgres | depends on tenants | | Audit rows dominate growth. |

Connection pool: `maturad` uses pgx's default of `max(4, CPUs)` plus nine for the background leaders, unless `pool_max_conns` is in `MATURA_DATABASE_URL`. Size Postgres's `max_connections` for replicas × that number plus Keycloak's pool.

Readiness reports re-verify whole audit chains; on a large installation that is the heaviest request `maturad` serves. Schedule it rather than polling.

## Scaling and replicas

`maturad` is stateless and runs several replicas without configuration. Migrations run under an advisory lock, so replicas may start together. Background work (event relay, webhook delivery, placement provisioning, purging, audit streaming, privacy jobs, email, OpenFGA sync) is done by whichever replica holds the Postgres advisory lock for that job; the others idle on it and take over when it is released. The Helm chart runs two `maturad` and two Keycloak replicas with a pod disruption budget and anti-affinity, and optional CPU autoscaling.

Known constraints:

- There is one audit streamer, one relay and one mailer at a time; throughput is bounded by a single replica's work on those queues.
- The trust page and readiness cache are per replica (five minutes).
- The in-memory profile cache (`seen`) is per replica; a deactivated account may take up to a minute longer to be refused on another replica.
- Compose is single-host; Postgres high availability is outside the bundle.
- The portal is embedded in `maturad` and scales with it.
