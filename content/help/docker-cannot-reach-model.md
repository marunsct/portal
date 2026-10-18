---
title: The product cannot reach my model server
description: The usual causes: localhost inside a container, a firewall, or a missing /v1.
section: Models
order: 10
updated: 2026-10-19
---

Work through these in order.

1. **Is the server reachable from the host?** `curl -s http://localhost:1234/v1/models` (change the port). If this fails, the model server is not running or not listening on the network interface.
2. **Is it reachable from inside the container?** `docker compose exec app curl -s http://host.docker.internal:1234/v1/models` (DevFlow) or `docker compose exec api curl -s http://host.docker.internal:11434/api/tags` (AgentCanvas with Ollama). On Linux, `host.docker.internal` needs the `extra_hosts: host.docker.internal:host-gateway` entry that the compose bundles already include.
3. **Is the server bound to all interfaces?** LM Studio has a "Serve on local network" switch; Ollama needs `OLLAMA_HOST=0.0.0.0`; vLLM and llama.cpp take `--host 0.0.0.0`.
4. **Is the path right?** OpenAI-compatible servers need the `/v1` suffix; Ollama's native endpoint does not.
5. **Firewall.** On a separate GPU box, open the port to the Docker host's address only.

DevFlow reports the endpoint state at `/api/health/models` (admin only); AgentCanvas has a **Test connection** button on the model picker.
