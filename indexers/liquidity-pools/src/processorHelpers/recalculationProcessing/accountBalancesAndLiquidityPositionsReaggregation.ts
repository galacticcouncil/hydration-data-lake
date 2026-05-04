import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { ProcessorStatusManager } from '../../processorStatusManager';
import { prefetchGenericPersistentDataWithLogs } from '../prefetchHelpers';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetSpotPriceHistoricalData,
  Block,
  MoneyMarketEvent,
  OmnipoolAsset,
} from '../../model';
import { handleRelayChainBlocks } from '../../handlers/relayChain';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { getParsedEventsData } from '../../parsers/batchBlocksParser';
import { StorageResolver } from '../../parsers/storageResolver';
import {
  prefetchOrInitAllBatchAccounts,
  saveAllBatchAccounts,
} from '../../handlers/accounts';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import { handleOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions';
import { HistoricalDataManager } from '../../handlers/historicalData';
import { Between } from 'typeorm/find-options/operator/Between';
import { handleAccountTotalBalance } from '../../handlers/balances/accountTotalBalance';
import { handleXykPoolLiquidityMiningEvents } from '../../handlers/liquidity/xykpool/liquidityMining';
import { initAllOmnipoolLiquidityPositions } from '../../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import { initAllXykLiquidityMiningDeposits } from '../../handlers/liquidity/xykpool/liquidityMining/depositsHandlers';
import { handleOmnipoolLiquidityMiningEvents } from '../../handlers/liquidity/omnipool/liquidityMining';
import { handleUniquesEvents } from '../../handlers/uniques';
import {
  initAllOmnipoolLiquidityMiningDeposits
} from '../../handlers/liquidity/omnipool/liquidityMining/depositHandlers';
import { handleMoneyMarketAssetBalancesForAccounts } from '../../handlers/balances/moneyMarketAssetBalances';

export async function accountBalancesAndLiquidityPositionsReaggregation(
  ctx: SqdProcessorContext<Store>
) {
  if (!ctx.appConfig.processingMode.ALL_IN_ONE_PROCESSOR_MODE) return;

  console.log('accountBalancesAndLiquidityPositionsReaggregation');

  let parsedData = null;

  await Promise.all([
    (async () => {
      await handleRelayChainBlocks(ctx);

      console.time('processExtrinsics');
      await ChainActivityTraceManager.processExtrinsics(ctx);
      console.timeEnd('processExtrinsics');

      console.time('getParsedEventsData');
      /**
       * getParsedEventsData must be executed ONLY after
       * ChainActivityTraceManager.processExtrinsics method execution, because
       * getParsedEventsData needs already compiled traceIds.
       */
      parsedData = await getParsedEventsData(ctx);
      console.timeEnd('getParsedEventsData');

      await StorageResolver.getInstance().init({
        ctx: ctx,
        blockNumberFrom: ctx.blocks[0].header.height,
        blockNumberTo: ctx.blocks[ctx.blocks.length - 1].header.height,
      });

      await prefetchOrInitAllBatchAccounts(ctx);
    })(),
    (async () => {
      console.time('initContractInstances');
      await AaveMoneyMarketManager.getInstance().initContractInstances({
        ctx: ctx,
        blockNumber: ctx.blocks[ctx.blocks.length - 1].header.height,
      });
      console.timeEnd('initContractInstances');
      return null;
    })(),
    prefetchGenericPersistentDataWithLogs(ctx, false),
  ]);

  if (!parsedData) throw new Error('parsedData is null');

  ctx.batchState.state.assetsAll = new Map(
    (
      await ctx.storeUtils.findWithLogs(
        Asset,
        {
          where: {},
        },
        { className: 'Asset' }
      )
    ).map((p) => [p.id, p])
  );

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
        },
        { className: 'Block' }
      )
    ).map((p) => [p.id, p])
  );

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
        },
        { className: 'AssetSpotPriceHistoricalData' }
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
            event: {
              block: true,
            },
          },
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'MoneyMarketEvent' }
      )
    ).map((p) => [p.id, p])
  );
  ctx.batchState.state.accountAssetBalanceHistoricalData = new Map(
    (
      await ctx.storeUtils.findWithLogs(
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
        { className: 'MoneyMarketEvent' }
      )
    ).map((p) => [p.id, p])
  );

  const allProcessedAccountsPerBlock = new Map<number, Set<string>>();

  for (const balanceHistData of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (!allProcessedAccountsPerBlock.has(balanceHistData.paraBlockHeight))
      allProcessedAccountsPerBlock.set(
        balanceHistData.paraBlockHeight,
        new Set()
      );

    allProcessedAccountsPerBlock
      .get(balanceHistData.paraBlockHeight)
      ?.add(balanceHistData.accountId);
  }

  console.time('handleMoneyMarketAssetBalancesForAccounts');
  await handleMoneyMarketAssetBalancesForAccounts({
    allProcessedAccountsPerBlock,
    ctx,
  });
  console.timeEnd('handleMoneyMarketAssetBalancesForAccounts');

  console.time('initAllXykLiquidityMiningDeposits');
  await initAllXykLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllXykLiquidityMiningDeposits');

  console.time('initAllOmnipoolLiquidityPositions');
  await initAllOmnipoolLiquidityPositions(ctx);
  console.timeEnd('initAllOmnipoolLiquidityPositions');

  console.time('initAllOmnipoolLiquidityMiningDeposits');
  await initAllOmnipoolLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllOmnipoolLiquidityMiningDeposits');

  console.time('handleOmnipoolLiquidityPositions');
  await handleOmnipoolLiquidityPositions(ctx, parsedData);
  console.timeEnd('handleOmnipoolLiquidityPositions');

  console.time('handleOmnipoolLiquidityMiningEvents');
  await handleOmnipoolLiquidityMiningEvents(ctx, parsedData);
  console.timeEnd('handleOmnipoolLiquidityMiningEvents');

  console.time('handleXykPoolLiquidityMiningEvents');
  await handleXykPoolLiquidityMiningEvents(ctx, parsedData);
  console.timeEnd('handleXykPoolLiquidityMiningEvents');

  console.time('handleUniquesEvents');
  await handleUniquesEvents(ctx, parsedData);
  console.timeEnd('handleUniquesEvents');

  console.time('handleAccountTotalBalance');
  await handleAccountTotalBalance({ ctx });
  console.timeEnd('handleAccountTotalBalance');

  console.time('saveAllBatchAccounts');
  await saveAllBatchAccounts(ctx);
  console.timeEnd('saveAllBatchAccounts');

  console.time('saveAccountBalancesRelatedDataBulk');
  await HistoricalDataManager.saveAccountBalancesRelatedDataBulk(ctx);
  console.timeEnd('saveAccountBalancesRelatedDataBulk');

  console.time('updateInitialIndexingFinishedAtTime');
  await ProcessorStatusManager.updateInitialIndexingFinishedAtTime(ctx);
  console.timeEnd('updateInitialIndexingFinishedAtTime');

  await ProcessorStatusManager.getInstance(ctx).updateProcessorStatus({
    latestProcessedBlock: ctx.blocks[ctx.blocks.length - 1].header.height,
  });
}
