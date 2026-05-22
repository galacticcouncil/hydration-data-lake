# Hydration Data Lake — monorepo overview

Monorepo of [Subsquid (SQD) framework](https://docs.sqd.ai/) blockchain indexers for **Hydration** (Polkadot parachain, 6s block time). The core deliverable is the indexers under `indexers/`; everything else in the repo is infrastructure that builds, deploys, or observes them.

npm workspaces + Turborepo. Workspace roots: `indexers/*`, `tests/*`, `support/*` (see `package.json`).

## Where the work happens

**`indexers/`** — the indexers themselves. This is the active surface of the repo. Each subfolder is its own SQD project with its own `package.json`, `schema.graphql`, `.env.example`, build/run scripts, and **its own `CLAUDE.md` that is the authoritative spec for that indexer**. Read those before doing any work on an indexer — this root file does not duplicate their content.

| Indexer | Role | Spec |
|---|---|---|
| `indexers/liquidity-pools` | Aggregation indexer — business logic, spot prices, account balances, liquidity positions. Consumer of the storage dictionary. | `indexers/liquidity-pools/CLAUDE.md` |
| `indexers/storage-dictionary` | Thin per-block storage snapshot indexer. Acts as reusable middleware so aggregation indexers can read storage from Postgres instead of hitting RPC. | `indexers/storage-dictionary/CLAUDE.md` |

The two are designed to run together: storage-dictionary writes per-block snapshots, liquidity-pools reads them when available and falls back to RPC otherwise.

## Supporting folders

**`self-hosted/`** — Docker Swarm stack files used for **production deployment**. This is the active deployment target. One subfolder per deployable component:

- `storage-dictionary-indexer/` — one stack per `PROCESS_*` category (`st-dict-lbp-hist-data`, `st-dict-xyk-hist-data`, `st-dict-omnipool-hist-data`, `st-dict-stableswap-hist-data`, `st-dict-generic-hist-data`, `st-dict-account-hist-data`) plus `st-dict-all-in-one`. The category split enables parallel reindex — see `indexers/storage-dictionary/CLAUDE.md` "Deployment" section.
- `aggregation-indexer/` — liquidity-pools stack files (`orca-full-orca.yml`, `orca-full-catfish.yml`).
- `all-in-one/` — single-stack catch-all for dev/small setups.
- `indexer-health-checker/` — health-checker stack.
- `time-series.stack.yml`, `api-health-checker.stack.yml` — shared infra stacks.

When changing a production deployment, edit the matching `.stack.yml` here.

**`.github/`** — CI workflows. Primary purpose: build Docker images of both indexers and push them to GitHub Container Registry on every push to `main`, `develop`, `develop-orca`, `feat/**`, `fix/**`, `versions/**`. Images:
- `ghcr.io/galacticcouncil/data-lake-aggregation-indexer` (from `indexers/liquidity-pools/`)
- `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer` (from `indexers/storage-dictionary/`)

Tag rule: `main` → `latest`; other branches → `wip-<sanitized-branch-name>`; every build is also tagged with the commit SHA. Reusable workflow files are prefixed `_called_*.yml`. Additional workflows cover API tests for both indexers and a legacy SQD-hosting auto-deploy.

**`support/`** — auxiliary apps that share the monorepo but are **not part of the active indexer pipeline**. Includes `api-health-checker` (continuous testing of the liquidity-pools API) and `db-backfill-from-reapers` (one-off backfill tooling). No `CLAUDE.md` files — refer to their own READMEs if you actually need to touch them.

**`tests/`** — `api-tests` workspace for the liquidity-pools / storage-dictionary GraphQL APIs. Not actively used in day-to-day work; treat as legacy unless asked.

**`scripts/`** — small CI helper scripts (branch-name sanitization for image tags, etc.) and `generateProjectStructure.js`.

## Working in this repo

- For any indexer task, the per-indexer `CLAUDE.md` is the source of truth — defer to it over anything here.
- Production deployment changes go in `self-hosted/`, not in the legacy SQD-hosting manifests inside individual indexer folders.
- Docker image builds are wired up via `.github/workflows/docker-images-build-publish.yml`; image context is the indexer subfolder (`./indexers/<name>/`), so the indexer's own `Dockerfile` is what runs in CI.