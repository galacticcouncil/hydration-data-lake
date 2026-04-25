import { Counter, Gauge, Histogram } from 'prom-client';
import { Store } from '@subsquid/typeorm-store';
import { SqdProcessorContext } from '../../processor';
import { ProcessorType, sqdRegistry } from './registry';

/**
 * Custom Prometheus metrics for tracking chain reorgs.
 *
 * SQD does not expose a "reorg" flag on the batch context. When a reorg
 * happens, SQD silently rolls back the DB transaction and re-runs the batch
 * handler with overlapping block heights. We detect this by tracking the
 * highest block height we have seen across batches and comparing each batch's
 * first block to it: if the incoming first height is at or below the prior
 * max, it is a re-run caused by a reorg.
 */

const reorgCounter = new Counter({
  name: 'sqd_reorg_total',
  help: 'Number of detected chain reorgs (batch re-runs at or below prior max height)',
  labelNames: ['processor_type'] as const,
  registers: [sqdRegistry],
});

const reorgDepthHistogram = new Histogram({
  name: 'sqd_reorg_depth_blocks',
  help: 'Reorg depth in blocks (prev max height - incoming first height + 1)',
  labelNames: ['processor_type'] as const,
  registers: [sqdRegistry],
  buckets: [1, 2, 3, 5, 10, 25, 50, 100, 250],
});

const reorgLastHeightGauge = new Gauge({
  name: 'sqd_reorg_last_block_height',
  help: 'Height of the incoming first block of the most recent detected reorg',
  labelNames: ['processor_type'] as const,
  registers: [sqdRegistry],
});

/**
 * Info-style gauge whose value is always 1; the data lives in the labels.
 * We .remove() the previous label set before setting a new one so only one
 * series is active at a time (avoids Prometheus cardinality growth).
 *
 * In Grafana render via a Table panel; block_timestamp is ms-since-epoch as
 * a string label (preserves exact precision; cast to time via field-type
 * transform).
 */
const reorgLastInfoGauge = new Gauge({
  name: 'sqd_reorg_last_block_info',
  help: 'Info-style metric exposing block_height, block_hash and block_timestamp labels for the latest reorg',
  labelNames: [
    'processor_type',
    'block_height',
    'block_hash',
    'block_timestamp',
  ] as const,
  registers: [sqdRegistry],
});

export function createReorgTracker(processorType: ProcessorType) {
  let maxObservedHeight = -1;
  let lastInfoLabels: {
    block_height: string;
    block_hash: string;
    block_timestamp: string;
  } | null = null;

  return {
    /**
     * Call once at the very start of every batch handler, before any other
     * state is initialized — that way even a reorg arriving before batchState
     * setup is recorded.
     */
    observeBatch(ctx: SqdProcessorContext<Store>): void {
      if (ctx.blocks.length === 0) return;

      const first = ctx.blocks[0].header;
      const last = ctx.blocks[ctx.blocks.length - 1].header;

      if (maxObservedHeight >= 0 && first.height <= maxObservedHeight) {
        const depth = maxObservedHeight - first.height + 1;
        // Block production time when available; otherwise fall back to
        // detection wall-clock so the label is never empty.
        const blockTimestampMs = first.timestamp ?? Date.now();

        reorgCounter.inc({ processor_type: processorType });
        reorgDepthHistogram.observe(
          { processor_type: processorType },
          depth
        );
        reorgLastHeightGauge.set(
          { processor_type: processorType },
          first.height
        );

        if (lastInfoLabels) {
          reorgLastInfoGauge.remove({
            processor_type: processorType,
            ...lastInfoLabels,
          });
        }
        lastInfoLabels = {
          block_height: String(first.height),
          block_hash: first.hash,
          block_timestamp: String(blockTimestampMs),
        };
        reorgLastInfoGauge.set(
          { processor_type: processorType, ...lastInfoLabels },
          1
        );

        console.warn(
          `[reorg] detected. processor=${processorType} ` +
            `incomingFirstHeight=${first.height} hash=${first.hash} ` +
            `timestamp=${blockTimestampMs} prevMaxHeight=${maxObservedHeight} depth=${depth}`
        );
      }

      if (last.height > maxObservedHeight) {
        maxObservedHeight = last.height;
      }
    },
  };
}
