---
name: Monorepo layout
description: How the hydration-data-lake repo is organised — npm workspaces + Turborepo, the top-level folder map, and which folders are the active surface vs supporting infra.
audience: ai-agent, human
related:
  - ./indexer-topology.md
  - ../deployment/docker-swarm-overview.md
  - ../ci-cd/image-build-publish.md
---

# Monorepo layout

## When to read this
- First time orienting in the repo, or onboarding someone.
- Deciding **where** a change belongs (which workspace, which folder).
- Unsure whether a folder is part of the active indexer pipeline or legacy/support.
- Questions about `package.json` workspaces, `turbo.json`, or the root build/lint/format scripts.

## Concepts

This is an **npm workspaces + Turborepo** monorepo. The single deliverable is the two SQD indexers under `indexers/`; everything else builds, deploys, observes, or supports them.

- **Workspace roots** (root `package.json` → `workspaces`): `indexers/*`, `tests/*`, `support/*`. Each subfolder of those is an independent npm package.
- **Turborepo** (`turbo.json`) wires the root scripts: `build` (depends on `^build`, outputs `.lib/**` / `.dist/**`), `lint`, `dev` (persistent, uncached). Root `package.json` exposes `npm run build|dev|lint|format`.
- **`postinstall`** copies the root `package-lock.json` into each indexer folder (`cpx` into `indexers/liquidity-pools/` and `indexers/storage-dictionary/`) so each indexer's Docker build context has a lockfile.
- Node `>=20`, `npm@10.2.4`. `@polkadot/*` versions are pinned via root `resolutions`.

### Top-level folder map

| Folder | Role | Active? | Authority |
|---|---|---|---|
| `indexers/liquidity-pools/` | Aggregation indexer (business logic, spot prices, balances). | **Active core** | `indexers/liquidity-pools/CLAUDE.md` + `docs/ai/` |
| `indexers/storage-dictionary/` | Per-block storage-snapshot indexer (reusable middleware). | **Active core** | `indexers/storage-dictionary/CLAUDE.md` |
| `self-hosted/` | Docker Swarm stack files — production deployment. | **Active** | `docs/ai/deployment/` |
| `.github/workflows/` | CI/CD: build & publish indexer images, API tests, legacy SQD deploy. | **Active** | `docs/ai/ci-cd/` |
| `scripts/` | CI helper scripts (branch-name sanitisation, port-wait, processor-status poll) + `generateProjectStructure.js`. | Active (CI) | this repo |
| `support/` | Auxiliary apps NOT in the indexer pipeline (`api-health-checker`, `db-backfill-from-reapers`). | Support | each app's README |
| `tests/` | `api-tests` workspace for the indexer GraphQL APIs. Used by CI; not day-to-day. | Legacy-ish | `docs/ai/ci-cd/api-tests.md` |

### Where the work happens
- **Indexer logic** → the relevant `indexers/<name>/`. Each is self-contained: its own `package.json`, `schema.graphql`, `.env.example`, `commands.json`, `Dockerfile`, migrations.
- **Production deployment change** → `self-hosted/` (NOT the legacy SQD-hosting manifests inside individual indexer folders).
- **Build/test/publish pipeline change** → `.github/workflows/`.

## Code map
- `package.json` — workspaces list, root scripts, `postinstall` lockfile copy, engines, `@polkadot/*` resolutions.
- `turbo.json` — Turborepo task graph (`build` / `lint` / `dev`).
- `README.md` — human-facing project structure table + license banner.
- `CLAUDE.md` (root) — monorepo overview kept in context every session.
- `scripts/ci/` — `gh-actions-get-branch-name.sh`, `gh-actions-branch-name-serialize.sh`, `gh-actions-wait-for-port.sh`, `github-script-src/wait-for-processor-status.js`, `github-script-src/get-sqd-indexer-name-slot-from-branch-name.js`.

## Gotchas
- **Each indexer's own `CLAUDE.md` is authoritative for that indexer.** The root `CLAUDE.md` and this base deliberately do not duplicate indexer internals — defer to the per-indexer spec.
- **Two lockfile copies.** Because of `postinstall`, an indexer folder carries a copy of the root `package-lock.json`. The source of truth is the root lockfile; the copies are an artifact for the per-indexer Docker build context — don't hand-edit the copies.
- **`indexers/.DS_Store` and other `.DS_Store` files** appear in listings on macOS; ignore them.
- **`support/` and `tests/` are workspaces but not part of the runtime indexer pipeline.** Treat them as legacy/support unless a task explicitly targets them.
- **Docker build context is the indexer subfolder.** CI builds images with context `./indexers/<name>/`, so each indexer's own `Dockerfile` is what runs — not a root Dockerfile (there isn't one). See `../ci-cd/image-build-publish.md`.
