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

import { events } from './typegenTypes';

import { BatchState } from './utils/batchState';
import { AppConfig } from './appConfig';
const appConfig = AppConfig.getInstance();

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
    name: [events.relayChainInfo.currentBlockNumbers.name],
    call: true,
    extrinsic: true,
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
  })
  .includeAllBlocks()
  .setBlockRange({
    from: appConfig.PROCESS_FROM_BLOCK,
    to: appConfig.PROCESS_TO_BLOCK > 0 ? appConfig.PROCESS_TO_BLOCK : undefined,
  });

if (appConfig.GATEWAY_HYDRATION_HTTPS && !appConfig.IGNORE_ARCHIVE_DATA_SOURCE)
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  processor = processor.setGateway(
    assertNotNull(
      appConfig.GATEWAY_HYDRATION_HTTPS,
      'No gateway endpoint supplied'
    )
  );

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
