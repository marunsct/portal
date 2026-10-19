# Running the Ownstack portal and the product demos

This guide takes you from a fresh checkout to:

1. the portal running on your laptop (5 minutes);
2. the portal plus all three products running locally with hosted-style demo sessions
   (an afternoon, mostly image builds);
3. the whole thing on a public server with your own domain and HTTPS.

Do them in order the first time. Each stage ends with a check you can run, so if something
breaks you know which stage it belongs to. The day-to-day runbook is
[`OPERATIONS.md`](OPERATIONS.md); the reasoning behind the design is in [`PLAN.md`](PLAN.md).

---

## 0. What you are running

```
                 browser
                    │
        ┌───────────▼──────────────────────────────────────────┐
        │ gateway (Caddy)  ports 80/443                         │
        │   www.<domain>        → portal                        │
        │   devflow.demo.<dom>  → DevFlow      ┐                │
        │   canvas.demo.<dom>   → AgentCanvas  │ only with a    │
        │   matura.demo.<dom>   → Matura       │ demo session   │
        │   id.demo.<dom>       → Keycloak     ┘ cookie         │
        └──────┬───────────────────────────┬───────────────────┘
               │                           │
     ┌─────────▼────────┐      ┌───────────▼────────────────────────────────┐
     │ portal  :3000    │      │ products, each in its own Docker Compose     │
     │ pages, docs,     │      │   DevFlow      :8000                         │
     │ demo sessions,   │      │   AgentCanvas  :7777                         │
     │ support tickets  │      │   Matura       :8080  (+ Keycloak :8180)     │
     └──────────────────┘      └───────────┬────────────────────────────────┘
                                           │ OpenAI-compatible API
                                 ┌─────────▼─────────┐
                                 │ your model server │  LM Studio / Ollama / vLLM
                                 └───────────────────┘
```

| Piece | Lives in | Started by |
|---|---|---|
| Portal (website, docs, demo launcher, support form) | this repository | `docker compose up` |
| Gateway (hostname routing, TLS, demo gate) | `gateway/Caddyfile` | `docker compose up` |
| DevFlow, AgentCanvas, Matura | their own repositories | `scripts/products.sh up` |
| Model server | your machine or a GPU box | you |

---

## 1. Prerequisites

| Need | For | Check |
|---|---|---|
| Docker Engine 24+ with Compose v2 (Docker Desktop is fine on macOS/Windows) | everything | `docker compose version` |
| git, openssl, curl | everything | `git --version && openssl version` |
| Port 80 free on the host (443 too for production) | gateway | `sudo lsof -i :80` shows nothing |
| Read access to the three product repositories on GitHub | stage 2 | `git ls-remote https://github.com/marunsct/AgentCanvas.git` |
| A model server with a coding-capable model | stage 2, DevFlow and AgentCanvas | see §3.1 |
| 16 cores, 32 GB RAM, ~60 GB free disk | stage 2 with all three products | |
| Node.js 22 | only if you work on the portal without Docker | `node --version` |

On Windows, run everything inside WSL 2. Linux and macOS work as they are.

---

## 2. Stage 1: the portal on your laptop (5 minutes)

```bash
git clone https://github.com/marunsct/portal.git
cd portal
cp .env.example .env
```

Open `.env` and set one value:

```env
DEMO_SESSION_SECRET=<paste the output of: openssl rand -hex 32>
```

Leave everything else as it is; the defaults are for `localhost`. Then:

```bash
docker compose up -d --build
docker compose ps          # portal should show "healthy" after ~20 s
```

Open **http://www.localhost**. Browsers resolve every `*.localhost` name to your own
machine, so no DNS or hosts-file changes are needed. (`http://localhost` without `www`
redirects there.)

**Check:**

```bash
curl -s http://www.localhost/api/demo/status
# {"products":{"devflow":{"status":"down",...},"agentcanvas":...}}
```

`"down"` is correct at this stage: the products are not running yet. The rack on the home
page shows them as offline for the same reason.

> **First build note.** The portal image installs its four runtime dependencies from npm
> during `docker compose up --build`. It was built and tested with esbuild and
> `node dist/server.js` directly; the first Docker build happens on your machine. If it fails
> at `npm install`, see the troubleshooting table at the end.

