#!/usr/bin/env bash
# Run the portal locally without Docker: npm install && scripts/dev.sh
# Demo hosts work at http://devflow.demo.localhost:3000 only through the gateway; without it
# you can still browse every page and the launch flow (the "open" button points at the
# configured DEMO_ZONE).
set -euo pipefail
export PUBLIC_DOMAIN="${PUBLIC_DOMAIN:-localhost}"
export DEMO_ZONE="${DEMO_ZONE:-demo.localhost}"
export DEMO_SCHEME="${DEMO_SCHEME:-http}"
export DATA_DIR="${DATA_DIR:-$(pwd)/data}"
exec npm run dev
