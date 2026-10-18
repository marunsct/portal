---
title: Which ports do the products use, and can I serve them under a path?
description: Each product owns one port and expects its own hostname.
section: Installation
order: 10
updated: 2026-10-19
---

| Product | User-facing port | Internal ports | Serve at |
|---|---|---|---|
| DevFlow | 8000 (UI and API) | Postgres 5432, Redis 6379 | `https://devflow.example.com/` |
| AgentCanvas | 7777 on the host → 8080 in the web container | API 8000 (not published), Postgres 5432 | `https://canvas.example.com/` |
| Matura | 8080 (API and portal) | Metrics 9090, Keycloak 8180, Mailpit 8025 (dev), OpenFGA 8081 | `https://matura.example.com/` and `https://id.example.com/` |

None of them can be served under a sub-path such as `https://example.com/devflow/`. Their interfaces assume they are at the root of their origin, and they send `frame-ancestors` headers that prevent embedding in another site. Use one hostname per product behind a gateway that routes by `Host`; the [reference architecture](/docs/suite/architecture) shows the layout and the portal repository ships a Caddyfile.

Changing the published port is a matter of the compose variable (`APP_PORT`, `WEB_PORT`, or the `ports:` entry); the product does not need to know.
