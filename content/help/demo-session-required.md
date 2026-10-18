---
title: I opened a demo address and was sent back to the portal
description: The demo hosts only admit visitors with an active session cookie.
section: Demos
order: 10
updated: 2026-10-19
---

The demo products live on their own addresses (`devflow.demo…`, `canvas.demo…`, `matura.demo…`). The gateway in front of them checks for a session cookie issued by the portal. Without one, or after it expires, you are redirected to the launch page to start a session.

Two common causes:

- **Cookies blocked for the site.** The cookie is set on the parent domain so that it is valid for the demo hosts; a browser extension or a strict cookie setting that blocks it will loop you back. Allow cookies for the portal's domain.
- **Session expired.** Start a new one from the launch page; it takes one click.

The cookie is the only thing the demo stores about you unless you fill in the optional form.
