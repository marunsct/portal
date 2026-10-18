---
title: FAQ
description: Short answers to the questions engineers ask when evaluating Matura.
section: Matura
order: 9
updated: 2026-10-19
---

## Is Matura a model gateway or an inference router?

No. It has no configuration for any model server and never sees a prompt. It is the identity, tenancy, audit and compliance layer around an application, including applications that run local models. If you need to route or meter model calls, that is a separate component in your stack; Matura decides who may call your application, in which tenant, and records what they did.

## Does it phone home or need a licence server?

No. `maturad` makes outbound calls only to your Postgres, your Keycloak, your SMTP relay, OpenFGA if configured, the webhook and audit-sink URLs you register, and the identity providers your tenants connect. Licensing is a signed file checked offline; see [Licensing](/docs/suite/licensing).

## Can I use my existing Keycloak?

Yes, in drop-in mode. Install the Matura extension jar (token mapper, MFA policy authenticator, tenant SSO authenticator) in that Keycloak's `providers/`, set `MATURA_URL` and `MATURA_INTERNAL_TOKEN` there, create the `matura-admin` confidential client, and attach the token mapper to the clients of apps that use Matura. Existing users keep signing in as before and join tenants when invited. The realm must run Matura's authentication flows for `require_mfa` and tenant SSO to work.

## Can I use a different identity provider than Keycloak?

Not as the issuer. The tenant claims are added by a Keycloak protocol mapper, and sessions, MFA, SSO brokering and SCIM provisioning use Keycloak's admin API. Your customers' identity providers (Okta, Entra, ADFS, Google Workspace and so on) connect per tenant through Keycloak brokering.

## How are tenants isolated?

In Postgres. Tenant-owned tables in Matura's own database use `FORCE ROW LEVEL SECURITY`, the runtime role cannot bypass it, and each request sets the tenant for its transaction; a request that sets none sees no rows. For your app's data, the manifest declares `shared` (one database with RLS, using the shipped policies), `schema` (a schema per tenant) or `database` (a database per tenant), managed by the app or provisioned by Matura on a registered Postgres server. The conformance checker proves from outside that tenant B cannot see tenant A's records.

## What does "readiness" mean, and does a high score make me compliant?

Readiness is a score computed from the installation's real state: which security controls are in place, with evidence and the fix for each gap, mapped to SOC 2, ISO/IEC 27001:2022 and GDPR references. It does not make anyone compliant. Organisational controls are outside what software can see, and an auditor decides. The exported OSCAL document and the trust page are inputs to that conversation, not a substitute for it.

## What happens when a webhook receiver is down?

Matura retries each endpoint in order with exponential backoff for 24 hours, then marks it `failing` and counts later events as `dropped` for that endpoint. The change feed keeps every event, so the app catches up by pulling `GET /v1/apps/{app}/changes` from its last cursor; the SDKs do this at start-up and hourly. Re-activate the endpoint with a `PATCH` once the receiver is fixed.

## Is there an operator UI?

Not yet. Operators register apps, issue secrets, define plans, register database servers, suspend or delete tenants, request support access and read readiness through `/admin/v1` and the `matura` CLI. The customer portal covers members, invitations, apps, workspaces, roles and the user's account; SSO, SCIM, agents, audit and security policy are API-only today.

## Can I embed the portal in my own product's UI?

No. `maturad` sends `frame-ancestors 'none'` and `X-Frame-Options: DENY`. Link to it. The portal path `/portal` is fixed and the portal must share its origin with the API.

## How fast is revocation?

Deactivating a user or an agent, removing a member or disabling an app refuses the next token immediately, because Keycloak asks `maturad` while minting every token. Tokens already issued live up to 5 minutes. Profiles are cached per replica for a minute. Ending sessions with `:sign-out` stops refreshes.

## What is stored encrypted, and what happens if I lose the KEK?

Webhook signing secrets, audit-sink secrets, SSO client secrets and database-server admin passwords are envelope-encrypted with AES-256-GCM under `MATURA_KEK`, because Matura must use them later. App backend secrets, invitation tokens and SCIM tokens are stored only as hashes, because Matura only ever compares them. Lose the KEK and the encrypted values cannot be read; the only way forward is to re-issue every one of them. Back up the KEK apart from the database dumps.

## Do I have to use an SDK?

No. The contract is OpenID Connect and JWT for tokens, HMAC-signed CloudEvents over HTTPS for events, a JSON change feed, and a few `matura_*` tables whose DDL ships for PostgreSQL, MySQL/MariaDB, SQL Server and SQLite. Shared test vectors let you check your implementation, and `matura-conformance` tests the running app from outside. The SDKs for Python, TypeScript and Go save you the boilerplate.

## Which Postgres and Keycloak versions are supported?

Postgres 16 is what the bundle ships and the Helm guide assumes. Keycloak 26.4 is what the extension is built against; every Keycloak upgrade needs a matching extension build, which is why the Keycloak image comes from our registry. OpenFGA 1.22.

## Does it run on Kubernetes?

Yes. The Helm chart runs two `maturad` replicas and, unless you bring your own, two Keycloak replicas, with ingress, network policies, a pod disruption budget, optional OpenFGA and a Prometheus ServiceMonitor. Postgres is not in the chart; use a managed service or CloudNativePG.

## How do multiple replicas coordinate?

Through Postgres only. Migrations run under an advisory lock; each background job (event relay, provisioning, purging, audit streaming, privacy work, email, OpenFGA sync) is led by whichever replica holds that job's advisory lock. There is no Redis, message broker or job runner to operate.

## What is in the audit log, and can it be edited?

Every change through the API: who (user, operator, agent, app, SCIM token, or an agent acting for a person), what, when, from which address and request id. Entries are hash-chained inside the same transaction as the change. Nothing in the API edits or deletes them; retention and legal hold apply per tenant; `:verify` recomputes the chain. Exporting the log is itself logged.

## How do agents get identities?

A tenant owner or admin creates an `agent` or `service` principal. Matura creates a confidential Keycloak client for it with token exchange enabled and the token mapper attached, and returns the secret once. The agent gets tokens with client credentials, or exchanges a person's token for one that carries `act` and only the permissions both hold. Agents have expiry, a kill switch, secret rotation and count against `max_agents`.

## What is not built yet?

Usage metering and billing, OpenBao or KMS for the KEK and crypto-shredding, rate limiting, instant token revocation, SCIM bulk operations, consent screens for delegated agent tokens, temporary-password and bulk CSV invitations, ISO 42001 and EU AI Act control packs in the readiness catalogue, SSO-only enforcement, tenant-scoped custom roles, and portal pages for SSO, SCIM, agents, audit and security policy.

## Where do I report a security issue?

To the security contact in your licence agreement. Installations that set `MATURA_SECURITY_CONTACT` show their own contact on the trust page for their customers.
