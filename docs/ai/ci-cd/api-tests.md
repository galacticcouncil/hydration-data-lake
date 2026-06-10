---
name: API test workflows
description: The build-then-test CI pipeline — build both indexers, run each against a throwaway Postgres over a fixed block range, then assert via the tests/api-tests suite. Includes with-dictionary and no-dictionary variants.
audience: ai-agent, human
related:
  - ./image-build-publish.md
  - ../support/support-apps.md
  - ../architecture/indexer-topology.md
---

# API test workflows

## When to read this
- Understanding what the API tests actually verify in CI.
- Changing the tested block range, pool-category flags, or the with/without-dictionary matrix.
- Working in `.github/workflows/liquidity-pools-indexer-api-test.yml` or the `_called_run-*` / `_called_build_indexers` reusable workflows.
- A red API-test check and you need to know the moving parts.

## Concepts

A build-then-test pipeline that spins up real indexer processes against throwaway Postgres containers, indexes a fixed historical block range, then runs GraphQL assertions from `tests/api-tests`.

### Trigger → jobs
- **Trigger:** `liquidity-pools-indexer-api-test.yml`, `on: push` to `fix/**`, `feat/**`, `develop`, and `pull_request` (opened) → `develop`.
- **`build`** → `_called_build_indexers.yml`: `npm ci` (cached node_modules keyed on `package-lock.json`), build both indexers, upload `lib/` as artifacts (`liquidity-pools-build-files`, `dictionary-build-files`).
- Three test jobs run after a successful build:
  1. **`liq-pools-indexer-with-no-dict-test`** → `_called_run-liq-pools-indexer-api-test.yml` with `is-liq-pools-indexer-with-dictionary: false`.
  2. **`liq-pools-indexer-with-dict-test`** → same reusable workflow with `…with-dictionary: true` (also boots the storage-dictionary processor + API first).
  3. **`storage-dictionary-test`** → `_called_run-storage-dict-api-test.yml`.

### What a test job does (`_called_run-liq-pools-indexer-api-test.yml`)
1. Download the prebuilt `lib/` artifacts (no rebuild).
2. `docker run postgres:15` for the liquidity-pools DB (and a second one for the dictionary in the with-dict variant), each on a fixed port (`23798` / `23799`), `--shm-size=1gb`.
3. Wait for DB ports via `scripts/ci/gh-actions-wait-for-port.sh`.
4. (with-dict only) Apply dictionary migrations, run `lib/main.js`, run `lib/api.js`, then **poll** `scripts/ci/github-script-src/wait-for-processor-status.js` until the dictionary reaches `PROCESS_TO_BLOCK`.
5. Run the liquidity-pools processor (`USE_STORAGE_DICTIONARY` = the variant flag) and API, poll until it reaches the end block.
6. Run `npm run test:liq-pools-api` in `tests/api-tests` against the live GraphQL endpoint.

### Fixed parameters (as of this writing)
- Block range: `4187498`–`4198534` for both indexers.
- Pool flags in the default matrix: `process-lbp-pools: true`, `process-xyk-pools: true`, omnipool/stablepool `false` (the storage-dict-only job uses lbp-only).
- Ports/db names are env constants in the reusable workflow (`LIQ_POOLS_INDEXER_*`, `STORAGE_DICT_*`).

## Code map
- `.github/workflows/liquidity-pools-indexer-api-test.yml` — orchestrator: build + three test jobs with their inputs.
- `.github/workflows/_called_build_indexers.yml` — builds both indexers, uploads `lib/` artifacts.
- `.github/workflows/_called_run-liq-pools-indexer-api-test.yml` — the with/without-dictionary consumer test.
- `.github/workflows/_called_run-storage-dict-api-test.yml` — the storage-dictionary-only test.
- `scripts/ci/gh-actions-wait-for-port.sh` — port readiness gate.
- `scripts/ci/github-script-src/wait-for-processor-status.js` — polls the GraphQL `squidStatus` until the processor hits its end block.
- `tests/api-tests/` — the assertion suite (`npm run test:liq-pools-api`). See `../support/support-apps.md`.

## Gotchas
- **These tests index real history, so they are slow and RPC/Archive-dependent.** The fixed block range is chosen to be cheap; widening it lengthens every run.
- **The with-dictionary job has an ordering dependency.** The dictionary must reach its end block before the consumer starts, enforced by the `wait-for-processor-status` poll. There's a `TODO` in the workflow noting the job does not yet hard-fail if that poll returns un-success — a green check doesn't strictly prove the dictionary finished.
- **`develop-orca` is built/published by the image workflow but is NOT in this test trigger.** API tests run on `fix/** | feat/** | develop` (+ PRs to `develop`). Pushing to `develop-orca` builds an image but skips these API tests.
- **Builds are reused via artifacts, not rebuilt per test job.** If a test fails oddly, confirm the uploaded `lib/` artifact matches the commit (the build job and test jobs are separate runners).
- **node_modules cache key is the root `package-lock.json` hash.** A lockfile change invalidates the cache and forces a full `npm ci`.
