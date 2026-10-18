---
title: Runs fail with context or token errors
description: Tell the product the model's real window and leave room for output.
section: Models
order: 10
updated: 2026-10-19
---

DevFlow sizes every budget from `MODEL_CONTEXT_WINDOW`. If it is larger than the window the server actually loaded, requests fail with a context-length error part-way through a stage; if it is much smaller, the harness compacts too aggressively and quality drops.

- Set `MODEL_CONTEXT_WINDOW` to the context length configured in the model server (LM Studio shows it on the model card; for vLLM it is `--max-model-len`).
- Set `MODEL_MAX_OUTPUT_TOKENS` so that input plus output fits.
- DevFlow compacts at 80% of the window automatically; you can watch it in the technical log.

In AgentCanvas, set the per-block max tokens in the Inspector and prefer the summarisation middleware on long conversations.
