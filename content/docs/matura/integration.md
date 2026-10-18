---
title: Integration
description: How an application talks to Matura: tokens, the API, signed webhooks and the change feed, the SDKs, MCP and agents, SCIM and SSO, and exporting data.
section: Matura
order: 7
updated: 2026-10-19
---

An app on Matura does three things: it verifies the access token on every request, it receives signed events and keeps a few `matura_*` tables current, and occasionally it calls Matura's API as itself. The rule behind the design is that the app never waits on Matura: everything it needs at request time is in the token or in its own tables.

## Authentication

| Caller | How | Scope |
|---|---|---|
| People and the portal | `Authorization: Bearer <JWT>` from Keycloak with `aud: matura-api`; the tenant comes from `tid` | `/v1` for their tenants |
| Operators | the same, with realm role `matura-operator` | `/admin/v1` as well |
| App backends | HTTP Basic with the app's client id and a secret from `POST /admin/v1/apps/{slug}/secrets` | `/v1/apps/{app}/…` only, filtered to tenants that enabled the app |
| Agents and service accounts | client-credentials tokens from their own Keycloak client | as a member of their tenant, with their grants |
| SCIM clients | `Authorization: Bearer scim_…` | `/scim/v2/tenants/{tid}` |
| Keycloak extension | `MATURA_INTERNAL_TOKEN` | `/internal/v1` |

Conventions on every endpoint: JSON bodies; errors as RFC 9457 `application/problem+json` with `type`, `title`, `status`, `detail`; `Idempotency-Key` on `POST` replays the first answer for 24 hours (a different body under the same key is `422`, a concurrent retry `409`); `If-Match` with the resource's `version` for optimistic concurrency; `X-Request-Id` on every response. Lists return `{"items": […]}` with `cursor` and `limit` where they page. The full OpenAPI 3.1 document ships with the bundle and is kept in step with the router by a test.

## The token your app verifies

Keycloak mints the token; while doing so, the Matura extension calls `POST /internal/v1/token-context` and adds the tenant claims. A token for client `notes` looks like:

```json
{"iss":"https://id.example.com/realms/matura","aud":"notes","azp":"notes","sub":"0192…",
 "email":"ana@acme.com","email_verified":true,"name":"Ana",
 "tid":"0192…","tenant":"acme","wid":null,"troles":["owner"],
 "roles":["editor"],"perms":["note.read","note.write"],"ver":41,"pmode":"shared","kind":"human"}
```

Verify `iss`, `aud`, signature against the issuer's JWKS (RS256/384/512, PS256, ES256/384; never `none` or `HS*`), then check `perms`, not role names. `*` grants everything. When the catalogue is large the token carries `perms_ref` instead and the SDK expands it from `matura_app_role`. Tokens for agents carry `kind: agent`; delegated tokens carry the person in `sub` and the agent in `act`.

Keycloak refuses to mint a token when the person is not an active member, the app is disabled in the tenant, the user is deactivated, or the tenant's session limits are exceeded (`session_expired`).

## Main endpoints with curl

Register an app (operator):

```bash
curl -s -X PUT $MATURA/admin/v1/apps/notes -H "Authorization: Bearer $OP" -H 'Content-Type: application/json' -d @manifest.json
```

The manifest names the app's Keycloak client (`client_id`, default: the slug). Create that client in the `matura` realm yourself, with the redirect URIs from the manifest and the `matura-token-mapper` protocol mapper attached; the realm export shows how on the `agentcanvas` client. Registering the manifest does not create the client.

Issue the backend credential and a webhook (operator):

```bash
curl -s -X POST $MATURA/admin/v1/apps/notes/secrets -H "Authorization: Bearer $OP" -H 'Content-Type: application/json' -d '{"label":"prod"}'
# → {"id":"…","client_id":"notes","secret":"<shown once>",…}
curl -s -X POST $MATURA/admin/v1/apps/notes/webhooks -H "Authorization: Bearer $OP" -H 'Content-Type: application/json' -d '{"url":"https://notes.example.com/matura/events"}'
# → {"id":"…","secret":"<signing secret, shown once>","status":"active",…}
curl -s -X POST $MATURA/admin/v1/apps/notes/webhooks/<id>/test -H "Authorization: Bearer $OP"
```

