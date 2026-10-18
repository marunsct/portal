---
title: Quickstart
description: From Docker and a local model server to a first built product in about fourteen steps.
section: DevFlow
order: 2
updated: 2026-10-19
---

This page gets DevFlow running on one machine and takes a small brief through to a
handover zip. Expect the run itself to take one to two hours on a mid-size local model.

> **Prerequisites**
>
> - Docker Engine 24 or later with Compose v2 (`docker compose version`).
> - A model server that speaks the OpenAI chat-completions API: LM Studio, Ollama,
>   llama.cpp `llama-server` or vLLM, on the same machine or reachable from it, with a
>   coding-capable model loaded and tool calling enabled. 32k tokens of context or more
>   is strongly recommended; 8k is the minimum the settings page accepts.
> - Your licence email: registry credentials and the compose bundle
>   `ownstack-devflow-<version>-compose.zip`.
> - About 12 GB of free disk for the image, Postgres and the first few workspaces.
> - A machine with at least 4 CPUs and 12 GB RAM free for the containers, on top of
>   whatever your model server needs.

## 1. Unpack the bundle and sign in to the registry

```bash
unzip ownstack-devflow-<version>-compose.zip -d devflow && cd devflow
docker login registry.ownstack.example -u <licensee-id>
```

## 2. Create the environment file

```bash
cp .env.example .env
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('SETTINGS_ENCRYPTION_KEY=' + secrets.token_hex(32))"
```

Paste both into `.env`, then set `ADMIN_PASSWORD` and `POSTGRES_PASSWORD` to values of your
own. The stack refuses to start without `JWT_SECRET_KEY` (at least 32 characters),
`ADMIN_PASSWORD` and `POSTGRES_PASSWORD` when `ENV=production`.

## 3. Let agents run commands

Agents cannot install, build or test anything until you allow it. For a single-machine
evaluation, run commands inside the worker container:

```env
ALLOW_COMMAND_EXECUTION=true
SANDBOX_EXECUTION_MODE=in-container
```

The default `container` mode needs `DOCKER_SOCKET=/var/run/docker.sock`, which gives the
worker root-equivalent access to the host. See [Installation](/docs/devflow/installation)
for the trade-off.

## 4. Point DevFlow at your model server

In `.env`, keep `LLM_PROVIDER=local` and set the base URL and the model id as the server
reports it:

```env
OPENAI_BASE_URL=http://host.docker.internal:1234/v1
OPENAI_MODEL=qwen2.5-coder-32b-instruct
MODEL_CONTEXT_WINDOW=32768
```

`host.docker.internal` resolves to the Docker host from inside the containers; the
compose file maps it for you. LM Studio listens on 1234, Ollama on 11434
(`http://host.docker.internal:11434/v1`), llama-server commonly on 8080. Set
`MODEL_CONTEXT_WINDOW` to what the loaded model really has: a larger number schedules
compaction at a point the model never reaches, which fails silently mid-run.

## 5. Pull the images and start the stack

```bash
docker compose pull
docker compose up -d
docker compose ps
```

Expected: `db`, `redis`, `app` and `worker` all `healthy` within about a minute. The
worker's healthcheck is `celery inspect ping` and can take 40 seconds to go green.

## 6. Check health

```bash
curl -s localhost:8000/api/health
curl -s localhost:8000/api/health/ready
```

Expected:

```json
{"status":"ok"}
{"status":"ok","db":"ok","redis":"ok","celery":"ok","runs":{"in_flight":0,"limit":null}}
```

## 7. Create an operator account (optional)

The `admin` account exists already. For day-to-day work create an operator, which can
start and steer runs but cannot change settings:

```bash
docker compose exec app python -m app.server.manage create-user demo --password <pw> --role operator
```

Expected: `Created 'demo' with role 'operator' in tenant 'default'.`

## 8. Sign in

Open `http://localhost:8000/` and sign in as `admin` with `ADMIN_PASSWORD`. Five failed
attempts from one address in five minutes lock sign-in for that window.

## 9. Confirm the model in Settings

