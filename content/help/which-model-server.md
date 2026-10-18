---
title: Which model servers are supported?
description: LM Studio, Ollama, vLLM, llama.cpp and any OpenAI-compatible endpoint.
section: Models
order: 10
updated: 2026-10-19
---

DevFlow and AgentCanvas talk to any server that implements the OpenAI chat completions API. That covers:

| Server | Default address | Notes |
|---|---|---|
| LM Studio | `http://localhost:1234/v1` | DevFlow's default endpoint. Enable the local server in LM Studio's Developer tab. |
| Ollama | `http://localhost:11434` | AgentCanvas uses the native Ollama client; DevFlow uses Ollama's OpenAI-compatible `/v1` path. |
| vLLM | `http://localhost:8000/v1` | Best for concurrent users. Note the port clashes with DevFlow's own 8000 if both are on one host. |
| llama.cpp server | `http://localhost:8080/v1` | Works well with GGUF models. |
| Anything OpenAI-compatible | you set it | OpenRouter, Together, a company gateway, LiteLLM. |

From inside Docker, `localhost` is the container, not your machine. Use `host.docker.internal` (DevFlow's default) or set `AGENTCANVAS_LOCAL_MODELS_HOST` (AgentCanvas does the rewrite for you).

Matura does not call models at all.

## Which model should I pick?

For DevFlow, a coding-tuned model with at least a 32k context window. The team runs 30B-class mixture-of-experts models; smaller models complete small briefs but fail more often at architecture and review stages. For AgentCanvas, almost anything with tool-calling support works for the templates; use a larger model for the copilot.
