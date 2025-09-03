import { SqdProcessorContext } from '../processor';
import { Store } from '@subsquid/typeorm-store';
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
import { Between } from 'typeorm/find-options/operator/Between';

export async function prefetchGenericPersistentData(
  ctx: SqdProcessorContext<Store>
) {
  await prefetchOrInitAllBatchAccounts(ctx);

  await prefetchAllAssets(ctx);

  ctx.batchState.state.lbpAllBatchPools = new Map(
    (
      await ctx.store.find(Lbppool, {
        where: {},
        relations: { account: true, assetA: true, assetB: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykAllBatchPools = new Map(
    (
      await ctx.store.find(Xykpool, {
        where: {},
        relations: { assetA: true, assetB: true, account: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAssets = new Map(
    (
      await ctx.store.find(OmnipoolAsset, {
        where: {},
        relations: { asset: true, pool: true, addedAtBlock: true },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolEntity =
    (await ctx.store.findOne(Omnipool, {
      where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
      relations: { account: true },
    })) ?? null;

  ctx.batchState.state.stableswapPools = new Map(
    (
      await ctx.store.find(Stableswap, {
        where: {},
        relations: {
          account: true,
          shareToken: true,
          createdAtBlock: true,
          assets: { asset: true },
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.stableswapAssets = new Map(
    (
      await ctx.store.find(StableswapAsset, {
        where: {},
        relations: {
          pool: true,
          asset: true,
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.aavePools = new Map(
    (
      await ctx.store.find(Aavepool, {
        where: {},
        relations: {
          reserveAsset: true,
          aToken: true,
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.moneyMarketReserves = new Map(
    (
      await ctx.store.find(MoneyMarketReserve, {
        where: {},
        relations: {
          aToken: true,
          underlyingAsset: true,
          variableDebtToken: true,
          aavePool: true,
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.hsmpoolEntity =
    (await ctx.store.findOne(Hsmpool, {
      where: { id: ctx.appConfig.HSMPOOL_ADDRESS },
      relations: {
        account: true,
      },
    })) ?? null;

  ctx.batchState.state.hsmCollaterals = new Map(
    (
      await ctx.store.find(HsmCollateral, {
        where: { isRemoved: false },
        relations: {
          pool: true,
          asset: true,
          stableswap: true,
        },
      })
    ).map((c) => [c.id, c])
  );
  ctx.batchState.state.aaveFacilitators = new Map(
    (
      await ctx.store.find(AaveFacilitator, {
        where: { isRemoved: false },
      })
    ).map((c) => [c.id, c])
  );
}

export async function prefetchPersistentDataForMultiFlowProcHistDataAggregationPhase(
  ctx: SqdProcessorContext<Store>
) {
  // moneyMarketEvents

  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.store.find(Block, {
        where: {
          height: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        order: {
          height: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.moneyMarketEvents = new Map(
    (
      await ctx.store.find(MoneyMarketEvent, {
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
      })
    ).map((p) => [p.id, p])
  );
}

export async function prefetchPersistentDataForMultiFlowProcPricesCalcPhase(
  ctx: SqdProcessorContext<Store>
) {
  ctx.batchState.state.batchBlocks = new Map(
    (
      await ctx.store.find(Block, {
        where: {
          height: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        order: {
          height: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.routeTrades = new Map(
    (
      await ctx.store.find(RoutedTrade, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          swaps: {
            event: { block: true },
            inputs: {
              asset: true,
            },
            outputs: {
              asset: true,
            },
          },
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
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
      await ctx.store.find(Swap, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          event: { block: true },
          inputs: {
            asset: true,
          },
          outputs: {
            asset: true,
          },
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
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
      await ctx.store.find(XykpoolVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: true,
          assetA: true,
          assetB: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    (
      await ctx.store.find(OmnipoolAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          omnipoolAsset: { asset: true },
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    (
      await ctx.store.find(StableswapVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { shareToken: true },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    (
      await ctx.store.find(StableswapAssetVolumeHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          volumesCollection: { pool: { shareToken: true } },
          asset: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.lbpPoolAllHistoricalData = new Map(
    (
      await ctx.store.find(LbppoolHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { account: true },
          assetA: true,
          assetB: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.xykPoolAllHistoricalData = new Map(
    (
      await ctx.store.find(XykpoolHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { account: true },
          assetA: true,
          assetB: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAllHistoricalData = new Map(
    (
      await ctx.store.find(OmnipoolHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { account: true },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    (
      await ctx.store.find(OmnipoolAssetHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          poolHistoricalData: { pool: true },
          omnipoolAsset: { asset: true },
          asset: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAllHistoricalData = new Map(
    (
      await ctx.store.find(StableswapHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { shareToken: true, account: true },
          assetsHistoricalData: {
            asset: true,
            stableswapAsset: { asset: true },
            block: true,
          },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.stablepoolAssetsAllHistoricalData = new Map(
    (
      await ctx.store.find(StableswapAssetHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          asset: true,
          poolHistoricalData: true,
          stableswapAsset: { asset: true, pool: { account: true } },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.aavePoolsHistoricalData = new Map(
    (
      await ctx.store.find(AavepoolHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          pool: { aToken: true, reserveAsset: true },
          reserveAsset: true,
          aToken: true,
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.hsmpoolAssetHistData = new Map(
    (
      await ctx.store.find(HsmpoolAssetHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          asset: true,
          collateral: { asset: true },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.moneyMarketEvents = new Map(
    (
      await ctx.store.find(MoneyMarketEvent, {
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
      })
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.constantsHistoricalData = new Map(
    (
      await ctx.store.find(ConstantsHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );

  ctx.batchState.state.assetsHistoricalDataBatch = new Map(
    (
      await ctx.store.find(AssetHistoricalData, {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        relations: {
          asset: {
            underlyingAsset: true,
            aToken: true,
            variableDebtToken: true,
            bondUnderlyingAsset: true,
          },
          block: true,
        },
        order: {
          paraBlockHeight: 'ASC',
          id: 'ASC',
        },
      })
    ).map((p) => [p.id, p])
  );
}
