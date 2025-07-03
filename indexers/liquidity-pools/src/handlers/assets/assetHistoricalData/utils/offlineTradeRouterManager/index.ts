import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';
import {
  TradeRouter,
  OfflinePoolService,
  IPersistentDataInput,
  OfflinePoolUtils,
} from '../offlineSdk/sdk/src';
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
        await this.initOfflineTradeRouterForBlock(blockNumber, ctx);
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
      }),
      pools: {
        lbp: this.getDecoratedLbppoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        xyk: ctx.appConfig.USE_XYKPOOLS_DATA_IN_TRADE_ROUTER
          ? this.getDecoratedXykpoolHistDataAsPersistentDataInput({
              blockNumber,
            })
          : [],
        stableswap: this.getDecoratedStableswapHistDataAsPersistentDataInput({
          blockNumber,
        }),
        omnipool: this.getDecoratedOmnipoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        aave: this.getDecoratedAavepoolHistDataAsPersistentDataInput({
          blockNumber,
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