### Working on the portal without Docker

```bash
npm install
npm run build
DEMO_SESSION_SECRET=$(openssl rand -hex 32) PUBLIC_DOMAIN=localhost DEMO_ZONE=demo.localhost \
  DEMO_SCHEME=http npm start
# http://localhost:3000
```

`npm run dev` rebuilds on every change. Content lives in `content/` (Markdown) and
`src/lib/products.ts`; names, prices and emails in `site.config.ts`.

---

## 3. Stage 2: the portal plus all three products, locally

### 3.1 Start a model server

DevFlow and AgentCanvas need an OpenAI-compatible model endpoint that **containers** can
reach. Pick one:

**LM Studio** (easiest on a Mac or a desktop with a GPU)
1. Download a coding model, for example a Qwen3-Coder or Qwen 3.x 27–35B build that fits
   your memory. Load it with at least a 32k context length.
2. Developer tab → Start server, and enable **Serve on local network**. Default port 1234.

```bash
curl -s http://localhost:1234/v1/models     # lists the loaded model
```

**Ollama**

```bash
OLLAMA_HOST=0.0.0.0 ollama serve &          # must listen on all interfaces
ollama pull qwen3-coder:30b                 # or another coding model you prefer
curl -s http://localhost:11434/v1/models
```

**vLLM** (a Linux GPU server, best for several concurrent users)

```bash
vllm serve <model> --host 0.0.0.0 --port 8001 --max-model-len 32768
```

Use port 8001 or another free port: DevFlow uses 8000 and Matura 8080, which are vLLM's and
llama.cpp's defaults.

Note the model's exact name as the server reports it, and its context length.

### 3.2 Configure the demo settings

In the portal's `.env`:

```env
DEVFLOW_DEMO_PASSWORD=<choose a password visitors will see on the DevFlow launch page>
DEMO_GATE_DISABLED=true
```

`DEMO_GATE_DISABLED=true` is for local testing in Chrome only. Chromium refuses cookies
scoped to `localhost`, so the demo gate cannot recognise you on `*.localhost`. To test the
real gate locally, see §3.6.

Restart the portal so it picks the values up:

```bash
docker compose up -d
```

### 3.3 Start the three products

```bash
MODEL_BASE_URL=http://host.docker.internal:1234/v1 \
MODEL_NAME=<the model name from 3.1> \
MODEL_CONTEXT_WINDOW=32768 \
scripts/products.sh up
```

Change the URL for Ollama (`:11434/v1`) or vLLM (`:8001/v1`). The model settings are only
read the first time; they are written into DevFlow's `.env` under `scripts/products/devflow/`.

What the script does:

| Product | Source | Runs with | Notes |
|---|---|---|---|
| DevFlow | `marunsct/DevFlow`, branch `harness-hardening-session` | production mode, generated secrets, local model, command execution in the worker container, settings read-only, one run at a time | creates the `demo` operator with `DEVFLOW_DEMO_PASSWORD`; the admin password is in `scripts/products/devflow/.env` |
| AgentCanvas | `marunsct/AgentCanvas`, `main` | no-login development mode, LangGraph-only image | set `AGENTCANVAS_FRAMEWORKS=all` in `.env` for every framework (image grows to several GB) |
| Matura | `marunsct/Platform`, `main` | development auth, Keycloak, Mailpit, OpenFGA | creates a demo tenant |

The first `up` takes a while: DevFlow's image carries every language toolchain plus
Chromium (expect 15–30 minutes), and Matura compiles a Go binary and a Keycloak extension
with Maven. Later runs reuse the images.

If the repositories are private and HTTPS cloning asks for credentials, either run
`gh auth login` first or point the script at SSH URLs:

```bash
DEVFLOW_REPO=git@github.com:marunsct/DevFlow.git \
AGENTCANVAS_REPO=git@github.com:marunsct/AgentCanvas.git \
MATURA_REPO=git@github.com:marunsct/Platform.git \
scripts/products.sh up
```

**Check:**

```bash
scripts/products.sh status
# devflow      up
# agentcanvas  up
# matura       up
curl -s http://www.localhost/api/demo/status     # statuses now "up"
```

### 3.4 Walk through a demo as a visitor would

