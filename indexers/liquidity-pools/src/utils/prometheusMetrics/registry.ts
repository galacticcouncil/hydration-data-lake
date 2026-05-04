import { Registry } from 'prom-client';
import { processor } from '../../processor';

/**
 * Shared Prometheus registry for all custom metrics in this app.
 *
 * SQD framework uses its own private Registry (not the prom-client default
 * global registry) and serves only that registry on port 3030. We extract it
 * from the processor instance so our custom metrics appear alongside SQD
 * built-in metrics (sqd_processor_last_block, sqd_rpc_request_count, etc.)
 * on the same /metrics endpoint.
 */
export const sqdRegistry: Registry = (processor as any).prometheus.registry;

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