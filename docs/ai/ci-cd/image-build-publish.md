---
name: Image build & publish workflow
description: The primary CI/CD pipeline — build both indexer Docker images and push to GHCR on push to selected branches. Branch→tag rule, image names, build context, reusable-workflow structure.
audience: ai-agent, human
related:
  - ./api-tests.md
  - ./sqd-hosting-deploy.md
  - ../runbooks/ship-new-image-version.md
  - ../architecture/indexer-topology.md
---

# Image build & publish workflow

## When to read this
- Understanding how indexer Docker images get built and where they land.
- Changing what triggers a build, the image tags, platforms, or build context.
- Working in `.github/workflows/docker-images-build-publish.yml` or `_called_docker-images-build-and-publish.yml`.
- Figuring out which image tag corresponds to a branch or commit (to pin in a stack file).

## Concepts

This is the **primary** pipeline. On every push to selected branches it builds **both** indexer images and pushes them to GitHub Container Registry (GHCR).

### Trigger → reusable structure
- **Trigger:** `docker-images-build-publish.yml`, `on: push` to branches `fix/**`, `feat/**`, `main`, `develop`, `develop-orca`, `versions/**`. Permissions: `contents: read`, `packages: write`.
- It just calls the reusable workflow `_called_docker-images-build-and-publish.yml` (passing `GHCR_AUTH_TOKEN`). The `_called_*.yml` naming = reusable, invoked only via `workflow_call`.

### Jobs in the reusable workflow
1. **`extract-image-tag-from-branch-name`** — runs `scripts/ci/gh-actions-get-branch-name.sh`, then sets the tag: `main` → `latest`, any other branch → `wip-<sanitized-branch-name>`.
2. **`build-and-push-liquidity-pools-indexer-image`** — buildx multi-arch (`linux/amd64,linux/arm64`), context `./indexers/liquidity-pools/`, push to `ghcr.io/galacticcouncil/data-lake-aggregation-indexer`.
3. **`build-and-push-storage-dictionary-indexer-image`** — same, context `./indexers/storage-dictionary/`, push to `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer`.

### Tag rule (load-bearing for deployment)
Every build pushes **two tags**:
- the branch tag (`latest` for `main`, else `wip-<sanitized-branch>`), and
- the **commit SHA** (`${{ github.sha }}`).

Production stacks pin the **SHA tag** (e.g. `...:43186c95...`). That's how a stack maps to an exact build. See `../runbooks/ship-new-image-version.md`.

### Build context = the indexer subfolder
Context is `./indexers/<name>/`, so each indexer's **own `Dockerfile`** runs in CI. There is no root Dockerfile. The `postinstall` lockfile copy (see `../architecture/monorepo-layout.md`) is what gives that context a `package-lock.json`.

## Code map
- `.github/workflows/docker-images-build-publish.yml` — thin trigger workflow.
- `.github/workflows/_called_docker-images-build-and-publish.yml` — the three jobs above (tag extraction + two image builds).
- `scripts/ci/gh-actions-get-branch-name.sh` — resolves branch name from event/ref.
- `scripts/ci/gh-actions-branch-name-serialize.sh` — sanitises branch name for use as an image tag (used by the build-indexers / test path; mirror logic).
- `indexers/<name>/Dockerfile` — what actually builds each image.

## Gotchas
- **Auth uses two tokens.** Login to GHCR uses `secrets.GITHUB_TOKEN`; the trigger also threads `GHCR_AUTH_TOKEN` through `secrets:`. Don't remove either without checking which step consumes it.
- **Branch filters are explicit.** A branch outside `fix/** | feat/** | main | develop | develop-orca | versions/**` produces **no image**. If a deployment can't find a `wip-<branch>` tag, the branch probably didn't match the trigger filter.
- **`wip-` tags are mutable per branch.** Pushing again to the same branch overwrites its `wip-<branch>` tag. For a stable reference, pin the **SHA** tag, never `wip-*` or `latest`, in production stacks.
- **Multi-arch builds (amd64+arm64) via QEMU** are slower; both indexers build on every matching push. There is no path filter, so a change to either indexer rebuilds both images.
- **`latest` only comes from `main`.** The `all-in-one` stack uses `:latest`, so it tracks `main` builds; the orca/category stacks pin SHAs and are unaffected by new `main` pushes until manually bumped.
