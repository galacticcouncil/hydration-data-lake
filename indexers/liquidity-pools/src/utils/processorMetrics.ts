import { Histogram, Registry } from 'prom-client';
import { processor } from '../processor';

/**
 * Custom Prometheus metrics for tracking handler function execution times.
 *
 * SQD framework uses its own private Registry (not the default global one)
 * and serves only that registry on port 3030. We extract it from the
 * processor instance so our custom metrics appear alongside SQD built-in
 * metrics (sqd_processor_last_block, sqd_rpc_request_count, etc.).
 */

const sqdRegistry: Registry = (processor as any).prometheus.registry;

const handlerDurationHistogram = new Histogram({
  name: 'sqd_handler_duration_seconds',
  help: 'Duration of handler function execution in seconds',
  labelNames: ['function_name', 'processor_type'] as const,
  registers: [sqdRegistry],
  buckets: [
    0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60,
  ],
});

const batchDurationHistogram = new Histogram({
  name: 'sqd_batch_duration_seconds',
  help: 'Total batch execution duration in seconds',
  labelNames: ['processor_type'] as const,
  registers: [sqdRegistry],
  buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60, 120, 300],
});

export type ProcessorType =
  | 'single_flow'
  | 'core'
  | 'spot_price'
  | 'balances'
  | 'pool_and_asset_metrics';

/**
 * Creates a metrics tracker scoped to a specific processor type.
 * Each call to track/trackSync records both a Prometheus histogram
 * observation and a console.time/console.timeEnd log.
 *
 * Usage:
 *   const mt = createMetricsTracker('core');
 *   await mt.track('handleAssetRegistry', () => handleAssetRegistry(ctx, parsedData));
 *   mt.trackSync('processPoolsTvlNormalized', () => processPoolsTvlNormalized({ ctx }));
 */
export function createMetricsTracker(processorType: ProcessorType) {
  return {
    async track<T>(name: string, fn: () => Promise<T>): Promise<T> {
      const end = handlerDurationHistogram.startTimer({
        function_name: name,
        processor_type: processorType,
      });
      console.time(name);
      try {
        return await fn();
      } finally {
        end();
        console.timeEnd(name);
      }
    },

    trackSync<T>(name: string, fn: () => T): T {
      const end = handlerDurationHistogram.startTimer({
        function_name: name,
        processor_type: processorType,
      });
      console.time(name);
      try {
        return fn();
      } finally {
        end();
        console.timeEnd(name);
      }
    },

    /**
     * Start tracking total batch execution time (Prometheus only).
     * console.time('TOTAL BATCH EXECUTION TIME') is already handled in main.ts.
     * Returns a function to call when the batch completes.
     */
    startBatch(): () => void {
      return batchDurationHistogram.startTimer({
        processor_type: processorType,
      });
    },
  };
}
