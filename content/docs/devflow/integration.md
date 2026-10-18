---
title: Integration
description: Driving DevFlow from scripts and other systems, the event stream, MCP tool servers, codebase seeding and exporting what a run produced.
section: DevFlow
order: 7
updated: 2026-10-19
---

Everything the interface does goes through the HTTP API on the same origin, under
`/api`. The interactive OpenAPI document is at `/docs` on the `app` service. There is
no SDK; the examples use `curl` and `python3`.

## Authentication

Sign in with a form-encoded `POST` (there is no JSON login) and send the access token as
a bearer. Access tokens last 60 minutes; refresh tokens 7 days.

```bash
BASE=https://devflow.example.com
TOKEN=$(curl -s -X POST $BASE/api/auth/token \
  -d 'username=alice&password=<password>' | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
curl -s -H "Authorization: Bearer $TOKEN" $BASE/api/auth/me
```

Response of `/token`:

```json
{"access_token": "...", "refresh_token": "...", "token_type": "bearer", "expires_in": 3600}
```

Refresh with `POST /api/auth/refresh` and a JSON body `{"refresh_token": "..."}`.
Every request may carry `X-Correlation-ID` (letters, digits, `_ . : -`, up to 128
characters); the response echoes it and the logs carry it.

Rate limits: 300 requests per minute per caller, answered with 429 and
`Retry-After: 60`.

## Runs

| Method and path | Role | Purpose |
|---|---|---|
| `POST /api/runs` | operator | Create a run from 1 to 10 uploaded documents (`multipart/form-data`, field `files`). Returns 201 with `run_id`. |
| `POST /api/runs/{id}/codebase` | operator | Upload a codebase archive (`file`); returns `upload_id`. |
| `POST /api/runs/{id}/start` | operator | Start. JSON body optional. 202. |
| `GET /api/runs?limit=50&offset=0` | any | List runs in your tenant. |
| `GET /api/runs/{id}` | any | Full status: stage, stages, artifacts, reviews, cost, gaps. |
| `GET /api/runs/{id}/wizard` | any | The dashboard's phase model. |
| `GET /api/runs/{id}/stages`, `/artifacts`, `/decisions`, `/evidence`, `/changes`, `/changes/{sha}`, `/logs` | any | Stage history, documents, `DR-n` records, evidence pages, git history and diffs, event log. |
| `GET /api/runs/{id}/artifacts/download?path=docs/technical_specification.md` | any | One file from the workspace. |
| `GET /api/runs/{id}/handover` | any | The handover zip. |
| `POST /api/runs/{id}/pause`, `/resume`, `/cancel`, `/clone` | operator | Run control. |
| `GET /api/runs/{id}/rewind-points`, `POST /api/runs/{id}/rewind` | operator | List stages entered; rewind with `{"checkpoint_id": "..."}`. |
| `DELETE /api/runs/{id}` | operator | Delete a terminal run and its data. |
| `GET /api/runs/outcomes` | any | Finished runs with hours, mode, models, score and a time forecast per mode. |

Start-request body (all fields optional):

```json
{
  "delivery_mode": "fast",
  "use_frontier_model": false,
  "auto_approve": true,
  "review_policy": {"product_intake": false, "technical_specification": true, "acceptance_tests": false,
                    "sprint": false, "release": true, "escalation": true},
  "approval_timeout_minutes": 120,
  "reviewer": "alice",
  "workspace_label": "checkout-service",
  "allow_subdirectories": true,
  "llm_provider": "local",
  "openai_base_url": "http://host.docker.internal:1234/v1",
  "model_name": "qwen2.5-coder-32b-instruct",
  "source": null
}
```

Credentials are never accepted in a request body; the worker resolves them from its own
environment or the encrypted settings store. The three model override fields pin the
run to a provider, URL and model; `manage clear-run-overrides` drops such pins.

A complete unattended run from the shell:

```bash
RUN=$(curl -s -H "Authorization: Bearer $TOKEN" -F files=@brief.md -F files=@style-guide.pdf $BASE/api/runs \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["run_id"])')
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"delivery_mode":"thorough","auto_approve":true,"review_policy":{}}' $BASE/api/runs/$RUN/start
until [ "$(curl -s -H "Authorization: Bearer $TOKEN" $BASE/api/runs/$RUN | python3 -c 'import sys,json;print(json.load(sys.stdin)["status"])')" = completed ]; do sleep 300; done
curl -s -H "Authorization: Bearer $TOKEN" -o handover.zip $BASE/api/runs/$RUN/handover
```

Stop the loop on `failed`, `cancelled` or a `waiting_*` status in a real script.

## Reviews, approvals and steering

| Method and path | Body | Notes |
|---|---|---|
| `GET /api/runs/{id}/review` | | `{"pending": true, "review": {point, artifact_id, revision, comments, available_actions}}` while paused at a review point. |
| `POST /api/runs/{id}/review` | form: `action` = `approve`, `changes` or `skip`; `comment`; optional `file` (UTF-8 edited artifact) | `changes` needs a comment or a file. |
| `GET /api/runs/{id}/approval` | | The pending write, with a content preview. |
| `POST /api/runs/{id}/approval` | JSON `{"action": "approve" \| "reject", "reason": "..."}` | Only with auto-approve off. |
| `GET /api/runs/{id}/steering` | | Notes sent so far. |
| `POST /api/runs/{id}/steering` | JSON `{"text": "..."}` (up to 2000 chars) | Appended to every later model call. Any role. |

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -F action=changes -F 'comment=Add AC-5: export to CSV.' $BASE/api/runs/$RUN/review
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"text":"Use SQLite for storage; no external services."}' $BASE/api/runs/$RUN/steering
```

## Events: WebSocket and polling

There are no outbound webhooks; DevFlow does not call your systems. Instead subscribe
to a run's event stream or poll it.

**WebSocket.** Exchange the bearer token for a single-use ticket (valid 30 seconds),
then connect:

```bash
TICKET=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" $BASE/api/runs/$RUN/events/ticket \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["ticket"])')
# wss://devflow.example.com/api/runs/$RUN/events/stream?ticket=$TICKET&last_event_id=0
```

```python
import asyncio, json, websockets

