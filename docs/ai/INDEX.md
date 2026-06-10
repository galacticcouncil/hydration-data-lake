---
name: Monorepo AI Knowledge Base Index
description: Index of monorepo-level knowledge documents (orchestration, deployment, CI/CD, support apps) for AI agents and human supporters. Start here.
audience: ai-agent, human
---

# Monorepo AI Knowledge Base — Index

This directory documents the **monorepo as a whole** — how the repo is laid out, how the two indexers relate at runtime, how they are deployed (Docker Swarm), how they are built and tested (GitHub Actions), and the auxiliary apps that live alongside them.

**Scope boundary — read this first.** This knowledge base does NOT document the internals of either indexer. Each indexer is its own SQD project with its own authoritative spec and its own deep `docs/ai/`:

- `indexers/liquidity-pools/CLAUDE.md` + `indexers/liquidity-pools/docs/ai/INDEX.md` — the aggregation indexer (business logic, spot prices, balances, caches, flows).
- `indexers/storage-dictionary/CLAUDE.md` — the storage-snapshot indexer (per-block storage, multiprocessor mode, compression).

When a task is about indexer-internal behaviour (a handler, a cache, a price calc, a schema entity), go to the per-indexer docs. Use this monorepo base for cross-indexer, deployment, and CI/CD questions.

The root `CLAUDE.md` holds only the must-know monorepo facts that belong in context for every conversation. Everything deeper lives here and is loaded on demand.

---

## How to read this knowledge base (for agents)

1. Open this `INDEX.md` first.
2. Scan the one-line descriptions below.
3. Read **only** the topic files relevant to the current task. Each file stands on its own — do not bulk-read.
4. Each topic file starts with a **"When to read this"** block. Use it to confirm relevance before reading the body.
5. If a topic references a file (`self-hosted/...stack.yml`, `.github/workflows/...yml`), prefer opening that exact file over re-deriving the information — deployment/CI facts rot fast.

---

## How to add or update knowledge (for agents)

Treat this section as a contract. It mirrors the per-indexer knowledge base contract so the two stay stylistically aligned.

### 1. Decide whether a new document is needed
- Prefer **updating an existing topic file** over creating a new one. Check this INDEX first.
- Create a new file only when the topic is **substantively distinct** and would not fit cleanly as a section of an existing file.
- A topic deserves its own file when it has its own "When to read this" trigger, is longer than ~100 lines, or is referenced from multiple places.

### 2. Choose the correct category folder

| Folder | Use for |
|---|---|
| `architecture/` | How the monorepo is structured and how the pieces relate: workspaces/Turborepo, the producer→consumer indexer topology, shared image registry. |
| `deployment/` | Self-hosted Docker Swarm stack files in `self-hosted/`: common patterns, per-component stacks, shared infra. The active production deployment target. |
| `ci-cd/` | GitHub Actions workflows in `.github/workflows/`: image build & publish, API tests, legacy SQD-hosting deploy. |
| `support/` | Auxiliary apps not part of the active indexer pipeline (`support/*`, `tests/*`). Overview / pointers only. |
| `runbooks/` | Operational, "how do I do X" task guides that span the monorepo (ship a new image version, reindex a category). |

If a topic doesn't fit any of these, ask the user before creating a new top-level folder.

### 3. File naming
- `kebab-case.md`, descriptive: `image-build-publish.md`, not `ci.md`.
- Match the concept / file name as it appears in the repo when there is one.

### 4. Required structure of every topic file

Every file MUST follow this template (same template as the per-indexer base). Write "N/A" if a section genuinely doesn't apply, but prefer to fill it.

```markdown
---
name: <Short human title>
description: <One sentence. This is what the index lists. Be specific — it drives relevance decisions.>
audience: ai-agent, human
related:
  - <relative path to related doc>
---

# <Title>

## When to read this
Concrete triggers. Reference file names / stack names / workflow names an agent will grep for.

## Concepts
The mental model. The *why* and the invariants, not just the *what*. Skimmable in under a minute.

## Code map
File pointers to the canonical source. These WILL rot — prefer stable file names over line numbers.

## Gotchas
Non-obvious things, past bugs, constraints not visible from the files themselves. Highest-value section.

## Examples
Concrete scenarios when helpful. Optional but recommended for runbooks.
```

