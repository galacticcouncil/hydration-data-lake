import { SqdProcessorContext } from '../../../processor';
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
} from '../../../model';
import { Between } from 'typeorm/find-options/operator/Between';

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
        swapper: true,
        filler: true,
        event: true,
        inputs: {
          asset: true,
        },
        outputs: {
          asset: true,
        },
        fees: {
          asset: true,
          recipient: true,
        },
      },
    },
  }, { className: 'RoutedTrade' });

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
      assetA: true,
      assetB: true,
      pool: true,
    },
  }, { className: 'XykpoolVolumeHistoricalData' });

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
      assetA: true,
      assetB: true,
      pool: true,
    },
  }, { className: 'LbppoolVolumeHistoricalData' });

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
      omnipoolAsset: {
        asset: true,
      },
    },
  }, { className: 'OmnipoolAssetVolumeHistoricalData' });

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
        asset: true,
        volumesCollection: true,
      },
    },
  }, { className: 'StableswapVolumeHistoricalData' });

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
      assetA: true,
      assetB: true,
      pool: true,
    },
  }, { className: 'XykpoolHistoricalData' });

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
      assetA: true,
      assetB: true,
      pool: true,
    },
  }, { className: 'LbppoolHistoricalData' });

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
  }, { className: 'OmnipoolHistoricalData' });
  const assetsData = await ctx.storeUtils.findWithLogs(OmnipoolAssetHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      poolHistoricalData: true,
      omnipoolAsset: { asset: true },
      asset: true,
    },
  }, { className: 'OmnipoolAssetHistoricalData' });

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
  }, { className: 'StableswapHistoricalData' });
  const poolAssetsData = await ctx.storeUtils.findWithLogs(StableswapAssetHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      asset: true,
      stableswapAsset: { asset: true },
      poolHistoricalData: true,
    },
  }, { className: 'StableswapAssetHistoricalData' });

  ctx.batchState.state.stablepoolAssetsAllHistoricalData = new Map(
    poolAssetsData.map((r) => [r.id, r])
  );
  ctx.batchState.state.stablepoolAllHistoricalData = new Map(
    poolData.map((r) => [r.id, r])
  );
}
