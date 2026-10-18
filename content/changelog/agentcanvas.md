---
title: AgentCanvas 0.28.1
description: Deep-review security fixes on top of the Matura tenancy work and every-framework Docker images.
order: 2
updated: 2026-10-19
---

Versions follow semver. Dates are UTC. Image tags: `registry.ownstack.example/agentcanvas/api:<version>` and `registry.ownstack.example/agentcanvas/web:<version>`.

## 0.28.1 — 2026-10-18

Fixes from a whole-codebase review; the critical and high-severity findings that needed no new design.

- **Security:** all workspace code now runs in the sandbox. With `AGENTCANVAS_SCRIPT_EXECUTION` other than `inprocess`, Python tools used to be imported into the API process (where they could read every project's decrypted secrets), and Script steps under `tools.`, `nodes.` or `events.` skipped the sandbox. Every tool call is now one sandbox run and the server never imports the module.
- **Security:** every run passes the security rules first (E041, E042, E043, E080), including runs started by cron, webhooks, event handlers and hand-over, which previously ran the draft unvalidated.
- **Security:** the API connects as an ordinary database role. `compose.prod.yml` runs `python -m agentcanvas.db.app_role` after migrations and connects as `agentcanvas_app` (new required `POSTGRES_APP_PASSWORD`), so Postgres row-level security applies; the Helm migrate Job does the same with `MIGRATE_DATABASE_URL`, `APP_DB_USER`, `APP_DB_PASSWORD`. Matura mode refuses to start in `staging`/`prod` on a role that bypasses RLS.
- **Security:** `compose.local.yml` (no sign-in) binds to `127.0.0.1` only; `WEB_BIND=0.0.0.0` opens it deliberately.
- Fixed: pauses on CrewAI, Google ADK, the flow-engine frameworks and Mastra reused a decided inbox item at a second pause on the same block; pause ids are now unique per run.
- Fixed: hand-over after a redeploy restarted runs of frameworks without saved state from the beginning; they now end with an error that says to start again.
- Fixed (web): queued edits survive opening another workflow and 409 conflicts; closing a tab with unsaved edits asks first; run and Copilot streams stop when the editor is left and a stale run's events cannot land in a fresh panel.
- Changed: `pyproject.toml`, `package.json` and the Helm chart's `appVersion` follow the API version; `compose.prod.yml` documents that `subprocess` is limits only and that non-LangGraph flows need `API_REPLICAS=1`.

## 0.28.0 — Matura workspaces, database isolation, portal links, audit sink

- Added: Matura **workspaces** group projects (`project.workspace_id`, `GET /v1/workspaces`, `GET /v1/projects?workspace_id=`, `PUT /v1/projects/{id}/workspace`); a workspace picker on Home. Matura mode only.
- Added: **row-level security on Postgres**. Forced `agentcanvas_tenant` policies on the 35 organisation-owned tables; in Matura mode every signed-in transaction sets `matura.tenant_id`; API connections start with `agentcanvas.all_tenants=on` so background work and the `dev`/`oidc` modes behave as before. `db/rls.py` lists every table as covered or exempt and a test fails when a new table is neither.
- Added: links to Matura's customer portal (`AGENTCANVAS_MATURA_PUBLIC_URL`, `AGENTCANVAS_MATURA_PORTAL_URL`); `GET /v1/me` returns `portal_url`.
- Added: an audit sink for security-relevant entries; `AGENTCANVAS_MATURA_AUDIT_URL` sends each as a signed CloudEvent (placeholder until Matura has an audit ingest API).
- Changed: shared data mode only; a token whose `pmode` is `schema` or `database` is refused with 503.

## 0.27.0 — Sign-in through Matura

- Added: `AGENTCANVAS_AUTH_MODE=matura`. The token names the organisation (`tid`) and its permissions (`perms`); the highest role whose permissions the token carries in full applies. People in several organisations switch with a picker.
- Added: Matura webhooks (`POST /v1/matura/events`, HMAC-signed) and the change feed keep organisations, people and roles current; `matura_*` contract tables on every install (empty unless used); `matura/manifest.json` with four permissions and four starter roles; passes Matura's 19-check conformance suite.
- Changed: in Matura mode the member and invitation endpoints answer 409 and Members is read-only with a link to the portal.

## 0.26.3 — Every framework in the Docker app by default

- Changed: the API image built for the Docker app includes every framework runtime (CrewAI, Google ADK, Pydantic AI, Agno, Microsoft Agent Framework, Strands, LlamaIndex, Mastra) so their workflows run without extra steps. The image is several GB; `FRAMEWORKS=none` or a list builds a smaller one. Production images still opt in per framework.
- 0.26.2 before it: "Runtime not available" in Docker fixed by building frameworks into the image; the Framework setting says what is not set up and `GET /v1/frameworks` returns `ready` and `setup`; **Download code** can package a workflow for any installed framework (`export.zip?framework=`); Full mode fits a 1,280 px window.
- 0.26.1 before it, **security:** a workflow's name, description or block ids can no longer become code in generated Pydantic AI, Agno, Microsoft Agent Framework, Strands, LlamaIndex, OpenAI Agents SDK, CrewAI, Google ADK or Mastra modules; Mastra prompt templates refuse `constructor`, `prototype` and `__proto__`; share-page visitors no longer see internal step tokens or pre-redaction text, cannot approve, and have a per-address rate limit (`AGENTCANVAS_RATE_LIMIT_PER_SHARE_CLIENT`); knowledge uploads are linear-time on pathological Markdown and refuse Word files that unpack past 100 MB; importers no longer take exponential time on many-branch files.
