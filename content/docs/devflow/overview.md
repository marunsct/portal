---
title: DevFlow overview
description: What DevFlow is, who it is for, how it is built, and where it stands today.
section: DevFlow
order: 1
updated: 2026-10-19
---

## What it is

DevFlow turns a written product brief into a working, tested git repository. You upload
the brief (Markdown, text, PDF or Word) through a web interface; a team of model-driven
agents, product manager, architect, reviewers, QA, scrum master, technical lead,
specialist developers and a security reviewer, builds the product sprint by sprint and
hands it over with unit tests, a locked acceptance suite, design documents, a decision
log, sprint records, a CI workflow and container files.

It is built to run against your own model server. The default provider is `local`, the
default base URL is an LM Studio endpoint on the Docker host, and every context budget
in the system is derived from the context window you tell it the model has. A second,
stronger "judgement" model is optional and can be switched off per run so a run stays
entirely on your hardware.

Runs are long. A simple brief on a 35B-class local model takes one to two hours; a
medium brief has taken over ten. DevFlow is designed for that: runs are checkpointed in
Postgres, survive restarts, can be paused, resumed, rewound and cloned, and record every
model call and every command they ran.

## Who it is for

- An engineer or product owner who wants a complete, verified codebase from a
  specification without driving an IDE agent by hand.
- A team that cannot send source or briefs to a hosted model and wants the whole
  pipeline on premises.
- An evaluator who wants to measure what a local model can build, with hidden
  benchmark tests the agents never see.

It is not an IDE plugin and not a chat assistant. You give it a brief and get a repository.

## Vocabulary

| Term | Meaning |
|---|---|
| Run | One execution of the workflow on one brief. Id `run-<uuid>`, checkpointed as a LangGraph thread in Postgres. |
| Workspace | The run's own git repository under `DATA_DIR/workspaces/<tenant>/workspace-<run-id>/`. |
| Brief | The uploaded product document(s): `.md`, `.txt`, `.pdf`, `.docx` or `.csv`, up to 10 per run, 5 MB each. |
| Acceptance criteria | `AC-1..n`, numbered from the brief or the intake document. |
| Acceptance suite | QA's tests for the criteria, locked (checksums and snapshot under `.harness/`) before building starts. The definition of done. Only QA, through a recorded reopen, may change it. |
| Stack pack | A product-kind × language bundle: scaffold, install/test commands, kept files, CI and container release files. 33 pack modules cover browser JS/React/Vue/Svelte/Angular, Node, Python, Django, Next, Go, Java Spring, Rust Axum, Ruby, PHP and C#. |
| Custom stack | A stack no pack covers. A proven setup stage picks the commands; the release carries no packaged CI or container files and says so. |
| Work order | One delegated task for a specialist: files, interfaces, steps, test cases, verification. Checked by a mechanical definition of ready. |
| Sprint | A vertical slice owning a set of criteria. Each sprint ends with a Sprint Record. |
| Review point | A place a person can be asked: `product_intake`, `technical_specification`, `acceptance_tests`, `sprint`, `release`, `escalation`. |
| Auto mode | All review points off; the harness decides and records every decision. The UI calls this "Run unattended". |
| Decision record / change request | `DR-n` records every decision; `CR-n` is a reviewer's requested change, with its own acceptance test. |
| Judgement model | Optional stronger model for the stages that judge: specification, reviews, escalated fixes. The UI calls it the "frontier model". |
| Delivery mode | `fast` (one sprint for small products, files drafted from the specification, reasoning off while building) or `thorough` (every stage in full). |
| Execution mode | `linear` (one specialist at a time) or `parallel` (work orders fan out, up to `HARNESS_MAX_PARALLEL`). |
| Steering note | Free-text direction you post to a running run; it is injected into every later model call. |

## Architecture

DevFlow ships as one image run as two services, plus Postgres and Redis.

