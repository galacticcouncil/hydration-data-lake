---
name: Ship a new indexer image version
description: How a code change reaches the self-hosted swarm — push a branch, let CI build & tag the GHCR image, bump the SHA in the matching stack file, redeploy. The end-to-end release loop.
audience: ai-agent, human
related:
  - ../ci-cd/image-build-publish.md
  - ../deployment/docker-swarm-overview.md
  - ../deployment/storage-dictionary-stacks.md
  - ../deployment/aggregation-indexer-stacks.md
---

# Ship a new indexer image version

## When to read this
- You changed indexer code and need it running on the self-hosted swarm.
- Asked to "bump"/"update"/"redeploy" a stack to a newer build.
- Mapping a commit/branch to the image tag a stack should pin.

## Concepts

The release loop has two halves that are decoupled: **CI builds & publishes images**, then **a human bumps the stack file** to point at the new image. Nothing auto-deploys to the swarm (the only auto-deploy is the legacy SQD-cloud one for `versions/**`; see `../ci-cd/sqd-hosting-deploy.md`).

### The loop
1. **Push to a build-triggering branch.** One of `fix/** | feat/** | main | develop | develop-orca | versions/**`. Other branch names produce no image. (`../ci-cd/image-build-publish.md`)
2. **CI builds both indexer images** and pushes to GHCR with two tags: the branch tag (`latest` for `main`, else `wip-<sanitized-branch>`) **and the commit SHA**.
   - `ghcr.io/galacticcouncil/data-lake-aggregation-indexer` (from `indexers/liquidity-pools/`)
   - `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer` (from `indexers/storage-dictionary/`)
3. **Pin the SHA in the matching stack file.** Edit the image anchor (e.g. `&dict-indexer-image` / `&aggregation-indexer-image`) to `...:<commit-sha>`. Production stacks pin SHAs, not `wip-*`/`latest`, so the deploy is reproducible.
4. **Redeploy on the swarm.** `docker stack deploy -c <file> <stack-name>` (operator action on the cluster). Respect startup order: DB → processor → API.

### Which file to edit
| Change in | Edit stack file(s) |
|---|---|
| `indexers/liquidity-pools` | `self-hosted/aggregation-indexer/orca-full-orca.yml` **and** `orca-full-catfish.yml` (keep both in sync) |
| `indexers/storage-dictionary` | the relevant `self-hosted/storage-dictionary-indexer/st-dict-<category>.stack.yml` (only the affected category) |
| dev / combined | `self-hosted/all-in-one/...` (uses `:latest`, so often just redeploy) |

## Examples

**Bump the XYK storage-dictionary stack to commit `abc1234`:**
1. Confirm CI built it: the `data-lake-storage-dictionary-indexer:abc1234...` tag exists in GHCR (the build ran for the branch containing that commit).
2. In `self-hosted/storage-dictionary-indexer/st-dict-xyk-hist-data.stack.yml`, set the `&dict-indexer-image` anchor to `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer:abc1234...`.
3. Redeploy that stack on the swarm.

**Bump both aggregation environments:** apply the same SHA to the `&aggregation-indexer-image` anchor in `orca-full-orca.yml` and `orca-full-catfish.yml`.

## Gotchas
- **Pin the SHA, not `wip-<branch>` or `latest`.** `wip-*` is overwritten on the next push to that branch and `latest` tracks `main` — both make "which code is running?" ambiguous. The SHA tag is immutable per build.
- **A code change rebuilds BOTH images** (no path filter). But you only bump the stack(s) for the indexer you changed.
- **Aggregation = two files.** `orca` and `catfish` are separate environments with the same app structure; a version bump usually applies to both.
- **Storage-dictionary = per-category.** Only redeploy the category stack(s) whose data the change affects; the split is precisely what avoids a global rewind.
- **CI does not deploy to the swarm.** Step 4 is a manual operator action. Don't assume a green CI build means the swarm updated.
- **Verify the branch matched the build trigger.** If the SHA tag is missing in GHCR, the branch name likely fell outside the trigger filter — rename/rebase onto a matching prefix and re-push.
