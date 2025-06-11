import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  LbppoolVolumeHistoricalData,
  OmnipoolAssetVolumeHistoricalData,
  RoutedTrade,
  StableswapAssetVolumeHistoricalData,
  StableswapVolumeHistoricalData,
  SwapAssetBalanceType,
  XykpoolVolumeHistoricalData,
} from '../../model';
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
  const routes = await ctx.store.find(RoutedTrade, {
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
      block: true,
    },
  });

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
  const records = await ctx.store.find(XykpoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      assetA: true,
      assetB: true,
      pool: true,
      block: true,
    },
  });

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
  const records = await ctx.store.find(LbppoolVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      assetA: true,
      assetB: true,
      pool: true,
      block: true,
    },
  });

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
  const records = await ctx.store.find(OmnipoolAssetVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      omnipoolAsset: {
        asset: true,
      },
      block: true,
    },
  });

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
  const records = await ctx.store.find(StableswapVolumeHistoricalData, {
    where: {
      paraBlockHeight: Between(fromBlockNumber, toBlockNumber),
    },
    relations: {
      pool: true,
      assetVolumes: {
        asset: true,
        block: true,
        volumesCollection: true,
      },
      block: true,
    },
  });

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
