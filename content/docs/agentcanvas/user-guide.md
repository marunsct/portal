---
title: User guide
description: Task-oriented walkthroughs of every screen, from the first-run model picker to publishing, in the order you meet them.
section: AgentCanvas
order: 5
updated: 2026-10-19
---

This guide assumes a running install (see [quickstart](/docs/agentcanvas/quickstart)). Screens are named as they appear in the top bar and the side panels. Web routes are given for reference: the app is a single-page application, so every path is served by the same shell.

## Home (`/`)

Home shows **Set up your model** until a default model is saved, then: **Start the guided build**, a **New workflow** box, the template gallery (27 templates in categories: getting started, customer support, content, sales, data extraction, research, HR, engineering, operations), **Import a file…** for Langflow, Flowise, n8n and Open Agent Spec JSON, and your workflow list. In Matura mode a workspace picker appears when the organisation has workspaces.

The three templates to start with: **Chat assistant** (one agent over the `messages` channel), **Classify and route** (an LLM classifies, a router branches), **Approval workflow** (draft, human approval, publish).

## Setup: models and keys (`/setup`)

1. Pick a provider: hosted (Anthropic, OpenAI, Azure OpenAI, Google Gemini, Mistral, Groq, DeepSeek, xAI, any OpenAI-compatible API) or on your machine (Ollama, LM Studio, vLLM, llama.cpp).
2. Pick or type the model as `provider:model`.
3. Hosted: paste the key; it is stored as the project secret named after the provider (`OPENAI_API_KEY`, …) and never shown again. Local: leave **Server address** empty for the default port, or set it (`http://gpu-box:11434`).
4. **Test connection** sends one short message with exactly these settings and shows the reply or the error. Nothing is saved yet.
5. **Save** stores the project's default model. New AI model blocks and templates use it; existing workflows do not change.

For each AI model block the key is resolved in this order: the block's own **API key (secret reference)**, the project secret named after the provider, the server's environment variable of the same name.

The same page holds **AI Copilot** settings (model, **Private** mode restricting it to local models, token limit per chat) and **Send traces to your observability tool** (Langfuse, Arize Phoenix, Datadog, any OTLP/HTTP endpoint, with **Send a test trace**).

## The editor (`/workflows/<id>`)

| Area | Contents |
|---|---|
| Palette (left) | Every block by category, your workspace scripts, tools and custom widgets, the MCP **App connectors** gallery. *Search widgets…* filters. |
| Canvas | `▶ START` to `■ END`. Steps are solid cards; add-ons (models, tools, middleware) are dashed boxes wired into typed, colour-coded ports. |
| Toolbar | `⌘K` command palette, **Tidy** (ELK auto-layout), **Blast radius**, **⧉ Subgraph**, **▭ Frame**, undo/redo, **▶ Test**, links to **Evaluate**, **Workspace**, **Memory**, **Inbox**, **✦ Copilot**, framework badges. |
| Side panel (right) | **Inspector**, **Run**, **Tests**, **Versions**, **Code**, **Copilot**. |
| Dock (bottom) | **Problems**, **Timeline**, **Explain**. |

Everything saves automatically with conflict detection: if someone saved the same workflow first, you are told instead of overwriting. Queued edits survive a navigation, and closing the tab with unsaved edits asks first. **Simple mode** hides advanced settings; the choice is remembered per browser.

### Build the graph

- Drag a block from the palette or use `⌘K`. Click a block's right-hand dot to see what can come next and add it already connected.
- Drag from port to port. `model*` takes a *ChatModel*, `tools` a list of *Tool*s, `middleware` agent add-ons; `*` means required. A connection that does not fit is refused with the reason.
- Click a card to configure it in the **Inspector**: name (used in code and the API), label, and a settings form. Prompts are templates over the state (`{{ state.ticket }}`); conditions are CEL (`state.urgency == "high"`).
- Click empty canvas for the **Workflow** panel: name, description, recursion limit, durability (`exit`, `async`, `sync`), budgets (tokens, USD, seconds per run; day and month USD with alert percentages), **state channels** (`+ Channel`: type, reducer, io, storage), **Framework**, and `trace_redact`.
- **⧉ Subgraph** (`⌘G`) turns a selection into one step with its own state; double-click to work inside. **▭ Frame** is a visual box.

### Blocks you will use most

