---
title: The interface loads but live updates do not arrive
description: Your proxy is buffering server-sent events or blocking WebSockets.
section: Installation
order: 10
updated: 2026-10-19
---

DevFlow streams run events over a WebSocket at `/api/runs/{id}/events/stream`. AgentCanvas streams run output as server-sent events over POST under `/api/v1/`.

For nginx:

```nginx
location /api/ {
    proxy_pass http://upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_buffering off;
    proxy_read_timeout 3600s;
}
```

Caddy passes both through by default; add `flush_interval -1` under `reverse_proxy` for SSE to be safe. Cloudflare and some corporate proxies buffer responses; put the products on a hostname that bypasses them or enable streaming for that hostname.
