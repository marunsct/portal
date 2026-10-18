# Ownstack portal

The public website, documentation and hosted-demo gateway for the Ownstack product suite:
**DevFlow** (build software from a brief with local-model agents), **AgentCanvas** (visual
agent builder that compiles to ten frameworks) and **Matura** (enterprise-readiness control
plane). Everything runs in Docker on hardware you own.

- Company vision, product positioning and the reasoning behind the architecture:
  [`docs/PLAN.md`](docs/PLAN.md)
- Hosting runbook (DNS, TLS, demos, backups, nightly reset): [`docs/OPERATIONS.md`](docs/OPERATIONS.md)

## What is in here

```
app/                Next.js 15 app router: pages, API routes (demo sessions, support)
components/         Nav, footer, the rack hero, docs shell, forms
content/            Markdown: docs/<product>/*.md, help/*.md, legal/*.md, changelog/*.md
lib/                products catalogue, markdown loader, demo-session signing, JSONL store
gateway/Caddyfile   hostname routing + demo gate (forward_auth) + TLS
scripts/            products.sh (run the three products with demo settings), nightly reset
site.config.ts      company name, domains, emails, plans, demo limits (edit this first)
Dockerfile          multi-stage standalone build, non-root
docker-compose.yml  portal + gateway
```

## Run it locally in five minutes

```bash
cp .env.example .env
# set DEMO_SESSION_SECRET (openssl rand -hex 32); the other defaults are for localhost
docker compose up -d --build
open http://www.localhost        # portal
```

Browsers resolve `*.localhost` to 127.0.0.1, so the demo hosts work with no DNS changes:
`http://devflow.demo.localhost`, `http://canvas.demo.localhost`, `http://matura.demo.localhost`.
They route to the products on the Docker host's ports 8000, 7777 and 8080; start those with:

```bash
scripts/products.sh up           # clones the three repos and runs their compose bundles
scripts/products.sh status
```

To develop the portal itself without Docker: `npm install && scripts/dev.sh` (Node 22).

## Deploy it

1. Point DNS: `www.<domain>`, `<domain>`, and `*.demo.<domain>` (or the four names
   `devflow`, `canvas`, `matura`, `id` under `demo.<domain>`) at the host.
2. In `.env`: `PUBLIC_DOMAIN=<domain>`, `DEMO_ZONE=demo.<domain>`, `SITE_ADDRESS_PREFIX=`
   (empty, for automatic HTTPS), `DEMO_SCHEME=https`, `ACME_EMAIL=you@<domain>`, a fresh
   `DEMO_SESSION_SECRET`, and `DEVFLOW_DEMO_PASSWORD`.
3. `docker compose up -d --build` then `scripts/products.sh up`.
4. Install the nightly reset: `sudo cp scripts/reset-demo.cron /etc/cron.d/ownstack-demo-reset`
   (edit the path and user inside).

Full details, including wildcard certificates, running the products on another machine,
backing up leads and tickets, and self-hosting the fonts, are in `docs/OPERATIONS.md`.

## Editing content

- **Company facts, domains, emails, prices, demo limits:** `site.config.ts`.
- **Product copy** (taglines, features, FAQ, demo rules): `lib/products.ts`.
- **Documentation:** Markdown under `content/docs/<product>/`. Front matter `title`,
  `description`, `section`, `order`. New files appear in the sidebar automatically.
- **Help centre / legal / changelog:** Markdown under the matching `content/` folder.
- **Screenshots:** drop `public/screens/<product>.png` and swap the `ProductSketch` for an
  image on the product page when you have real captures.

## How the demo gate works

The portal issues a signed, time-limited cookie on the parent domain when a visitor starts a
session (`POST /api/demo/start`). Caddy's `forward_auth` asks `GET /api/demo/verify` on every
request to a demo host; the portal checks the cookie against that host's product and answers
200, or 302 back to the launch page. Concurrency is counted from an append-only
`/data/sessions.jsonl`; leads and support tickets land in `/data/leads.jsonl` and
`/data/tickets.jsonl`. No database is required.

## Licence

The portal source is proprietary to the company; the products it describes are commercial,
closed-source software. See `/legal/eula` on the running site.
