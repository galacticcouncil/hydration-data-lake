import { assertNotNull } from '@subsquid/util-internal';
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';
import { PrometheusServer } from '@subsquid/util-internal-processor-tools';

import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
import { TypeormDatabaseUtils } from './utils/typeormDatabaseUtils';
import { HydratedLogger } from './utils/hydratedLogger';
import { sqdRegistry } from './utils/prometheusMetrics/registry';
const appConfig = AppConfig.getInstance();

console.log('appConfig.RPC_URL', appConfig.RPC_URL);

let processor = new SubstrateBatchProcessor()
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    url: assertNotNull(appConfig.RPC_URL, 'No RPC endpoint supplied'),
    capacity: appConfig.RPC_CAPACITY,
    rateLimit: appConfig.RPC_RATE_LIMIT,
    maxBatchCallSize: appConfig.RPC_MAX_BATCH_CALL_SIZE,
    requestTimeout: appConfig.RPC_REQUEST_TIMEOUT,

    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
  })
  .addEvent({
    name: appConfig.getEventsToListen(),
    call: true,
    extrinsic: true,
  })
  .addCall({
    name: appConfig.getCallsToListen(),
    stack: true,
  })
  .setFields({
    event: {
      args: true,
      name: true,
      phase: true,
      extrinsic: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
      events: true,
      call: true,
      calls: true,
      stack: true,
      index: true,
    },
    block: {
      timestamp: true,
    },
    call: {
      name: true,
      events: true,
      args: true,
      origin: true,
      success: true,
      error: true,
      extrinsic: true,
    },
  })
  .includeAllBlocks()
  .setBlockRange({
    from: appConfig.PROCESS_FROM_BLOCK,
    to: appConfig.PROCESS_TO_BLOCK > 0 ? appConfig.PROCESS_TO_BLOCK : undefined,
  });

if (appConfig.BLOCKS_FINALITY_OFFSET && appConfig.BLOCKS_FINALITY_OFFSET > 0)
  processor = processor.setFinalityConfirmation(
    appConfig.BLOCKS_FINALITY_OFFSET
  );

if (
  appConfig.GATEWAY_HYDRATION_HTTPS &&
  appConfig.GATEWAY_HYDRATION_API_KEY &&
  !appConfig.IGNORE_ARCHIVE_DATA_SOURCE
)
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  // SQD Network v2 gateways require an API key — https://docs.sqd.dev/v2-keys
  processor = processor.setGateway({
    url: appConfig.GATEWAY_HYDRATION_HTTPS,
    apiKey: appConfig.GATEWAY_HYDRATION_API_KEY ?? undefined,
  });

// Custom prometheus metrics register onto `sqdRegistry`. SQD's PrometheusServer
// keeps its own private registry with no public getter, so we attach a
// MetricsSink: when the metrics server starts, SQD invokes register() with its
// internal registry and we copy our metrics in — exposing them on the same
// /metrics endpoint as SQD built-ins (sqd_processor_last_block, etc.).
const prometheusServer = new PrometheusServer();
prometheusServer.addMetricsSink({
  register(sqdInternalRegistry) {
    for (const { name } of sqdRegistry.getMetricsAsArray()) {
      const metric = sqdRegistry.getSingleMetric(name);
      if (metric) sqdInternalRegistry.registerMetric(metric);
    }
  },
});
processor.setPrometheusServer(prometheusServer);

export { processor };

export type SqdFields = SubstrateBatchProcessorFields<typeof processor>;
export type SqdBlock = BlockHeader<SqdFields>;
export type SqdEvent = _Event<SqdFields>;
export type SqdCall = _Call<SqdFields>;
export type SqdExtrinsic = _Extrinsic<SqdFields>;
export type SqdProcessorContext<Store> = DataHandlerContext<
  Store,
  SqdFields
> & {
  batchState: BatchState;
  appConfig: AppConfig;
  storeUtils: TypeormDatabaseUtils;
  extLogger: HydratedLogger;
};