Pull the change feed and a snapshot (app backend):

```bash
curl -s -u notes:$SECRET "$MATURA/v1/apps/notes/snapshot"
# → {"cursor":"1532","tenant":[…],"workspace":[…],"user":[…],"membership":[…],"grant":[…],"placement":[…]}
curl -s -u notes:$SECRET "$MATURA/v1/apps/notes/changes?cursor=1532&limit=500"
# → {"items":[<CloudEvents>],"next_cursor":"1587","has_more":false}
```

A cursor older than what Matura still holds answers `410 cursor-expired`; take a snapshot and continue from its cursor. Placement calls for the app: `GET`/`PUT /v1/apps/notes/placements/{tid}`, `POST …/{tid}:ready`, `…/{tid}:deleted`, `POST …/{tid}/credentials` (`runtime` or `migrate`, returned once and never stored by the app).

## Webhooks and events

Events are CloudEvents 1.0 JSON delivered in order per endpoint:

```json
{"specversion":"1.0","id":"0192…","source":"matura://installation/main","type":"matura.membership.added",
 "time":"2026-10-19T09:12:03Z","subject":"tenants/0192…/members/0192…","tenantid":"0192…",
 "datacontenttype":"application/json",
 "data":{"object":"membership","version":41,"membership":{"tenant_id":"…","user_id":"…","tenant_role":"admin","status":"active"}}}
```

Headers: `Matura-Signature: t=<unix>,v1=<hex HMAC-SHA256 of "t.body">` and `Matura-Event-Id`. Receivers reject a timestamp more than 300 s off, compare the HMAC in constant time, skip ids already in `matura_inbox`, and apply the change with the version rule (keep the row only when the incoming `version` is newer) in one transaction, then answer `2xx`. Matura retries with exponential backoff for 24 hours, then marks the endpoint `failing`; the change feed covers the gap. Outside development the URL must be `https://`.

Event types: `matura.tenant.{created,updated,suspended,reactivated,deleting,deleted}`, `matura.workspace.{created,updated,archived,deleted}`, `matura.user.{created,updated,deactivated,deleted}`, `matura.membership.{added,updated,removed}`, `matura.tenant_app.{enabled,disabled}`, `matura.grant.{added,revoked}`, `matura.placement.{requested,provisioned,ready,moving,retiring,deleted}`, `matura.app.manifest.updated`, `matura.app.role.{created,updated,deleted}`.

Tenant audit sinks use the same envelope and signature for a tenant's audit events, delivered to the tenant's own URL.

## SDKs

All three do the same things: verify tokens and expose a `Principal`, enforce permissions, receive webhooks, create and apply the contract tables, catch up from the feed, and call the placement and permission endpoints. Each ships a fake issuer for tests and runs the shared test vectors. Packages are available to licensed customers from the same registry as the images.

Python (FastAPI):

```python
from matura import Verifier, Contract, MaturaAPI, Sync
from matura.fastapi import MaturaFastAPI, webhook_router

verifier = Verifier(issuer="https://id.example.com/realms/matura", audience="notes")
matura = MaturaFastAPI(verifier)

@app.post("/notes")
async def create(p = matura.require_permission("note.write")):
    ...  # p.tenant_id, p.user_id, p.workspace_id, p.permissions, p.kind, p.actor

contract = Contract("postgresql")
app.include_router(webhook_router(WEBHOOK_SECRET, contract, engine.begin))
sync = Sync(MaturaAPI(MATURA_URL, "notes", CLIENT_ID, CLIENT_SECRET), contract, engine.begin)
await sync.catch_up()   # at start-up and hourly
```

TypeScript (Node 20+, no runtime dependencies):

```ts
import { Verifier, authenticate, requirePermission, webhookHandler, MaturaAPI, Sync, Contract } from "@matura/sdk";

const verifier = new Verifier({ issuer: "https://id.example.com/realms/matura", audience: "notes" });
app.post("/notes", async (req, res) => {
  const p = requirePermission(await authenticate(verifier, req.headers), "note.write");
  res.json({ tenant: p.tenantId });
});
app.post("/matura/events", express.raw({ type: "*/*" }), async (req, res) => {
  const { status, body } = await webhookHandler({ secret, contract, transaction })(req.body, req.headers);
  res.status(status).type("json").send(body);
});
```

