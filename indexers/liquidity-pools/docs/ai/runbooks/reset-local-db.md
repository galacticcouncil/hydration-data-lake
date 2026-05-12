---
name: Reset local DB
description: Reset the local dev DB container and restore a dump from `db/dev/`. Skeleton — see also the `reset-and-init-orca-local-alt` skill.
audience: ai-agent, human
related: []
---

# Reset local DB

## When to read this
- Local dev DB is in a bad state and you want a clean restore.
- Switching between dumps in `db/dev/`.

## Steps
TODO. Notes to capture:
- The Claude Code skill `reset-and-init-orca-local-alt` automates this. Document the manual equivalent here so it's reproducible without the skill.
- Which docker compose service to restart (`docker-compose.yml`).
- Where dumps live (`db/dev/`) and naming conventions.
- Post-restore sanity checks.

## Gotchas
TODO.