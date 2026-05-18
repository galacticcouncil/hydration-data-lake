---
name: ChainActivityTrace
description: How on-chain activity is grouped into traces (containers of calls/events) and stitched across blocks via operation_id, so the API can render a full action history per user.
audience: ai-agent, human
related:
  - ../caches/batch-state.md
  - ../architecture/data-flow.md
---

# ChainActivityTrace

## When to read this

- Working on anything that touches the `chain_activity_trace`, `chain_activity_trace_relation`, or `account_chain_activity_trace` tables.
- Touching `src/chainActivityTracingManagers/` (`ChainActivityTraceManager`, `OperationStackManager`).
- Adding a new event/call kind that should be surfaced in a user's "actions history" and wondering whether you need to register `entityTypes`, attach participants, or wire a parent relation.
- Reading code that calls `addParticipantsToActivityTracesBulk`, `addOperationIdToActivityTrace`, `getChainActivityTraceByTraceIdsBatch`, `getTraceIdRoot`, `isCallTraceId`, `isEventTraceId`.
- Debugging why an event/swap is (or is not) visible in a user's action history in the UI, or why two related events (e.g. a DCA schedule and one of its trade executions in a different block) are not linked.
- Wondering what `trace_id` strings like `trace-id://context:call/0012399500-5f1ed-000002` or `trace-id://context:event/0012399500-5f1ed:fin/50` mean, or what `operation_ids` like `DCA:30104:9426155/Router:9426156` mean.

## Concepts

### What a "trace" is

A **ChainActivityTrace** is a *container* that groups all on-chain artefacts (`Call`, `Event`) belonging to a single logical unit of work at a single block. There are two kinds of containers, decided by what produced the artefact:

| Container kind | `id` shape | Holds | Originator |
|---|---|---|---|
| Extrinsic-rooted | `<extrinsic.id>` (e.g. `0012399500-5f1ed-000002`) | every `Call` in the extrinsic's call tree + every `Event` emitted under `phase = ApplyExtrinsic` that **is linked to a call** (via `event.getCall()`) in that tree | The signer of the root call (`originValue` when `originValueKind = 'Signed'`). Stored as `originator_id`. |
| Block-phase-rooted | `<block.id>:<group>` where `<group>` ∈ `init` / `ext` / `fin` (e.g. `0012399500-5f1ed:fin`, `0012399394-f2cc6:ext`) | every `Event` in that block-phase that has **no owning call** | None — `originator_id` is `NULL`. |

Note the `:ext` group: not every `ApplyExtrinsic`-phase event is in an extrinsic-rooted trace. Runtime side-effect events that have no parent call (`Balances.Withdraw`, `Balances.Issued`, `Balances.Rescinded`, `Balances.Deposit`, `Currencies.Withdrawn`, `Currencies.Deposited`, `TransactionPayment.TransactionFeePaid`, etc., emitted around extrinsic execution but not as children of its calls) land in the block-phase `:ext` container — exactly the same shape as `:init` / `:fin`, just gated on phase. The branching point is `processExtrinsics` calling `event.getCall()`: if it resolves and the call is in `batchCalls`, the event joins the extrinsic-rooted trace; otherwise it falls through to `getOrCreateChainActivityTrace(eventTraceIdRoot(..., 'ApplyExtrinsic'))` and lands in `<block.id>:ext`.

So in a single block you can have both an extrinsic-rooted trace `<extrinsic.id>` *and* a block-phase `:ext` trace covering the same block — they hold disjoint event sets distinguished only by whether each event has a resolvable parent call.

A trace is created the first time any artefact references it in a batch; subsequent calls/events for the same trace just append to its `trace_ids` array. See `getOrCreateChainActivityTrace` in `ChainActivityTraceManager.processExtrinsics`.

### Trace IDs (the string format)

Every `Call` and `Event` row carries a `trace_id` text column. Format:

```
trace-id://context:<context>/<root>[/<suffix>]
```

| Field | Values | Meaning |
|---|---|---|
| `context` | `call` \| `event` | What kind of artefact the trace-id describes. Tells the matcher whether to expect a call-rooted container or an event-group container. |
| `root` | extrinsic id, or `<block.id>:<group>` | The container's id (see table above). Recover with `ChainActivityTraceManager.getTraceIdRoot`. |
| `suffix` | optional | For calls: the call's own id appended for each level of the call tree. For events: the event's `index` in the block. |

