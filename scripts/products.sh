#!/usr/bin/env bash
# Run the three products in Docker with demo settings, on the ports the portal expects.
#
#   scripts/products.sh clone     # fetch the three repositories at the right branches
#   scripts/products.sh up        # build and start all three (first build takes a while)
#   scripts/products.sh status    # health of each product
#   scripts/products.sh down      # stop all three (data kept)
#   scripts/products.sh reset     # wipe demo data and start fresh (what the nightly reset runs)
#   scripts/products.sh logs <devflow|agentcanvas|matura>
#
# Repositories are checked out under scripts/products/ (git-ignored). Override with
# PRODUCTS_DIR. Branches and demo settings are at the top of this file.
#
# Requirements: git, docker with compose v2, ~40 GB disk, and a model server reachable
# from containers at $MODEL_BASE_URL (default: LM Studio on the host, port 1234).

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRODUCTS_DIR="${PRODUCTS_DIR:-$HERE/products}"
ENV_FILE="${ENV_FILE:-$HERE/../.env}"

DEVFLOW_REPO="${DEVFLOW_REPO:-https://github.com/marunsct/DevFlow.git}"
DEVFLOW_BRANCH="${DEVFLOW_BRANCH:-harness-hardening-session}"
AGENTCANVAS_REPO="${AGENTCANVAS_REPO:-https://github.com/marunsct/AgentCanvas.git}"
AGENTCANVAS_BRANCH="${AGENTCANVAS_BRANCH:-main}"
MATURA_REPO="${MATURA_REPO:-https://github.com/marunsct/Platform.git}"
MATURA_BRANCH="${MATURA_BRANCH:-main}"

# Model server as seen from inside containers.
MODEL_BASE_URL="${MODEL_BASE_URL:-http://host.docker.internal:1234/v1}"
MODEL_NAME="${MODEL_NAME:-}"
MODEL_CONTEXT_WINDOW="${MODEL_CONTEXT_WINDOW:-32768}"

# Read DEVFLOW_DEMO_PASSWORD from the portal's .env if present.
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source <(grep -E '^(DEVFLOW_DEMO_PASSWORD|AGENTCANVAS_FRAMEWORKS)=' "$ENV_FILE" || true); set +a
fi
DEVFLOW_DEMO_PASSWORD="${DEVFLOW_DEMO_PASSWORD:-}"
AGENTCANVAS_FRAMEWORKS="${AGENTCANVAS_FRAMEWORKS:-none}"   # "all" for every framework (several GB)

