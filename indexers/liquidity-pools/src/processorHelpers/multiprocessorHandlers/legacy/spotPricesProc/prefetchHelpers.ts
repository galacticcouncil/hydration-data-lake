import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  LbppoolHistoricalData,
  LbppoolVolumeHistoricalData,
  OmnipoolAssetHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  OmnipoolHistoricalData,
  RoutedTrade,
  StableswapAssetHistoricalData,
  StableswapAssetVolumeHistoricalData,
  StableswapHistoricalData,
  StableswapVolumeHistoricalData,
  SwapAssetBalanceType,
  XykpoolHistoricalData,
  XykpoolVolumeHistoricalData,
} from '../../../../model';
import { SqdProcessorContext } from '../../../../processor';

export async function prefetchAllAvailableRoutedTradesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const routes = await ctx.storeUtils.findWithLogs(RoutedTrade, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      swaps: {
        event: true,
        inputs: {},
        outputs: {},
        fees: {},
      },
    },
  }, { className: 'RoutedTrade', originCallFn: 'prefetchAllAvailableRoutedTradesForBlocksRange' });

  for (const route of routes) {
    for (const swap of route.swaps) {
      swap.inputs = swap.inputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Input
      );
      swap.outputs = swap.outputs.filter(
        (i) => i.assetBalanceType === SwapAssetBalanceType.Output
      );
    }
  }

  ctx.batchState.state.routeTrades = new Map(routes.map((r) => [r.id, r]));
}

export async function prefetchAllAvailableXykpoolVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(XykpoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
    },
  }, { className: 'XykpoolVolumeHistoricalData', originCallFn: 'prefetchAllAvailableXykpoolVolumesForBlocksRange' });

  ctx.batchState.state.xykPoolVolumes = new Map(records.map((r) => [r.id, r]));
}

export async function prefetchAllAvailableLbppoolVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(LbppoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
    },
  }, { className: 'LbppoolVolumeHistoricalData', originCallFn: 'prefetchAllAvailableLbppoolVolumesForBlocksRange' });

  ctx.batchState.state.lbpPoolVolumes = new Map(records.map((r) => [r.id, r]));
}

export async function prefetchAllAvailableOmnipoolAssetVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(OmnipoolAssetVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      omnipoolAsset: true,
      
    },
  }, { className: 'OmnipoolAssetVolumeHistoricalData', originCallFn: 'prefetchAllAvailableOmnipoolAssetVolumesForBlocksRange' });

  ctx.batchState.state.omnipoolAssetVolumes = new Map(
    records.map((r) => [r.id, r])
  );
}

export async function prefetchAllAvailableStableswapVolumesForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(StableswapVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
      assetVolumes: {
        volumesCollection: true,
      },
      
    },
  }, { className: 'StableswapVolumeHistoricalData', originCallFn: 'prefetchAllAvailableStableswapVolumesForBlocksRange' });

  ctx.batchState.state.stablepoolAssetVolumes = new Map(
    records
      .map((r) =>
        r.assetVolumes.map(
          (av): [string, StableswapAssetVolumeHistoricalData] => [av.id, av]
        )
      )
      .flat()
  );
  ctx.batchState.state.stablepoolVolumeCollections = new Map(
    records.map((r) => [r.id, r])
  );
}

export async function prefetchAllAvailableXykpoolHistDataForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(XykpoolHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
    },
  }, { className: 'XykpoolHistoricalData', originCallFn: 'prefetchAllAvailableXykpoolHistDataForBlocksRange' });

  ctx.batchState.state.xykPoolAllHistoricalData = new Map(
    records.map((r) => [r.id, r])
  );
}

export async function prefetchAllAvailableLbppoolHistDataForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const records = await ctx.storeUtils.findWithLogs(LbppoolHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
    },
  }, { className: 'LbppoolHistoricalData', originCallFn: 'prefetchAllAvailableLbppoolHistDataForBlocksRange' });

  ctx.batchState.state.lbpPoolAllHistoricalData = new Map(
    records.map((r) => [r.id, r])
  );
}

export async function prefetchAllAvailableOmnipoolAssetHistDataForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const poolData = await ctx.storeUtils.findWithLogs(OmnipoolHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
      
    },
  }, { className: 'OmnipoolHistoricalData', originCallFn: 'prefetchAllAvailableOmnipoolAssetHistDataForBlocksRange' });
  const assetsData = await ctx.storeUtils.findWithLogs(OmnipoolAssetHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      poolHistoricalData: true,
      omnipoolAsset: true,
    },
  }, { className: 'OmnipoolAssetHistoricalData', originCallFn: 'prefetchAllAvailableOmnipoolAssetHistDataForBlocksRange' });

  ctx.batchState.state.omnipoolAllHistoricalData = new Map(
    poolData.map((r) => [r.id, r])
  );
  ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
    assetsData.map((r) => [r.id, r])
  );
}

export async function prefetchAllAvailableStableswapHistDataForBlocksRange({
  fromBlockNumber,
  toBlockNumber,
  ctx,
}: {
  fromBlockNumber: number;
  toBlockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  const poolData = await ctx.storeUtils.findWithLogs(StableswapHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
      
    },
  }, { className: 'StableswapHistoricalData', originCallFn: 'prefetchAllAvailableStableswapHistDataForBlocksRange' });
  const poolAssetsData = await ctx.storeUtils.findWithLogs(StableswapAssetHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      stableswapAsset: true,
    },
  }, { className: 'StableswapAssetHistoricalData', originCallFn: 'prefetchAllAvailableStableswapHistDataForBlocksRange' });

  ctx.batchState.state.stablepoolAssetsAllHistoricalData = new Map(
    poolAssetsData.map((r) => [r.id, r])
  );
  ctx.batchState.state.stablepoolAllHistoricalData = new Map(
    poolData.map((r) => [r.id, r])
  );
}
