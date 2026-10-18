---
title: DevFlow 0.9.0
description: Release integrity gates, steering and the Changes view, saved model profiles, and seeding and sandbox hardening.
order: 1
updated: 2026-10-19
---

Versions follow the image tags in the private registry. Dates are the image build dates.

## 0.9.0 (2026-10-18)

- Release integrity: a suite with zero tests, a test naming no criterion, or a declared
  test the runner never collected is refused at lock, in test rounds and at release
  ("vacuous green" gate). A release that still has gaps lists them as `completion_gaps`
  on the run, writes `NON-DELIVERABLE.json` into the workspace, and the dashboard marks
  the run non-deliverable.
- Interface contract: the specification carries strict interface lines that are shown
  to QA, kept at lock and compiled into Playwright checks at release for browser packs.
- Steering: `GET|POST /api/runs/{id}/steering`; notes are kept in `.harness/steering.json`
  and appended to every later model call. "Steer this run" on the dashboard.
- Changes view: `GET /api/runs/{id}/changes` and `/changes/{sha}` expose the workspace's
  git history read-only; the dashboard shows commits and diffs, and the view state lives
  in the URL.
- Saved model profiles: `PUT /api/settings/local` and `PUT /api/settings/frontier`
  save the build and judgement models separately; "No model" keeps a run fully local.
  `JUDGEMENT_MAX_OUTPUT_TOKENS` gives the judgement model its own reply ceiling.
- Defect handling: defects are clustered by root error; a reverted fix escalates the
  next attempt to the judgement model; the last attempt is told to rewrite the file
  rather than patch it; dispatch re-measures a defect before fixing it again.
- Environment contract: every role is told, byte-stably, which runtimes and commands
  the worker has; dependency drift between imports and manifests is a defect.
- `replace_lines` is off by default (`LINE_EDITS=on` restores it) after measuring a 62%
  failure rate against 7% for find/replace edits.
- Accessibility of the interface: axe violations reduced from 455 to 5 across Home,
  Runs, Settings and the dashboard; live regions, skip link, contrast tokens.
- Owner-approved lessons (`plugins/lessons.py`): only approved lessons reach a prompt.
- Products that store data default to an embedded database under `DATA_DIR`.

## 0.8.0 (2026-10-14)

- Fast delivery mode (`DELIVERY_MODE=fast`, per run on Home): one sprint for products
  of up to 20 criteria, work-order files drafted from the specification one call per
  file, harness-run test rounds, building and fixing with reasoning off. Intake,
  comparison, stack choice, consultations, planning and acceptance authoring run on
  the build model; the specification and every review stay on the judgement model.
- Rewind: every stage start snapshots the workspace (`refs/harness/stages/...`);
  `GET /api/runs/{id}/rewind-points` and `POST /api/runs/{id}/rewind` branch a paused
  run from the checkpoint before a stage with its files restored.
- Specification for local models: a `library_usage` section with exact imports and
  calls, taken from `read_docs`, is handed to every work order.
- Reach beyond the packs: `look_up_package` (npm, PyPI, crates.io, Go proxy, Maven
  Central, RubyGems, Packagist, NuGet), `read_docs` (`llms.txt`, READMEs),
  `use_runtime` (per-project Node, Go, Java, Python versions), `look_at_page` (the
  running page's accessibility tree), MCP tool servers (`HARNESS_MCP_SERVERS`), and a
  proven setup stage for stacks no pack covers (`CUSTOM_STACK_SETUP`). Each has an
  on/off variable.
- Stack packs: 33 pack modules covering browser JS/React/Vue/Svelte/Angular, Node,
  NestJS, Hono-style, Next.js, Django, Python, Go, Java Spring, Rust Axum, Ruby,
  PHP and C#. One Playwright release (1.64.0) across packs, image and scorer; Chromium
  is cached in the image rather than copied per run.
- Context budgets follow the Settings page rather than the process environment; a
  judgement stage compacts at its own model's window.
- A provider refusing for want of quota parks the run as `waiting_for_budget` instead
  of failing it; `MAX_RUN_TOKENS` bounds every token a run uses.
- Security: the stack contract is read, never guessed, so a wrong pack's runner
  configuration is no longer written into a project.

## 0.7.0 (2026-10-05)

- The software-company redesign: QA writes and locks an acceptance suite before
  building; the harness runs it at every CI gate, test round and the release gate; a
  milestone review cannot accept a sprint with red criteria; a fix that breaks a passing
  test is reverted; decision records (`DR-n`) and change requests (`CR-n`) with their
  own acceptance tests; the escalation ladder with six human review points.
- Work orders with a mechanical definition of ready, the parallel/linear execution
  toggle (`EXECUTION_MODE`, `HARNESS_MAX_PARALLEL`) with per-work-order file
  ownership, and the Sprint Record per sprint.
- Hosted vs self-hosted endpoint detection (`OPENAI_ENDPOINT_KIND`), chat-template
  thinking control, retries without reasoning for replies lost to thinking, and the
  `MODEL_READS_IMAGES` switch for screenshot review.
- Interface checks for web products: 375 px overflow, axe-core, desktop and phone
  screenshots.
- Security: per-run provider credentials removed from start-request bodies and access
  logs; credentials are resolved from the worker's environment or the encrypted
  settings store. The server-path `artifact_directory` start field was removed in
  favour of a label the server resolves, closing a path-traversal route. Upload ids
  and artifact paths are resolved inside the workspace and rejected if they escape.
- Security: codebase seeding restricted to HTTPS and public hosts by default
  (`SEED_ALLOWED_SCHEMES`, `SEED_ALLOW_PRIVATE_HOSTS`); `ext::` transport always
  refused; archive size and member ceilings.
- Security: `ALLOWED_MODEL_HOSTS` restricts where a settings change may point model
  traffic; `SETTINGS_READ_ONLY` refuses provider changes through the API; provider
  keys stored Fernet-encrypted under `SETTINGS_ENCRYPTION_KEY`.
- Security: WebSocket access by single-use 30-second ticket instead of a token in the
  URL; per-caller rate limiting with `TRUSTED_PROXIES`; sign-in lockout; constant-time
  password checks; `/metrics` behind `METRICS_SCRAPE_TOKEN`.
- Operations: Postgres-checkpointed runs shared by API and worker; orphan recovery on
  worker start; `MAX_CONCURRENT_RUNS` and `MAX_RUN_COST_USD`; run deletion with
  `RUN_DELETE_KEEPS_RECORDS`; the `manage` commands for accounts, orphans,
  reconciliation, workspaces, checkpoints and failed tasks; Prometheus multiprocess
  metrics shared between app and worker; the database moved to a bind mount that
  `down -v` cannot remove.
