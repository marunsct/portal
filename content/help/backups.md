---
title: How do I back up and restore?
description: Dump Postgres and copy the data volume; each product's administration page has the exact steps.
section: Administration
order: 10
updated: 2026-10-19
---

Every product keeps its state in two places: a Postgres database and a data volume.

| Product | Database | Volume | Notes |
|---|---|---|---|
| DevFlow | `db` service, bind-mounted at `./data/postgres` | `appdata` (`/app/data`): workspaces, transcripts, uploads | Workspaces are git repositories; back them up with the volume |
| AgentCanvas | `postgres` service | `pgdata`, `workspaces` | `infra/scripts/backup.sh` and `restore.sh` ship with the bundle |
| Matura | `postgres` service (databases `matura`, `keycloak`, `openfga`) | `pgdata` | Back up Keycloak's database too, or you lose users |

Minimum procedure: `pg_dump` each database nightly, snapshot or `tar` the volumes, and test a restore on a scratch host every month. The administration pages have the commands with the right database names and roles.