async def follow(base, run, ticket):
    url = f"{base.replace('https', 'wss')}/api/runs/{run}/events/stream?ticket={ticket}&last_event_id=0"
    async with websockets.connect(url) as ws:
        async for raw in ws:
            frame = json.loads(raw)          # {"id": "<sequence>", "event": "<type>", "data": "<json>"}
            event = json.loads(frame["data"])
            print(event["sequence"], event["stage"], event["event_type"], event.get("message"))
```

Each frame has `id` (the sequence), `event` (the type) and `data` (the event as a JSON
string). The server pings every 20 seconds. Pass `last_event_id` to resume after a drop without
missing events. Your reverse proxy must pass the `Upgrade` header on this path.

**Polling.** `GET /api/runs/{id}/events?since=<sequence>` returns the events after a
cursor; `GET /api/runs/{id}/status` returns the current stage with its meaning and
whether the run is terminal. Both use the bearer token.

Event types include stage transitions, review and approval requests and decisions,
agent activity (when `STREAM_AGENT_ACTIVITY=true`), defects, budget pauses and errors.
Every event carries `run_id`, `event_id`, `sequence`, `timestamp`, `stage`, `event_type`
and `message`.

## Seeding from an existing codebase

A run can start from your code instead of an empty workspace. The interface has no
control for this; it is API-only.

From an archive (`.zip`, `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.tbz2`, `.tar.xz`, up
to 200 MB):

```bash
UPLOAD=$(curl -s -H "Authorization: Bearer $TOKEN" -F file=@service.tar.gz $BASE/api/runs/$RUN/codebase \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["upload_id"])')
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"source\":{\"type\":\"archive\",\"upload_id\":\"$UPLOAD\"}}" $BASE/api/runs/$RUN/start
```

From a git repository:

```json
{"source": {"type": "git", "url": "https://github.com/acme/service.git", "ref": "main", "token": "<read token>", "depth": 1}}
```

Clones are HTTPS to public hosts by default. For an internal git server set
`SEED_ALLOW_PRIVATE_HOSTS=true`, and `SEED_ALLOWED_SCHEMES` to add `ssh` or `git`.
The `ext::` transport is never allowed. The materialised tree is limited by
`SEED_MAX_BYTES` and `SEED_MAX_ARCHIVE_MEMBERS`.

## Settings over the API (admin)

| Method and path | Purpose |
|---|---|
| `GET /api/settings` | The effective settings, derived budgets and key hints. |
| `PUT /api/settings` | Replace the whole settings payload. |
| `PUT /api/settings/local` | Save the build model (provider, base URL, model, window, longest reply, thinking, key). |
| `PUT /api/settings/frontier` | Save the judgement model, or `{"no_model": true}` for none. |
| `POST /api/settings/detect-context-window` | Probe the server for its window. |
| `GET /api/settings/models`, `DELETE /api/settings/models/{id}` | Saved model profiles. |

With `SETTINGS_READ_ONLY=true` the write endpoints return an error and `.env` is the
only source.

## MCP tool servers

Agents can be given tools from Model Context Protocol servers. Set `HARNESS_MCP_SERVERS`
to a JSON map; each entry names the transport (`streamable_http`, `http`, `sse`,
`stdio` or `websocket`), the connection (`url` and `headers`, or `command`, `args`,
`env`, `cwd` for stdio), the tools to expose and the roles that get them:

```env
HARNESS_MCP_SERVERS='{"context7": {"transport": "streamable_http", "url": "https://mcp.context7.com/mcp", "headers": {"CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"}, "tools": ["resolve-library-id", "query-docs"], "roles": ["specialist", "principal_architect", "stack_selector"]}}'
```

Single quotes keep `${...}` for the harness to expand from its environment rather than
compose. `HARNESS_MCP_LOAD_TIMEOUT` and `HARNESS_MCP_CALL_TIMEOUT` bound the listing and
each call. DevFlow is an MCP client only; it does not expose an MCP server, and there is
no A2A endpoint.

## Identity and the suite

DevFlow authenticates with its own accounts. OIDC sign-in and Matura-backed tenancy are
on the roadmap and not available in this release; put the interface behind your own
SSO proxy if you need it today. See [Matura](/docs/matura/overview) for what that
integration will provide.

## Exporting data

- **The product**: `GET /api/runs/{id}/handover` (zip) or the workspace directory on the
  worker host, `DATA_DIR/workspaces/<tenant>/workspace-<run-id>/`, which is an ordinary
  git repository you can `git push` to your own remote.
- **Documents**: `GET /api/runs/{id}/artifacts` lists them;
  `/artifacts/download?path=...` fetches one.
- **Decisions and evidence**: `GET /api/runs/{id}/decisions` and `/evidence` as JSON;
  the same content is in `docs/decision_log.md` and `docs/reviews/` in the workspace.
- **Transcripts and ledger**: `DATA_DIR/transcripts/<run>.jsonl` and `DATA_DIR/ledger/`
  on the `appdata` volume.
- **Metrics**: `GET /metrics` for Prometheus.
- **Audit log**: the `audit_log` table in Postgres.

## Command line

The image also contains a single-process CLI for a run without the server:
`python -m app.main --document brief.md`, with `--model`, `--reviewer`, `--thread-id`
and `--repo-root`. It uses in-memory checkpoints and is intended for development and
tests, not for production runs.
