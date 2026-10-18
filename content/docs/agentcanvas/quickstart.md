---
title: Quickstart
description: From Docker and a local model server to a published, callable agent in about twenty minutes.
section: AgentCanvas
order: 2
updated: 2026-10-19
---

This walkthrough runs the whole product on one computer with the local compose file, which has no sign-in and binds to `127.0.0.1` only. For a server other people reach, go to [installation](/docs/agentcanvas/installation).

> **Prerequisites**
>
> - Docker Desktop (Windows, macOS) or Docker Engine 24+ with the Compose v2 plugin (Linux).
> - Your licence credentials for `registry.ownstack.example` and the compose bundle `ownstack-agentcanvas-compose.zip` from your licence email.
> - A local model server with a model that supports tool calling. This guide uses Ollama with `llama3.3`; LM Studio, vLLM and llama.cpp work the same way.
> - About 12 GB of free disk for the images (the API image with every framework runtime is several GB) and 8 GB of RAM for the stack, plus whatever your model needs.
> - Port 7777 free on the host.

## 1. Start your model server

```bash
ollama pull llama3.3
ollama serve
```

Ollama listens on `http://localhost:11434`. The API container reaches it through `host.docker.internal`, which the compose file maps for you on Linux and Docker Desktop provides on its own.

## 2. Unpack the bundle and sign in to the registry

```bash
unzip ownstack-agentcanvas-compose.zip -d agentcanvas && cd agentcanvas
docker login registry.ownstack.example
```

The bundle contains `infra/compose.local.yml`, `infra/compose.prod.yml`, `infra/.env.local.example`, `infra/.env.prod.example`, `infra/nginx.conf` and `infra/scripts/`.

## 3. (Optional) set a port or server-wide keys

```bash
cp infra/.env.local.example infra/.env.local
```

Everything in it can be left empty. `WEB_PORT=7777` is the default; `AGENTCANVAS_LOCAL_MODELS_HOST=host.docker.internal` is already right for Ollama on the same machine. Provider keys can go here, but the first-run screen stores them as encrypted project secrets instead, which is the usual path.

## 4. Pull the images and start

```bash
API_IMAGE=registry.ownstack.example/agentcanvas/api:0.28.1 \
WEB_IMAGE=registry.ownstack.example/agentcanvas/web:0.28.1 \
docker compose -f infra/compose.local.yml --env-file infra/.env.local up -d --wait
```

Expected output ends with every service healthy:

```
 ✔ Container agentcanvas-local-postgres-1  Healthy
 ✔ Container agentcanvas-local-api-1       Healthy
 ✔ Container agentcanvas-local-web-1       Healthy
```

The API runs `alembic upgrade head` on start and seeds a default organisation, project and admin user. Follow it with `docker compose -f infra/compose.local.yml logs -f api`; you should see `api.started auth=dev database=postgresql edition=dev env=dev`.

## 5. Open the app

Open `http://localhost:7777`. There is no sign-in: every request is the built-in admin `dev@localhost`. Home shows **Set up your model**.

## 6. Choose a model

1. Click **Choose a model**.
2. Under **On your machine** pick **Ollama**.
3. Type or pick `ollama:llama3.3`. Leave **Server address** empty.
4. Click **Test connection**. AgentCanvas sends one short message and shows the reply. A connection error here means the model server is not running or not reachable from the container; see [troubleshooting](/docs/agentcanvas/troubleshooting).
5. Click **Save**. This becomes the project's default model; templates you open from now on use it.

## 7. Open a template and run it

1. On Home, pick **Chat assistant** from the template gallery. The editor opens with the palette on the left, the canvas in the middle, and the **Inspector / Run / Tests / Versions / Code** tabs on the right.
2. Open the **Run** tab, switch to **Chat**, type `What can you do?` and press **Send**.
3. The agent card lights up, tokens and latency appear on it, and the reply streams into the panel.

## 8. Give the agent a tool that needs approval

1. In the palette search for **App connectors** and drag **DuckDuckGo Search** or **Fetch** onto the canvas. These are `stdio` connectors that start a program on the server, so if the Problems dock shows `E042`, pick an HTTP connector such as **Context7** or **Cloudflare Docs** instead (no key needed), or set `AGENTCANVAS_ALLOW_LOCAL_MCP=true` on the API and restart.
2. Wire the connector's `tools` output into the agent's `tools` port. A refused connection shows why.
3. Click **Browse tools**, tick a tool, and under the agent's settings add that tool to **Pause for a human before these tools run**.
4. Run again with a question that needs the tool. The run pauses with **Approval needed**. Click **Approve**, or open **Inbox** in the top bar and decide there.

## 9. Read the generated code and switch framework

Open the **Code** tab: this is the LangGraph Python program compiled from your canvas, each block tagged `# ── @canvas-node … ──`. Click empty canvas, change **Framework** to **Pydantic AI**, and watch the code and the framework badges next to the workflow name change. Switch back to LangGraph (Undo works too).

## 10. Save a test case and a version

1. On the **Run** tab, after a successful run, click **Save as test case**.
2. Open **Tests** and press **▶ Run tests**; the case should pass.
3. Open **Versions** and click **Save version**. It becomes `1.0.0`.

## 11. Publish and call it over HTTP

1. On **Versions**, click **Publish** and pick environment `dev`. The publish checklist (validation, policies, secrets, tests, contract, release gate) runs and the deployment is created.
2. Copy the **API key**. It is shown once.
3. Call it:

```bash
curl -s -X POST http://localhost:7777/api/v1/deployments/<deployment id>/runs/wait \
  -H "Authorization: Bearer <api key>" \
  -H "Content-Type: application/json" \
  -d '{"input": {"messages": [{"role": "user", "content": "Hello"}]}}'
```

```json
{"run_id": "run_…", "thread_id": "th_…", "status": "success",
 "output": {"messages": [ … ]}, "interrupts": [], "error": null}
```

## 12. Share it as a chat page

Under the deployment, open **Share as an app or a chat widget**, tick **Anyone with the link can chat with this deployment**, save, and open the link. It serves from `http://localhost:7777/s/<token>` and needs no account.

## 13. Stop

```bash
docker compose -f infra/compose.local.yml down        # data stays in the pgdata and workspaces volumes
docker compose -f infra/compose.local.yml down -v     # delete everything
```

## What you just did

You ran the three-container stack (Postgres with pgvector, the API, the nginx web image), pointed it at a model on your own machine, built an agent with an approval-gated tool, read the framework-native code it compiles to, saved a regression test and a version, published a deployment behind an API key, called it over the same `/api/v1` path the browser uses, and shared it with a public page. Nothing left your computer.

## Next steps

- [User guide](/docs/agentcanvas/user-guide): the Timeline, Explain, pins, Copilot, Knowledge, Memory and Evaluation Studio.
- [Integration](/docs/agentcanvas/integration): the deployment API, webhooks, MCP and A2A endpoints, export.
- [Installation](/docs/agentcanvas/installation): the production compose file with OIDC sign-in, a reverse proxy and backups.
