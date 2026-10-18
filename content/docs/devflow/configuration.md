---
title: Configuration
description: Every environment variable DevFlow reads, grouped, with its default and meaning, plus the settings editable in the interface.
section: DevFlow
order: 4
updated: 2026-10-19
---

All variables are set in `.env` next to `compose.yaml`; the compose file passes them to
`app` and `worker`. Defaults shown are the effective value in the bundle: where the
compose file sets one, that is listed; otherwise the code's own default. "empty" means
unset and off.

Model settings in the second table are also stored in the database when saved from the
Settings page, and a saved value wins over the environment.

## Core

| Variable | Default | Meaning |
|---|---|---|
| `ENV` | `production` | `dev`, `development`, `test` or `testing` relax the secret checks and generate throwaway keys. Anything else is production and fails closed. |
| `JWT_SECRET_KEY` | required | HS256 signing key for access and refresh tokens. 32+ characters. |
| `ADMIN_PASSWORD` | required | Password of the `admin` account, seeded once on first start. Never overwritten later; use `manage reset-password`. |
| `POSTGRES_USER` | `postgres` | Database user. |
| `POSTGRES_PASSWORD` | required | Database password. |
| `POSTGRES_DB` | `langchain` | Database name. |
| `PGDATA_DIR` | `./data/postgres` | Host directory bind-mounted as the database's data directory. |
| `DB_URL`, `AUTH_DB_URL` | built from the three above | Connection strings for the run store and the auth tables. Set both to use an external Postgres. |
| `REDIS_URL` | `redis://redis:6379/0` | Celery broker and event bus. |
| `APP_PORT` | `8000` | Host port published for the `app` service. The container always listens on 8000. |
| `DATA_DIR` | `/app/data` | Root for workspaces, transcripts, ledger, journal, uploads, objects. The `appdata` volume. |
| `WORKFLOW_UPLOAD_DIR` | `/app/data/uploads` | Where uploaded briefs and codebase archives are stored. |
| `WORKFLOW_WORKSPACE_ROOT` | `/app/data/workspaces` | Root of per-tenant, per-run git workspaces. |
| `CHECKPOINTER_TYPE` | `postgres` | Where LangGraph checkpoints live. Keep `postgres`; the API and the worker must share one store. |
| `WEB_CONCURRENCY` | `4` | gunicorn worker processes for `app`. |
| `WEB_TIMEOUT` | `120` | gunicorn request timeout in seconds. |
| `ACCESS_LOG_LEVEL` | `INFO` | Level of the request log; `WARNING` quietens it. |
| `CELERY_CONCURRENCY` | `2` | Worker processes, which is also the number of runs that can execute at once on this worker. |
| `CELERY_TASK_TIME_LIMIT` | `43500` | Hard limit in seconds for one run's task (about 12 h). |
| `CELERY_TASK_SOFT_TIME_LIMIT` | `43200` | Soft limit; the run is asked to stop cleanly first. |
| `CELERY_MAX_TASKS_PER_CHILD` | `50` | Worker process recycled after this many tasks. |
| `MAX_CONCURRENT_RUNS` | empty | Runs that may execute at once across workers; empty or 0 means no limit. Set `1` for a model server that serves one request at a time. |
| `RECOVER_ORPHANS_ON_START` | `true` | On worker start, make runs resumable whose worker died, and resume them. |
| `RUN_DELETE_KEEPS_RECORDS` | empty | `true` keeps transcript, ledger and journal when a run is deleted, as an audit trail. |

## Auth, network and rate limiting

| Variable | Default | Meaning |
|---|---|---|
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Lifetime of an access token. |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Lifetime of a refresh token. |
| `ALLOWED_ORIGINS` | empty | Comma-separated browser origins allowed by CORS. Empty is same-origin only, which is how the bundle serves the interface. |
| `TRUSTED_PROXIES` | empty | CIDRs whose `X-Forwarded-For` is believed for rate limiting. Set to your reverse proxy. |
| `RATE_LIMIT_MAX_REQUESTS` | `300` | Requests per caller per window. |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | The window. Exceeding it returns 429 with `Retry-After: 60`. |
| `LOGIN_MAX_ATTEMPTS` | `5` | Failed sign-ins per username and address before lockout. |
| `LOGIN_WINDOW_SECONDS` | `300` | Lockout window. |
| `METRICS_SCRAPE_TOKEN` | empty | Bearer token required on `/metrics`. Empty leaves it open. |
| `SETTINGS_ENCRYPTION_KEY` | empty | Fernet key material for provider credentials stored from the Settings page. Empty derives it from `JWT_SECRET_KEY`. |
| `SETTINGS_READ_ONLY` | empty | `true` refuses every provider and credential change through the API, so configuration comes only from the deployment. |
| `SETTINGS_CACHE_TTL` | `5` | Seconds a process reuses the settings row it last read. |

