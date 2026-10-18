---
title: The suite at a glance
description: How DevFlow, AgentCanvas and Matura fit together, and what you need before installing any of them.
section: The suite
order: 1
updated: 2026-10-19
---

## Three products, one thesis

| Layer | Product | Job | Talks to |
|---|---|---|---|
| Build | DevFlow | Turns a written brief into a tested repository with a team of AI agents | your model server, your git |
| Create | AgentCanvas | Draws agents and workflows, compiles them to framework-native code, runs, evaluates and publishes them | your model server, your tools, optionally Matura |
| Sell | Matura | Gives applications tenancy, SSO, audit, privacy and compliance evidence | your Postgres, your Keycloak, your apps |

Each product is installed and licensed on its own. The suite is the combination, and the
only hard dependency between them is optional: AgentCanvas can use Matura as its identity
and tenancy provider (`AGENTCANVAS_AUTH_MODE=matura`). DevFlow runs with its own accounts
today; Matura-backed sign-in for DevFlow is on the roadmap.

## What you need

- **Docker Engine 24 or newer with Compose v2.** All three products ship as Compose bundles
  and, for Matura and AgentCanvas, Helm charts.
- **A model server** for DevFlow and AgentCanvas. Anything that speaks the OpenAI chat
  completions API works: LM Studio, Ollama, vLLM, llama.cpp. The products reach it over the
  network, so it can be on the same machine (`host.docker.internal`) or on a GPU box elsewhere.
- **Postgres** is bundled in every Compose file. For production you can point each product
  at an existing Postgres 15 or 16 instead.
- **A hostname per product.** None of the three supports being served under a sub-path, and
  all of them set `frame-ancestors` headers that prevent embedding in another site's frame.
  Plan on `devflow.example.com`, `canvas.example.com`, `matura.example.com` and, for Matura,
  `id.example.com` for Keycloak.
- **Licence credentials** to pull images from the private registry. Evaluation licences are
  issued from the [support page](/support?topic=licence).

## Suggested order of installation

1. **AgentCanvas** if you want something interactive in an afternoon. It runs with a no-login
   development mode and a fake model server, so you can see the whole interface before you
   wire a real model.
2. **DevFlow** once you have a capable local coding model. A run takes an hour or more, so
   plan the first one for a time you can leave it alone.
3. **Matura** when you are ready to put the other two in front of customers. It changes how
   people sign in, so it is easiest to adopt before you have many users.

## Reading these docs

Every product has the same nine pages: overview, quick start, installation, configuration,
user guide, administration, integration, troubleshooting and questions. Commands are given
for Linux and macOS shells; on Windows use WSL 2.

The suite pages that follow cover what is common to all three: the
[reference architecture](/docs/suite/architecture) for running them side by side behind one
gateway, how [licensing and delivery](/docs/suite/licensing) work, and the
[security model](/docs/suite/security).
