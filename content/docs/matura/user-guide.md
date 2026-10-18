---
title: User guide
description: What a tenant owner, an end user and an operator do in Matura, screen by screen and call by call, in the order they meet it.
section: Matura
order: 5
updated: 2026-10-19
---

Matura has three kinds of people. **Operators** run the installation and work through `/admin/v1`. **Tenant owners and admins** run their organisation in the customer portal at `/portal/`. **Members** sign in to your app and occasionally visit *My account*. This guide follows one organisation, Acme, from creation to a connected identity provider. Commands assume `MATURA=https://matura.example.com` and a bearer token in `$TOKEN`; in a development install replace the `Authorization` header with `X-Matura-Dev-User` and friends.

## Sign in

Browse to `$MATURA/portal/`. The portal fetches `/portal/config.json`, learns the issuer and client id, and sends you to Keycloak with authorization code and PKCE. Tokens stay in memory; a reload goes through Keycloak again and returns at once while the session lasts. On a development install the page is replaced by *Dev sign-in*, which asks for a user id, email, name and whether to act as an operator.

The organisation switcher at the top of the sidebar lists your organisations; operators see all of them. The user menu at the bottom holds the theme and sign-out.

## Create an organisation

The first person to call `POST /v1/tenants` becomes the owner:

```bash
curl -s -X POST $MATURA/v1/tenants -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"slug":"acme","name":"Acme"}'
```

Slugs are 3–40 lower-case letters, digits or inner hyphens and must not be reserved words such as `admin`, `api` or `matura`. `kind` is `company` by default; `personal` tenants skip some controls such as the security policy. Operators may pass `owner_id` to create a tenant for someone else.

## Overview

The Overview page shows the organisation's name, plan and status, and counts of members, pending invitations, apps and workspaces. Owners and admins rename the organisation here. The same data comes from `GET /v1/tenants/{tid}` and `GET /v1/tenants/{tid}/entitlements`, which also lists the plan's limits (`max_members`, `max_workspaces`, `max_agents`, allowed `apps`, `features`) after any overrides.

## Apps

Before members can use your application in this organisation, an owner or admin enables it on the **Apps** page. The list shows every app the operator registered and that the plan allows. Enabling it (`PUT /v1/tenants/{tid}/apps/{app}`) creates the tenant's placement in the app's default mode and sends `matura.tenant_app.enabled` to the app. Members with no explicit grant get the app's default role; owners and admins also get the manifest's `owner_role` implicitly.

Disabling (`DELETE`) keeps data and grants but stops tokens for that app carrying the tenant.

## Members

The **Members** page lists everyone with their tenant role. Owners and admins change roles; only owners make or unmake owners; the last owner cannot be demoted, removed or leave. Deactivating a member (`PATCH …/members/{uid}` with `"status":"deactivated"`) keeps the seat but refuses tokens.

```bash
curl -s -X PATCH $MATURA/v1/tenants/$TID/members/$UID -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"tenant_role":"admin"}'
```

Adding an existing user directly (`POST …/members` with `user_id` or `email`) works when you know they already have an account; otherwise invite.

## Invitations

On the **Invitations** page, enter an email, a tenant role (`owner`, `admin`, `billing`, `member`) and a role per enabled app, optionally scoped to one workspace. The invitee receives an email with a link to `/invitations/accept`, which signs them in or up with Keycloak and joins them with the roles you chose. If the server has no SMTP relay, the portal shows the link once so you can send it yourself.

```bash
curl -s -X POST $MATURA/v1/tenants/$TID/invitations -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"email":"ben@acme.com","tenant_role":"member","app_roles":[{"app":"notes","role":"editor"}]}'
```

Links are single-use, stored only as a hash and expire after 7 days. Badges show `pending`, `accepted`, `revoked` or `expired`; resend (`POST …/invitations/{id}:resend`) issues a fresh link and revoke (`DELETE`) kills it. When the security policy sets `allowed_email_domains`, invitations to other domains are refused. Only owners can invite owners. `delivery: temp_password` is not available yet; the API says so with a 422.

## App access and roles