## Model and LLM

These are the environment defaults; the Settings page writes the same keys to the
database and the database wins. `OPENAI_*` names are used for every OpenAI-compatible
server, including local ones.

| Variable | Default | Meaning |
|---|---|---|
| `LLM_PROVIDER` | `local` | `local`, `openai`, `anthropic` or `gemini`. `local` is any OpenAI-compatible server. |
| `OPENAI_BASE_URL` | `http://host.docker.internal:1234/v1` | Chat-completions endpoint for `local` and `openai`. `localhost` is rewritten to the Docker host automatically. |
| `OPENAI_MODEL` | empty | Model id as the server reports it. |
| `OPENAI_API_KEY` | empty | Key for the endpoint above, if it needs one. |
| `ANTHROPIC_API_KEY` | empty | For `anthropic`. |
| `GOOGLE_API_KEY` | empty | For `gemini`. `GEMINI_API_KEY` is accepted as an alias. |
| `OPENAI_ENDPOINT_KIND` | empty | `self-hosted` or `hosted`. Overrides the guess made from the hostname; self-hosted endpoints get chat-template thinking switches and the harness's own retries. |
| `ALLOWED_MODEL_HOSTS` | empty | Comma-separated hostnames the base URL may point at. A settings change to another host is refused. |
| `MODEL_CONTEXT_WINDOW` | `100000` | The model's context window in tokens. Every other budget is derived from it. Set it to the truth. |
| `MODEL_MAX_OUTPUT_TOKENS` | derived | Longest single reply. 0 or empty derives it from the window; for local endpoints 0 also removes the cap. |
| `MODEL_THINKING_MODE` | `default` | `default` leaves the server's setting alone, `on` asks the model to think, `off` asks it not to. |
| `MODEL_THINKING_EFFORT` | `medium` | `low`, `medium`, `high`: roughly a quarter, half or three quarters of the reply budget. |
| `MODEL_READS_IMAGES` | `auto` | `yes`, `no`, `auto`. Whether reviewers are shown page screenshots. `auto` says no for a model it cannot place. |
| `MODEL_REQUEST_TIMEOUT_SECONDS` | `1800` | Per-request timeout to the model server (compose sets 1800). |
| `MODEL_TOKENS_PER_SECOND` | empty | Hint of the server's generation speed, used for timing estimates. |
| `MODEL_LOCALHOST_IS_THIS_CONTAINER` | empty | `true` stops `localhost` in a base URL being rewritten to the Docker host. |
| `JUDGEMENT_PROVIDER` | empty | Provider of the optional judgement ("frontier") model. Empty means every stage uses the build model. |
| `JUDGEMENT_BASE_URL` | empty | Its endpoint. |
| `JUDGEMENT_MODEL` | empty | Its model id. |
| `JUDGEMENT_API_KEY` | empty | Its key. |
| `JUDGEMENT_CONTEXT_WINDOW` | `0` | Its window; judgement stages compact at this size. |
| `JUDGEMENT_MAX_OUTPUT_TOKENS` | `0` | Its longest reply; 0 derives from its window. |
| `PLAN_ON_JUDGEMENT_MODEL` | `true` | Whether planning stages use the judgement model. |
| `ESCALATE_AFTER_ATTEMPTS` | `2` | Failures of a stage or defect on the build model before the judgement model takes it. |
| `OPENAI_FALLBACK_MODEL` | `gpt-4o-mini` | Fallback when the OpenAI provider fails. |
| `ANTHROPIC_FALLBACK_MODEL` | `claude-haiku-4-5-20251001` | Fallback when the Anthropic provider fails. |
| `MAX_RUN_COST_USD` | empty | Per-run spend ceiling. A run that reaches it pauses as `waiting_for_budget`. Only priced calls count; a local model costs nothing. |
| `MAX_RUN_TOKENS` | empty | Ceiling on every token a run uses, priced or not. Same pause. |
| `MODEL_PRICES_JSON` | empty | Corrections to the price table: `{"<model-id>": {"input": <usd per million>, "output": <usd per million>}}`. |

## Context compaction

Set only to override the derivation from `MODEL_CONTEXT_WINDOW` on purpose.

