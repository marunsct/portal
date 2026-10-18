---
title: User guide
description: Working with DevFlow screen by screen, from sign-in to the handover zip.
section: DevFlow
order: 5
updated: 2026-10-19
---

This guide follows the order in which you meet the interface. Everything here is also
available over the API; see [Integration](/docs/devflow/integration).

## Sign in

Open `https://devflow.example.com/` and enter your username and password. There are
three roles:

| Role | Can |
|---|---|
| `viewer` | Open runs, read documents, logs, changes and decisions; post steering notes. |
| `operator` | Everything a viewer can, plus create, start, pause, resume, rewind, clone, cancel and delete runs, and answer reviews and approvals. |
| `admin` | Everything, plus Settings, model profiles and the model health check. Sees every tenant's runs. |

Accounts are created from the command line; see [Administration](/docs/devflow/administration).
A session lasts 60 minutes and refreshes itself for 7 days. Five failed attempts in five
minutes lock sign-in from that address for the rest of the window.

## Settings (admin)

Before the first run an admin tells DevFlow which model to use.

**AI Provider Configuration.** Choose a provider: Local (LM Studio / Ollama), OpenAI,
Anthropic or Google Gemini. For a local server enter the Base URL, for example
`http://host.docker.internal:1234/v1`, and the model name exactly as the server reports
it. Press **Detect** beside **Context window (tokens)**: DevFlow probes the server and
fills in the window it finds, or explains why it could not. Everything the agents are
allowed to hold in context is derived from this one number, so it must be the truth.

**Longest reply** caps one answer. **Thinking** has three settings: leave the server's
setting alone, think before answering, or do not think, with an effort of low, medium or
high. Reasoning models that spend their whole reply thinking are retried without
reasoning automatically.

**Frontier model.** A second, stronger model for the stages that judge: the technical
specification, every review, and fixes the build model failed at. Choose "No model" to
keep every stage on the build model. **Escalate after attempts** says how many failures
on the build model hand a stage or a defect to the frontier model.

**Execution Mode.** "Stages run one at a time" or "Specialist tasks fan out
concurrently". Fan-out helps only when the model server can serve several requests at
once; a single-slot server makes concurrent agents wait their turn.

Save a configuration as a named model to switch between it and others later. API keys
are stored encrypted and are never shown again; the page shows a hint.

## Home: starting a run

**Choose product documents to upload.** One to ten files, `.md`, `.txt`, `.pdf`, `.docx`
or `.csv`, 5 MB each. The first is treated as the brief; the rest as supporting
material. A good brief has a short description, a features list and numbered
acceptance criteria.

**Delivery.** *Fast* drafts the files from the specification, plans one sprint for a
product of twenty criteria or fewer, runs the test rounds itself and builds with
reasoning off. *Thorough* runs every stage in full. Start with fast.

**Use the frontier model.** Off keeps the run entirely on the build model. On uses the
frontier model configured in Settings for the judging stages.

**Run unattended.** Switches every review point off: the harness makes and records
every decision. Untick it to pick the points where you want to be asked:

| Review | When the run pauses |
|---|---|
| Product Intake Review | After the product manager writes the intake document. |
| Technical Specification Review | After the architect's specification converges. |
| Acceptance Tests Review | After QA's suite passes review, before it locks. |
| End of Sprint Review | After each sprint's milestone review accepts it. |
| Release Review | Before the final release decision. |
| Ask Me When Work Is Stuck | When the escalation ladder is exhausted: defer criteria, build from the latest design, or give direction. |

**Approval timeout.** Minutes a gate waits before approving itself; "never" waits for
you however long it takes. Useful for a review you want to see but not block on.

**Auto-approve file writes and tool calls.** On by default. Off pauses the run at every
file write for your approval. That is slow on a real product; use it to watch a short
brief closely.

**Grant subdirectory access** lets agents work in subdirectories of the workspace;
leave it on. The **workspace label** names the workspace directory, for example
`checkout-service`.

Press **Start New Workflow**. The run is created, the files are stored, and you land on
its dashboard.

## The run dashboard

The header shows the run id, status, current stage, when it started and the spend so
far (tokens, and dollars where the model has a price). Status values:

| Status | Meaning |
|---|---|
| `created` | Registered, not started. |
| `running` | A worker is executing it. |
| `waiting_for_review` | Paused at a review point you enabled. |
| `waiting_for_approval` | Paused at a file write (auto-approve off) or at an escalation. |
| `waiting_for_budget` | Paused at `MAX_RUN_COST_USD` or `MAX_RUN_TOKENS`. Raise the ceiling and resume. |
| `paused` | You paused it. |
| `completed`, `failed`, `cancelled` | Terminal. A completed run with gaps is marked non-deliverable and lists them. |