The **App access** page grants a member a role in an app for the whole organisation or for one workspace, and revokes it. The equivalent call:

```bash
curl -s -X POST $MATURA/v1/tenants/$TID/grants -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"app":"notes","user_id":"'$UID'","role":"editor","workspace_id":null}'
```

The **Roles** page shows each app's roles, the permissions they carry and which is the default. Operators create, rename, edit and delete roles there (`/admin/v1/apps/{slug}/roles`); the change applies in every organisation and apps learn of it through `matura.app.role.*` events. Tenant-scoped custom roles are not built yet.

## Workspaces

Workspaces divide an organisation; apps that declare `workspace_scoped` in their manifest can grant roles per workspace and tokens carry the workspace in `wid`. The **Workspaces** page lists, creates and renames them; archiving is through `PATCH …/workspaces/{wid}`.

## Security policy (API)

Owners and admins set the organisation's policy:

```bash
curl -s -X PUT $MATURA/v1/tenants/$TID/security-policy -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"require_mfa":true,"session_max_age":43200,"idle_timeout":1800,
       "allowed_email_domains":["acme.com"],"ip_allowlist":["203.0.113.0/24"]}'
```

- `require_mfa` makes Keycloak's `matura-mfa-policy` authenticator challenge members with a second factor and enrol those without one at their next password sign-in. Sign-ins through the organisation's own SSO leave MFA to that identity provider.
- `session_max_age` and `idle_timeout` are checked when an app asks for a token; a session past either limit is ended and the person signs in again.
- `ip_allowlist` applies to API calls in this tenant's scope. Make sure `MATURA_TRUSTED_PROXIES` is set, or every request appears to come from the proxy.

There is no portal page for this yet.

## Sessions and MFA

Everyone can list their sessions (`GET /v1/me/sessions`), end one, end all, or all but the current one (`?keep_current=true`), and see their MFA status (`GET /v1/me/mfa`). Owners and admins can list a member's sessions, sign them out (`POST …/members/{uid}:sign-out`) and reset their second factor (`…:reset-mfa`), for members they govern: people who belong to this organisation only, or whose email domain the organisation has verified. Admins cannot do this to owners.

## Enterprise SSO (API)

Three steps, all under `/v1/tenants/{tid}`:

1. **Verify a domain.** `POST …/domains {"domain":"acme.com"}` returns a TXT record name and value. Publish it, then `POST …/domains/acme.com:verify`.
2. **Connect the provider.** `POST …/sso` with `protocol: oidc` (`discovery_url`, `client_id`, `client_secret`) or `protocol: saml` (`metadata_url`, attribute names). The response gives the `redirect_uri` or SAML metadata to register in the provider. Set `default_tenant_role` for people who join through it.
3. **Send people there.** Your sign-in page calls the public `GET /v1/sso/discover?email=…` and adds `kc_idp_hint` to the authorisation request.

Only addresses in verified domains are accepted from the provider. First sign-in creates or links the account and joins the organisation with the default role.

## SCIM provisioning (API)

Owners create a SCIM token (`POST …/scim/tokens {"name":"okta"}`); the response shows the token once and the `scim_base_url` to paste into Okta or Entra. The provider then creates, updates, deactivates and deletes users and pushes groups. Group names are mapped to app roles with `POST …/scim/group-mappings {"group":"Finance","app":"notes","role":"editor"}`, and Matura keeps the grants in step with membership. Up to five live tokens per organisation.

## Agents and service accounts (API)

Give integrations and AI agents their own identity rather than a person's credentials:

```bash
curl -s -X POST $MATURA/v1/tenants/$TID/agents -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"kind":"agent","name":"Report bot","expires_at":"2027-01-31T00:00:00Z","grants":[{"app":"notes","role":"viewer"}]}'
```

The response holds `client_id`, a `client_secret` shown once and the `token_endpoint`. The agent fetches tokens with the client-credentials grant; it can also exchange a member's token for one that acts on their behalf, with the intersection of both permission sets. `PATCH …/agents/{id} {"status":"deactivated"}` is the kill switch; `POST …/agents/{id}:rotate-secret` rotates. Agents count against `max_agents`, not against member seats.

