---
title: Integration
description: The REST API, deployment keys, webhooks and events, MCP and A2A endpoints, the chat widget, OIDC and Matura, and exporting data.
section: AgentCanvas
order: 7
updated: 2026-10-19
---

## API overview

Everything the web app does goes through the JSON API. Through the web image the paths are under `/api/v1/…`; the API container itself serves `/v1/…` on port 8000 (the nginx in the web image strips `/api`). Errors are RFC 9457 `application/problem+json` with `type`, `title`, `status`, `detail`. In `dev` and `staging` the interactive reference is at `/api/docs` (OpenAPI at `/api/openapi.json`); `prod` hides it.

Two kinds of credentials:

| Caller | Credential | Endpoints |
|---|---|---|
| A person or your own service acting as a user | `Authorization: Bearer <OIDC access token>` (nothing in `dev` mode) | everything under `/v1/…`: projects, workflows, runs, inbox, evaluation, org |
| An application calling a published workflow | `Authorization: Bearer <deployment key>` | `/v1/deployments/{id}/runs/*`, `/threads/*`, `/mcp`, `/a2a` |
| A sender of a webhook | HMAC signature headers | `/v1/hooks/{trigger_id}` |
| A share-page visitor | the link token | `/v1/share/{token}/*` |

There is no SDK. The API is plain HTTP; the OpenAPI document can be fed to any client generator. The web app's own TypeScript types are generated from it.

### Main user-level endpoints

| Method and path | Purpose |
|---|---|
| `GET /v1/me`, `GET /v1/auth/config` | Current user and role; auth mode, issuer and client id for the SPA |
| `GET /v1/projects`, `POST /v1/projects` | Projects (with `workspace_id` in Matura mode) |
| `GET/PUT /v1/projects/{id}/setup`, `POST …/setup/test` | Default model and key; `{"model": "ollama:llama3.3", "base_url": null, "api_key": null}` |
| `GET /v1/projects/{id}/secrets`, `PUT …/secrets/{name}` `{"value": "…"}`, `DELETE` | Project secrets, names only on read |
| `POST /v1/projects/{id}/workflows`, `GET …/workflows`, `GET/PUT/DELETE /v1/workflows/{id}` | Workflow CRUD; `PUT` carries `If-Match` for optimistic concurrency, 409 on conflict |
| `POST /v1/workflows/{id}/commands` | Editor commands (the same edits the canvas sends) |
| `POST /v1/workflows/{id}/validate`, `GET …/code`, `GET …/portability`, `GET …/blast-radius`, `GET …/contract` | Diagnostics, generated code, framework badges, side-effect map, input/output contract |
| `POST /v1/projects/{id}/workflows/import` | `{"file": <Langflow/Flowise/n8n/Agent Spec JSON>, "name": "…"}` → new workflow with a report |
| `GET /v1/workflows/{id}/agent-spec`, `POST /v1/projects/{id}/workflows/agent-spec` | Open Agent Spec export and import |
| `POST /v1/workflows/{id}/runs/stream` | Run the draft; SSE (`stream: false` returns 202 with `run_id` to attach later) |
| `GET /v1/runs/{id}`, `GET …/events`, `POST …/cancel`, `GET /v1/threads`, `GET /v1/threads/{id}/history`, `POST …/resume`, `POST …/fork`, `POST …/state` | Run and thread inspection, time travel |
| `GET /v1/inbox`, `POST /v1/inbox/{interrupt_id}/decision` `{"value": true}` | Pending human decisions |
| `POST /v1/workflows/{id}/versions`, `GET …/versions/{a}/diff/{b}`, `POST …/versions/{ref}/restore` | Versions |
| `POST /v1/workflows/{id}/publish` `{"environment": "prod", "message": "…"}` | Checklist and deployment; the response carries `api_key` once |
| `POST /v1/deployments/{id}/rotate-key`, `DELETE /v1/deployments/{id}` | Key rotation, unpublish |
| `GET /v1/workflows/{id}/export/plan?target=`, `GET …/export.zip?target=&version=&framework=`, `POST …/github` | Export |
| `/v1/workflows/{id}/test-cases*`, `/v1/datasets*`, `/v1/evaluators*`, `/v1/experiments*`, `/v1/workflows/{id}/gates/{environment}`, `/v1/online*`, `/v1/annotation*` | Tests and Evaluation Studio |
| `/v1/projects/{id}/knowledge*`, `/v1/knowledge/{kb_id}/search`, `/v1/memory/namespaces`, `/v1/memory/items` | Knowledge and memory |
| `/v1/org/members`, `/v1/org/policies`, `/v1/org/settings`, `/v1/org/audit` | Administration |
| `GET/PUT /v1/projects/{id}/copilot-settings`, `POST /v1/workflows/{id}/copilot/messages` (SSE) | Copilot |
| `GET /v1/node-types`, `/v1/frameworks`, `/v1/model-providers`, `/v1/mcp-connectors`, `/v1/templates`, `/v1/ir-schema` | Catalogs |

