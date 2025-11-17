import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../../../processor';
import {
  IPersistentDataInput,
  OfflinePoolService,
  OfflinePoolUtils,
  TradeRouter,
} from '../offlineSdk/sdk/src';
import {
  OfflineTradeRouterManagerHelper,
} from './offlineTradeRouterManagerHelper';

// } from '@galacticcouncil/sdk';

export class OfflineTradeRouterManager extends OfflineTradeRouterManagerHelper {
  private static instance: OfflineTradeRouterManager;

  private routerInstancesMap: Map<number, TradeRouter> = new Map();

  static getInstance(): OfflineTradeRouterManager {
    if (!OfflineTradeRouterManager.instance) {
      OfflineTradeRouterManager.instance = new OfflineTradeRouterManager();
    }
    return OfflineTradeRouterManager.instance;
  }
  private constructor() {
    super();
  }

  getRouterForBlock(blockNumber: number): TradeRouter | null {
    return this.routerInstancesMap.get(blockNumber) ?? null;
  }

  wipeCache() {
    this.routerInstancesMap = new Map();
  }

  async initForBlocksBatch({
    blockNumbers,
    ctx,
  }: {
    blockNumbers: number[];
    ctx: SqdProcessorContext<Store>;
  }) {
    await this.prefetchAllHistoricalData({ blockNumbers, ctx });

    await Promise.all(
      blockNumbers.map(async (blockNumber) => {
        return this.initOfflineTradeRouterForBlock(blockNumber, ctx);
      })
    );
  }

  private async initOfflineTradeRouterForBlock(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>
  ) {
    const block = ctx.batchState.getParaBlockFromCacheByHeight(blockNumber);

    if (!block) throw new Error(`Block ${blockNumber} not found in cache`);

    const persistentDataSource: IPersistentDataInput = {
      meta: {
        paraBlockNumber: block.height,
        paraBlockHash: block.hash,
        relayBlockNumber: block.relayBlockHeight,
      },
      constants: this.getDecoratedConstantsHistDataAsPersistentDataInput({
        blockNumber,
      }),
      emaOracle: this.getDecoratedEmaOraclesHistDataAsPersistentDataInput({
        blockNumber,
      }),
      mmOracle: Array.from(
        this.mmOraclesHistData.get(blockNumber)?.values() || []
      ),
      assets: this.getDecoratedAssetsHistDataAsPersistentDataInput({
        blockNumber,
        ctx,
      }),
      pools: {
        lbp: this.getDecoratedLbppoolHistDataAsPersistentDataInput({
          blockNumber,
          ctx,
        }),
        xyk: ctx.appConfig.USE_XYKPOOLS_DATA_IN_TRADE_ROUTER
          ? this.getDecoratedXykpoolHistDataAsPersistentDataInput({
              blockNumber,
              ctx,
            })
          : [],
        stableswap: this.getDecoratedStableswapHistDataAsPersistentDataInput({
          blockNumber,
          ctx,
        }),
        omnipool: this.getDecoratedOmnipoolHistDataAsPersistentDataInput({
          blockNumber,
          ctx,
        }),
        aave: this.getDecoratedAavepoolHistDataAsPersistentDataInput({
          blockNumber,
          ctx,
        }),
      },
    };

    const offlinePoolService = new OfflinePoolService(
      OfflinePoolUtils.fromPersistentDataToDataSource(persistentDataSource)
    );
    const router = new TradeRouter(offlinePoolService);

    this.routerInstancesMap.set(block.height, router);
  }
}