| Block | Type id | Notes |
|---|---|---|
| Ask AI | `core.llm` | Prompt in, reply to a channel. Needs an AI model on `model`. |
| AI Agent | `core.agent` | LangChain `create_agent`: tools, add-ons, **Tools that need approval**, structured output to `structured_response`. |
| Planning Agent | `agent.deep` | Deep Agents: plans, keeps files, delegates to **Helper Agent** add-ons. |
| AI model | `model.chat` | `provider:model`, temperature, max tokens, timeout, Base URL, key reference, **Backup models**, **Reuse answers for (s)**, **Mock replies for debug runs**. |
| Web API tool / App connector (MCP) / Python tool / Memory tools | `tool.http`, `mcp.server`, `tool.python`, `tool.memory` | Private addresses are refused unless the tool allows them (E043 in hosted edition). MCP **Browse tools** lists and flags tools that change things. |
| Ask for approval / Ask a person | `core.approval`, `core.human_input` | Pause the run; decisions land in the Run tab and the Inbox. |
| Choose a path / Repeat for each item / Wait for all / Group of steps | `core.router`, `core.map`, `core.join`, `core.subgraph` | Flow control. A join must not wait on a branch after a router (E016). |
| Set values / Run Python code | `core.set`, `core.script` | `core.script` runs `def run(state) -> dict` from `scripts/`. |
| Safety blocks | `guard.pii`, `guard.injection`, `guard.moderation`, `guard.schema` | **When it fails**: stop, flag (save a verdict to branch on) or redact. Each ships with labelled test cases. |
| Agent add-ons | `mw.*` | PII protection, call limits, retries, backup models, summarisation, to-do list, tool selector, rubric self-grading. |

### Problems dock

Validation runs continuously. `E` codes block running, `W` are warnings, `I` are hints; `P001`–`P006` are portability notes about the framework. Organisation policies appear as `E095`/`W095`. Click a problem to jump to its block. The workflow can run when the dock reads *No problems*.

### Framework

Click empty canvas, choose **Framework**. Badges next to the workflow name say for each installed framework whether it can run this workflow (`✓ LangGraph`, `✕ CrewAI · 2`). An **AI Agent** block can also be **Designed for** another framework (including the Claude Agent SDK) and shows its native code in the block. Changing framework is an ordinary, undoable edit.

## Run tab

- **JSON** mode: edit the pre-filled input, press **▶ Run**. **Chat** mode: for `messages` workflows; each message continues the same thread. **continue thread** keeps the previous thread's state.
- **Dry run (stub risky tools)** replaces every tool that can write, send, execute or spend with a recorder.
- While a run streams, each card shows its status, then tokens and time. The panel shows streamed output, totals (tokens, latency, cost from catalog prices, *cached*, *by backup model*), and the final state.
- **Approval needed** appears when the run pauses. **Approve**, edit then approve, or **Reject**. Paused runs are durable.
- **○ Add breakpoint** in a step's Inspector pauses before that step; **⏵ Continue** resumes.
- **📌 Pin last output** on a step makes later debug runs replay it. **Mock replies for debug runs** on an AI model block skips the provider. Neither affects deployments.
- **Save as test case** records input and expected status, route and output. **Record as test** turns a recorded run into a deterministic regression test.

## Timeline and Explain (dock)

**Timeline** lists every checkpoint of the thread. Select one to see the state and its lineage (which step last wrote each channel), edit the state and **⑂ Fork from here** to re-run from that point without touching the original. **Explain** narrates the run (*chose route 'normal' → reply_drafter*, where it paused).

## Inbox (`/inbox`)

Every pending approval and question across the workflows you can see, with the value under review. Reviewers and above decide; approvals record a hash of what was approved in the audit log. Share-page visitors cannot approve; their runs wait here.

## Code tab

The program compiled from the canvas for the workflow's framework, read-only, each block tagged `# ── @canvas-node … ──`. For Mastra it is TypeScript. **Export** on the Versions tab takes it away as a project.

## Copilot

**✦ Copilot** has **Build** mode (builders and admins) and **Ask** mode (everyone). A build goes brief → plan → build → review: the proposal is drawn on the canvas with new blocks in green and changed ones in amber; **Accept** applies it as one undoable edit. It validates its own work with the same rules as the Problems dock, can test and debug a workflow, and fixes ruff findings in workspace code. It refuses to put keys into settings and uses secret references.

## Workspace (`/workspace`, `/workflows/<id>/workspace`)

One git repository per project: `scripts/` (`core.script` functions), `tools/` (LangChain `@tool` functions), custom widgets, `events/` handlers, `sandbox.json`. Edit files in the CodeMirror editor; saves commit and run ruff. **Secrets** holds named encrypted values (names only ever leave the server). **Sandbox policy** sets time and memory limits, an outbound allow-list and injected headers.

