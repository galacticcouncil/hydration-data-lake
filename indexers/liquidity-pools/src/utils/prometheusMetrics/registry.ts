import { Registry } from 'prom-client';
import { processor } from '../../processor';

/**
 * Shared Prometheus registry for all custom metrics in this app.
 *
 * SQD framework owns a private Registry and serves only that registry on the
 * configured prometheus port. We keep our own local Registry so metric
 * constructors can wire to it eagerly at module load, then register a sink
 * with SQD so its server merges every metric from this registry into its own
 * just before serving. Result: custom metrics appear alongside SQD built-ins
 * (sqd_processor_last_block, sqd_rpc_request_count, etc.) on the same
 * /metrics endpoint.
 */
export const sqdRegistry: Registry = new Registry();

(processor as any).getPrometheusServer().addMetricsSink({
  register(sqdInternalRegistry: Registry) {
    for (const { name } of sqdRegistry.getMetricsAsArray()) {
      const metric = sqdRegistry.getSingleMetric(name);
      if (metric) sqdInternalRegistry.registerMetric(metric);
    }
  },
});

/**
 * Label value used by every metric in this folder to identify which
 * processor produced the observation. Centralised here so adding a new
 * processor type only touches one file.
 */
export type ProcessorType =
  | 'single_flow'
  | 'core'
  | 'spot_price'
  | 'balances'
  | 'pool_and_asset_metrics';
