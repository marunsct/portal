---
title: Overview
description: What Matura is, who it is for, how it is built and where it stands today.
section: Matura
order: 1
updated: 2026-10-19
---

## What Matura is

Matura is a self-hosted control plane for identity, tenancy, access and compliance evidence. You run it next to your own application; your application verifies the tokens it issues, receives its signed events and keeps a few `matura_*` tables in sync. In return your application gets the things business buyers ask for before they sign: single sign-on, multi-tenancy with database-level isolation, a customer admin portal, invitations, roles and permissions, a tamper-evident audit log, data export and erasure, plan entitlements, agent identities, and a readiness score with evidence for SOC 2, ISO 27001 and GDPR reviews.

Matura never runs your application and never calls out to us. It is one Go binary (`maturad`), a Keycloak realm with a small Matura extension, Postgres, and optionally OpenFGA. It is commercial software, delivered as container images from our private registry and source-available to licensed customers.

Two things Matura is not:

- It is not an inference gateway or model router. It has no configuration for any model server. If your product runs local models, Matura is the layer around it that decides who may use it, in which tenant, with what audit trail.
- It is not a platform-as-a-service. It does not host, build or deploy your application.

## Who it is for

- **Teams with a working product who need to sell it to companies.** You have a prototype or an early product, often built with [DevFlow](/docs/devflow/overview) or [AgentCanvas](/docs/agentcanvas/overview), and the first enterprise prospect has sent a security questionnaire.
- **Operators who must keep everything on their own infrastructure.** Matura runs on Compose or Kubernetes against your Postgres and your Keycloak.
- **Developers in any language.** There are SDKs for Python, TypeScript and Go, but the contract is OpenID Connect, JWT, signed CloudEvents and plain SQL, with a conformance checker that tests any application from the outside.

## Vocabulary

| Term | Meaning |
|---|---|
| Installation | One running Matura: a `maturad` deployment, its database and its Keycloak realm. |
| Operator | A person with the realm role `matura-operator`. Operators manage apps, plans, database servers and tenants through `/admin/v1`. |
| Tenant | A customer organisation. The portal calls it an *organisation*. Kinds: `company` (default), `shared`, `personal`. |
| Workspace | A sub-division of a tenant; every tenant gets a default workspace. |
| Member | A person in a tenant with a tenant role: `owner`, `admin`, `billing` or `member`. A tenant always keeps at least one owner. |
| App | Your application, registered with a manifest. The manifest declares a permission catalogue, starter roles, a default role and how tenant data is placed. |
| Role, grant | An app role is a named set of permissions. A grant gives a member (or agent) a role in an app, for the whole tenant or one workspace. |
| Permission | A string the app's code checks, written `resource.action`. Tokens carry the member's permissions in `perms`. |
| Placement | Where a tenant's app data lives: `shared` (one database, row-level security), `schema` (one schema per tenant) or `database` (one database per tenant), managed by the app or by Matura. |
| Agent, service account | Non-human principals that belong to a tenant. They get their own Keycloak client, roles, expiry and a kill switch. |
| Change feed | An ordered log of every change, per app, that an app pulls to catch up; webhooks push the same events. |
| Readiness | A score computed from the installation's real state: which security controls are in place, with evidence and the fix for each gap. |

## Architecture

```
                       browser / app front end
                              │
                 ┌────────────┴─────────────┐
                 ▼                          ▼
   :8180  Keycloak (realm "matura")   :8080  maturad
          + Matura extension jar             ├── /v1, /admin/v1      JSON API
          │  token mapper                    ├── /portal/            customer portal (embedded)
          │  MFA policy authenticator        ├── /invitations/accept, /trust, /scim/v2
          │  tenant SSO authenticator        ├── /internal/v1        called by Keycloak
          │                                  └── :9090 /metrics      Prometheus
          └── POST /internal/v1/token-context ─────────┘
                              │
                              ▼
                 Postgres 16: databases matura, keycloak, openfga
                              ▲
                 OpenFGA 1.22 (optional) ──┘

   your app  ◄── JWT on every request, signed webhooks, change feed ──  maturad
```

