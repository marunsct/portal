---
title: Reference architecture
description: Running all three products behind one gateway, with one model server and one Postgres, on a single host or a small cluster.
section: The suite
order: 2
updated: 2026-10-19
---

## One host, one gateway

The smallest serious deployment is a single Linux host with Docker, a reverse proxy that
routes by hostname, and the three product stacks each on its own internal network. A GPU
box running the model server can be the same machine or a second one.

```
                      ┌──────────────────────────────────────────────┐
  Internet ──TLS──▶   │ Gateway (Caddy or nginx), routes by hostname  │
                      │  devflow.example.com  →  devflow-app:8000     │
                      │  canvas.example.com   →  agentcanvas-web:8080 │
                      │  matura.example.com   →  maturad:8080         │
                      │  id.example.com       →  keycloak:8180        │
                      └───────┬──────────────┬───────────────┬────────┘
                              │              │               │
                      ┌───────▼──────┐ ┌─────▼──────┐ ┌──────▼───────┐
                      │ DevFlow      │ │ AgentCanvas│ │ Matura       │
                      │ app, worker  │ │ web, api   │ │ maturad      │
                      │ postgres     │ │ postgres   │ │ postgres     │
                      │ redis        │ │ (pgvector) │ │ keycloak     │
                      └───────┬──────┘ └─────┬──────┘ └──────────────┘
                              │              │
                              └──────┬───────┘
                            ┌────────▼─────────┐
                            │ Model server     │  LM Studio / Ollama / vLLM / llama.cpp
                            │ (host or GPU box)│  OpenAI-compatible, port of your choice
                            └──────────────────┘
```

## Hostnames and the root-of-origin rule

Each product expects to own its origin. In practice:

| Product | Served at | Why a sub-path does not work |
|---|---|---|
| DevFlow | `https://devflow.example.com/` | The interface calls `/api` with relative URLs and opens a WebSocket on the page's own host. There is no base-path setting. |
| AgentCanvas | `https://canvas.example.com/` | The router has no basename and the share page checks `location.pathname`. The web container's nginx proxies `/api/` to the API; the only knob is `API_UPSTREAM`. |
| Matura | `https://matura.example.com/` with the portal at `/portal/` | The `/portal` prefix is compiled in. The API lives at `/v1`, `/admin/v1`, `/scim`, `/invitations`, `/.well-known` on the same origin. |
| Keycloak (for Matura) | `https://id.example.com/` | Browsers must reach the issuer URL directly for the PKCE flow. |

## Gateway requirements

- **WebSockets** on DevFlow (`/api/runs/*/events/stream`).
- **Server-sent events** on AgentCanvas (`/api/` paths): disable response buffering and
  allow long read timeouts (3600 s is what the AgentCanvas Helm chart uses).
- **Large uploads**: DevFlow briefs and codebase archives, AgentCanvas knowledge files.
  Allow at least 20 MB bodies, more if you seed DevFlow from archives.
- **Forwarded headers**: set `X-Forwarded-For` and `X-Forwarded-Proto` and tell each
  product to trust the gateway (`TRUSTED_PROXIES` in DevFlow and the AgentCanvas web
  image, `MATURA_TRUSTED_PROXIES` in Matura), otherwise rate limits and IP allow-lists see
  the gateway's address.
- **Public URLs**: `ALLOWED_ORIGINS` (DevFlow, only if the API is ever on another origin),
  `AGENTCANVAS_CORS_ORIGINS`, `MATURA_PUBLIC_URL` and `MATURA_ISSUER`.

A complete Caddyfile for this layout ships in the portal repository
(`gateway/Caddyfile`) and each product's installation page has the equivalent nginx
server block.

## Sharing infrastructure

**Postgres.** Each product can use its own bundled Postgres (simplest, and what the quick
starts do) or a shared instance with one database per product. Matura additionally needs two
roles per database it manages (an owner for migrations and a runtime role without
`BYPASSRLS`); its installation page explains the split.

**The model server.** One server can serve both DevFlow and AgentCanvas, but note that
DevFlow keeps a model busy for an hour or more per run. If people will be using AgentCanvas
interactively at the same time, give it a second model or a server that handles concurrent
requests (vLLM, or LM Studio with parallel slots).

**Redis** is used only by DevFlow (Celery broker and event bus). AgentCanvas lists it in its
development infrastructure but does not use it; Matura uses none.

## Sizing a single host

| Component | CPU | Memory | Disk | Notes |
|---|---|---|---|---|
| DevFlow app + worker | 4 | 10 GB | 20 GB + workspaces | Worker is 8 GB because JavaScript toolchains fork per core |
| AgentCanvas api + web | 2 | 2–3 GB | 10 GB + image | The all-frameworks image is several GB |
| Matura maturad + Keycloak | 1–2 | 2–3 GB | 2 GB | Keycloak is the heavy part |
| Postgres ×3 | 1–2 | 2–3 GB | grows with runs and audit | |
| Gateway | <1 | <256 MB | | |
| **Total (without the model)** | **8–10** | **~20 GB** | **40 GB +** | A 16-core, 32 GB host is comfortable |

The model server is sized separately: a 30B-class coding model in 4-bit needs roughly
20–24 GB of GPU memory, more for a 32k+ context.

## Growing past one host

- Move Postgres to a managed or dedicated instance first; it is the only stateful piece
  besides the product volumes.
- AgentCanvas and Matura have Helm charts with multiple replicas (AgentCanvas must stay at
  one API replica while non-LangGraph frameworks hold paused runs in memory; see its
  administration page).
- DevFlow scales by workers: add worker containers pointing at the same Redis and Postgres.
  Runs are bounded by the model server, so add model capacity before worker capacity.