### 5. After creating or updating a file
1. **Update this `INDEX.md`** — add/adjust the one-line entry under the correct category. Format: `- [Title](relative/path.md) — one-line hook describing when to read it.`
2. Update related files' `related:` frontmatter if you created a strong cross-reference.
3. Do not duplicate content across files — put it in one place and link.
4. **Do not edit `CLAUDE.md` automatically.** Propose changes to the user instead (see the suggestion block at the bottom).
5. **Do not duplicate per-indexer content here.** If the fact belongs to one indexer's internals, it goes in that indexer's `docs/ai/`, and this base links to it.

### 6. Style rules
- Write for an AI agent reading cold.
- Prefer bullet points and tables over prose.
- File references use backticks and full paths from repo root.
- Mark uncertainty: "as of <date>" / "verify before relying on this".
- No marketing language, no emojis unless asked.

### 7. When the files and a doc disagree
The repo is the source of truth. If a doc contradicts a stack file / workflow / `package.json`: verify against the file, update the doc, and note the change in your reply so the user can confirm the doc was stale (vs the config having regressed).

---

## Index

### Architecture
<!-- How the monorepo is structured and how the pieces relate. -->
- [Monorepo layout](architecture/monorepo-layout.md) — npm workspaces + Turborepo, the folder map, where work happens vs supporting infra.
- [Indexer topology](architecture/indexer-topology.md) — the two indexers, the storage-dictionary → liquidity-pools producer/consumer relationship, shared GHCR image registry.

### Deployment
<!-- Self-hosted Docker Swarm stacks in self-hosted/. Active production target. -->
- [Docker Swarm overview](deployment/docker-swarm-overview.md) — patterns shared by every stack: SHA-pinned images, pgbouncer, Traefik routing, external secrets, Postgres tuning, restart policy.
- [Postgres password & secret management](deployment/postgres-secret-management.md) — the two paired Swarm secrets (raw password + pgbouncer userlist) used by every production stack, why `AUTH_TYPE=plain`, Swarmpit constraints, rotation playbook.
- [Storage-dictionary stacks](deployment/storage-dictionary-stacks.md) — one stack per `PROCESS_*` category, multiprocessor block-range split, how parallel reindex is wired.
- [Aggregation-indexer stacks](deployment/aggregation-indexer-stacks.md) — `orca-full-orca.yml` / `orca-full-catfish.yml`, storage-dictionary URL wiring, Redis TimeSeries + Prometheus sidecars.
- [Shared & all-in-one stacks](deployment/shared-infra-stacks.md) — `all-in-one/`, `time-series.stack.yml`, `api-health-checker.stack.yml`, `indexer-health-checker/`.

### CI/CD
<!-- GitHub Actions workflows in .github/workflows/. -->
- [Image build & publish](ci-cd/image-build-publish.md) — the primary pipeline: build both indexer Docker images, push to GHCR, branch→tag rule, reusable workflows.
- [API tests](ci-cd/api-tests.md) — build-then-test pipeline running each indexer against a throwaway Postgres and asserting via `tests/api-tests`.
- [SQD-hosting deploy (legacy)](ci-cd/sqd-hosting-deploy.md) — `versions/**`-triggered auto-deploy of the aggregation indexer to SQD Cloud. Legacy/reference.

### Support apps
<!-- Auxiliary apps not part of the active indexer pipeline. Overview only. -->
- [Support & test apps](support/support-apps.md) — `support/api-health-checker`, `support/db-backfill-from-reapers`, `tests/api-tests`. What they are and when they matter.

### Runbooks
<!-- Cross-monorepo operational tasks. -->
- [Ship a new image version](runbooks/ship-new-image-version.md) — push branch → CI builds & tags image → bump the SHA in the matching stack file → redeploy on the swarm.

---

## Suggested reference to add to root `CLAUDE.md`

Not applied automatically (per the contract above). Suggested wording for a "Further reading" section in the root `CLAUDE.md`:

```markdown
## Further reading

Monorepo-level deep docs (layout, deployment, CI/CD, support apps) live in `docs/ai/`. Start with `docs/ai/INDEX.md`, then load only the relevant topic.

- Repo layout / indexer topology → `docs/ai/architecture/`
- Docker Swarm deployment (self-hosted/) → `docs/ai/deployment/`
- GitHub Actions (image builds, API tests) → `docs/ai/ci-cd/`
- Support & test apps → `docs/ai/support/support-apps.md`

Per-indexer internals stay in each indexer's own docs: `indexers/<name>/CLAUDE.md` and `indexers/liquidity-pools/docs/ai/`.
```
