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

export const processor = new SubstrateBatchProcessor()
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  .setGateway(
    assertNotNull(
      appConfig.GATEWAY_HYDRATION_HTTPS,
      'No gateway endpoint supplied'
    )
  )
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
  .includeAllBlocks()
  .setBlockRange({
    from: appConfig.START_BLOCK !== undefined ? appConfig.START_BLOCK : 0,
    to:
      appConfig.END_BLOCK !== undefined && appConfig.END_BLOCK >= 0
        ? appConfig.END_BLOCK
        : undefined,
  });
// .setBlockRange({ from: 3934551 }); // XYK.create_pool
// .setBlockRange({ from: 3934590 }); // XYK.buy
// .setBlockRange({ from: 1708101 }); // Omnipool.TokenAdded
// .setBlockRange({ from: 3640110 }); // Stableswap.PoolCreated
// .setBlockRange({ from: 1439857 }); // AssetRegistry.Registered

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields> & {
  batchState: BatchState;
  appConfig: AppConfig;
};