Example tool:

```python
# tools/orders.py
from langchain.tools import tool

@tool
def order_status(order_id: str) -> str:
    """Look up an order's status by id."""
    return f"order {order_id}: shipped"
```

Example event handler:

```python
# events/leads.py
from agentcanvas.sdk import on

@on("crm.lead.created", filter="event.data.amount > 50000", dedup_key="event.data.lead_id")
def qualify(event, act):
    act.start_workflow("Lead qualification", input={"lead": event.data})
```

**Events** (`/events`) shows the event map, a test-event sender with **Dry run**, and the event log. Other systems post events to `POST /v1/projects/{project_id}/events`.

## Knowledge (`/knowledge`)

Create a knowledge base (lower-case name), **Add documents** (PDF, Word, HTML, Markdown, text, CSV, JSON; 20 files of 20 MB at a time; or a public URL up to 5 MB), choose chunking and the embedder (built-in offline, or `ollama:nomic-embed-text` and provider embedders), and search with **Hybrid**, **Meaning** or **Keywords**. The **Search knowledge** block returns numbered passages for citations. **Load the sample handbook** gives you something to query immediately; the **Ask your documents** template uses it. A **retrieval** evaluator on the Evaluate page scores found passages against `reference.relevant` (`recall`, `precision`, `hit` or `mrr`). Search runs in memory per server, up to 50,000 chunks per knowledge base.

## Memory (`/memory`)

Long-term memory lives in **spaces** shared per `user` (needs a context field with source `user`; API callers pass `user_id`), `workflow` or `thread`. Blocks: **Remember**, **Recall**, **Forget**, **Memory tools**, and a **Saved files folder** for Planning Agents. The Memory page lists namespaces (for example `memories/user/usr_dev`), searches, deletes items, or erases a namespace. Semantic search uses pgvector on Postgres.

## Evaluate (`/workflows/<id>/evaluation`)

Six tabs. **Datasets** (hand-entered, from test cases, from runs, CSV/JSONL import, LangSmith sync; every change is a version; splits). **Evaluators** (exact match, regex, JSON Schema, LLM judge, tool trajectory, workspace code, composite, pairwise judge; **Try** on a sample). **Experiments** (targets: draft, a version, a variant, or the same workflow on another framework; results grid; **Compare**; simulated users for chat workflows). **Release gates** (minimum mean score and maximum pass-rate drop per environment; admins can override with an audited reason). **Production** (online evaluators per deployment with a sampling rate and filters; drift alerts). **Annotation queues** (rules such as `polite < 0.7` or a thumbs-down; reviewers score and can add corrected examples to a dataset).

Local models work as LLM judges and simulated users.

## Tests and Versions tabs

**Tests** lists saved cases and runs them against the draft or a version. **Versions**: **Save version** freezes the workflow with its workspace commit as a semver; pick two for a field-level diff drawn on the canvas; **Restore**; the **Contract** panel shows input and output fields and where the workflow may pause.

**Publish** creates one deployment per environment, pinned to a version, after the checklist: validation, policies, secrets, tests, contract (no breaking change against the live version), release gate. The API key is shown once; **Rotate key**, **Unpublish**. Under a deployment: **Share as an app or a chat widget** (title, greeting, suggested questions, **Copy link**, the `widget.js` snippet), **Use from other agents (MCP, A2A)** with ready-to-paste client settings, **+ Webhook** and **+ Cron** triggers, and online evaluators.

**⬇ Export to run in your own environment…** picks a version and a target (`local`, `server`, `kubernetes`, `cloudrun`, `aws`, `azure` for LangGraph; a framework project for the others, or any installed framework with `export.zip?framework=`), lists what you will need, and downloads a zip with `make doctor`, `make smoke` and `make gate`. **Push to GitHub…** commits the same files using a project secret `GITHUB_TOKEN`.

## Members, Policies, Audit log (`/members`, `/policies`, `/audit`)

Admin pages. **Members** invites by email with a role (`viewer`, `reviewer`, `builder`, `admin`); in Matura mode it is read-only with a link to Matura's portal. **Policies** are CEL rules with a scope (each step, each resource, the workflow), a match, a requirement, a severity and optional environments; two presets get you started. **Audit log** records who did what, when and from where; publishing past a failed gate records the reason.

## Playground (`/playground`)

Pick a model, write its instructions, chat with it. When the answers look right, name it and press **Make it a workflow**: you get a workflow with one AI agent carrying those instructions and that model, ready for tools and approvals. Nothing typed in the Playground is saved.