Go (net/http, pgx v5):

```go
verifier, _ := matura.NewVerifier(matura.VerifierOptions{Issuer: issuer, Audience: "notes"})
auth := matura.Middleware(verifier)
mux.Handle("POST /notes", auth(matura.RequirePermission("note.write")(http.HandlerFunc(addNote))))
mux.Handle("POST /matura/events", matura.NewWebhookHandler(os.Getenv("MATURA_WEBHOOK_SECRET"), contract, ownerPool))
```

In shared mode the Go SDK's `matura.WithTenant` sets `matura.tenant_id` on the transaction so your own row-level security policies apply; the SQL for the contract tables and the RLS policies is shipped for PostgreSQL, MySQL/MariaDB, SQL Server and SQLite for any other language.

## Fine-grained permissions

Apps that need "can this user edit this document" declare an OpenFGA model under `authorization.model` in the manifest. Matura keeps tuples for memberships and grants and the app writes its own:

```bash
curl -s -u notes:$SECRET -X POST "$MATURA/v1/apps/notes/tenants/$TID/relations" -H 'Content-Type: application/json' \
  -d '{"writes":[{"user":"user:0192…","relation":"owner","object":"document:42"}]}'
curl -s -u notes:$SECRET -X POST "$MATURA/v1/apps/notes/tenants/$TID:check" -H 'Content-Type: application/json' \
  -d '{"user":"user:0192…","relation":"editor","object":"document:42"}'
```

`:batch-check` takes up to 50 checks; `:list-objects` returns what a user may see. Without `MATURA_OPENFGA_URL` these answer `501`.

## Agents and MCP

A tenant creates an agent and receives a client id and secret. The agent fetches its own token with `grant_type=client_credentials` and `matura_app=notes` (or `audience`, or `resource=<URL>`), or exchanges a person's token with RFC 8693 token exchange for one that carries `act` and the intersection of permissions. An app that exposes an MCP server lists the server's URL under `auth.resources` in its manifest and serves RFC 9728 metadata; the SDKs build the document and the `WWW-Authenticate: Bearer resource_metadata=…` challenge. `maturad` itself serves `/.well-known/oauth-protected-resource` for its own API. Consent screens for delegation are not built yet; set up token exchange only for agents the tenant trusts.

## SSO and SCIM for your customers

Both are features your customers configure in Matura, not in your app. Your sign-in page should call the public `GET /v1/sso/discover?email=` and pass `kc_idp_hint` to Keycloak so company users go straight to their provider. Users provisioned by SCIM arrive in your app through the same `matura.user.*`, `matura.membership.*` and `matura.grant.*` events as everyone else.

## Conformance

`matura-conformance` tests a running app from outside, in any language. It starts a test issuer, seeds two tenants with signed events, then checks that each resource refuses missing, expired, wrong-audience, wrong-issuer and unknown-key tokens (`401`), refuses a missing permission (`403`), keeps tenant A's records out of tenant B's lists and reads, applies a repeated event once and rejects tampered or stale signatures.

```bash
matura-conformance --app http://localhost:8000 --manifest matura/manifest.json --webhook-secret whsec_dev
# prints: MATURA_ISSUER=http://127.0.0.1:8099/realms/conformance MATURA_AUDIENCE=notes MATURA_WEBHOOK_SECRET=whsec_dev
```

Start your app with those values and the checker runs; `--json` gives a machine-readable report for CI. The manifest's `conformance` section names the webhook path and one `create`/`list`/`read` triple per resource.

## Exporting data

| What | How | Format |
|---|---|---|
| Organisation data | `POST /v1/tenants/{tid}/exports`, poll, `GET …/exports/{id}/download` | JSON attachment with `sha256` |
| A person's data | `GET /v1/me/export` | JSON |
| Tenant audit log | `GET /v1/tenants/{tid}/audit/export?from=&to=` | NDJSON with hashes |
| Installation audit log | `GET /admin/v1/audit` with `cursor` | JSON pages |
| Readiness report | `matura check --json` or `--oscal` | JSON, OSCAL 1.1.2 assessment results |
| Everything | `scripts/backup.sh backup` | `pg_dump` custom format |

Apps export their own data; Matura's export covers what Matura holds.