**Stage strip and execution flow.** The wizard shows the phases, intake, design, each
sprint and the summary, with each stage's state, duration and what it is doing now. In
a sprint, every revision pass is shown with the review that caused it.

**Agent activity.** A live feed over a WebSocket: one line per assistant message, tool
call and tool result. It never streams tokens. If the socket cannot connect, the page
polls instead.

**Results.** Every document the run has written, newest revision first. Early on:
`docs/product_intake.md`, `docs/tools_and_models.md`, `docs/technology_stack.md`,
`docs/technical_specification.md`. At the lock: `docs/acceptance_criteria.md`. Per
sprint: `docs/milestone_plan.md`, `docs/sprint_N_summary.md`, review pages under
`docs/reviews/`. Click a document to read it rendered; download any file.

**Technical log.** The run's event history, paged. Filter it to find a stage's
start, a defect, a refused command.

**Changes.** The workspace's git history, newest first. Select a commit to see its
diff. Every CI gate commits a batch, every accepted sprint is tagged `sprint-N`, and
every stage start is snapshotted for rewind.

**Sprint Milestones.** The Sprint Record for each sprint: backlog and outcome, defects
with the check that raised them, findings and their dispositions, what was carried
forward, lessons.

**Delivery.** The acceptance criteria with their current test results; each criterion
opens to the tests that cover it. At the end: decisions, evidence pages, the release
record and any completion gaps.

## Steering a run

Type into **Steer this run** and send. The note is stored with the run and appended to
every later model call, so it reaches whichever agent works next. Use it to settle
something the brief left open ("use SQLite, not Postgres") or to stop a loop ("the
sign-in page is fine; the session cookie is the problem"). Notes are listed under
**Directions sent**. Any signed-in user may post one.

## Answering a review

When a run pauses at a review point, the Review panel shows the document under review,
the revision number and earlier comments. Three answers:

- **Approve**, optionally with a comment or an edited copy of the document (upload a
  UTF-8 file; it replaces the artifact).
- **Changes**: a comment saying what must change, or an edited file. At intake,
  specification and acceptance points this produces a new revision. After a sprint or at
  release it becomes a change request `CR-n` with its own acceptance test, and the
  sprint is re-planned.
- **Skip**: continue without a decision; the harness decides as it would unattended.

With auto-approve off, the **Write Approval Required** panel shows each proposed file
with a content preview. Approve or reject with a reason; a rejection goes back to the
agent as feedback.

An escalation asks you to choose between deferring the failing criteria (with the
reason recorded), building from the latest design with the risks recorded, or giving
direction through a comment.

## Pause, resume, rewind, clone, cancel

- **Pause** stops at the next step and keeps the run to resume later. A paused run
  holds no worker slot.
- **Resume** continues from the checkpoint. After a restart, orphan recovery resumes
  `running` runs itself.
- **Rewind** lists each stage the run entered; pick one and the run branches from the
  checkpoint before it, with the workspace's files restored to that moment, and
  continues from there. A `before-rewind` snapshot is kept. Pause first; only a
  stopped run can be rewound.
- **Clone** creates a new run with the same documents and settings, so you can try a
  different model or mode on the same brief. The clone starts unattended if the
  original did.
- **Cancel** stops the run cooperatively at the next node. A cancelled run keeps its
  workspace and documents until you delete it.

## Runs list and outcomes

**Workflow Runs** lists every run in your tenant with status, stage, mode and models.
**Outcomes of finished runs** tabulates each finished run's hours, mode, models, hidden
test score where a benchmark was used, and a forecast of the typical time per delivery
mode from your own history.

## Collecting the result

From the dashboard header, download the handover zip: the product with its tests, the
locked acceptance suite, every document, decisions and sprint records, plus a CI
workflow and, for services, a `Dockerfile` and `.dockerignore`. The same files are under
`DATA_DIR/workspaces/<tenant>/workspace-<run-id>/` on the host if you prefer to push
the repository to your own git server from there.

Delete a run when you no longer need it. Deletion removes the workspace, checkpoints,
events, uploads no other run shares and, unless the deployment keeps records, the
transcript and command ledger.

## Building on an existing codebase

Seeding a run from a git URL or an uploaded archive is available through the API only;
the Home page has no control for it yet. See [Integration](/docs/devflow/integration).
