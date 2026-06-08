import { Registry } from 'prom-client';

/**
 * Shared Prometheus registry for all custom metrics in this app.
 *
 * SQD's PrometheusServer keeps its own private Registry and exposes no getter
 * for it, so we cannot register onto it directly. Custom metrics register here
 * instead; `processor.ts` attaches a MetricsSink that copies these metrics into
 * SQD's registry when the metrics server starts — so they are served alongside
 * SQD built-in metrics (sqd_processor_last_block, sqd_rpc_request_count, etc.)
 * on the same /metrics endpoint.
 */
export const sqdRegistry: Registry = new Registry();

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
