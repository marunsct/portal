# Operations runbook

How to host the portal and the hosted demos on one Linux machine, keep them healthy, and
change the things that will change.

## 1. Machine

- Ubuntu 22.04/24.04 or Debian 12, Docker Engine 24+ with Compose v2, 16 cores, 32 GB RAM,
  200 GB SSD. The model server can be on the same machine (GPU) or on a second box.
- Open TCP 80 and 443 to the internet. Nothing else needs to be public; the products' own
  ports (8000, 7777, 8080, 8180) must be reachable only from this host (bind them to the
  Docker bridge or firewall them; `scripts/products.sh` binds AgentCanvas to 0.0.0.0 so the
  gateway container can reach it — restrict it with `ufw` to the `docker0` interface).
- Clone this repository to `/opt/ownstack/portal` and run as a user in the `docker` group.

## 2. DNS

| Record | Points to |
|---|---|
| `www.<domain>` A/AAAA | the host |
| `<domain>` A/AAAA | the host (redirects to www) |
| `*.demo.<domain>` A/AAAA | the host (or four records: `devflow`, `canvas`, `matura`, `id` under `demo.<domain>`) |

## 3. TLS

Caddy gets a certificate per hostname from Let's Encrypt automatically (HTTP-01). Nothing
to configure beyond `ACME_EMAIL` and leaving `SITE_ADDRESS_PREFIX` empty.

For a wildcard certificate (`*.demo.<domain>`) use the DNS challenge: build a Caddy image with
your DNS provider's module and add a `tls { dns <provider> {env.API_TOKEN} }` block to the
demo sites. See Caddy's documentation for the module name of your provider. Per-host
certificates are fine for four demo hosts; wildcard only matters if you add many.

## 4. Configuration

`.env` is the single place. The important ones:

| Variable | Production value |
|---|---|
| `PUBLIC_DOMAIN` | `ownstack.example` |
| `DEMO_ZONE` | `demo.ownstack.example` |
| `SITE_ADDRESS_PREFIX` | empty |
| `DEMO_SCHEME` | `https` |
| `DEMO_SESSION_SECRET` | `openssl rand -hex 32`; rotating it ends every live session |
| `DEMO_SESSION_MINUTES` / `DEMO_MAX_CONCURRENT` | 45 / 5 to start; watch `/api/demo/status` |
| `DEMO_REQUIRE_EMAIL` | `false` until you want leads; `true` adds the form to launch pages |
| `DEVFLOW_DEMO_PASSWORD` | the demo operator's password; `scripts/products.sh up` creates the user |
| `*_UPSTREAM` | where the products listen, as seen from the gateway container |
| `SUPPORT_WEBHOOK_URL` | optional; a Slack incoming webhook is the quickest way to see tickets |

Company name, emails, prices, plan text and demo-host labels live in `site.config.ts`
(rebuild the image after changing it).

## 5. Start, stop, update

```bash
cd /opt/ownstack/portal
docker compose up -d --build          # portal + gateway
scripts/products.sh up                # the three products with demo settings
scripts/products.sh status

git pull && docker compose up -d --build   # update the portal
scripts/products.sh up                     # update the products (re-fetches branches)
```

## 6. The demo products

`scripts/products.sh` checks the three repositories out under `scripts/products/` and runs
each product's own compose bundle with demo-appropriate settings:

- **DevFlow**: production mode, generated secrets, `LLM_PROVIDER=local`,
  `OPENAI_BASE_URL=$MODEL_BASE_URL` (default LM Studio on the host, port 1234),
  command execution on, in-container sandbox, settings read-only, one concurrent run.
  Set `MODEL_NAME` and `MODEL_CONTEXT_WINDOW` when running `up` the first time to match
  your server. A demo operator account `demo` is created with `DEVFLOW_DEMO_PASSWORD`.
  Admin password is generated into `scripts/products/devflow/.env` (`ADMIN_PASSWORD`).
- **AgentCanvas**: development auth (no sign-in), LangGraph-only image by default
  (`AGENTCANVAS_FRAMEWORKS=all` in `.env` for every framework; the image is several GB),
  local models via `host.docker.internal`. Visitors are the seeded local admin.
- **Matura**: development auth (identity from a dev sign-in page), Keycloak, Mailpit and
  OpenFGA as in its compose file, one demo tenant created on start.

**Preloading a finished DevFlow run** (so visitors see a result without waiting an hour):
start a run from `benchmarks/web-todo/brief.md` once after `up`; it survives until the next
`reset`. A future improvement is to restore a saved run from a database dump in `reset`.

**Nightly reset** wipes volumes and brings everything back: install `scripts/reset-demo.cron`
in `/etc/cron.d/`. The reset takes a few minutes; the rack lights on the home page show the
demos as offline during that time.

## 7. Monitoring

- Portal health: `GET /api/demo/status` returns each product's reachability and seat count;
  Docker's healthcheck uses it.
- Gateway: `docker compose logs gateway`; Caddy logs certificate renewals and upstream errors.
- Products: `scripts/products.sh logs <name>`; each product exposes Prometheus metrics
  (DevFlow `/metrics`, AgentCanvas `/metrics` on the API, Matura port 9090).

## 8. Data on the portal volume

`/data` inside the portal container (`portal-data` volume):

| File | Contents |
|---|---|
| `sessions.jsonl` | demo sessions started/ended; safe to truncate |
| `leads.jsonl` | launch-form submissions (name, email, company, consent, IP) |
| `tickets.jsonl` | support requests |

Back them up with `docker compose cp portal:/data ./backup-$(date +%F)`. Import into a CRM
or helpdesk at your leisure; the format is one JSON object per line. When volume justifies
it, replace `lib/store.ts` with a Postgres table; nothing else depends on the file format.

## 9. Self-hosting the fonts

The layout links Google Fonts for Bricolage Grotesque, IBM Plex Sans and IBM Plex Mono.
To serve them yourself: download the woff2 files (Google Fonts or the projects' GitHub
releases), put them under `public/fonts/`, add `@font-face` rules at the top of
`app/globals.css`, and delete the three `<link>` tags in `app/layout.tsx`. Then update the
privacy policy sentence about fonts in `content/legal/privacy.md`.

## 10. Running the products on a different machine

Set the `*_UPSTREAM` variables to that machine's address (for example
`http://10.0.0.5:8000`). The gateway container must be able to reach it; the products must
trust the gateway's address in their `TRUSTED_PROXIES` settings so rate limits see the
visitor's IP rather than the gateway's. Keep those ports closed to the internet.

## 11. Changing the demo hosts or adding a product

- Host labels: `site.config.ts` → `demo.hosts`, plus a matching site block in
  `gateway/Caddyfile` and an `*_UPSTREAM` variable in `docker-compose.yml`.
- A new product: add it to `lib/products.ts` (everything on the site derives from that
  entry), add `content/docs/<id>/` pages, and extend `app/api/demo/status/route.ts`
  with its health path.

## 12. Known rough edges

- The products do not yet verify licence files; the portal's licensing pages describe the
  intended mechanism and the changelog will mark the release that enables it.
- Matura's compose sets `MATURA_PUBLIC_URL` to `localhost`, so invitation links in the demo
  mailbox point at localhost. Harmless for a demo; set it to the demo host if you want the
  links to work.
- AgentCanvas and Matura send `frame-ancestors` headers; the launch pages open the products
  in a new tab for that reason. Do not try to iframe them.
- The concurrency counter is per portal process and file-based. Fine for one replica; move
  to a shared store before running several portal replicas.
