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

import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
const appConfig = AppConfig.getInstance();

let processor = new SubstrateBatchProcessor()
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    url: assertNotNull(appConfig.RPC_HYDRATION_URL, 'No RPC endpoint supplied'),
    capacity: 1000,
    rateLimit: 1000,
    maxBatchCallSize: 1000,

    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
  })
  .addEvent({
    name: appConfig.getEventsToListen(),
    call: true,
    extrinsic: true,
  })
  .addCall({
    name: appConfig.getCallsToListen(),
  })
  .setFields({
    event: {
      args: true,
      name: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
    },
    block: {
      timestamp: true,
    },
    call: {
      name: true,
      args: true,
      origin: true,
      success: true,
      error: true,
    },
  });

if (appConfig.GATEWAY_HYDRATION_HTTPS)
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  processor = processor.setGateway(
    assertNotNull(
      appConfig.GATEWAY_HYDRATION_HTTPS,
      'No gateway endpoint supplied'
    )
  );

if (appConfig.INDEX_FROM_BLOCK && appConfig.INDEX_FROM_BLOCK > 0)
  processor = processor.setBlockRange({
    from: appConfig.INDEX_FROM_BLOCK,
    ...(appConfig.INDEX_TO_BLOCK && appConfig.INDEX_TO_BLOCK > 0
      ? { to: appConfig.INDEX_TO_BLOCK }
      : {}),
  });

export { processor };

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields> & {
  batchState: BatchState;
  appConfig: AppConfig;
};