Examples (all real, from prod-101):

- `trace-id://context:call/0012399500-5f1ed-000002` — a `Router.sell` call in extrinsic `0012399500-5f1ed-000002`.
- `trace-id://context:event/0012399500-5f1ed:fin/50` — event #50 in block `0012399500-5f1ed`, emitted during `Finalization`.
- `trace-id://context:event/0007342919-6af9a:init/12` — event #12 in block `0007342919-6af9a`, emitted during `Initialization` (e.g. a DCA-driven `Broadcast.Swapped`).
- `trace-id://context:event/0012399394-f2cc6:ext/8` — event #8 in block `0012399394-f2cc6`, emitted during `ApplyExtrinsic` but with no owning call (a runtime side-effect event like `Balances.Issued`); lands in the block-phase `:ext` container, not in the extrinsic-rooted trace.

Helpers: `isCallTraceId`, `isEventTraceId`, `getTraceIdRoot`, `getTraceId` (composer), `traceIdPrefixWithContext`, `eventTraceIdRoot` — all on `ChainActivityTraceManager`.

`Event.group` is a coarse `EventGroup` enum independent of the trace string and is used by the API/UI to bucket events (`Extrinsic`, `Initialization`, `Finalization`, plus special groups like `Dca`, `Buyback`). See `ChainActivityTraceManager.eventGroup`.

### Participants & originator

- `originator_id` — single account that signed the root call of an extrinsic-rooted trace. Null for block-phase traces (no signer).
- `participant_accounts text[]` and the `account_chain_activity_trace` join table — every account *involved* in any artefact under the trace. Populated by handlers calling `ChainActivityTraceManager.addParticipantsToActivityTracesBulk({ traceIds, participants, ctx })`. Each handler decides who is a participant (swapper, filler, fee recipient, transfer recipient, liquidator, etc.); the trace manager just deduplicates and persists.
- The `account_chain_activity_trace` row is the lookup the API uses to list "all traces this user appears in" without scanning the trace array.

### Relations (cross-block stitching)

`chain_activity_trace_relation` links one trace to another with `(parent_trace_id, child_trace_id)`. The id is `<parent>-<child>` (deterministic, idempotent on reorg re-runs).

Why it exists: a single user action (a DCA schedule, an OTC order) can spawn child events in later blocks (each scheduled trade execution, each partial fill). Those children live in *different* block-phase traces. To let the UI walk from "DCA schedule X" → "all its executions", the indexer writes a relation row from the root trace (where the schedule/order was created) to each subsequent execution trace.

Current writers (search for `new ChainActivityTraceRelation`):

- `src/handlers/dca/dcaScheduleExecutionEvents.ts` — parent = DCA schedule's trace, child = the execution's `swap.event.block` trace (`init` group, since DCA executes in `Initialization`).
- `src/handlers/otc/eventUtils.ts` (`processChainActivityTracesRelationshipsOnOtcOrderEvent`) — parent = the `OTC.place_order` call trace, child = the fill/cancel/partial-fill event's trace.

Both writers skip when parent and child resolve to the same container (no self-loop).

### `operation_id` and `OperationStackManager`

`operation_id` is **not** the same thing as a trace id. It is Hydration's native execution-stack identifier emitted in `Broadcast.Swapped` events as the `operationStack` field. The runtime tags every swap with the chain of execution wrappers it went through, each segment being `<Kind>:<incrementalId>` (DCA also encodes the schedule id, Xcm hashes the source chain). `OperationStackManager.operationStackToString` flattens that struct into a `/`-joined string.

`SwappedExecutionTypeKind`:

| Kind | Segment shape | Notes |
|---|---|---|
| `Batch` | `Batch:<id>` | utility.batch |
| `DCA` | `DCA:<scheduleId>:<executionId>` | The only kind that carries two numbers — schedule id + execution id. |
| `Omnipool` | `Omnipool:<id>` | direct omnipool sell/buy |
| `Router` | `Router:<id>` | trade router sell/buy |
| `Xcm` | `Xcm:<md5(source)>:<id>` | inbound XCM. Source location is hashed to keep length stable. |
| `XcmExchange` | `XcmExchange:<id>` | xcm-exchange pallet |

Example flattened ids seen on prod-101:

