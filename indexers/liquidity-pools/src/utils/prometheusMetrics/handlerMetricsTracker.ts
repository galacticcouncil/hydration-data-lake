import { Gauge, Histogram } from 'prom-client';
import { ProcessorType, sqdRegistry } from './registry';

/**
 * Custom Prometheus metrics for tracking handler function execution times
 * and total batch durations.
 */

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

const batchDurationGauge = new Gauge({
  name: 'sqd_batch_duration_last_seconds',
  help: 'Duration of the last batch execution in seconds',
  labelNames: ['processor_type'] as const,
  registers: [sqdRegistry],
});

const handlerDurationGauge = new Gauge({
  name: 'sqd_handler_duration_last_seconds',
  help: 'Duration of the last handler execution in seconds',
  labelNames: ['function_name', 'processor_type'] as const,
  registers: [sqdRegistry],
});

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
      const start = performance.now();
      console.time(name);
      try {
        return await fn();
      } finally {
        end();
        handlerDurationGauge.set(
          { function_name: name, processor_type: processorType },
          (performance.now() - start) / 1000
        );
        console.timeEnd(name);
      }
    },

    trackSync<T>(name: string, fn: () => T): T {
      const end = handlerDurationHistogram.startTimer({
        function_name: name,
        processor_type: processorType,
      });
      const start = performance.now();
      console.time(name);
      try {
        return fn();
      } finally {
        end();
        handlerDurationGauge.set(
          { function_name: name, processor_type: processorType },
          (performance.now() - start) / 1000
        );
        console.timeEnd(name);
      }
    },

    /**
     * Start tracking total batch execution time (Prometheus only).
     * console.time('TOTAL BATCH EXECUTION TIME') is already handled in main.ts.
     * Returns a function to call when the batch completes.
     */
    startBatch(): () => void {
      const histEnd = batchDurationHistogram.startTimer({
        processor_type: processorType,
      });
      const start = performance.now();
      return () => {
        histEnd();
        batchDurationGauge.set(
          { processor_type: processorType },
          (performance.now() - start) / 1000
        );
      };
    },
  };
}