log() { printf '\033[1;34m▸\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m✗\033[0m %s\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "missing: $1"; }
rand() { openssl rand -hex "${1:-32}" 2>/dev/null || head -c "${1:-32}" /dev/urandom | od -An -tx1 | tr -d ' \n'; }

clone_or_update() {
  local name="$1" repo="$2" branch="$3" dir="$PRODUCTS_DIR/$name"
  if [[ -d "$dir/.git" ]]; then
    log "updating $name ($branch)"
    git -C "$dir" fetch --depth 1 origin "$branch"
    git -C "$dir" checkout -q -B "$branch" FETCH_HEAD
  else
    log "cloning $name ($branch)"
    git clone --depth 1 --branch "$branch" "$repo" "$dir"
  fi
}

cmd_clone() {
  need git
  mkdir -p "$PRODUCTS_DIR"
  clone_or_update devflow "$DEVFLOW_REPO" "$DEVFLOW_BRANCH"
  clone_or_update agentcanvas "$AGENTCANVAS_REPO" "$AGENTCANVAS_BRANCH"
  clone_or_update matura "$MATURA_REPO" "$MATURA_BRANCH"
}

# ---- DevFlow -----------------------------------------------------------------
devflow_env() {
  local dir="$PRODUCTS_DIR/devflow"
  if [[ ! -f "$dir/.env" ]]; then
    log "writing DevFlow demo .env"
    cp "$dir/.env.example" "$dir/.env"
    {
      echo
      echo "# --- demo settings written by portal/scripts/products.sh ---"
      echo "ENV=production"
      echo "JWT_SECRET_KEY=$(rand 32)"
      echo "SETTINGS_ENCRYPTION_KEY=$(rand 32)"
      echo "ADMIN_PASSWORD=$(rand 12)"
      echo "POSTGRES_PASSWORD=$(rand 16)"
      echo "APP_PORT=8000"
      echo "LLM_PROVIDER=local"
      echo "OPENAI_BASE_URL=$MODEL_BASE_URL"
      [[ -n "$MODEL_NAME" ]] && echo "OPENAI_MODEL=$MODEL_NAME"
      echo "MODEL_CONTEXT_WINDOW=$MODEL_CONTEXT_WINDOW"
      echo "ALLOW_COMMAND_EXECUTION=true"
      echo "SANDBOX_EXECUTION_MODE=in-container"
      echo "TRUSTED_PROXIES=172.16.0.0/12,10.0.0.0/8,192.168.0.0/16"
      echo "MAX_CONCURRENT_RUNS=1"
      echo "MAX_RUN_COST_USD=0"
      echo "SETTINGS_READ_ONLY=true"
    } >> "$dir/.env"
  fi
}
devflow_up() {
  devflow_env
  ( cd "$PRODUCTS_DIR/devflow" && docker compose up -d --build --wait )
  devflow_demo_user
}
devflow_demo_user() {
  [[ -n "$DEVFLOW_DEMO_PASSWORD" ]] || { log "DEVFLOW_DEMO_PASSWORD not set in portal .env; skipping demo user"; return; }
  ( cd "$PRODUCTS_DIR/devflow" && docker compose exec -T app \
      python -m app.server.manage create-user demo --password "$DEVFLOW_DEMO_PASSWORD" --role operator ) \
    || ( cd "$PRODUCTS_DIR/devflow" && docker compose exec -T app \
      python -m app.server.manage reset-password demo --password "$DEVFLOW_DEMO_PASSWORD" ) || true
}
devflow_down()  { ( cd "$PRODUCTS_DIR/devflow" && docker compose down ); }
devflow_reset() {
  ( cd "$PRODUCTS_DIR/devflow" && docker compose down -v && rm -rf ./data/postgres )
  devflow_up
}

# ---- AgentCanvas -------------------------------------------------------------
agentcanvas_up() {
  ( cd "$PRODUCTS_DIR/agentcanvas" && \
    WEB_BIND=0.0.0.0 WEB_PORT=7777 FRAMEWORKS="$AGENTCANVAS_FRAMEWORKS" \
    AGENTCANVAS_LOCAL_MODELS_HOST=host.docker.internal \
    docker compose -f infra/compose.local.yml up -d --build --wait )
}
agentcanvas_down()  { ( cd "$PRODUCTS_DIR/agentcanvas" && docker compose -f infra/compose.local.yml down ); }
agentcanvas_reset() { ( cd "$PRODUCTS_DIR/agentcanvas" && docker compose -f infra/compose.local.yml down -v ); agentcanvas_up; }

# ---- Matura ----------------------------------------------------------------------
matura_up() {
  ( cd "$PRODUCTS_DIR/matura" && docker compose -f deploy/compose/compose.yaml up -d --build --wait )
  matura_demo_tenant
}
matura_demo_tenant() {
  # Development auth: identity comes from headers. Create one tenant for the demo owner.
  local uid="0192b7a4-5c1e-7d2a-9f00-4b1e2a9c0d11"
  curl -fsS -X POST http://localhost:8080/v1/tenants \
    -H "X-Matura-Dev-User: $uid" -H "X-Matura-Dev-Email: demo-owner@example.test" \
    -H "X-Matura-Dev-Name: Demo Owner" -H "Idempotency-Key: demo-tenant-1" \
    -H "Content-Type: application/json" \
    -d '{"slug":"demo","name":"Demo Tenant"}' >/dev/null 2>&1 || true
}
matura_down()  { ( cd "$PRODUCTS_DIR/matura" && docker compose -f deploy/compose/compose.yaml down ); }
matura_reset() { ( cd "$PRODUCTS_DIR/matura" && docker compose -f deploy/compose/compose.yaml down -v ); matura_up; }

# ---- commands -------------------------------------------------------------------
cmd_up()     { need docker; cmd_clone; devflow_up; agentcanvas_up; matura_up; cmd_status; }
cmd_down()   { devflow_down || true; agentcanvas_down || true; matura_down || true; }
cmd_reset()  { log "resetting demo data"; devflow_reset; agentcanvas_reset; matura_reset; cmd_status; }
cmd_status() {
  printf '%-12s %s\n' devflow     "$(curl -fsS -m 3 http://localhost:8000/api/health >/dev/null 2>&1 && echo up || echo down)"
  printf '%-12s %s\n' agentcanvas "$(curl -fsS -m 3 http://localhost:7777/ >/dev/null 2>&1 && echo up || echo down)"
  printf '%-12s %s\n' matura      "$(curl -fsS -m 3 -o /dev/null http://localhost:8080/healthz/live && echo up || echo down)"
}
cmd_logs() {
  case "${1:-}" in
    devflow)     ( cd "$PRODUCTS_DIR/devflow" && docker compose logs -f --tail=200 ) ;;
    agentcanvas) ( cd "$PRODUCTS_DIR/agentcanvas" && docker compose -f infra/compose.local.yml logs -f --tail=200 ) ;;
    matura)      ( cd "$PRODUCTS_DIR/matura" && docker compose -f deploy/compose/compose.yaml logs -f --tail=200 ) ;;
    *) die "logs <devflow|agentcanvas|matura>" ;;
  esac
}

case "${1:-}" in
  clone)  cmd_clone ;;
  up)     cmd_up ;;
  down)   cmd_down ;;
  reset)  cmd_reset ;;
  status) cmd_status ;;
  logs)   shift; cmd_logs "$@" ;;
  *) sed -n '2,13p' "$0"; exit 1 ;;
esac