### Run a draft and stream events

```bash
curl -N -X POST https://agentcanvas.example.com/api/v1/workflows/<wf_id>/runs/stream \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"input": {"ticket": "Where is my invoice?"}, "mode": "normal"}'
```

The stream is `text/event-stream`. Event types: `RUN_STARTED`, `STEP_STARTED`, `STEP_FINISHED`, `TEXT_MESSAGE_CONTENT` (streamed tokens), `STATE_DELTA`, `CUSTOM`, `RUN_FINISHED` (with `status`, `output`, `interrupts`), `RUN_ERROR` (with `code`, for example `cancelled` or `redeploy`). Reattach with `GET /v1/runs/{id}/events?after=<n>`.

## Deployment API

Publish a version, then call it with the deployment key. Requests count against `AGENTCANVAS_RATE_LIMIT_PER_DEPLOYMENT` (120/min) and `_PER_PROJECT` (600/min); 429 carries `Retry-After`.

```bash
curl -s -X POST https://agentcanvas.example.com/api/v1/deployments/<dep_id>/runs/wait \
  -H "Authorization: Bearer <deployment key>" -H "Content-Type: application/json" \
  -d '{"input": {"messages": [{"role": "user", "content": "Hello"}]},
       "user_id": "customer-42", "metadata": {"tier": "gold"}}'
```

```json
{"run_id": "run_…", "thread_id": "th_…", "status": "success",
 "output": {"messages": [ … ]}, "interrupts": [], "error": null}
```

| Endpoint | Body | Notes |
|---|---|---|
| `POST /v1/deployments/{id}/runs/wait` | `input`, optional `thread_id`, `context`, `user_id`, `metadata` (≤20 string labels) | Waits up to 300 s; then returns `status: "running"`. `interrupted` means the run waits for a person. |
| `POST /v1/deployments/{id}/runs/stream` | same | Server-Sent Events, as above. |
| `POST /v1/deployments/{id}/threads/{thread_id}/resume` | `{"value": true}` (or edited value, or text), `interrupt_id` when several are open | Answers a pause. |
| `POST /v1/deployments/{id}/runs/{run_id}/feedback` | `{"rating": "up" \| "down", "comment": "…"}` | A thumbs-down can route the run to an annotation queue. |

`user_id` is stored as `api:<deployment>:<user_id>` and drives per-user memory. `thread_id` continues a conversation; it stays on the version it started with unless the new version is resume-compatible. `metadata` is what online evaluators filter on.

## Webhooks and cron triggers

Create a trigger on the Versions tab or with `POST /v1/workflows/{id}/triggers`:

```json
{"kind": "webhook", "deployment_id": "dep_…",
 "config": {"input_mapping": {"ticket": "{{ body.issue.title }}"}}}
```

The response carries `url` (`/v1/hooks/{trigger_id}`) and `secret`, shown once. Without `input_mapping` the JSON body is the input. Senders sign each delivery:

```python
import hmac, hashlib, json, time, requests
secret, body = "whsec_…", json.dumps({"issue": {"title": "Printer on fire"}}).encode()
ts = str(int(time.time()))
sig = "sha256=" + hmac.new(secret.encode(), f"{ts}.".encode() + body, hashlib.sha256).hexdigest()
requests.post("https://agentcanvas.example.com/api/v1/hooks/trg_…", data=body,
              headers={"Content-Type": "application/json",
                       "X-AgentCanvas-Timestamp": ts, "X-AgentCanvas-Signature": sig})
# 202 Accepted
```

Deliveries older than 300 s, or with a bad or missing signature, get 401. A cron trigger is `{"kind": "cron", "config": {"schedule": "*/5 9-17 * * 1-5", "input": {…}}}`, 5 fields in UTC, firing once per minute across replicas. A trigger with a `deployment_id` runs the pinned version, otherwise the draft. `PATCH /v1/triggers/{id}` `{"enabled": false}` pauses one.

**Domain events** are the other inbound path: `POST /v1/projects/{id}/events` `{"type": "crm.lead.created", "data": {…}}` is matched against the handlers in the workspace's `events/` folder, which start or resume workflows. `POST …/events/dry-run` shows what would happen.

## Every deployment is an MCP server and an A2A agent

Both use the deployment key and the same rate limits. Runs started this way are ordinary deployment runs.

