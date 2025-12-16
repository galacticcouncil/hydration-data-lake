import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';
import { Entity } from '@subsquid/typeorm-store/src/store';

import { prefetchOrInitAllBatchAccounts } from '../handlers/accounts';
import { prefetchAllAssets } from '../handlers/assets/utils';
import {
  AaveFacilitator,
  Aavepool,
  AavepoolHistoricalData,
  AssetHistoricalData,
  Block,
  ConstantsHistoricalData,
  HsmCollateral,
  Hsmpool,
  HsmpoolAssetHistoricalData,
  Lbppool,
  LbppoolHistoricalData,
  MoneyMarketEvent,
  MoneyMarketReserve,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  OmnipoolHistoricalData,
  RoutedTrade,
  Stableswap,
  StableswapAsset,
  StableswapAssetHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapHistoricalData,
  StableswapVolumeHistoricalData,
  Swap,
  SwapAssetBalanceType,
  Xykpool,
  XykpoolHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../model';
import { SqdProcessorContext } from '../processor';

export async function prefetchGenericPersistentDataWithLogs(
  ctx: SqdProcessorContext<Store>,
  processCollectedIdsToPrefetch: boolean = true
) {
  await ctx.extLogger.measure({
    fn: () => prefetchGenericPersistentData(ctx, processCollectedIdsToPrefetch),
    name: 'prefetchGenericPersistentData',
    actionType: 'other',
    meta: { paraBlockHeight: ctx.blocks[0].header.height },
  });
}

export async function prefetchGenericPersistentData(
  ctx: SqdProcessorContext<Store>,
  processCollectedIdsToPrefetch: boolean = true
) {
  if (processCollectedIdsToPrefetch) await prefetchOrInitAllBatchAccounts(ctx);

  await prefetchAllAssets(ctx);

  const fetchAndCachePersistentData = async (
    cacheContainer: Map<string, Entity>,
    fetchFn: () => Promise<Entity[]>
  ) => {
    const resp = await fetchFn();

    for (const entity of resp) {
      cacheContainer.set(entity.id, entity);
    }
  };

  await fetchAndCachePersistentData(ctx.batchState.state.lbpAllBatchPools, () =>
    ctx.storeUtils.findWithLogs(
      Lbppool,
      {
        where: {},
        relations: {},
      },
      { className: 'Lbppool', originCallFn: 'prefetchGenericPersistentData' }
    )
  );

  await fetchAndCachePersistentData(ctx.batchState.state.xykAllBatchPools, () =>
    ctx.storeUtils.findWithLogs(
      Xykpool,
      {
        where: {},
        relations: {},
      },
      { className: 'Xykpool', originCallFn: 'prefetchGenericPersistentData' }
    )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.omnipoolAssets, () =>
    ctx.storeUtils.findWithLogs(
      OmnipoolAsset,
      {
        where: {},
        relations: { pool: true },
      },
      {
        className: 'OmnipoolAsset',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.stableswapPools, () =>
    ctx.storeUtils.findWithLogs(
      Stableswap,
      {
        where: {},
        relations: {
          assets: true,
        },
      },
      {
        className: 'Stableswap',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.stableswapAssets, () =>
    ctx.storeUtils.findWithLogs(
      StableswapAsset,
      {
        where: {},
        relations: {
          pool: true,
        },
      },
      {
        className: 'StableswapAsset',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.aavePools, () =>
    ctx.storeUtils.findWithLogs(
      Aavepool,
      {
        where: {},
        relations: {},
      },
      { className: 'Aavepool', originCallFn: 'prefetchGenericPersistentData' }
    )
  );
  await fetchAndCachePersistentData(
    ctx.batchState.state.moneyMarketReserves,
    () =>
      ctx.storeUtils.findWithLogs(
        MoneyMarketReserve,
        {
          where: {},
          relations: {
            aavePool: true,
          },
        },
        {
          className: 'MoneyMarketReserve',
          originCallFn: 'prefetchGenericPersistentData',
        }
      )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.hsmCollaterals, () =>
    ctx.storeUtils.findWithLogs(
      HsmCollateral,
      {
        where: { isRemoved: false },
        relations: {
          pool: true,
          stableswap: true,
        },
      },
      {
        className: 'HsmCollateral',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )
  );
  await fetchAndCachePersistentData(ctx.batchState.state.aaveFacilitators, () =>
    ctx.storeUtils.findWithLogs(
      AaveFacilitator,
      {
        where: { isRemoved: false },
      },
      {
        className: 'AaveFacilitator',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )
  );
  ctx.batchState.state.omnipoolEntity =
    (await ctx.storeUtils.findOneWithLogs(
      Omnipool,
      {
        where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
        relations: {},
      },
      {
        className: 'Omnipool',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )) ?? null;
  ctx.batchState.state.hsmpoolEntity =
    (await ctx.storeUtils.findOneWithLogs(
      Hsmpool,
      {
        where: { id: ctx.appConfig.HSMPOOL_ADDRESS },
        relations: {},
      },
      {
        className: 'Hsmpool',
        originCallFn: 'prefetchGenericPersistentData',
      }
    )) ?? null;
}

export async function prefetchPersistentDataForMultiFlowProcHistDataAggregationPhase(
  ctx: SqdProcessorContext<Store>
) {
  // moneyMarketEvents

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Block,
        {
          where: {
            height: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            height: 'ASC',
          },
        },
        { className: 'Block' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.moneyMarketEvents = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        MoneyMarketEvent,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            event: { block: true },
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'MoneyMarketEvent' }
      )
    ).map((p) => [p.id, p])
  );
}

export async function prefetchPersistentDataForMultiFlowProcPricesCalcPhase(
  ctx: SqdProcessorContext<Store>
) {
  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Block,
        {
          where: {
            height: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            height: 'ASC',
          },
        },
        { className: 'Block' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.routeTrades = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        RoutedTrade,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            swaps: {
              event: { block: true },
              inputs: {},
              outputs: {},
            },
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'RoutedTrade' }
      )
    ).map((p) => [
      p.id,
      {
        ...p,
        swaps: p.swaps.map((s) => ({
          ...s,
          inputs: s.inputs.filter(
            (i) => i.assetBalanceType === SwapAssetBalanceType.Input
          ),
          outputs: s.outputs.filter(
            (o) => o.assetBalanceType === SwapAssetBalanceType.Output
          ),
        })),
      },
    ])
  );

  ctx.batchState.state.swaps = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Swap,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            event: { block: true },
            inputs: {},
            outputs: {},
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'Swap' }
      )
    ).map((s) => [
      s.id,
      {
        ...s,
        inputs: s.inputs.filter(
          (i) => i.assetBalanceType === SwapAssetBalanceType.Input
        ),
        outputs: s.outputs.filter(
          (o) => o.assetBalanceType === SwapAssetBalanceType.Output
        ),
      },
    ])
  );

  ctx.batchState.state.xykPoolVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        XykpoolVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'XykpoolVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            omnipoolAsset: true,
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'OmnipoolAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
            
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'StableswapVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapAssetVolumeHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            volumesCollection: { pool: true },
            
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'StableswapAssetVolumeHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.lbpPoolAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        LbppoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: {},
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'LbppoolHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        XykpoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'XykpoolHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
            
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'OmnipoolHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolAssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            poolHistoricalData: { pool: true },
            omnipoolAsset: true,          
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'OmnipoolAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true,
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'StableswapHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetsAllHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        StableswapAssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            stableswapAsset: { pool: true },
            
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'StableswapAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.aavePoolsHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AavepoolHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            pool: true
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'AavepoolHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.hsmpoolAssetHistData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        HsmpoolAssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            collateral: true,
            
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'HsmpoolAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.moneyMarketEvents = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        MoneyMarketEvent,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          relations: {
            event: { block: true },
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'MoneyMarketEvent' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.constantsHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        ConstantsHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'ConstantsHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
            id: 'ASC',
          },
        },
        { className: 'AssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );
}