1. Open http://www.localhost. The rack lights on the home page turn green within 30 s.
2. **Demos → DevFlow → Start a 45-minute session.** The launch page switches to its live
   state: a countdown, the `demo` credentials and an **Open DevFlow** button.
3. The button opens http://devflow.demo.localhost. Sign in as `demo`.
4. Repeat for AgentCanvas (http://canvas.demo.localhost) and Matura
   (http://matura.demo.localhost/portal/).
5. **End my session** on the launch page clears the cookie.

DevFlow runs take an hour or more on a local model. Start one run from a benchmark brief
(`scripts/products/devflow/benchmarks/web-todo/brief.md`) after `up`, so visitors see a
finished result; it survives until the next reset.

### 3.5 Useful commands

```bash
scripts/products.sh logs devflow      # or agentcanvas, matura
scripts/products.sh down              # stop all three, keep data
scripts/products.sh reset             # wipe demo data and start fresh
docker compose logs -f portal gateway
```

### 3.6 Testing the real demo gate locally

The gate (a signed cookie checked by Caddy on every demo request) needs a domain the
browser will set cookies on. Use a made-up one:

```bash
sudo sh -c 'echo "127.0.0.1 ownstack.test www.ownstack.test devflow.demo.ownstack.test canvas.demo.ownstack.test matura.demo.ownstack.test id.demo.ownstack.test" >> /etc/hosts'
```

In `.env`: `PUBLIC_DOMAIN=ownstack.test`, `DEMO_ZONE=demo.ownstack.test`,
`DEMO_GATE_DISABLED=false`. Then `docker compose up -d` and open http://www.ownstack.test.
Opening http://devflow.demo.ownstack.test without a session now sends you to the launch page.

---

## 4. Stage 3: production on your own server and domain

### 4.1 Server

- Ubuntu 22.04/24.04 or Debian 12; Docker Engine 24+ with Compose v2.
- 16 cores, 32 GB RAM, 200 GB SSD for the portal plus three demo products. The model server
  can be on the same machine (with a GPU) or another box on the private network.
- Firewall: allow 22, 80 and 443 from the internet; **nothing else**. The products' ports
  (8000, 7777, 8080, 8180, 8025, 8081) must stay private.

```bash
sudo ufw allow 22,80,443/tcp && sudo ufw enable
```

Clone to `/opt/ownstack/portal` as a user in the `docker` group.

### 4.2 DNS

| Record | Type | Value |
|---|---|---|
| `www.<domain>` | A (and AAAA) | the server's IP |
| `<domain>` | A | the server's IP |
| `*.demo.<domain>` | A | the server's IP |

If your DNS provider has no wildcards, create `devflow`, `canvas`, `matura` and `id` under
`demo.<domain>` individually.

### 4.3 Configure

`.env`:

```env
PUBLIC_DOMAIN=<domain>
DEMO_ZONE=demo.<domain>
SITE_ADDRESS_PREFIX=
DEMO_SCHEME=https
ACME_EMAIL=you@<domain>
DEMO_SESSION_SECRET=<openssl rand -hex 32>
DEVFLOW_DEMO_PASSWORD=<a password you don't mind visitors seeing>
DEMO_GATE_DISABLED=false
DEMO_REQUIRE_EMAIL=false        # true asks visitors for name/email before a session
SUPPORT_WEBHOOK_URL=            # optional: a Slack incoming webhook to see support tickets
```

`SITE_ADDRESS_PREFIX` empty tells Caddy to get Let's Encrypt certificates for every
hostname automatically; DNS must already point at the server and ports 80/443 must be open.

Before going public, edit `site.config.ts`: company name, legal name, contact emails and
prices are placeholders.

### 4.4 Start

```bash
docker compose up -d --build
MODEL_BASE_URL=http://<model-host>:<port>/v1 MODEL_NAME=<model> MODEL_CONTEXT_WINDOW=<n> \
  scripts/products.sh up
sudo cp scripts/reset-demo.cron /etc/cron.d/ownstack-demo-reset   # edit path and user first
```

### 4.5 Check

```bash
curl -sI https://www.<domain> | head -1                  # HTTP/2 200
curl -s  https://www.<domain>/api/demo/status            # three products "up"
curl -sI https://devflow.demo.<domain> | grep -i location # 302 to /demo/devflow (no session)
docker compose logs gateway | grep -i "certificate obtained"
```

Then walk through §3.4 on the real domain, from a phone as well as a laptop.

---

## 5. Keeping it running

| Task | Command |
|---|---|
| Update the portal | `git pull && docker compose up -d --build` |
| Update the products | `scripts/products.sh up` (re-fetches the branches) |
| Back up leads and tickets | `docker compose cp portal:/data ./backup-$(date +%F)` |
| Read support tickets | `docker compose exec portal cat /data/tickets.jsonl` |
| Rotate the demo secret | change `DEMO_SESSION_SECRET`, `docker compose up -d` (ends all live sessions) |
| Nightly reset | the cron file from §4.4, or `scripts/products.sh reset` by hand |

More in [`OPERATIONS.md`](OPERATIONS.md): wildcard certificates, products on another
machine, self-hosting the fonts, adding a product.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `docker compose up` stops with `set DEMO_SESSION_SECRET in .env` | the secret is empty | §2 |
| Port 80 already in use | another web server is running | stop it, or set `HTTP_PORT=8088`; demo links assume port 80, so prefer freeing it |
| Portal build fails at `npm install` | registry unreachable, or a newer dependency release changed behaviour | retry; if it persists, pin exact versions in `package.json` (built and tested with react 19.2, marked 18, esbuild 0.28; gray-matter 4 is the current release), run `npm install` once and commit the generated `package-lock.json` |
| Gateway container restarts | Caddyfile error | `docker compose logs gateway`; the message names the line |
| Demo host keeps sending you back to the launch page | cookie not reaching the demo host | locally: `DEMO_GATE_DISABLED=true` or §3.6; in production: check `DEMO_ZONE` is `demo.<PUBLIC_DOMAIN>` and that you are on https |
| Rack lights stay grey or red | the portal cannot reach a product | `scripts/products.sh status`; check `*_UPSTREAM` in `.env`; on Linux `host.docker.internal` needs the `extra_hosts` entry already in the compose file |
| DevFlow run fails immediately with a model error | containers cannot reach the model server | from the host: `docker compose -f scripts/products/devflow/docker-compose.yml exec app curl -s $MODEL_BASE_URL/models`; make sure the server listens on 0.0.0.0, not 127.0.0.1 |
| DevFlow fails part-way with context-length errors | `MODEL_CONTEXT_WINDOW` larger than what the server loaded | set it to the real value in `scripts/products/devflow/.env`, then `scripts/products.sh up` |
| Live updates in DevFlow or AgentCanvas freeze | a proxy in front of Caddy buffers WebSockets/SSE | Caddy itself is configured for streaming; disable buffering in any CDN or corporate proxy in front of it |
| Matura build fails downloading Maven artifacts | no access to Maven Central | allow it, or build on a machine that has access and push the images |
| Matura invitation links point at localhost | its compose sets `MATURA_PUBLIC_URL` to localhost | harmless for the demo; set it to `https://matura.demo.<domain>` in its compose to fix |
| Let's Encrypt fails | DNS not pointing at the server yet, or ports 80/443 blocked | fix DNS/firewall, then `docker compose restart gateway` |

---

## 7. What is still on you

These came out of the research and the plan; none of them blocks running the site.

1. **Licence files in the product repositories.** The site now states the adopted model:
   DevFlow and AgentCanvas under the Fair Core License (FCL-1.0-ALv2), Matura's core,
   SDKs and conformance CLI under Apache-2.0. Add an `FCL-1.0-ALv2` `LICENSE` file to the
   DevFlow and AgentCanvas repositories (text at fcl.dev) and keep Matura's Apache licence.
2. **Placeholders in `site.config.ts`:** company and legal name (pending a trademark check),
   contact emails, domain.
3. **Licence-key checks in the products.** The site describes offline signed licence files;
   the products do not verify them yet.
4. **The first benchmark run.** DevFlow on Vibe Code Bench with a locally hosted model,
   compared with an open-source agent on the same model. The home page promises these
   numbers before any score is quoted.
5. **Real screenshots** in `public/screens/` to replace the schematic drawings.
6. **GitHub default branch** of this repository: switch it from `expen` to `main`.
