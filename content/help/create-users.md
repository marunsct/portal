---
title: How do I create users?
description: DevFlow has a CLI, AgentCanvas uses your identity provider, Matura uses Keycloak and invitations.
section: Administration
order: 10
updated: 2026-10-19
---

**DevFlow** seeds an `admin` account from `ADMIN_PASSWORD` on first start. Create more from the app container:

```bash
docker compose exec app python -m app.server.manage create-user alice --role operator
docker compose exec app python -m app.server.manage list-users
docker compose exec app python -m app.server.manage set-role alice admin
```

Roles are `admin`, `operator` and `viewer`.

**AgentCanvas** in development mode needs no users. With `AGENTCANVAS_AUTH_MODE=oidc`, create people in your identity provider; the emails listed in `AGENTCANVAS_BOOTSTRAP_ADMIN_EMAILS` become the first administrators, and they invite others from the Members page. Roles are viewer, reviewer, builder and admin.

**Matura** users sign up through Keycloak (self-registration can be turned off) or are created by an administrator in the Keycloak console. Tenant owners invite members from the portal; the invitation email carries a single-use link.