Open **Settings**. Under **AI Provider Configuration** choose **Local (LM Studio / Ollama)**,
confirm the **Base URL** and **Model Name**, and press the detect control beside
**Context window (tokens)**; it probes the server and fills in what it reports, or tells
you why it could not. Set **Execution Mode** to "Stages run one at a time" for a first
run. Save as a named local model so you can reuse it.

If you have no stronger model, choose "No model" in the frontier section. Then check the
provider from the API as admin:

```bash
TOKEN=$(curl -s -X POST localhost:8000/api/auth/token -d 'username=admin&password=<ADMIN_PASSWORD>' | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
curl -s -H "Authorization: Bearer $TOKEN" localhost:8000/api/health/models
```

The response lists each configured provider with its status; a provider that cannot be
reached says so. `{"detail": "No models have been configured yet."}` means the settings
were not saved.

## 10. Write a small brief

Save this as `todo-brief.md`:

```markdown
# Task list

A single-page browser app. The user can add an item with a text box, mark it done,
delete it, and filter by all/active/done. Items persist across page reloads using
localStorage. No build step; plain HTML, CSS and JavaScript.

## Acceptance criteria
- AC-1 An item typed and submitted appears in the list.
- AC-2 Marking an item done shows it struck through and moves it to the done filter.
- AC-3 Deleting an item removes it permanently.
- AC-4 Items are still there after a reload.
```

## 11. Start the run

On **Home**, choose the file under **Choose product documents to upload**, set
**Delivery** to fast, leave **Use the frontier model** off, tick **Run unattended**, and
start the workflow. You land on the run dashboard at `/runs/<run-id>`.

The same thing from the API:

```bash
RUN=$(curl -s -H "Authorization: Bearer $TOKEN" -F files=@todo-brief.md localhost:8000/api/runs | python3 -c 'import sys,json;print(json.load(sys.stdin)["run_id"])')
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"delivery_mode":"fast","use_frontier_model":false,"auto_approve":true,"review_policy":{}}' \
  localhost:8000/api/runs/$RUN/start
```

Expected: `202 Accepted` and a status of `running` within a few seconds.

## 12. Watch it work

The dashboard shows the stage strip, live agent activity over a WebSocket, and three
centre tabs: **Results** (documents as they are written), **Technical log** and
**Changes** (the workspace's git history). Early documents are `docs/product_intake.md`
and `docs/technical_specification.md`; `docs/acceptance_criteria.md` appears when the
suite locks. If you want to redirect the agents, type a note in **Steer this run**.

Poll from the shell if you prefer:

```bash
curl -s -H "Authorization: Bearer $TOKEN" localhost:8000/api/runs/$RUN | python3 -m json.tool | grep -E '"status"|"current_stage"'
```

## 13. Collect the result

When the status is `completed`, the Delivery panel lists the criteria with their test
results and the release decision. Download everything:

```bash
curl -s -H "Authorization: Bearer $TOKEN" -o $RUN-handover.zip localhost:8000/api/runs/$RUN/handover
unzip -l $RUN-handover.zip | head
```

The zip holds the product, its tests, the locked acceptance suite, `docs/`, the decision
log and the sprint records. Run the product's own tests with the commands in the
included CI workflow.

## 14. Clean up (optional)

```bash
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" localhost:8000/api/runs/$RUN
docker compose down
```

`down` keeps the database (it is a bind mount under `./data/postgres`) and the
`appdata` volume. Add `-v` to drop the volumes; the database directory survives either way.

## What you just did

You installed the four-service stack, told it which model to use and how large its
window is, allowed the worker to run commands in its own container, and let a team of
agents take a brief through intake, specification, a locked acceptance suite, one
sprint and a release gate. The handover zip is the product plus the evidence that it
passes the suite written before it was built.

## Next steps

- [Installation](/docs/devflow/installation): a reverse proxy, TLS, backups and upgrades.
- [Configuration](/docs/devflow/configuration): every environment variable.
- [User guide](/docs/devflow/user-guide): review gates, approval mode, rewind and clone.
- [Integration](/docs/devflow/integration): driving runs from scripts and seeding from an existing codebase.