| Service | Image | Role |
|---|---|---|
| `app` | `registry.ownstack.example/devflow/app:<version>` | FastAPI control plane behind gunicorn with uvicorn workers. REST and WebSocket API under `/api`, Prometheus `/metrics`, and the built React interface served from the same origin. Listens on 8000. |
| `worker` | same image, command `celery -A app.server.tasks worker` | Executes runs: the LangGraph workflow, the agents, the sandbox, the git workspaces. |
| `db` | `postgres:15-alpine` | Runs, users, audit log, runtime settings (provider keys encrypted), plugin instructions, model profiles, LangGraph checkpoints. |
| `redis` | `redis:7-alpine` | Celery broker and the run event bus that feeds the dashboard. |
| `minio` (optional) | any S3-compatible store | Second copy of uploads and artifacts for multi-node deployments. Off by default; files fall back to `DATA_DIR/objects`. |

```
 Browser ──HTTP/WS──▶ app :8000 ──enqueue──▶ Redis ──▶ worker
                        │                               │
                        │ runs, settings, checkpoints    │ LangGraph workflow
                        ▼                               │ agents + sandbox
                     Postgres ◀──── checkpoints ─────────┤
                                                        │ chat completions
                        appdata volume (/app/data) ◀────┤
                        workspaces, transcripts,        ▼
                        ledger, uploads            Model server(s)
                                                   host.docker.internal:1234
```

The worker reaches your model server over OpenAI-compatible chat completions. Anthropic
and Gemini are supported for hosted use. The model server is never part of the compose
stack; it runs on the host or elsewhere on your network.

## The workflow in one pass

1. Intake: a product manager writes `docs/product_intake.md`; a technology comparison and a stack decision follow.
2. Specialists (UI/UX, database, backend, security, testing) advise; the principal architect writes the technical specification, reviewed until it converges.
3. The stack pack scaffolds the project and proves its smoke tests.
4. QA writes one acceptance test per criterion; the suite is reviewed and locked.
5. The scrum master plans sprints. Per sprint: the lead writes work orders, specialists build, a CI gate commits and measures, code review, harness-run test rounds with defect fixing, security review, milestone review (cannot accept a sprint with red criteria), Sprint Record.
6. Release: every non-deferred criterion passes, CI and container files are added, an evidence page is written.

At every stage the harness, not the agent, runs the tests. A fix that breaks a passing test is reverted.

## How it fits with the suite

DevFlow is the Build layer of the suite. It is self-contained: its own accounts, its own
database, its own licence. [AgentCanvas](/docs/agentcanvas/overview) can build agentic
products that DevFlow then wraps in a service; [Matura](/docs/matura/overview) can give
the products DevFlow builds tenancy, SSO and audit. DevFlow signing in through Matura is
on the roadmap; today it uses its own JWT accounts (see
[Administration](/docs/devflow/administration)).

## Limitations and current status

The following is taken from the project's own handover and review records.

- Validation is early. The simplest benchmark (a browser to-do app) has passed the
  project's gate twice with hidden tests scoring 10/10. Medium briefs are being run and
  audited by hand; one took 11.7 hours on a local model, most of it in defect fixing.
  "Technology-agnostic" is the design, not yet a measured claim across every pack.
- Quality depends on the served model. Reasoning models that spend their whole output
  budget thinking, forced-tool-call quirks and small windows are handled with retries
  and fallbacks, but a weak model produces a weak product.
- Only one run at a time is realistic against a model server that answers one request
  at a time. `MAX_CONCURRENT_RUNS` exists for that reason.
- Command execution is off by default. With it off, agents can write a product but
  never install, build or test it; the run is refused before its first model call.
  Turning it on means choosing between `container` mode (needs the Docker socket,
  which is root-equivalent on the host) and `in-container` mode (commands run as the
  unprivileged worker user and can see other runs' workspaces).
- Container files for the built product are written, never built, because the sandbox
  has no container runtime.
- Seeding a run from an existing codebase (git URL or archive) is API-only; the UI has
  no control for it. User management is CLI-only.
- The interface must be served at the root of its origin. There is no sub-path setting.
- Three automated tests that need S3 credentials are known to fail in a deployment
  without an object store; this does not affect runtime.

Read next: [Quickstart](/docs/devflow/quickstart), then
[Installation](/docs/devflow/installation) and [Configuration](/docs/devflow/configuration).
