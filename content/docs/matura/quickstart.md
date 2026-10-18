---
title: Quickstart
description: From Docker to a signed-in tenant, a registered app and a readiness score in about fifteen minutes.
section: Matura
order: 2
updated: 2026-10-19
---

This walkthrough runs the evaluation stack from the compose bundle, creates a tenant in development mode, registers an app, invites a second person, switches to real sign-in through Keycloak and ends with a readiness report. Everything happens on one machine.

> **Prerequisites**
>
> - Docker Engine 24 or newer with Compose v2, and about 4 GB of free RAM (Keycloak takes most of it).
> - Licence credentials for `registry.ownstack.example` and the bundle `ownstack-matura-compose.zip` from your licence email.
> - `curl`. Optional: `jq` and Go 1.24 for the `matura` CLI.
> - Ports 8080, 8180, 8025 and 8081 free.
>
> Matura does not need a model server. If you are evaluating the suite, this is the one product you can set up before your GPU box is ready.

## 1. Unpack the bundle and sign in to the registry

```bash
unzip ownstack-matura-compose.zip -d matura && cd matura
docker login registry.ownstack.example -u <licensee-id>   # password: the pull token from your licence email
```

The bundle's `compose.yaml` is the evaluation stack: Postgres 16, Keycloak 26.4 with the Matura extension, Mailpit, OpenFGA and `maturad`, with development-only secrets. `init-db.sql` creates the three databases and their roles on first start.

## 2. Start the stack

```bash
docker compose up -d
docker compose logs -f maturad
```

Wait for these two lines from `maturad`:

```json
{"level":"INFO","msg":"migrations applied"}
{"level":"INFO","msg":"maturad listening","addr":":8080"}
```

You will also see two warnings, both expected in this mode: `MATURA_AUTH=dev: requests are trusted from X-Matura-Dev-* headers` and `MATURA_OPENFGA_URL is not set` only if you removed OpenFGA. Keycloak takes a further minute to import the realm.

## 3. Check health

```bash
curl -i localhost:8080/healthz/ready
```

Expected: `HTTP/1.1 204 No Content`. A `503` with `"detail":"database unreachable"` means Postgres is still starting; try again. Keycloak is ready when `curl -s localhost:8180/realms/matura` returns JSON with `"realm":"matura"`.

## 4. Create a tenant in development mode

The stack starts with `MATURA_AUTH=dev`, which trusts `X-Matura-Dev-*` headers so you can explore without a login. Pick any UUID as your user id and keep it for the rest of the walkthrough.

```bash
export ME=0192b7a4-5c1e-7d2a-9f00-4b1e2a9c0d11
curl -s -X POST localhost:8080/v1/tenants \
  -H "X-Matura-Dev-User: $ME" -H 'X-Matura-Dev-Email: ana@acme.test' -H 'X-Matura-Dev-Name: Ana' \
  -H 'Content-Type: application/json' -d '{"slug":"acme","name":"Acme"}' | jq .
```

The response is the tenant with `"status":"active"` and `"kind":"company"`. The creator becomes its owner and a default workspace exists. Save the id:

```bash
export TID=$(curl -s localhost:8080/v1/me/tenants -H "X-Matura-Dev-User: $ME" | jq -r '.items[0].id')
```

## 5. Open the portal

Browse to `http://localhost:8080/portal/`. In development mode the portal shows a *Dev sign-in* page: enter the same user id and email, leave *operator* unticked, and continue. You land on the organisation overview for Acme. Look at Members (you, as owner) and Workspaces (the default one).

## 6. Register an app as an operator

Apps are registered by operators with a manifest. Send the operator header this time. The realm already contains a Keycloak client named `agentcanvas` that carries Matura's token mapper, so register an app with that slug and you can mint real app tokens in step 12 without touching Keycloak. The manifest declares a permission catalogue and roles; `tenancy` says the app keeps tenant data in one shared database with row-level security.

```bash
curl -s -X PUT localhost:8080/admin/v1/apps/agentcanvas \
  -H "X-Matura-Dev-User: $ME" -H 'X-Matura-Dev-Operator: true' \
  -H 'Content-Type: application/json' -d '{
    "slug": "agentcanvas", "name": "AgentCanvas",
    "auth": {"redirect_uris": ["http://localhost:7777/*"], "public_client": true},
    "permissions": [{"name":"canvas.read"},{"name":"workflow.build"},{"name":"inbox.review"},{"name":"org.admin"}],
    "roles": [{"name":"viewer","permissions":["canvas.read"]},
              {"name":"builder","permissions":["canvas.read","workflow.build"]},
              {"name":"admin","permissions":["*"]}],
    "default_role": "viewer", "owner_role": "admin",
    "tenancy": {"modes":["shared"], "managers":["app"], "default":{"mode":"shared","manager":"app"}}
  }' | jq '.app.slug, .changed'
```

