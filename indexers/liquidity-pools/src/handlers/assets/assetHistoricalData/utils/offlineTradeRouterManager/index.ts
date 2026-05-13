import { pool, sor } from '@galacticcouncil/sdk-next';
import { Store } from '@subsquid/typeorm-store';

import { AppConfig } from '../../../../../appConfig';
import { SqdProcessorContext } from '../../../../../processor';
import { publicKeyToSs58 } from '../../../../../utils/helpers';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';

const TradeRouter = sor.TradeRouter;
type TradeRouterInstance = InstanceType<typeof TradeRouter>;
type Hop = pool.Hop;
type SnapshotPoolCtx = pool.SnapshotPoolCtx;
type PoolBase = pool.PoolBase;
type PoolToken = pool.PoolToken;
type LbpPoolBase = pool.lbp.LbpPoolBase;
type StableSwapBase = pool.stable.StableSwapBase;
type OmniPoolBase = pool.omni.OmniPoolBase;
type OmniPoolToken = pool.omni.OmniPoolToken;
const { PoolType } = pool;
const { SnapshotPoolCtxProvider } = pool;
const StableMath = pool.stable.StableMath;

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

    const snapshotCtx = this.buildSnapshotCtx(blockNumber, ctx);
    const router = new TradeRouter(new SnapshotPoolCtxProvider(snapshotCtx));

    this.routerInstancesMap.set(block.height, router);
  }

  private buildSnapshotCtx(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>
  ): SnapshotPoolCtx {
    const blockConstants = this.constantsHistData.get(blockNumber)!;
    const assetsMap = this.assetsHistData.get(blockNumber) ?? new Map();

    return {
      block: blockNumber,
      pools: {
        xyk: this.buildXykPools(blockNumber, ctx, assetsMap, blockConstants),
        lbp: this.buildLbpPools(blockNumber, ctx, assetsMap, blockConstants),
        stable: this.buildStablePools(blockNumber, ctx, assetsMap, blockConstants),
        omni: this.buildOmniPools(blockNumber, ctx, assetsMap, blockConstants),
        aave: this.buildAavePools(blockNumber, ctx),
      },
      states: this.buildPoolStates(blockNumber, ctx, assetsMap, blockConstants),
    };
  }

  private buildXykPools(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>,
    assetsMap: Map<string, any>,
    blockConstants: any
  ): PoolBase[] {
    const pools: PoolBase[] = [];

    if (!ctx.appConfig.USE_XYKPOOLS_DATA_IN_TRADE_ROUTER) return pools;

    for (const [poolId, poolHistData] of (
      this.xykpoolsHistData.get(blockNumber) ?? new Map()
    )) {
      const assetAHistData = assetsMap.get(poolHistData.assetAId);
      const assetBHistData = assetsMap.get(poolHistData.assetBId);
      if (!assetAHistData || !assetBHistData) {
        console.error(`>> XYK: missing asset data for pool ${poolId}`);
        continue;
      }
      const assetA = ctx.batchState.state.assetsAll.get(assetAHistData.assetId);
      const assetB = ctx.batchState.state.assetsAll.get(assetBHistData.assetId);
      if (!assetA || !assetB) {
        console.error(`>> XYK: missing asset in cache for pool ${poolId}`);
        continue;
      }
      pools.push({
        address: publicKeyToSs58(poolHistData.pool.accountId),
        type: PoolType.XYK,
        tokens: [
          {
            id: Number(assetA.assetRegistryId),
            balance: BigInt(poolHistData.assetABalance.toString()),
            decimals: assetA.decimals,
            existentialDeposit: BigInt(assetA.existentialDeposit?.toString() ?? '0'),
            type: assetA.assetType as any,
          },
          {
            id: Number(assetB.assetRegistryId),
            balance: BigInt(poolHistData.assetBBalance.toString()),
            decimals: assetB.decimals,
            existentialDeposit: BigInt(assetB.existentialDeposit?.toString() ?? '0'),
            type: assetB.assetType as any,
          },
        ] as PoolToken[],
        maxInRatio: blockConstants.xykMaxInRatio ?? 0n,
        maxOutRatio: blockConstants.xykMaxOutRatio ?? 0n,
        minTradingLimit: blockConstants.xykMinTradingLimit ?? 0n,
      } as PoolBase);
    }

    return pools;
  }

  private buildLbpPools(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>,
    assetsMap: Map<string, any>,
    blockConstants: any
  ): LbpPoolBase[] {
    const pools: LbpPoolBase[] = [];

    for (const [poolId, poolHistData] of (
      this.lbppoolsHistData.get(blockNumber) ?? new Map()
    )) {
      if (!poolHistData.startBlockNumber || !poolHistData.endBlockNumber) {
        console.log(`>> LBP: missing start/end block for pool ${poolId}`);
        continue;
      }
      const assetAHistData = assetsMap.get(poolHistData.assetAId);
      const assetBHistData = assetsMap.get(poolHistData.assetBId);
      if (!assetAHistData || !assetBHistData) {
        console.error(`>> LBP: missing asset data for pool ${poolId}`);
        continue;
      }
      const assetA = ctx.batchState.state.assetsAll.get(assetAHistData.assetId);
      const assetB = ctx.batchState.state.assetsAll.get(assetBHistData.assetId);
      if (!assetA || !assetB) {
        console.error(`>> LBP: missing asset in cache for pool ${poolId}`);
        continue;
      }
      pools.push({
        address: publicKeyToSs58(poolHistData.pool.accountId),
        type: PoolType.LBP,
        tokens: [
          {
            id: Number(assetA.assetRegistryId),
            balance: BigInt(poolHistData.assetABalance.toString()),
            decimals: assetA.decimals,
            existentialDeposit: BigInt(assetA.existentialDeposit?.toString() ?? '0'),
            type: assetA.assetType as any,
          },
          {
            id: Number(assetB.assetRegistryId),
            balance: BigInt(poolHistData.assetBBalance.toString()),
            decimals: assetB.decimals,
            existentialDeposit: BigInt(assetB.existentialDeposit?.toString() ?? '0'),
            type: assetB.assetType as any,
          },
        ] as PoolToken[],
        maxInRatio: blockConstants.lbpMaxInRatio ?? 0n,
        maxOutRatio: blockConstants.lbpMaxOutRatio ?? 0n,
        minTradingLimit: blockConstants.lbpMinTradingLimit ?? 0n,
        fee: poolHistData.fee as [number, number],
        repayFeeApply: false,
      } as LbpPoolBase);
    }

    return pools;
  }

  private buildStablePools(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>,
    assetsMap: Map<string, any>,
    blockConstants: any
  ): StableSwapBase[] {
    const pools: StableSwapBase[] = [];

    for (const [poolId, poolHistData] of (
      this.stableswapHistData.get(blockNumber) ?? new Map()
    )) {
      const poolAssetsHistData = Array.from(
        ctx.batchState.state.stablepoolAssetsAllHistoricalData.values()
      ).filter(
        (assetHistData) =>
          assetHistData.paraBlockHeight === blockNumber &&
          assetHistData.id.startsWith(`${poolId}-`)
      );

      if (!poolAssetsHistData || poolAssetsHistData.length === 0) {
        console.error(`>> Stable: missing assets data for pool ${poolId}`);
        continue;
      }

      const poolShareTokenHistData = assetsMap.get(poolHistData.pool.shareTokenId);
      if (!poolShareTokenHistData) {
        console.error(`>> Stable: missing share token data for pool ${poolId}`);
        continue;
      }

      const ampStr = StableMath.calculateAmplification(
        poolHistData.initialAmplification.toString(),
        poolHistData.finalAmplification.toString(),
        (poolHistData.initialAmplificationChangeAtBlockHeight ?? blockNumber).toString(),
        (poolHistData.finalAmplificationChangeAtBlockHeight ?? blockNumber).toString(),
        blockNumber.toString()
      );

      const stableTokens = poolAssetsHistData
        .map((assetHistData) => {
          const assetHistoricalData = assetsMap.get(assetHistData.assetId);
          if (!assetHistoricalData) return null;
          const asset = ctx.batchState.state.assetsAll.get(assetHistoricalData.assetId);
          if (!asset) return null;
          return {
            id: Number(asset.assetRegistryId),
            balance: BigInt(assetHistData.freeBalance.toString()),
            decimals: asset.decimals,
            existentialDeposit: BigInt(asset.existentialDeposit?.toString() ?? '0'),
            tradeable: assetHistData.tradable ?? undefined,
            type: asset.assetType as any,
          } as PoolToken;
        })
        .filter((t): t is PoolToken => t !== null);

      // Append virtual share token so the router can price the pool's share
      // token (e.g. 103 for 3-Pool). StableSwapClient does the same at runtime
      // (see StableSwapClient.loadPools, "add virtual share (routing)").
      // Without this entry StableSwap.parsePair() throws "Pool does not contain
      // tokenIn/tokenOut" for the share token ID, causing getSpotPrice to return
      // undefined for every StableSwap share token asset.
      const shareTokenId = Number(poolHistData.pool.id);
      const shareTokenTotalIssuance = BigInt(
        poolShareTokenHistData.totalIssuance?.toString() ?? '0'
      );
      stableTokens.push({
        id: shareTokenId,
        balance: shareTokenTotalIssuance,
        decimals: 18, // RUNTIME_DECIMALS — share tokens always use 18 decimals
        existentialDeposit: 0n,
        tradeable: 15, // TRADEABLE_DEFAULT — share token is always fully tradeable
        type: 'StableSwap' as any,
      } as PoolToken);

      pools.push({
        id: shareTokenId,
        address: publicKeyToSs58(poolHistData.pool.accountId),
        type: PoolType.Stable,
        tokens: stableTokens,
        maxInRatio: 0n,
        maxOutRatio: 0n,
        minTradingLimit: blockConstants.stableswapMinTradingLimit ?? 0n,
        amplification: BigInt(ampStr),
        isRampPeriod: Number(ampStr) < poolHistData.finalAmplification,
        fee: [poolHistData.fee, 1_000_000] as [number, number],
        totalIssuance: BigInt(poolShareTokenHistData.totalIssuance?.toString() ?? '0'),
        pegs: poolHistData.pegs.map((p: any[]) => p.map((i) => i.toString())),
      } as StableSwapBase);
    }

    return pools;
  }

  private buildOmniPools(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>,
    assetsMap: Map<string, any>,
    blockConstants: any
  ): OmniPoolBase[] {
    const omnipoolHistData = this.omnipoolHistData.get(blockNumber);
    if (!omnipoolHistData) return [];

    const omniTokens = omnipoolHistData.assetsHistoricalData
      .map((assetHistData) => {
        const assetHistoricalData = assetsMap.get(assetHistData.assetId);
        if (!assetHistoricalData) return null;
        const asset = ctx.batchState.state.assetsAll.get(assetHistoricalData.assetId);
        if (!asset) {
          console.error(
            `>> Omni: missing asset in cache for omnipool asset ${assetHistData.assetId}`
          );
          return null;
        }
        return {
          id: Number(asset.assetRegistryId),
          balance: BigInt(assetHistData.freeBalance.toString()),
          decimals: asset.decimals,
          existentialDeposit: BigInt(asset.existentialDeposit?.toString() ?? '0'),
          tradeable: assetHistData.tradable,
          type: asset.assetType as any,
          cap: BigInt(assetHistData.assetCap?.toString() ?? '0'),
          hubReserves: BigInt(assetHistData.assetHubReserve?.toString() ?? '0'),
          protocolShares: BigInt(assetHistData.assetProtocolShares?.toString() ?? '0'),
          shares: BigInt(assetHistData.assetShares?.toString() ?? '0'),
        } as OmniPoolToken;
      })
      .filter((t): t is OmniPoolToken => t !== null);

    return [
      {
        address: publicKeyToSs58(omnipoolHistData.pool.accountId),
        type: PoolType.Omni,
        hubAssetId: Number(blockConstants.omnipoolHubAssetId),
        tokens: omniTokens,
        maxInRatio: blockConstants.omnipoolMaxInRatio ?? 0n,
        maxOutRatio: blockConstants.omnipoolMaxOutRatio ?? 0n,
        minTradingLimit: blockConstants.omnipoolMinimumTradingLimit ?? 0n,
      } as OmniPoolBase,
    ];
  }

  private buildAavePools(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>
  ): PoolBase[] {
    const pools: PoolBase[] = [];

    for (const [poolId, poolHistData] of (
      this.aavepoolsHistData.get(blockNumber) ?? new Map()
    )) {
      const reserveAsset = poolHistData.pool.reserveAssetId
        ? ctx.batchState.state.assetsAll.get(poolHistData.pool.reserveAssetId)
        : undefined;
      const aToken = ctx.batchState.state.assetsAll.get(poolHistData.pool.aTokenId);
      if (!reserveAsset || !aToken) {
        console.error(`>> Aave: missing asset in cache for pool ${poolId}`);
        continue;
      }
      pools.push({
        address: publicKeyToSs58(poolHistData.pool.id),
        type: PoolType.Aave,
        tokens: [
          {
            id: Number(reserveAsset.assetRegistryId),
            balance: BigInt(poolHistData.liquidityIn.toString()),
            decimals: reserveAsset.decimals,
            existentialDeposit: BigInt(reserveAsset.existentialDeposit?.toString() ?? '0'),
            type: reserveAsset.assetType as any,
          },
          {
            id: Number(aToken.assetRegistryId),
            balance: BigInt(poolHistData.liquidityOut.toString()),
            decimals: aToken.decimals,
            existentialDeposit: BigInt(aToken.existentialDeposit?.toString() ?? '0'),
            type: aToken.assetType as any,
          },
        ] as PoolToken[],
        maxInRatio: 0n,
        maxOutRatio: 0n,
        minTradingLimit: 0n,
      } as PoolBase);
    }

    return pools;
  }

  private buildPoolStates(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>,
    assetsMap: Map<string, any>,
    blockConstants: any
  ): SnapshotPoolCtx['states'] {
    const emaEntries = this.emaOraclesHistData.get(blockNumber) ?? new Map();

    const dynamicFees: { asset: number; fee: any }[] = [];
    for (const [, assetHistData] of assetsMap) {
      if (!assetHistData.dynamicFee) continue;
      dynamicFees.push({
        asset: Number(
          ctx.batchState.state.assetsAll.get(assetHistData.assetId)?.assetRegistryId ?? 0
        ),
        fee: {
          asset_fee: assetHistData.dynamicFee.assetFee,
          protocol_fee: assetHistData.dynamicFee.protocolFee,
          timestamp: assetHistData.dynamicFee.timestamp,
        } as any,
      });
    }

    const emaOracles: { pair: [number, number]; oracle: any }[] = [];
    for (const entry of emaEntries.values()) {
      if (entry.source !== 'omnipool' || entry.period !== 'Short') continue;
      emaOracles.push({
        pair: [
          Number(entry.assetAAssetRegistryId),
          Number(entry.assetBAssetRegistryId),
        ] as [number, number],
        oracle: [
          {
            volume: {
              a_in: BigInt(entry.assetAInVolume?.toString() ?? '0'),
              a_out: BigInt(entry.assetAOutVolume?.toString() ?? '0'),
              b_in: BigInt(entry.assetBInVolume?.toString() ?? '0'),
              b_out: BigInt(entry.assetBOutVolume?.toString() ?? '0'),
            },
            liquidity: {
              a: BigInt(entry.assetALiquidity?.toString() ?? '0'),
              b: BigInt(entry.assetBLiquidity?.toString() ?? '0'),
            },
            price: { n: 0n, d: 1n },
            updated_at: entry.updatedAtParaBlockHeight ?? 0,
          },
        ] as any,
      });
    }

    return {
      omni: {
        dynamicFees,
        emaOracles,
        assetFeeParams: {
          min_fee: blockConstants.dynamicFeesAssetFeeParameters?.minFee ?? 0,
          max_fee: blockConstants.dynamicFeesAssetFeeParameters?.maxFee ?? 0,
          decay: blockConstants.dynamicFeesAssetFeeParameters?.decay ?? 0,
          amplification: blockConstants.dynamicFeesAssetFeeParameters?.amplification ?? 0,
        } as any,
        protocolFeeParams: {
          min_fee: blockConstants.dynamicFeesProtocolFeeParameters?.minFee ?? 0,
          max_fee: blockConstants.dynamicFeesProtocolFeeParameters?.maxFee ?? 0,
          decay: blockConstants.dynamicFeesProtocolFeeParameters?.decay ?? 0,
          amplification: blockConstants.dynamicFeesProtocolFeeParameters?.amplification ?? 0,
        } as any,
        maxSlipFee: 0,
      },
      xyk: {
        exchangeFee: (blockConstants.xykGetExchangeFee ?? [3, 1000]) as [number, number],
      },
      lbp: {
        repayFee: (blockConstants.lbpRepayFee ?? [0, 1000]) as [number, number],
      },
    };
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
