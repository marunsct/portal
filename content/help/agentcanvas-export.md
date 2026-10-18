---
title: Can I run an AgentCanvas workflow without AgentCanvas?
description: Yes. Export produces a standalone project for the framework you chose.
section: AgentCanvas
order: 10
updated: 2026-10-19
---

Open the workflow, choose **Export**, and you receive a project for the workflow's framework (LangGraph by default) containing the generated code, its dependencies, tests, a `make smoke` command and deployment guides for Docker, Compose, Helm and the major clouds. Run it anywhere; it does not call back to AgentCanvas.

What you give up by running outside AgentCanvas is the surrounding tooling: the timeline debugger, the evaluation studio, versioning, the MCP and A2A endpoints and the governance features. Many teams design and evaluate in AgentCanvas and ship the exported project.
