import { pool, sor } from '@galacticcouncil/sdk-next';
import { Store } from '@subsquid/typeorm-store';

import { AppConfig } from '../../../../../appConfig';
import { SqdProcessorContext } from '../../../../../processor';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';

const OfflinePoolService = pool.OfflinePoolService;
const OfflinePoolUtils = pool.OfflinePoolUtils;
const TradeRouter = sor.TradeRouter;
type TradeRouterInstance = InstanceType<typeof TradeRouter>;
type Hop = pool.Hop;
type IPersistentDataInput = pool.IPersistentDataInput;

export class RouterCacheManager {
  private static instance: RouterCacheManager;

  public mlrCached: Map<string, Hop[]> = new Map();
  public mlrCachedPerBlock: Map<string, Hop[]> = new Map();

  static getInstance(): RouterCacheManager {
    if (!RouterCacheManager.instance) {
      RouterCacheManager.instance = new RouterCacheManager();
    }
    return RouterCacheManager.instance;
  }

  wipeCache() {
    this.mlrCached = new Map();
  }
}

const appConfig = AppConfig.getInstance();

export class OfflineTradeRouterManager extends OfflineTradeRouterManagerHelper {
  private static instance: OfflineTradeRouterManager;

  private routerInstancesMap: Map<number, TradeRouterInstance> = new Map();

  static getInstance(): OfflineTradeRouterManager {
    if (!OfflineTradeRouterManager.instance) {
      OfflineTradeRouterManager.instance = new OfflineTradeRouterManager();
    }
    return OfflineTradeRouterManager.instance;
  }
  private constructor() {
    super();
  }

  getRouterForBlock(blockNumber: number): TradeRouterInstance | null {
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

    const persistentDataSource = {
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
      OfflinePoolUtils.fromPersistentDataToDataSource(
        persistentDataSource as unknown as IPersistentDataInput
      )
    )
      .withOmnipool()
      .withXyk()
      .withStableswap()
      .withLbp()
      .withAave();
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
    router?: TradeRouterInstance;
    blockHeight?: number;
  }) {
    if (!router && !blockHeight)
      throw new Error('Router or blockHeight required');

    const routerInstance = router ?? this.getRouterForBlock(blockHeight!);

    if (!routerInstance) throw new Error('Router not found');

    const assetInNum = Number(assetInId);
    const assetOutNum = Number(assetOutId);

    if (!appConfig.ENABLE_CACHED_ROUTES_FOR_PRICE_CALCULATION) {
      const price = await routerInstance.getSpotPrice(assetInNum, assetOutNum);
      if (!price) return undefined;
      const route = await routerInstance.getMostLiquidRoute(
        assetInNum,
        assetOutNum
      );
      return { price, route };
    }

    const cacheKey = `${assetInId}-${assetOutId}`;
    const cachedRoute =
      RouterCacheManager.getInstance().mlrCached.get(cacheKey);

    let route: Hop[];
    if (cachedRoute) {
      route = cachedRoute;
    } else {
      route = await routerInstance.getMostLiquidRoute(assetInNum, assetOutNum);
      if (route?.length)
        RouterCacheManager.getInstance().mlrCached.set(cacheKey, route);
    }

    const price = await routerInstance.getSpotPrice(assetInNum, assetOutNum);
    if (!price) return undefined;

    return { price, route };
  }
}