| Variable | Default | Meaning |
|---|---|---|
| `CTX_COMPACTION_ENABLED` | `true` | Summarise a conversation once it passes the trigger. |
| `CTX_SOFT_TRIGGER_RATIO` | `0.8` | Fraction of `CTX_MAX_TOKENS` that triggers compaction. |
| `CTX_MAX_TOKENS` | derived | Usable input window. |
| `CTX_KEEP_MESSAGES` | derived | Most recent messages kept verbatim through compaction. |
| `CTX_SUMMARY_BUDGET` | `4000` | Tokens for the summary. |
| `CTX_COMPACTION_MODEL` | empty | Model that writes summaries; empty uses the run's own. |
| `CTX_ARCHITECT_DOCUMENT_BUDGET` | derived | Characters of the brief sent to the architect's first request. |
| `CTX_SPECIFICATION_BUDGET` | derived | Characters of the specification put in an agent's first message. |
| `CTX_REVISION_DOCUMENT_BUDGET` | derived | Same, for revision requests. |
| `CTX_REVISION_SPECIFICATION_BUDGET` | `25000` | Specification characters sent with a revision. |
| `SANDBOX_MAX_OUTPUT` | derived | Bytes of command output returned to an agent. |
| `CTX_STORE_ROOT`, `CTX_JOURNAL_ROOT` | under `DATA_DIR` | Compaction scratch and oversized tool output. |
| `CTX_JOURNAL_RETENTION_HOURS` | `72` | Journal entries older than this are pruned at a run's end. |
| `CTX_CONTEXT_RETENTION_HOURS` | `72` | Same for context-store evictions. |

## Execution and sandbox

| Variable | Default | Meaning |
|---|---|---|
| `ALLOW_COMMAND_EXECUTION` | `false` | Whether agents may run install, build and test commands at all. A run is refused up front when they cannot. |
| `SANDBOX_EXECUTION_MODE` | `container` | `container` (one throwaway container per command, needs `DOCKER_SOCKET`) or `in-container` (inside the worker as the unprivileged user). |
| `DOCKER_SOCKET` | `/dev/null` | Host path mounted at `/var/run/docker.sock` in the worker. Set `/var/run/docker.sock` for `container` mode. Root-equivalent. |
| `SANDBOX_MEMORY_LIMIT` | `1g` | Per-process heap (`RLIMIT_DATA`) for a sandboxed command. Several fit inside the worker's 8 GB. |
| `SANDBOX_CPU_LIMIT` | `2` | CPU limit per command. |
| `SANDBOX_PIDS_LIMIT` | `512` | Process limit per command. |
| `SANDBOX_MAX_FILE_BYTES` | 2 GiB | Largest file a command may write. |
| `SANDBOX_BASE_IMAGE`, `SANDBOX_PYTHON_IMAGE`, `SANDBOX_NODE_IMAGE`, `SANDBOX_GO_IMAGE`, `SANDBOX_RUST_IMAGE` | `debian:12-slim`, `python:3.12-slim`, `node:24-slim`, `golang:1.22`, `rust:1-slim` | Images used in `container` mode. |
| `SANDBOX_RUNTIMES_ENABLED` | `true` | Agents may fetch another Node, Go, Java or Python version for a project (`use_runtime`). |
| `SANDBOX_RUNTIME_DOWNLOAD_TIMEOUT` | `600` | Seconds allowed for such a download. |
| `SANDBOX_TOOLCHAIN_DIR` | empty | Where downloaded runtimes are kept. |
| `PACKAGE_LOOKUP_ENABLED` | `true` | Agents may ask package registries for current versions (`look_up_package`). |
| `DOCS_LOOKUP_ENABLED` | `true` | Agents may read a framework's `llms.txt` or a package README (`read_docs`). |
| `PAGE_VIEW_ENABLED` | `true` | Agents may inspect the running page's accessibility tree (`look_at_page`). |
| `CUSTOM_STACK_SETUP` | `true` | Run a proven setup stage for a stack no pack covers. |
| `HARNESS_MCP_SERVERS` | empty | JSON map of MCP servers whose tools named roles get. See [Integration](/docs/devflow/integration). |
| `HARNESS_MCP_LOAD_TIMEOUT` | `20` | Seconds to list an MCP server's tools. |
| `HARNESS_MCP_CALL_TIMEOUT` | `60` | Seconds for one MCP tool call. |
| `CONTEXT7_API_KEY` | empty | Optional key for the Context7 example server. |
| `DELIVERY_MODE` | `fast` | `fast` or `thorough`; the Settings page and each run can override. |
| `EXECUTION_MODE` | `linear` | `linear` or `parallel`; the Settings page overrides. |
| `HARNESS_MAX_PARALLEL` | `6` | Agents of one run at once in parallel mode. |
| `STREAM_AGENT_ACTIVITY` | `true` | One dashboard event per assistant message, tool call and result. |
| `WORKFLOW_MAX_GATES` | `1000` | Auto-approvals a whole run may take before it is stopped. |
| `WORKFLOW_MAX_GATES_PER_STAGE` | `120` | Same, for one stage. |
| `WORKFLOW_MAX_REVIEW_RERUNS` | `8` | Rejections of a stage before escalation. |
| `WORKFLOW_MAX_ARCHITECTURE_REVISIONS` | `6` | Specification revisions before the design escalation. |
| `WORKFLOW_MAX_STRUCTURED_RETRIES` | `2` | Retries of a reply that did not match its schema. |
| `LINE_EDITS` | empty | `on` offers the `replace_lines` tool to agents; off by default after measurement showed a 62% failure rate. |
| `ENVIRONMENT_CONTRACT`, `WORKSPACE_DIGEST`, `PROJECT_MEMORY`, `ALREADY_KNOWN` | on | A/B switches for what every model call carries. Leave on. |
| `HARNESS_TASK_LIST` | `false` | Task-list middleware; measured no gain. |