**MCP** (Streamable HTTP, stateless JSON responses): `POST /api/v1/deployments/{id}/mcp`. One tool named after the workflow with the workflow's input fields, plus `answer` when the workflow can pause. Claude Desktop through `mcp-remote`:

```json
{"mcpServers": {"support-triage": {"command": "npx",
  "args": ["-y", "mcp-remote", "https://agentcanvas.example.com/api/v1/deployments/<id>/mcp",
           "--header", "Authorization: Bearer <deployment key>"]}}}
```

Cursor, VS Code, LangChain's MCP adapter and the OpenAI Agents SDK take the URL and header directly.

**A2A** (JSON-RPC, A2A 0.3): card at `GET /api/v1/deployments/{id}/a2a/.well-known/agent-card.json` (no key), endpoint `POST /api/v1/deployments/{id}/a2a`. `message/send` runs the workflow (a `data` part gives input fields, a `text` part goes to the text input); a pause becomes `input-required`, answered by sending to the same `taskId`; `contextId` continues a conversation; `tasks/get` reads a task. Not supported: `message/stream`, push notifications, cancel.

In the other direction, the canvas consumes MCP servers (**App connector** block, 30-connector gallery) and remote A2A agents as steps.

## Share page and chat widget

With sharing on, `https://agentcanvas.example.com/s/<token>` is a public chat page (no account, per-visitor rate limit, visitors cannot approve). Embed the chat on any site:

```html
<script src="https://agentcanvas.example.com/widget.js" data-share="sh_…" async
        data-label="Ask us" data-position="left" data-color="#0a7"></script>
```

`/widget.js` is served with `Access-Control-Allow-Origin: *`; the `/s/` page allows any `frame-ancestors`. The share API is `GET /v1/share/{token}`, `POST /v1/share/{token}/runs/stream`, `POST …/threads/{thread_id}/resume`, `POST …/runs/{run_id}/feedback`.

## Identity: OIDC and Matura

The SPA uses authorization code with PKCE against the issuer that `GET /v1/auth/config` returns; your own services call the API with any access token the same issuer mints for the `AGENTCANVAS_OIDC_AUDIENCE`. In Matura mode the token also carries `tid` (organisation) and `perms`; Matura pushes membership changes to `POST /v1/matura/events` (HMAC-signed with `AGENTCANVAS_MATURA_WEBHOOK_SECRET`) and the API reads Matura's change feed hourly. Security-relevant audit entries can be forwarded as CloudEvents to `AGENTCANVAS_MATURA_AUDIT_URL`. See [administration](/docs/agentcanvas/administration#matura-mode) and [Matura](/docs/matura/overview).

## Observability integrations

Per project: Langfuse, Arize Phoenix, Datadog or any OTLP/HTTP collector (`PUT /v1/projects/{id}/trace-export`, `POST …/trace-export/test`). Server-wide: `OTEL_EXPORTER_OTLP_ENDPOINT`, `LANGSMITH_TRACING` with `LANGSMITH_API_KEY` (adds an **Open trace** link per run; also used by dataset sync).

## Exporting data

| What | How |
|---|---|
| A workflow as code | `GET /v1/workflows/{id}/export.zip?target=server&version=1.2.0` (LangGraph targets: `local`, `server`, `kubernetes`, `cloudrun`, `aws`, `azure`); `?framework=<id>` for any installed framework. The export's service answers the same `/v1/deployments/<name>/runs/*` API with `API_KEYS` from its environment, so a client moves by changing base URL and key. MCP and A2A are not part of the exported service. |
| A workflow to GitHub | `POST /v1/workflows/{id}/github` `{"repo": "acme/agents", "branch": "agentcanvas/support", "folder": "agents/support"}` with a `GITHUB_TOKEN` project secret; ≤500 files. |
| The workflow definition | `GET /v1/workflows/{id}` returns the IR JSON; `GET …/agent-spec` returns Open Agent Spec. Imports from Langflow, Flowise and n8n go through `POST …/workflows/import`. |
| Runs and threads | `GET /v1/threads?workflow_id=&status=&limit=200` with cursor paging, `GET /v1/threads/{id}/history`, `GET /v1/runs/{id}/events`. |
| Datasets and experiment results | Evaluation endpoints, CSV/JSONL import; LangSmith push and pull on demand. |
| Audit log | `GET /v1/org/audit` (admins). |
| Knowledge chunks | `GET /v1/knowledge/{kb_id}/documents/{doc_id}/chunks`. |
| Memory | `GET /v1/memory/items?namespace=…`. |
| The whole database | `infra/scripts/backup.sh` (a portable `pg_dump`). |
