---
title: How long does a DevFlow run take?
description: An hour or more on a local model; it depends on the model, the brief and the mode.
section: DevFlow
order: 10
updated: 2026-10-19
---

The team's reference figure is about 80 minutes for the smallest benchmark brief (a web to-do application) on a 35B mixture-of-experts model served one request at a time. Larger briefs, thorough delivery mode and extra review gates add time; a faster server or parallel execution on a server that handles concurrent requests removes it.

While a run is working you can watch every stage on the dashboard, read artifacts as they land, and post steering notes. If you need to stop, pause the run; it resumes from its last checkpoint. Cost and token ceilings pause a run rather than letting it continue unbounded.