| Service | Image (licensed registry) | Role | Ports |
|---|---|---|---|
| `maturad` | `registry.ownstack.example/matura/maturad:<version>` | API, portal, background leaders (event relay, provisioner, purger, audit streamer, privacy worker, mailer, OpenFGA syncer) | 8080 HTTP, 9090 metrics |
| `keycloak` | `registry.ownstack.example/matura/keycloak:<version>` | Keycloak 26.4 with the Matura extension; realm `matura` imported from JSON | 8180 |
| `postgres` | `postgres:16` | Control-plane database `matura` (roles `matura_owner`, `matura_app`), plus `keycloak` and `openfga` | 5432, internal |
| `openfga` | `openfga/openfga:v1.22.0` | Optional fine-grained permissions | 8081 → 8080 |
| `mailpit` | `axllent/mailpit:v1.27` | Development only: catches every email | 8025 |

`maturad` has five direct Go dependencies and uses the standard library HTTP server. There is no Redis, NATS or job runner: outbox and job tables with `SKIP LOCKED`, and Postgres advisory locks to elect one leader per background task, so several replicas can run without configuration. Migrations are embedded and run at start-up under an advisory lock.

Tenant isolation is enforced in the database. Tenant-owned tables use `FORCE ROW LEVEL SECURITY`; `maturad` connects as `matura_app`, which cannot bypass it; each request sets `matura.tenant_id` for its transaction. A request that forgets to set the tenant sees no rows.

## How it fits with the other products

| Product | Relationship |
|---|---|
| [AgentCanvas](/docs/agentcanvas/overview) | The first app on Matura. With `AGENTCANVAS_AUTH_MODE=matura` it verifies Matura tokens, maps its permissions onto its roles, receives webhooks and forwards run and publish events into the tenant audit log. It passes all 19 conformance checks. |
| [DevFlow](/docs/devflow/overview) | Runs with its own accounts today. Matura-backed sign-in for DevFlow is on the roadmap. |
| Your own app | Integrates the same way AgentCanvas does, with an SDK or the raw contract. See [Integration](/docs/matura/integration). |

## What is in the current release

Built and tested end to end against a real Keycloak: tenants, workspaces, members and invitations; apps, roles and grants; the customer portal; data placement in all three modes; signed webhooks and the change feed; the hash-chained audit log with streaming and verification; tenant security policies (MFA, session limits, allowed domains, IP allow-list); MFA and session management; per-tenant OIDC and SAML SSO with domain verification; SCIM 2.0; OpenFGA-backed resource permissions; agents and service accounts with on-behalf-of tokens; data export, access and erasure; entitlements; readiness, evidence, OSCAL export and the trust page; SDKs for Python, TypeScript and Go; the conformance checker; a Helm chart.

## Limitations and status

Read this before you plan a rollout.

- **Young.** The product was built in a short, intense period and this is its first licensed release. Breadth is wide; production hardening at scale has not happened yet. Treat it as a candidate for pilots, not for a regulated workload on day one.
- **No operator UI.** Everything an operator does (apps, plans, database servers, tenant suspension, support access, readiness) is API and CLI. The customer portal covers members, invitations, apps, workspaces, roles and the user's account; it has no pages yet for SSO, SCIM, agents, audit or security policy. Those are API-only.
- **Keycloak coupling.** The token mapper and two authenticators are a custom Java extension. Every Keycloak upgrade needs the extension rebuilt against it; a drop-in install into your existing Keycloak needs the jar installed.
- **Token revocation is not instant.** Deactivating a user or agent stops new tokens at once; tokens already issued live up to 5 minutes.
- **Not built yet:** usage metering and billing adapters, OpenBao or KMS for the key-encryption key (it is one environment variable), rate limiting, SCIM bulk operations, consent screens for delegated agent tokens, ISO 42001 and EU AI Act control packs in the readiness catalogue, temporary-password and bulk CSV invitations.
- **Readiness is not compliance.** The score tells you which controls are in place and shows evidence. It does not make you compliant; auditors decide.
- **Reverse proxy rules.** The portal is mounted at `/portal` and cannot be moved; the UI sets `frame-ancestors 'none'` and cannot be embedded in another site. Plan one hostname for `maturad` and one for Keycloak. See [Installation](/docs/matura/installation).

Next: the [Quickstart](/docs/matura/quickstart) gets a development stack running in about fifteen minutes.