```
DCA:15444:1528009/Router:1528010
DCA:15444:1528009/Router:1528010/Omnipool:1528011
Xcm:0fd0758ae47e228e2e55d3c018f099fd:1528015/Batch:1528016/Router:1528017
```

`Broadcast.Swapped` handler (`src/handlers/swap/swap.ts` ~line 383–405) does two things with the stack:

1. Stringify the stack → `operation_id`.
2. Find the **trace** the `Broadcast.Swapped` event belongs to (via its own `trace_id`) and push the operation_id into that trace's `operation_ids` array (`addOperationIdToActivityTrace`).

So each ChainActivityTrace ends up holding **every operation_id its `Broadcast.Swapped` events reported**. Two `Broadcast.Swapped` events with `operation_id` prefixes that share the same `DCA:<scheduleId>:<executionId>` came from the same scheduled execution; sharing only `DCA:<scheduleId>:` means same schedule, different executions. The API uses these prefixes to group swaps under their parent DCA schedule even when the swaps live in different traces (different blocks).

**Mental model**: a trace's `trace_ids` field is "what this trace contains"; its `operation_ids` field is "what runtime execution chains landed in this trace". Trace relations are the indexer's own cross-block links; operation ids are the chain's native cross-block correlator. The API uses both — relations for definite parent/child lineage (DCA schedule → execution, OTC place → fill), operation ids for swap-level grouping under a common root (DCA schedule → all its trades; XCM → all its hops).

### Lifecycle in the batch

Per `singleFlowAllInOneProcessor`:

1. **`ChainActivityTraceManager.processExtrinsics(ctx)`** — builds all `Block` / `Extrinsic` / `Call` / `Event` / `ChainActivityTrace` entities from `ctx.blocks` and pushes them into `ctx.batchState.state` (`batchBlocks`, `batchExtrinsics`, `batchCalls`, `batchEvents`, `chainActivityTraces`). Assigns `trace_id` strings here. Sets `originator` from the root signed call.
2. **`saveActivityTraceEntities(ctx)` (first call, post-`processExtrinsics`)** — flushes the skeleton so downstream handlers can resolve traces from the DB if they fall outside the batch.
3. **Handlers run** — they look up traces by trace-id (`getChainActivityTraceByTraceIdsBatch`), attach participants (`addParticipantsToActivityTracesBulk`), add operation ids (`addOperationIdToActivityTrace`), and create relations.
4. **`saveActivityTraceEntities(ctx)` (second call, end-of-batch)** — re-upserts the same maps. Order: blocks → extrinsics → calls → events → traces → account-trace joins → relations. Reverse iteration (`.reverse()`) preserves FK ordering for nested entities.

The double save is intentional: step 2 commits the structural skeleton so step 3 (which can run lookups crossing the in-memory cache and DB) always sees the rows; step 4 commits the enrichment (participants, operation_ids, relations) done in step 3.

### `entityTypes`

Each `Call` and `Event` has an `entity_types` array tagging it as `Swap` / `Transfer` / `DcaSchedule` / `OtcOrderEvent` / `StableswapLiquidityEvent` / `DcaScheduleExecutionEvent`, etc. Assigned by `getEntityTypesByCallName` / `getEntityTypesByEventName`. This is what the API filters on when it needs "all swap-typed artefacts in this trace" without inspecting raw `args`.

When you add support for a new event or call name that should be surfaced in the UI history, this is the registration point — add a case to those switch statements.

## Code map

- `src/chainActivityTracingManagers/chainActivityTraceManager.ts` — the manager. Key methods:
  - `processExtrinsics` — walks `ctx.blocks`, builds Block/Extrinsic/Call/Event entities and traces, assigns `trace_id` to every call and event.
  - `saveActivityTraceEntities` — flushes batch maps to DB in FK-safe order.
  - `addParticipantsToActivityTrace` / `addParticipantsToActivityTracesBulk` — handler-side API to register participants.
  - `addOperationIdToActivityTrace` — pushes a flattened operation_id onto a trace.
  - `getChainActivityTraceByTraceIdsBatch` — resolves a list of trace-ids to a trace entity (used by relation writers).
  - `getTraceIdRoot` / `isCallTraceId` / `isEventTraceId` — parse the `trace-id://...` string format.
  - `eventGroup` / `eventTraceIdRoot` — phase → bucket mapping.
  - `getEntityTypesByCallName` / `getEntityTypesByEventName` — registry of "interesting" calls/events.