Expected: `"agentcanvas"` and `true`. Re-applying the same manifest answers `"changed": false`; roles you later edit in Matura are never overwritten by a manifest. For your own app you would pick your own slug and create a matching client in Keycloak with the `matura-token-mapper` attached.

## 7. Enable the app for the tenant

In the portal, open **Apps** and enable *AgentCanvas*, or:

```bash
curl -s -X PUT localhost:8080/v1/tenants/$TID/apps/agentcanvas -H "X-Matura-Dev-User: $ME" | jq .status
```

## 8. Invite a colleague

```bash
curl -s -X POST localhost:8080/v1/tenants/$TID/invitations \
  -H "X-Matura-Dev-User: $ME" -H 'Content-Type: application/json' \
  -d '{"email":"ben@acme.test","tenant_role":"member","app_roles":[{"app":"agentcanvas","role":"builder"}]}' | jq .
```

The response includes `accept_url` once. The email also arrives in Mailpit at `http://localhost:8025`. Invitations expire after 7 days and can be resent or revoked from the portal's **Invitations** page.

## 9. Create a real account in Keycloak

Development headers stop here. Open `http://localhost:8180`, sign in to the admin console with `admin` / `admin`, switch to realm **matura**, and create a user `ana@acme.test` with email verified and a password. Under *Role mapping*, assign the realm role `matura-operator` if you want this account to be an operator too. Or do it with the admin API:

```bash
AT=$(curl -s localhost:8180/realms/master/protocol/openid-connect/token \
  -d grant_type=password -d client_id=admin-cli -d username=admin -d password=admin | jq -r .access_token)
curl -s -X POST localhost:8180/admin/realms/matura/users -H "Authorization: Bearer $AT" \
  -H 'Content-Type: application/json' -d '{"username":"ana@acme.test","email":"ana@acme.test",
  "firstName":"Ana","lastName":"Owner","enabled":true,"emailVerified":true,
  "credentials":[{"type":"password","value":"Ana-pass-123","temporary":false}]}'
```

The Keycloak user id is not the UUID you used in step 4, so Ana will create a fresh tenant after switching modes; that is fine for an evaluation.

## 10. Switch maturad to OpenID Connect

Edit `compose.yaml` under `maturad.environment`: change `MATURA_AUTH: dev` to `MATURA_AUTH: oidc`, then:

```bash
docker compose up -d maturad
```

Now every `/v1` call needs `Authorization: Bearer <token>` with `aud: matura-api`, and a request with only dev headers answers `401` with a `problem+json` body.

## 11. Sign in to the portal through Keycloak

Reload `http://localhost:8080/portal/`. You are sent to Keycloak, sign in as Ana, and come back signed in with PKCE. Create an organisation from the portal (or `POST /v1/tenants` with the bearer token), enable AgentCanvas on the Apps page, and look at **My account** to see your profile as Matura knows it.

## 12. Look at an app token

Get a token for the `agentcanvas` client and read its claims. Because the client carries the Matura token mapper and Ana's organisation has the app enabled, the token names her tenant and permissions. The client only allows the browser (authorization code) flow, so for this one evaluation step turn on **Direct access grants** on the `agentcanvas` client in the Keycloak admin console (Clients → agentcanvas → Capability config), and turn it off again afterwards.

```bash
curl -s localhost:8180/realms/matura/protocol/openid-connect/token \
  -d grant_type=password -d client_id=agentcanvas -d username=ana@acme.test -d password=Ana-pass-123 \
  | jq -r .access_token | cut -d. -f2 | base64 -d 2>/dev/null | jq '{tid, tenant, troles, roles, perms, ver, pmode}'
```

The `tid`, `roles` and `perms` claims come from `maturad` (`POST /internal/v1/token-context`), called by the Keycloak extension while the token is minted. This is what your app verifies.

## 13. Run a readiness check

```bash
go build -o matura ./cmd/matura        # from the source bundle; or use the CLI image from the registry
MATURA_URL=http://localhost:8080 MATURA_TOKEN=<an operator's access token> ./matura check
```

The table lists every control with `pass`, `FAIL` or `n/a`, then each gap with its fix. On this stack you will see `install-production`, `install-tls` and `install-kek` fail because the evaluation settings are deliberately insecure.

## What you just did

You ran the whole control plane, created a tenant with the API, registered an app with a permission catalogue, granted roles by invitation, moved from header-trusted development sign-in to Keycloak with PKCE, saw the tenant claims Keycloak adds to an app token, and scored the installation against its control catalogue.

## Next steps

- Wire your own application with an SDK and run the conformance checker: [Integration](/docs/matura/integration).
- Replace every development secret, put a reverse proxy in front and set the public URLs: [Installation](/docs/matura/installation).
- The full environment reference: [Configuration](/docs/matura/configuration).
- Walk the portal and the tenant features in the order a customer meets them: [User guide](/docs/matura/user-guide).
