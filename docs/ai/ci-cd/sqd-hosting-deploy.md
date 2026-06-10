---
name: SQD-hosting auto-deploy (legacy)
description: The versions/**-triggered workflow that builds and deploys the aggregation indexer to SQD Cloud hosting. Legacy/reference — the active deployment target is Docker Swarm in self-hosted/.
audience: ai-agent, human
related:
  - ./image-build-publish.md
  - ../deployment/docker-swarm-overview.md
---

# SQD-hosting auto-deploy (legacy)

## When to read this
- A push to a `versions/**` branch triggered a deploy and you need to know what it does.
- Considering restoring or removing SQD Cloud as a deployment target.
- Working in `.github/workflows/sqd-hosting-auto-deployment.yml` or `_called_deploy_agg_indexer_to_sqd_hosting.yml`.

## Concepts

**Legacy path.** The active production target is Docker Swarm (`self-hosted/`). This workflow deploys the **aggregation indexer only** to SQD's hosted platform and is kept for reference / occasional version branches.

### Trigger → job
- **Trigger:** `sqd-hosting-auto-deployment.yml`, `on: push` to `versions/**` only.
- Calls `_called_deploy_agg_indexer_to_sqd_hosting.yml` with `GHCR_AUTH_TOKEN` + `SQD_AUTH_TOKEN`.

### What the reusable workflow does
1. **`extract-indexer-params-from-branch-name`** — runs `scripts/ci/github-script-src/get-sqd-indexer-name-slot-from-branch-name.js` to parse `indexerName` / `indexerSlot` / `indexerType` from the `versions/...` branch name.
2. **`build-and-deploy-aggregation-indexer`** — only when `indexerType == 'agg-ind'`:
   - Install SQD CLI (`npm i -g @subsquid/cli@latest`), `sqd auth -k $SQD_AUTH_TOKEN`, `npm ci`.
   - `sed` the deployment manifest (`indexers/liquidity-pools/deployment-hydration-indexer.yaml`): inject `DEPLOYMENT_COMMIT_HASH` (= `github.sha`) and `INDEXER_ID` (= slot).
   - `sqd deploy . -m $DEPLOYMENT_MANIFEST_FILE --org galacticcouncil -s <slot> -n <name> --allow-update --allow-manifest-override --no-stream-logs`.

## Code map
- `.github/workflows/sqd-hosting-auto-deployment.yml` — `versions/**` trigger.
- `.github/workflows/_called_deploy_agg_indexer_to_sqd_hosting.yml` — branch-param extraction + SQD deploy.
- `scripts/ci/github-script-src/get-sqd-indexer-name-slot-from-branch-name.js` — parses name/slot/type from branch name.
- `indexers/liquidity-pools/deployment-hydration-indexer.yaml` — the SQD Cloud manifest that gets patched and deployed (`DEPLOYMENT_MANIFEST_FILE` env).

## Gotchas
- **Only `versions/**` branches deploy, and only `agg-ind` types reach the deploy job.** A `versions/...` branch whose parsed `indexerType` isn't `agg-ind` is a no-op for deployment.
- **This deploys to SQD Cloud, not the swarm.** It does not touch anything in `self-hosted/`. A change to a swarm stack has no effect here, and vice versa.
- **Manifest is mutated by `sed` at deploy time.** The committed manifest carries placeholders (`DEPLOYMENT_COMMIT_HASH: 'none'`, `INDEXER_ID: <n>`) that CI rewrites. Don't hardcode a real commit hash in the committed file.
- **Storage-dictionary has its own legacy SQD-cloud manifests** under `indexers/storage-dictionary/sqd-hosting-manifests/`, but this workflow only deploys the aggregation indexer. There is no active CI auto-deploy for the dictionary to SQD Cloud.
- **Prefer the swarm.** For real production changes use `self-hosted/` (`../deployment/`). Touch this workflow only when intentionally restoring SQD Cloud.