## Storage and seeding

| Variable | Default | Meaning |
|---|---|---|
| `OBJECT_STORE_BUCKET` | empty | S3 bucket for a second copy of uploads and artifacts. Empty uses `DATA_DIR/objects`. |
| `OBJECT_STORE_ENDPOINT` | empty | S3 endpoint, e.g. `http://minio:9000`. |
| `OBJECT_STORE_ACCESS_KEY`, `OBJECT_STORE_SECRET_KEY` | `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | Credentials. |
| `OBJECT_STORE_SECURE` | `false` | TLS to the object store. `false` inside the compose network. |
| `OBJECT_STORE_REGION`, `OBJECT_STORE_PATH` | empty | Region and key prefix for a cloud bucket. |
| `MINIO_ROOT_USER` | `minioadmin` | MinIO root user, if enabled. |
| `MINIO_ROOT_PASSWORD` | empty | MinIO refuses to start without one. |
| `MINIO_API_PORT`, `MINIO_CONSOLE_PORT` | `9000`, `9001` | Host ports for MinIO. |
| `SEED_ALLOWED_SCHEMES` | empty | Transports a clone URL may use. Empty is `https` only; `ext::` is never allowed. |
| `SEED_ALLOW_PRIVATE_HOSTS` | `false` | Whether a clone may target a private, loopback or link-local address. Turn on only for an internal git server. |
| `SEED_MAX_BYTES` | `2147483648` | Ceiling on a materialised codebase. |
| `SEED_MAX_ARCHIVE_MEMBERS` | `50000` | Files an uploaded archive may contain. |
| `SEED_CLONE_TIMEOUT` | `300` | Seconds for a clone. |
| `MAX_CODEBASE_ARCHIVE_BYTES` | `209715200` | Largest codebase archive accepted (200 MB). |

## Observability

| Variable | Default | Meaning |
|---|---|---|
| `PROMETHEUS_MULTIPROC_DIR` | `/app/data/prometheus` | Shared directory so `/metrics` served by `app` includes what the worker records. Empty gives per-process metrics. |
| `LANGSMITH_TRACING` | `false` | Send traces to LangSmith. |
| `LANGSMITH_API_KEY` | empty | Its key. |
| `LANGSMITH_PROJECT` | `product-development-workflow` | Project name. |
| `LANGSMITH_ENDPOINT` | `https://api.smith.langchain.com` | Endpoint. |

## Settings editable in the interface

The Settings page (admin only) writes these keys to the database; they override the
environment for every process within `SETTINGS_CACHE_TTL` seconds. Saved values are
grouped into named profiles you can switch between: a build ("local") model and a
frontier (judgement) model.

| Setting | Field | Env equivalent |
|---|---|---|
| Provider | Local (LM Studio / Ollama), OpenAI, Anthropic, Google Gemini | `LLM_PROVIDER` |
| Base URL, Model name | text | `OPENAI_BASE_URL`, `OPENAI_MODEL` |
| API key for this endpoint | stored encrypted, shown as a hint only | `OPENAI_API_KEY` etc. |
| Context window (tokens) | number, 8,000 to 2,000,000, with **Detect** | `MODEL_CONTEXT_WINDOW` |
| Longest reply (tokens) | number | `MODEL_MAX_OUTPUT_TOKENS` |
| Thinking | Leave the model server's setting alone / Think before answering / Do not think; effort low, medium, high | `MODEL_THINKING_MODE`, `MODEL_THINKING_EFFORT` |
| Execution Mode | Stages run one at a time / Specialist tasks fan out concurrently | `EXECUTION_MODE` |
| Delivery mode | fast / thorough | `DELIVERY_MODE` |
| Frontier model | provider, base URL, model, window, longest reply, key, or "No model" | `JUDGEMENT_*` |
| Escalate after attempts | 1 to 10 | `ESCALATE_AFTER_ATTEMPTS` |
| Plan on the frontier model | checkbox | `PLAN_ON_JUDGEMENT_MODEL` |

Per run, the Home page sets delivery mode, whether to use the frontier model, the
review points, the approval timeout and auto-approval of writes; see the
[User guide](/docs/devflow/user-guide). Set `SETTINGS_READ_ONLY=true` to make the
Settings page read-only and keep model configuration in `.env`.