- `src/chainActivityTracingManagers/operationStackManager.ts` — pure stateless helpers around `BroadcastSwappedExecutionType[]`.
- `src/utils/types.ts` — `TraceIdContext`, `TraceIdEventGroup`, `EventPhase`, `SwappedExecutionTypeKind` enums.
- `src/model/generated/chainActivityTrace.model.ts` — `ChainActivityTrace` entity.
- `src/model/generated/chainActivityTraceRelation.model.ts` — `ChainActivityTraceRelation` entity (id format documented inline: `<parentTraceId>-<childTraceId>`).
- `src/model/generated/accountChainActivityTrace.model.ts` — join table; id is `<accountId>-<chainActivityTraceId>`.
- `src/processorHelpers/singleFlowAllInOneProcessor.ts` — orchestration site; calls `processExtrinsics`, two `saveActivityTraceEntities` flushes, and runs all handlers in between.
- Participant-attaching call sites (handlers that decide who's a participant in a trace): see `src/handlers/swap/swap.ts`, `src/handlers/dca/dcaSchedule.ts`, `src/handlers/dca/dcaScheduleExecution.ts`, `src/handlers/otc/otcOrderEvents/*`, `src/handlers/transfers/*`, `src/handlers/moneyMarket/mmEventHandlers/*`, `src/handlers/liquidation/liquidationHandlers.ts`.
- Relation writers: `src/handlers/dca/dcaScheduleExecutionEvents.ts` (`processChainActivityTracesOnDcaExecutionEvent`), `src/handlers/otc/eventUtils.ts` (`processChainActivityTracesRelationshipsOnOtcOrderEvent`).

## Gotchas

- **`processExtrinsics` must run before `getParsedEventsData`.** The latter depends on every event/call having an assigned `trace_id`. Order is documented in `singleFlowAllInOneProcessor.ts` (~line 105–113).
- **Two `saveActivityTraceEntities` calls per batch is intentional.** Don't collapse them. The first persists the skeleton so cross-batch DB lookups in handlers see consistent rows; the second persists the enrichments (participants, operation_ids, relations). If you remove the first flush, handlers that fetch by trace-id from the DB will silently no-op for rows added in the current batch.
- **`entityTypes` is the registry surface for new tracked actions.** If you wire a new event in `parsers/types/events.ts` and want it surfaced in user histories, add a case to `getEntityTypesByEventName` (and `getEntityTypesByCallName` if there's a matching call). Otherwise the row is still written but the API can't filter for it.
- **Trace ids are derived, never random.** `processExtrinsics` re-derives them from `block.id` / `extrinsic.id` / `event.index` / `event.phase`, so the values are stable across reorg re-runs. Don't introduce non-deterministic suffixes.
- **`originator` is only set for `Signed` root calls.** All block-phase traces (`...:init`, `...:ext`, `...:fin`) have `originator_id = NULL` on purpose, *including* `:ext` even though the events fired during an extrinsic — the events themselves have no call to derive a signer from, and the signer lives on the sibling extrinsic-rooted trace. Don't add a fallback that fakes one; the UI relies on the null to decide whether to show "by user X" vs "by chain", and joining `:ext` events back to their owning user goes through `participant_accounts` / `account_chain_activity_trace`, not `originator_id`.
- **`participant_accounts` is the flattened mirror of the join table.** It exists so the API can do `participant_accounts && ARRAY['0x..']` without joining. Always update both — `addParticipantsToActivityTrace` does this for you; if you ever bypass it, keep the two in sync.
- **`operation_id` segments mean different things.** `Router:<id>` is just a router invocation counter, but `DCA:<scheduleId>:<executionId>` carries two numbers because the chain wants you to be able to link both back to the schedule and forward to the specific execution. `OperationStackManager.getRouterIncrementalIdFromOperationId` / `getOminpoolIncrementalIdFromOperationId` parse the simple case; the DCA segment must be parsed manually as `split(':')` yielding `['DCA', scheduleId, executionId]`.
- **`Xcm` segments hash the source location with MD5.** Don't expect to reverse it — it's there to give the segment a fixed length without leaking encoded multi-locations into the id.
- **Relations are created in the *child's* batch.** The parent trace usually lives in a much older block (e.g. the DCA schedule from months earlier); the handler in the current batch resolves it via `getChainActivityTraceByTraceIdsBatch({ fetchFromDb: true })`. If you ever change the parent's `id` retroactively, relation rows break — don't.
- **`addParticipantsToActivityTracesBulk` is a no-op when `traceIds` is empty or null.** Several handlers call it speculatively; that's fine, but be aware that "added a participant" is conditional on the event having a trace id to attach to.
- **Reorg safety.** Every id is deterministic (`extrinsic.id`, `block.id:phase/index`, `<parent>-<child>`, `<account>-<trace>`). Reorg re-runs upsert the same rows. No `firstSeenParaBlockHeight`-style write-once fields on these tables; `para_block_height` reflects the *latest* re-run's block, which is correct because the row's content is fully recomputed.
- **Volume of relations is modest, traces are huge.** As of 2026-05 on prod-101: ~8.4M traces, ~861k relations, ~65k unique originators. Don't paginate naive `SELECT * FROM chain_activity_trace WHERE 'x' = ANY(participant_accounts)` — go through `account_chain_activity_trace` first.

## Examples

### Example 1 — Router swap from a user

User submits `Router.sell`. Block `0012399500-5f1ed`, extrinsic `0012399500-5f1ed-000002`.

- One **extrinsic-rooted trace** is created with `id = '0012399500-5f1ed-000002'`. Originator = the signer.
- The `Router.sell` `Call` gets `trace_id = 'trace-id://context:call/0012399500-5f1ed-000002'`. Subcalls (e.g. `Omnipool.sell`) get nested trace-ids appended with their call ids.
- The `Broadcast.Swapped` event under that extrinsic gets a `context:event` trace-id under the same root.
- `handleBroadcastSwappedEvent` stringifies the `operationStack` (e.g. `['Router:9426270', 'Router:9426270/Omnipool:9426271']`) and pushes both into the trace's `operation_ids`.
- `handleSwap` attaches swapper, filler, fee recipients via `addParticipantsToActivityTracesBulk` — those go into `participant_accounts` and `account_chain_activity_trace`.

End state: a single self-contained trace, no relations. UI can render the full action by reading that one trace + joining calls/events on `trace_id`.

### Example 2 — DCA schedule + its later executions

User calls `DCA.schedule` at block 12,108,870.

- Extrinsic-rooted trace `0012108870-8347c-XXXXXX` is created, plus a block-phase trace `0012108870-8347c:init` because the `DCA.Scheduled` event fires in `Initialization` phase (not under any call).
- `handleDcaSchedules` records both trace ids on the `dcaSchedule` entity (`dcaSchedule.traceIds`).

Months later, at block 12,399,493, the runtime executes a scheduled trade in `Initialization` phase. A new block-phase trace `0012399493-45068:init` is created in that batch.

- `processChainActivityTracesOnDcaExecutionEvent` (in `dcaScheduleExecutionEvents.ts`) resolves both the *current* swap's trace (`0012399493-45068:init`) and the *original* DCA schedule's trace (`0012108870-8347c:init`, fetched from DB) and writes a relation row:
  ```
  id              = '0012108870-8347c:init-0012399493-45068:init'
  parent_trace_id = '0012108870-8347c:init'
  child_trace_id  = '0012399493-45068:init'
  ```
- The execution's `Broadcast.Swapped` event also dumps `DCA:15444:1528009/Router:1528010/...` into the child trace's `operation_ids`, giving the API a second way to confirm the link.

UI: from the user's `account_chain_activity_trace` row pointing at `0012108870-8347c:init`, follow `chain_activity_trace_relation.parent_trace_id` to enumerate every execution.

### Example 3 — Two DCA executions sharing a schedule

The two operation ids in your prompt — `DCA:30104:9426155/Router:9426156` and `DCA:30104:9426155/Router:9426526` — share the prefix `DCA:30104:9426155`, meaning:

- `30104` is the **DCA schedule id** (both come from the same user-submitted schedule).
- `9426155` is the **DCA execution id** (a single scheduled trigger of that schedule).
- `9426156` and `9426526` are two different `Router` invocations *inside the same execution* (e.g. a split trade across two router calls within one execution slot).

So they're not "two executions of the same schedule" — they're two router runs inside the **same execution**. Two different executions of the same schedule would share `DCA:30104:` but differ in the execution-id number.