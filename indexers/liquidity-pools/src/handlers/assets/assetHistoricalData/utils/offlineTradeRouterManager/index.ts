import { Store } from '@subsquid/typeorm-store';

import { SqdProcessorContext } from '../../../../../processor';
import {
  Hop,
  Amount,
  IPersistentDataInput,
  OfflinePoolService,
  OfflinePoolUtils,
  TradeRouter,
} from '../offlineSdk/sdk/src';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';
import { AppConfig } from '../../../../../appConfig';

// } from '@galacticcouncil/sdk';

export class RouterCacheManager {
  private static instance: RouterCacheManager;

  public mlrCached: Map<string, Hop[]> = new Map();
  public mlrCachedPerBlock: Map<string, Hop[]> = new Map();
  private cacheInvalidatedAtBlock: number = 0;

  static getInstance(): RouterCacheManager {
    if (!RouterCacheManager.instance) {
      RouterCacheManager.instance = new RouterCacheManager();
    }
    return RouterCacheManager.instance;
  }

  wipeCache(ctx: SqdProcessorContext<Store>) {
    if (ctx.blocks.length === 0) {
      this.mlrCached = new Map();
      this.cacheInvalidatedAtBlock = 0;
      return;
    }

    if (ctx.blocks.length > 1) {
      this.mlrCached = new Map();
      this.cacheInvalidatedAtBlock =
        ctx.blocks[ctx.blocks.length - 1].header.height;
      return;
    }

    if (
      ctx.blocks[0].header.height - this.cacheInvalidatedAtBlock >
      ctx.appConfig.CACHED_ROUTES_FOR_PRICE_CALCULATION_TTL_BLOCKS
    ) {
      this.mlrCached = new Map();
      this.cacheInvalidatedAtBlock = ctx.blocks[0].header.height;
    }
  }
}

const appConfig = AppConfig.getInstance();

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

  /**
   * Method to get the best spot price with route for a given asset pair.
   * Optionally can use cached routes for price calculation to improve performance.
   */
  async getBestSpotPriceWitRoute({
    assetInId,
    assetOutId,
    router,
    blockHeight,
  }: {
    assetInId: string;
    assetOutId: string;
    router?: TradeRouter;
    blockHeight?: number;
  }) {
    if (!router && !blockHeight)
      throw new Error('Router or blockHeight required');

    const routerInstance = router ?? this.getRouterForBlock(blockHeight!);

    if (!routerInstance) throw new Error('Router not found');

    let priceWithRoute:
      | { price: Amount; route: Hop[]; routeKey: string }
      | undefined;

    if (!appConfig.ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION)
      return routerInstance.getBestSpotPriceWitRoute(assetInId, assetOutId);

    try {
      priceWithRoute = await routerInstance.getBestSpotPriceWitRoute(
        assetInId,
        assetOutId,
        RouterCacheManager.getInstance().mlrCached
      );
    } catch (e) {
      priceWithRoute = await routerInstance.getBestSpotPriceWitRoute(
        assetInId,
        assetOutId
      );
    }

    if (priceWithRoute)
      RouterCacheManager.getInstance().mlrCached.set(
        priceWithRoute?.routeKey,
        priceWithRoute.route
      );

    return priceWithRoute;
  }
}