## Audit log (API)

Every change in the organisation is written to a hash-chained log in the same transaction as the change. Owners and admins read it, filter it and export it:

```bash
curl -s "$MATURA/v1/tenants/$TID/audit?action=member.&limit=50" -H "Authorization: Bearer $TOKEN"
curl -s "$MATURA/v1/tenants/$TID/audit/export?from=2026-10-01T00:00:00Z" -H "Authorization: Bearer $TOKEN" > audit.ndjson
curl -s "$MATURA/v1/tenants/$TID/audit:verify" -H "Authorization: Bearer $TOKEN"
```

Filters: `actor`, `action`, `from`, `to`, `limit` (up to 1000) and `cursor`. The export is NDJSON with every hash, so you can verify the chain yourself. Exporting is itself audited. To stream events to your own SIEM, create a sink: `POST …/audit/sinks {"kind":"webhook","url":"https://siem.acme.com/matura","backfill":true}`; deliveries are signed like app webhooks.

## Data rights (API)

- **Organisation export:** `POST …/exports` queues a job; poll `GET …/exports/{id}` until `state` is `ready`, then `GET …/exports/{id}/download` returns a JSON file with its `sha256`.
- **Your own data:** `GET /v1/me/export` downloads everything Matura holds about you.
- **Erasure:** `DELETE /v1/me` anonymises your rows and deletes your Keycloak account. An owner must hand over first; the last owner of an organisation cannot erase themselves.
- **Retention:** `PUT …/retention {"retention_days":400}` sets how long audit events are kept; `legal_hold` suspends deletion.

## My account

The **My account** page shows your profile as Matura knows it (name, email, verified flag), a link to edit it at the identity provider, and your organisations with a *leave* action. Leaving is refused for the last owner.

## Deleting an organisation

An owner calls `DELETE /v1/tenants/{tid}`. The organisation becomes `suspended` with a `purge_after` date; apps receive `matura.tenant.suspended`. During the grace period (`MATURA_TENANT_DELETE_GRACE`, 30 days by default) `POST /v1/tenants/{tid}:restore` brings it back. After it, the purger deletes the rows, moves placements to `retiring`, and drops Matura-managed schemas or databases once each app confirms `:deleted`.

## Operator tasks

Operators have no UI; the portal only adds the organisation switcher across all tenants and role editing. The common calls, all under `/admin/v1` and requiring the `matura-operator` realm role:

| Task | Call |
|---|---|
| Register or update an app | `PUT /admin/v1/apps/{slug}` with the manifest |
| Issue an app backend secret | `POST /admin/v1/apps/{slug}/secrets {"label":"prod"}` |
| Register a webhook | `POST /admin/v1/apps/{slug}/webhooks {"url":"https://…"}`; `POST …/webhooks/{id}/test` |
| Define plans | `PUT /admin/v1/plans/{id}` |
| Register a Postgres server for managed placements | `POST /admin/v1/db-servers`, then `POST …/db-servers/{id}/test` |
| Assign a plan or overrides | `PUT /admin/v1/tenants/{tid}/plan` |
| Suspend, resume, delete, restore a tenant | `POST /admin/v1/tenants/{tid}:suspend` (with `reason`), `:resume`, `:restore`; `DELETE /admin/v1/tenants/{tid}` |
| Ask to see a tenant's admin views | `POST /admin/v1/tenants/{tid}/support-access {"reason":"…","duration_minutes":60}`; an owner approves with `POST /v1/tenants/{tid}/support-access/{id}:approve`. Access is read-only and time-boxed. |
| Manage users | `GET /admin/v1/users?q=`, `PATCH …/users/{uid} {"status":"deactivated"}`, `DELETE …/users/{uid}` (row kept, anonymised) |
| Installation audit | `GET /admin/v1/audit`, `GET /admin/v1/audit:verify` |
| Numbers | `GET /admin/v1/stats` (tenants and users by status, tenants per app) |
| Readiness | `GET /admin/v1/readiness`, `POST /admin/v1/evidence` |

Every operator action that touches a tenant is written to that tenant's audit log as well as the installation's.
