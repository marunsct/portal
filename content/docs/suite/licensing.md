---
title: Licensing and delivery
description: How licences, images, updates and source access work for source-available software you run yourself.
section: The suite
order: 3
updated: 2026-10-19
---

## The model in one paragraph

You licence the software per product, per year, for a number of named users. We deliver it
as container images from a private registry and as Compose bundles and Helm charts. The
products run entirely on your infrastructure; the licence is a signed file that each product
verifies offline. Support and updates come with the licence; your customers, tenants and
model calls are never counted or reported.

## Licence files

A licence is a JSON document signed with our key:

```json
{
  "product": "agentcanvas",
  "licensee": "Acme K.K.",
  "seats": 25,
  "plan": "team",
  "issued": "2026-11-01",
  "expires": "2027-11-01",
  "features": ["oidc", "evaluation-studio"]
}
```

You mount it into the product (`LICENSE_FILE=/run/secrets/ownstack-license` in the compose
bundle) and the product checks the signature and the dates at start-up. There is no
licence server, no heartbeat and no network call. When a licence expires, the product keeps
running and logs a warning; you lose access to new images and to support until it is renewed.

> Licence verification is being added to each product; until a release includes it, the
> licence file is informational and the compose bundle ships without the `LICENSE_FILE`
> mount. The [changelog](/changelog) marks the release that enables it.

## Pulling images

Your licence email contains registry credentials:

```bash
docker login registry.ownstack.example -u <licensee-id>
# password: the pull token from the licence email

docker pull registry.ownstack.example/agentcanvas/api:0.28.1
docker pull registry.ownstack.example/agentcanvas/web:0.28.1
```

Tokens can be rotated from the support page. Images are signed; the digests are listed in
each release's notes so you can pin them.

## Compose bundles and Helm charts

Each release ships a bundle, for example `ownstack-devflow-0.9.0-compose.zip`, containing:

```
compose.yaml           the production stack
compose.override.yaml  development conveniences (hot reload, published DB ports)
.env.example           every variable with a comment
scripts/               init, backup, restore, create-user
gateway/               Caddy and nginx snippets for the product
CHECKSUMS.txt          sha256 of every file
```

Helm charts for AgentCanvas and Matura are published to the same registry as OCI artifacts.

## Updates

Releases follow semantic versioning. Patch releases are safe to apply without reading the
notes; minor releases may add migrations that run automatically at start; major releases have
an upgrade page. Security fixes are marked in the [changelog](/changelog) and emailed to the
technical contacts on the licence.

## Source access

- **DevFlow and AgentCanvas** are published under the Fair Core License (FCL-1.0-ALv2).
  Internal use is free; a licence key unlocks the enterprise features; offering the product
  as a competing service is not allowed. Each release converts to Apache-2.0 two years after
  it ships.
- **Matura**'s core, SDKs and conformance CLI are Apache-2.0. The enterprise pack is commercial.
- **Enterprise** agreements can add escrow for unreleased work with a neutral agent.

## Air-gapped installation

Enterprise customers receive an offline bundle per release: a `docker save` archive of every
image, the charts and bundles, the documentation as HTML, and checksums. Load it with
`docker load < ownstack-suite-<version>.tar` on a host inside the air gap and point the
compose bundle at the local image names.

## What is not metered

- End users of your product (Matura tenants and their members)
- Runs, workflows, deployments, model calls, tokens
- Environments, replicas, hosts

Only named users of the product interfaces count against seats: DevFlow accounts,
AgentCanvas members, Matura operators and tenant administrators.

## Evaluation licences

A 30-day evaluation licence for one product is available from the
[support page](/support?topic=licence). It is a full licence with an expiry; nothing is
disabled. Extensions are granted on request if a trial needs more time.
