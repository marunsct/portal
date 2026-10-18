---
title: FAQ
description: Short answers to the questions engineers ask when evaluating DevFlow.
section: DevFlow
order: 9
updated: 2026-10-19
---

## Which model should I use?

An instruction-tuned coding model with native tool calling and at least 32k tokens of
context. The project's own runs use 30B-class mixture-of-experts models served by
llama.cpp-style servers and LM Studio; a 35B MoE model finished the simplest benchmark
in about 80 minutes and a medium brief in about 12 hours. Smaller models work for small
briefs but produce more defect rounds. The window matters more than the parameter
count: tell DevFlow the real window and it sizes everything else.

## Do I need a hosted "frontier" model?

No. The frontier (judgement) model is optional; choose "No model" in Settings and
untick **Use the frontier model** on a run to keep everything on your hardware. It helps
for the technical specification and the reviews, where judgement matters more than
speed. With `ESCALATE_AFTER_ATTEMPTS` the build model gets two tries at a stage or a
defect before the frontier model takes it.

## Does anything leave my network?

Model calls go to the endpoints you configure. Beyond that, agents may query package
registries (npm, PyPI, crates.io, Go proxy, Maven Central, RubyGems, Packagist, NuGet)
for current versions, read a framework's `llms.txt` or a package README, and call any
MCP servers you configure. Each is a switch: `PACKAGE_LOOKUP_ENABLED`,
`DOCS_LOOKUP_ENABLED`, `HARNESS_MCP_SERVERS`. LangSmith tracing is off unless you turn
it on. There is no telemetry to us and no licence heartbeat.

## How long does a run take?

Hours, not minutes. Fast delivery on a small brief is one to two hours on a local
model; thorough delivery on a medium brief has taken over ten. Nearly all of that is
the model server's generation time; with a single-slot server there is only one request
in flight at a time whatever the execution mode. The **Outcomes** page forecasts time
per delivery mode from your own history.

## What does "locked acceptance suite" mean in practice?

QA writes one test per acceptance criterion before any product code exists; the suite
is reviewed for coverage and for tests that could never pass, then its checksums and a
snapshot are written under `.harness/`. From then on the harness, not the agents, runs
it at every CI gate, test round and the release gate, and agents cannot edit it. Only a
recorded reopen by QA can change it, and every version is kept. The release gate cannot
pass while a non-deferred criterion is red.

## Can agents cheat by editing the tests?

Not the locked ones. Writes to the locked suite, to `.harness/` and to the kept test
setup files are refused by the repository guards. A test engineer can write new unit
tests; those are the product's own and are measured alongside the suite. The project
measures false acceptances with hidden benchmark tests the agents never see and with a
mutation tester that breaks the product to check the suite notices.

## What languages and frameworks are supported?

33 stack packs: browser JavaScript, React, Vue, Svelte, Angular; Node HTTP, NestJS and
Hono-style APIs; full-stack Node, Next.js and Django; Python HTTP, Flask, CLI and
library; Go HTTP and Gin; Java Spring; Rust Axum; Ruby Rails and Sinatra; PHP Laravel
and Slim; C# ASP.NET. A pack brings a proven scaffold, exact install and test commands,
kept test setup, a CI workflow and container files. For anything else a setup stage
proves its own commands and the release carries no packaged CI or container files.
"Supported" is measured by benchmark only for a subset so far; see the
[overview](/docs/devflow/overview#limitations-and-current-status).

## Can it work on an existing codebase?

Yes, through the API: upload an archive or give a git URL when starting the run
(`source` in the start request). The agents build on what is there. The interface has
no control for this yet. See [Integration](/docs/devflow/integration).

## Can I intervene while it runs?

Three ways. Review points pause the run for your approve/changes/skip at up to six
places. Steering notes are free text injected into every later model call without
pausing. Rewind takes a paused run back to the start of any earlier stage with the
files as they were, and continues from there.

## Where is the product and how do I get it into my git?

In the run's workspace, `DATA_DIR/workspaces/<tenant>/workspace-<run-id>/` on the
`appdata` volume, which is an ordinary git repository with a commit per CI batch and a
tag per accepted sprint. Add your remote and push, or download the handover zip from
the dashboard or `GET /api/runs/{id}/handover`. DevFlow does not push to remotes itself.

## Is the sandbox safe to run on a shared host?

Choose the mode for your threat model. `in-container` runs commands as the unprivileged
worker user inside the worker container: no host access, but the command can see other
runs' workspaces on that worker. `container` runs each command in a throwaway
container: stronger isolation of the command, but the worker needs the Docker socket,
which is root on the host. Commands are argv-only, allowlisted, cannot start servers
and run under memory, CPU, process and file-size limits either way.

## Can several people use one installation?

Yes. Accounts have roles (`viewer`, `operator`, `admin`) and a tenant; users see only
their tenant's runs. Every action is in the audit log. There is no user-management
screen; accounts are created with `python -m app.server.manage` inside the `app`
container. See [Administration](/docs/devflow/administration).

## Does it support SSO or OIDC?

Not in this release. DevFlow uses its own JWT accounts. OIDC and Matura-backed sign-in
are on the roadmap; until then put the interface behind your own authenticating proxy
if you need SSO.

## Can I run two runs at once?

The worker allows `CELERY_CONCURRENCY` (default 2) and `MAX_CONCURRENT_RUNS` caps it
globally. Whether it helps depends on your model server: one that serves a single
request at a time makes two runs contend rather than go faster. Set the cap to the
number of parallel requests your server really serves.

## What happens if the server restarts mid-run?

Runs are checkpointed in Postgres at every node. On worker start, orphan recovery
resumes any run whose status was `running` from its last checkpoint; the stage that was
in progress is repeated. Pause runs before a planned upgrade to lose nothing.

## How much disk does it use?

The image is several gigabytes (every language toolchain plus Chromium). Each run keeps
a workspace with its dependencies installed, a transcript of every model call (5 to
10 MB), a command ledger and journal entries that age out after 72 hours. Reclaim space
with `manage workspaces --older-than-days N --delete` and
`manage checkpoints --older-than-days N --delete`, or delete finished runs.

## Can I keep the configuration out of the database?

Yes. Set every model variable in `.env` and `SETTINGS_READ_ONLY=true`; the Settings
page becomes read-only and the API refuses provider and credential changes.
`ALLOWED_MODEL_HOSTS` additionally pins which hosts a base URL may name.

## Does DevFlow build the container images it writes?

No. For services it writes a `Dockerfile` and `.dockerignore` at release, and a GitHub
Actions workflow that runs the same commands the harness ran, but the sandbox has no
container runtime, so images are not built or tested inside the run. Build them in
your CI.
