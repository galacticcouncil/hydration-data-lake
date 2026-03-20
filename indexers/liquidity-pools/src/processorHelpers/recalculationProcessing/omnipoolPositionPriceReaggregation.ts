import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
  AssetSpotPriceHistoricalData,
  Block,
  OmnipoolAssetHistoricalData,
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
  OmnipoolLiquidityPositionStatus,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { ProcessorStatusManager } from '../../processorStatusManager';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
} from '../../handlers/balances/accountTotalBalance';
import { HistoricalDataManager } from '../../handlers/historicalData';
import { LatestProcessedDataCacheManager } from '../../utils/latestProcessedDataCacheManager';
import { correlateAssetSpotPrices } from '../utils';
import { getOrCreateAsset } from '../../handlers/assets/asset';
import { prefetchAllAssets } from '../../handlers/assets/utils';
import { getAssetBalanceInRefAsset } from '../../handlers/balances/utils';
import { BalancesLoggerManager } from '../../handlers/balances/balancesLoggerManager';
import parsers from '../../parsers';

export async function handleOmnipoolPositionPriceReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.time('prefetchSpecificData');

  ctx.batchState.state.omnipoolLiquidityPositions = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        OmnipoolLiquidityPosition,
        {
          where: {
            status: OmnipoolLiquidityPositionStatus.PositionCreated,
          },
        },
        { className: 'OmnipoolLiquidityPosition' }
      )
    ).map((p) => [p.id, p])
  );

  const positionEvents = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPositionEvent,
    {
      where: {
        eventName: OmnipoolLiquidityPositionStatus.PositionCreated,
      },
      relations: { position: true },
    },
    { className: 'OmnipoolLiquidityPositionEvent' }
  );

  const positionEventsWithoutPrice = positionEvents.filter((e) => !e.price);

  const ensuredPositionsStorageData = new Map(
    (
      (await parsers.storage.omnipool.getOmnipoolLiquidityPositions({
        positionIds: positionEventsWithoutPrice
          .map((e) => e.position.id)
          .filter((id) => !!id),
        block: ctx.blocks[0].header,
      })) || []
    )
      .filter((dataWithId) => !!dataWithId.data)
      .map((dataWithId) => [dataWithId.positionId, dataWithId.data])
  );

  const eventsToSave = [];
  const positionsToSave = [];

  for (const event of positionEventsWithoutPrice) {
    const newPrice = ensuredPositionsStorageData.get(event.position.id)?.price;

    if (!newPrice) continue;

    event.price = newPrice;
    const position = ctx.batchState.state.omnipoolLiquidityPositions.get(
      event.position.id
    );

    if (position) {
      position.price = newPrice;
      positionsToSave.push(position);
    }
    eventsToSave.push(event);
  }

  await ctx.storeUtils.upsertWithBatches(eventsToSave);
  await ctx.storeUtils.upsertWithBatches(positionsToSave);
}
