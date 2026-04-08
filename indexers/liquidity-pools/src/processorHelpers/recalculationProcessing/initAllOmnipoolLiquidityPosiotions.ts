import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { prefetchAllAssets } from '../../handlers/assets/utils';
import parsers from '../../parsers';
import { AssetType, OmnipoolLiquidityPosition } from '../../model';
import pMap from 'p-map';
import { getOrCreateOmnipoolLiquidityPosition } from '../../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionUtils';
import { handleCommonAssetAccountBalances } from '../../handlers/balances/commonAssetBalances';
import { HistoricalDataManager } from '../../handlers/historicalData';

export async function initAllOmnipoolLiquidityPosiotions(
  ctx: SqdProcessorContext<Store>
) {
  console.log('initAllOmnipoolLiquidityPosiotions :: START');
  await prefetchAllAssets(ctx);

  const processingBlockHeader = ctx.blocks[0].header;

  const allPositions = await parsers.storage.uniques.getAllAssetsData({
    collectionId: '1337',
    block: processingBlockHeader,
  });

  console.log('allPositions - ', allPositions?.length);

  if (!allPositions) {
    console.log('No positions found for collection 1337');
    return;
  }

  const positionsToSave: OmnipoolLiquidityPosition[] = [];

  await pMap(
    allPositions,
    async (position) => {
      const positionEntity = await getOrCreateOmnipoolLiquidityPosition({
        positionId: position.assetId,
        ensure: true,
        blockHeader: processingBlockHeader,
        ctx,
      });
      if (positionEntity)
        ctx.batchState.state.omnipoolLiquidityPositions.set(
          positionEntity.id,
          positionEntity
        );
    },
    { concurrency: 150 }
  );

  await handleCommonAssetAccountBalances({
    ctx,
    accountIdsToProcess: {
      accountsFromSubstrateEventsPerBlock: new Map([
        [
          processingBlockHeader.height,
          new Set(positionsToSave.map((p) => p.accountId)),
        ],
      ]),
      allProcessedAccountsPerBlock: new Map(),
    },
  });

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolLiquidityPositions.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountAssetBalanceHistoricalData.values())
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values())
  );

  await HistoricalDataManager.commitAccountTotalBalancesToRedisTimeSeries(
    Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values()),
    ctx
  );
}
