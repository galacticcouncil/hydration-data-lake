import { Between } from 'typeorm/find-options/operator/Between';

import { Store } from '@subsquid/typeorm-store';

import {
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
  AssetSpotPriceHistoricalData,
  Block,
  OmnipoolAssetHistoricalData,
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

export async function handleAccountNormalisedBalancesReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  await prefetchAllAssets(ctx);

  console.time('prefetchSpecificData');

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
        {
          className: 'Block',
          originCallFn: 'handleAccountNormalisedBalancesReaggregation',
        }
      )
    ).map((p) => [p.id, p])
  );

  const [
    accountAssetBalanceHistoricalData,
    accountTotalBalanceHistoricalData,
    omnipoolAssetAllHistoricalData,
  ] = await Promise.all([
    ctx.storeUtils.findWithLogs(
      AccountAssetBalanceHistoricalData,
      {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        order: {
          paraBlockHeight: 'ASC',
        },
      },
      {
        className: 'AccountAssetBalanceHistoricalData',
        originCallFn: 'handleAccountNormalisedBalancesReaggregation',
      }
    ),
    ctx.storeUtils.findWithLogs(
      AccountTotalBalanceHistoricalData,
      {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        order: {
          paraBlockHeight: 'ASC',
        },
      },
      {
        className: 'AccountTotalBalanceHistoricalData',
        originCallFn: 'handleAccountNormalisedBalancesReaggregation',
      }
    ),
    ctx.storeUtils.findWithLogs(
      OmnipoolAssetHistoricalData,
      {
        where: {
          paraBlockHeight: Between(
            ctx.blocks[0].header.height,
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
        },
        order: {
          paraBlockHeight: 'ASC',
        },
      },
      {
        className: 'OmnipoolAssetHistoricalData',
        originCallFn: 'handleAccountNormalisedBalancesReaggregation',
      }
    ),
  ]);

  for (const item of accountAssetBalanceHistoricalData) {
    ctx.batchState.state.accountAssetBalanceHistoricalData.set(item.id, item);
  }

  for (const item of omnipoolAssetAllHistoricalData) {
    ctx.batchState.state.omnipoolAssetAllHistoricalData.set(item.id, item);
  }
  for (const item of accountTotalBalanceHistoricalData) {
    item.totalTransferableNorm = '0';
    item.totalLockedNorm = '0';
    item.totalDebtNorm = '0';
    ctx.batchState.state.accountTotalBalanceHistoricalData.set(item.id, item);
  }

  ctx.batchState.state.assetsSpotPriceHistoricalDataBatch = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        AssetSpotPriceHistoricalData,
        {
          where: {
            paraBlockHeight: Between(
              ctx.blocks[0].header.height,
              ctx.blocks[ctx.blocks.length - 1].header.height
            ),
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        {
          className: 'AssetSpotPriceHistoricalData',
          originCallFn: 'handleAccountNormalisedBalancesReaggregation',
        }
      )
    ).map((p) => [p.id, p])
  );

  await LatestProcessedDataCacheManager.getInstance().prefetchLastAssetSpotPriceHistDataItem(
    { ctx, blockHeader: ctx.blocks[0].header }
  );

  const spotPricesFromPreviousBatch =
    LatestProcessedDataCacheManager.getInstance().getAllCachedLastAssetSpotPriceHistoricalDataItems();

  for (const prevBatchSpotPrice of spotPricesFromPreviousBatch.values()) {
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.set(
      prevBatchSpotPrice.id,
      prevBatchSpotPrice
    );
  }

  correlateAssetSpotPrices(ctx);

  console.timeEnd('prefetchSpecificData');

  /**
   * ===========================================================================
   * ===========================================================================
   */

  let totalBalancesToIgnore: Set<string> | null = new Set();

  const allProcessedAccountsPerBlock: Map<number, Set<string>> = new Map();

  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (!allProcessedAccountsPerBlock.has(assetBalance.paraBlockHeight)) {
      allProcessedAccountsPerBlock.set(assetBalance.paraBlockHeight, new Set());
    }
    allProcessedAccountsPerBlock
      .get(assetBalance.paraBlockHeight)!
      .add(assetBalance.accountId);

    const asset = await getOrCreateAsset({
      id: assetBalance.assetId,
      ctx,
      ensure: true,
    });
    if (!asset) continue;

    let isNormBalanceUpdated = false;

    if (
      assetBalance.transferable > 0 &&
      assetBalance.transferableInRefAssetNorm === '0'
    ) {
      assetBalance.transferableInRefAssetNorm = await getAssetBalanceInRefAsset(
        {
          balance: assetBalance.transferable,
          asset: asset,
          blockHeight: assetBalance.paraBlockHeight,
          ctx,
        }
      );
      isNormBalanceUpdated = true;
    }

    if (
      assetBalance.totalLocked > 0 &&
      assetBalance.totalLockedInRefAssetNorm === '0'
    ) {
      assetBalance.totalLockedInRefAssetNorm = await getAssetBalanceInRefAsset({
        balance: assetBalance.totalLocked,
        asset: asset,
        blockHeight: assetBalance.paraBlockHeight,
        ctx,
      });
      isNormBalanceUpdated = true;
    }

    if (
      ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_TRIGGERS.has(
        `PROCESS_ACCOUNT_NORMALISED_BALANCES_ONLY_ON_ASSET_BALANCE_CHANGE`
      ) &&
      !isNormBalanceUpdated
    ) {
      totalBalancesToIgnore.add(
        `${assetBalance.accountId}-${assetBalance.paraBlockHeight}`
      );
      allProcessedAccountsPerBlock
        .get(assetBalance.paraBlockHeight)!
        .delete(assetBalance.accountId);
    }
    ctx.batchState.state.accountAssetBalanceHistoricalData.set(
      assetBalance.id,
      assetBalance
    );
  }

  if (
    !ctx.appConfig.processingMode.REAGGREGATION_PROCESSING_FLOW_TRIGGERS.has(
      `PROCESS_ACCOUNT_NORMALISED_BALANCES_ONLY_ON_ASSET_BALANCE_CHANGE`
    )
  ) {
    totalBalancesToIgnore = null;
  }

  await handleAccountTotalBalance({
    ctx,
    preProcessedTotalBalances: totalBalancesToIgnore,
  });

  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock,
    preProcessedTotalBalances: totalBalancesToIgnore,
  });

  console.time('accountLiquidityAndTotalBalancesProcessing:: Save');

  console.time('accountLiquidityAndTotalBalancesProcessing:: Save :: Flush');

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalanceHistoricalDataList'
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values())
  );
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalanceHistoricalDataList'
  );

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountAssetBalanceHistoricalData'
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.accountAssetBalanceHistoricalData.values())
  );
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountAssetBalanceHistoricalData'
  );

  if (ctx.appConfig.ACCOUNT_LIQUIDITY_BALANCES_FLUSH_ENABLED) {
    console.time(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalanceHistoricalData'
    );
    await ctx.storeUtils.upsertWithBatches(
      Array.from(
        ctx.batchState.state.accountLiquidityBalanceHistoricalData.values()
      )
    );
    console.timeEnd(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalanceHistoricalData'
    );
  }

  console.timeEnd('accountLiquidityAndTotalBalancesProcessing:: Save :: Flush');

  await BalancesLoggerManager.getInstance().flushLogs(ctx);

  console.timeEnd('accountLiquidityAndTotalBalancesProcessing:: Save');

  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('Commit to redis');

  await HistoricalDataManager.commitAccountTotalBalancesToRedisTimeSeries(
    Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.values()),
    ctx
  );

  console.timeEnd('Commit to redis');

  /**
   * ===========================================================================
   * ===========================================================================
   */

  LatestProcessedDataCacheManager.getInstance().setLastAssetSpotPriceHistoricalDataItem(
    Array.from(ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.values())
  );

  /**
   * ===========================================================================
   * ===========================================================================
   */
  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}
