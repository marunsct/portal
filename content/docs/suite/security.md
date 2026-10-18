---
title: Security model
description: Trust boundaries, secrets, isolation and what each product does and does not protect.
section: The suite
order: 4
updated: 2026-10-19
---

## Trust boundaries

```
 ┌──────────────── your network ────────────────────────────────────────┐
 │                                                                       │
 │  people ──▶ gateway ──▶ product UI/API ──▶ product DB                 │
 │                              │                                        │
 │                              ├──▶ model server (OpenAI-compatible)    │
 │                              ├──▶ tools you configure (MCP, HTTP)     │
 │                              └──▶ Keycloak (Matura)                   │
 │                                                                       │
 └───────────────────────────────────────────────────────────────────────┘
          nothing crosses this line unless you configure it to
```

The products make no outbound connection that you did not configure. The exceptions are the
ones you choose: a hosted model provider key, an MCP server on the internet, a webhook
target, a trace exporter, an SMTP relay.

## Secrets

| Product | Secret | Protection |
|---|---|---|
| DevFlow | Provider API keys saved in Settings | Fernet-encrypted in Postgres under `SETTINGS_ENCRYPTION_KEY` |
| DevFlow | Session tokens | HS256 JWT signed with `JWT_SECRET_KEY` (32+ chars enforced in production) |
| AgentCanvas | Project secrets, provider keys | Envelope encryption under `AGENTCANVAS_KMS_KEY` with a key ring for rotation |
| AgentCanvas | Deployment API keys | Hashed at rest; shown once at creation |
| Matura | App secrets, agent secrets, SCIM tokens | AES-256-GCM envelope encryption under `MATURA_KEK`; secrets shown once |
| Matura | Internal Keycloak↔maturad token | `MATURA_INTERNAL_TOKEN`, 32+ chars |

Generate every key with a cryptographic random source (`openssl rand -hex 32`); each
installation page shows the exact commands. Keep them out of images and out of git; the
compose bundles read them from `.env` or Docker secrets.

## Identity and sessions

- **DevFlow** has its own accounts: admin, operator and viewer roles, per-tenant, with
  lockout after failed logins and per-caller rate limits.
- **AgentCanvas** has no password store of its own. Use its development mode only on a
  trusted network, OIDC with PKCE in production (any provider), or Matura.
- **Matura** delegates authentication to Keycloak and enriches tokens with tenant context.
  It enforces per-tenant MFA requirements, session lifetimes, allowed email domains and IP
  allow-lists, and it treats AI agents as revocable identities.

## Isolation

- Matura and AgentCanvas use Postgres row-level security with a runtime role that cannot
  bypass it, so a request without a tenant context returns nothing. Matura can also place a
  tenant in its own schema or its own database.
- DevFlow separates runs into per-tenant workspaces on disk. Its agents can execute
  commands only when you turn that on; then commands are argv-only, filtered by allow-lists,
  under CPU, memory and process limits, either inside the worker container or in a separate
  sandbox container (which needs the Docker socket; prefer the in-container mode unless you
  need stronger separation between runs).
- AgentCanvas runs user Python in an in-process, subprocess or Docker sandbox. The
  subprocess sandbox applies limits but is not isolation; use the Docker sandbox for
  untrusted code.

## Audit and evidence

- Matura writes a hash-chained audit log in the same transaction as the change; tenants can
  export and verify it, and it can stream to a SIEM.
- AgentCanvas keeps an audit log per organisation and exports traces to Langfuse, Phoenix,
  Datadog or any OTLP endpoint.
- DevFlow records every model and tool call as a transcript and every executed command in a
  ledger, per run, under its data directory.

## Updates and disclosure

Security fixes ship as patch releases, marked in the changelog and emailed to licence
contacts. Report vulnerabilities to the address on the [security page](/security); we
acknowledge within two business days.

## What the products do not do

- They do not scan or filter model output for you beyond the guard blocks AgentCanvas offers.
  Treat model output as untrusted input in your own application.
- They do not back themselves up. Each administration page has the backup and restore
  procedure; schedule it.
- They do not make you compliant with anything. Matura implements controls and produces
  evidence; the audit, the policies and the people remain your responsibility.
