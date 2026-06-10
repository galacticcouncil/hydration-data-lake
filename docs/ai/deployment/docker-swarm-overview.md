---
name: Docker Swarm deployment overview
description: Patterns shared by every self-hosted/ stack file — SHA-pinned GHCR images, pgbouncer in front of Postgres, Traefik routing labels, external secrets, Postgres tuning, restart policy.
audience: ai-agent, human
related:
  - ./storage-dictionary-stacks.md
  - ./aggregation-indexer-stacks.md
  - ./shared-infra-stacks.md
  - ../runbooks/ship-new-image-version.md
---

# Docker Swarm deployment overview

## When to read this
- Editing any `self-hosted/**/*.stack.yml` or `*.yml` stack file.
- Understanding the conventions every stack shares before diving into a specific one.
- Questions about Traefik routing, pgbouncer, secrets, or the Postgres command flags.
- Deciding how a processor container connects to its DB.

## Concepts

`self-hosted/` is the **active production deployment** target (Docker Swarm). SQD Cloud hosting is legacy. One subfolder/file per deployable component:

```
self-hosted/
  aggregation-indexer/      liquidity-pools stacks (orca-full-orca.yml, orca-full-catfish.yml)
  storage-dictionary-indexer/  one stack per PROCESS_* category + st-dict-all-in-one
  all-in-one/               single-stack catch-all (both indexers + infra together)
  indexer-health-checker/   health-checker stack
  time-series.stack.yml     shared Redis TimeSeries infra
  api-health-checker.stack.yml  shared health-checker infra
  README.md
```

### Patterns common to (almost) every stack

- **YAML anchors for config reuse.** Top-of-file `x-*` anchors (`&dict-indexer-image`, `&dict-proc-default-envs`, `&dict-db-pgbouncer-creds`, `&aggregator-proc-default-config`, …) are merged into services with `<<: *anchor`. Change a value once at the anchor; per-service blocks override individual keys.
- **Images are pinned to a commit SHA**, not `latest`, in the production stacks (e.g. `ghcr.io/galacticcouncil/data-lake-storage-dictionary-indexer:43186c95...`). The `all-in-one/` stack is the exception — it uses `:latest`. Bumping the version = editing the SHA in the image anchor; see `../runbooks/ship-new-image-version.md`.
- **Postgres + pgbouncer.** Each indexer DB is `postgres:15` fronted by an `edoburu/pgbouncer` service (`POOL_MODE: session`). Processor/API containers connect through the **pgbouncer host**, not Postgres directly — `DB_HOST` in `*-db-pgbouncer-creds` points at the bouncer service name. The bouncer reads a `*_PGBOUNCER_USERLIST` external secret.
- **Postgres is hand-tuned** via a long `command:` list (`shared_buffers`, `effective_cache_size`, `work_mem`, `max_connections`, statement/idle timeouts, `pg_stat_statements`, verbose logging). These are deliberate; preserve them when copying a stack.
- **Secrets are external Swarm secrets** (`secrets: { NAME: { external: true } }`) injected at `/run/secrets/<NAME>`. The container `command:` typically does `export DB_PASS=$$(cat /run/secrets/<PG_PASSWORD>)` (and `GATEWAY_HYDRATION_API_KEY` likewise) before launching. Common secrets: `*_PG_PASSWORD`, `*_PGBOUNCER_USERLIST`, `GATEWAY_HYDRATION_API_KEY`, Discord tokens. The Postgres credential specifically uses **two paired secrets** (raw password + pre-baked pgbouncer userlist) — full design + rotation in `./postgres-secret-management.md`.
- **Processor start command** = apply migrations then run: `sqd migration:apply && node lib/main.js` (storage-dictionary) / equivalent for liquidity-pools. **API start command** = `sqd api:prod` (or `node lib/api.js`).
- **Traefik on the external `gateway` network.** API services (and Prometheus) carry `deploy.labels` with `traefik.http.routers.*` rules binding a `Host(...)` to the service, plus an HTTP→HTTPS redirect middleware and `tls.certresolver: myresolver`. Only API/observability services join `gateway`; DBs and processors stay on the internal `default` overlay network.
- **`restart_policy: condition: on-failure`** on every service (processors add `delay`/`max_attempts`/`window`).

## Code map
- `self-hosted/README.md` — human deployment notes (startup order: DB → processor → API; do not run consumer ahead of dictionary).
- `self-hosted/storage-dictionary-indexer/st-dict-all-in-one.stack.yml` — clearest single-processor reference (anchors, pgbouncer, Postgres flags, Traefik labels all in one readable file).
- `self-hosted/aggregation-indexer/orca-full-orca.yml` — full consumer stack with Redis + Prometheus sidecars.
- Per-stack env meaning: each `PROCESS_*` / `STATE_SCHEMA_NAME` / range var is defined in the indexer's own `.env.example` and `CLAUDE.md`.

## Gotchas
- **Connect through pgbouncer, not Postgres.** A new processor/API service must use the pgbouncer host in its DB creds anchor. Pointing it straight at the `postgres:15` service bypasses pooling and can exhaust `max_connections`.
- **`AUTH_TYPE: plain` on pgbouncer is intentional and required** here — the userlist secret is pre-baked with the plaintext password so pgbouncer can derive a SCRAM proof for the Postgres backend. The inline comment that it "should be scram-sha-256" predates that understanding; do not switch it. Full reasoning + rotation: `./postgres-secret-management.md`.
- **Traefik `Host(...)` rules and service names must stay consistent.** The `st-dict-all-in-one` file header warns the deployment must be named `stdict-all-in-one` to satisfy its routing rules. Renaming a stack/service can silently break routing because Traefik service references are string-built from the stack name.
- **`INDEXING_IS_PAUSED`** appears set to `'true'` in some stacks (e.g. `st-dict-all-in-one`). A "deployed but idle" processor is usually this flag, not a crash — check it before debugging "why isn't it indexing".
- **`$$` in commands is intentional.** Compose escapes `$` as `$$`; `$$(cat ...)` runs at container runtime, not at stack-parse time. Don't "fix" it to a single `$`.
- **External secrets must already exist on the swarm.** `external: true` means Compose won't create them — `docker secret create <NAME>` (or equivalent) must have been run on the cluster first, or the stack fails to start.
- **DB ports exposed on the host** (e.g. `15777:5432`, `15:...`) are for operator access; they are not how the app connects. The app uses the internal network + pgbouncer.
