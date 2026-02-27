import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountAssetBalanceHistoricalData,
  OmnipoolAssetHistoricalData,
} from '../../../../model';
import { Between } from 'typeorm/find-options/operator/Between';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
} from '../../../../handlers/balances/accountTotalBalance';
import { getAccountAssetBalancesLatest } from '../../../../handlers/balances/accountAssetBalanceLatest';
import { getAccountTotalBalancesLatest } from '../../../../handlers/balances/accountTotalBalanceLatest';
import { getAccountLiquidityBalancesLatest } from '../../../../handlers/balances/accountLiquidityBalanceLatest';
import { BalancesLoggerManager } from '../../../../handlers/balances/balancesLoggerManager';

export async function accountLiquidityAndTotalBalancesProcessing(
  ctx: SqdProcessorContext<Store>
) {
  console.time('accountLiquidityAndTotalBalancesProcessing');
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
          order: {
            paraBlockHeight: 'ASC',
          },
        },
        { className: 'OmnipoolAssetHistoricalData' }
      )
    ).map((p) => [p.id, p])
  );

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: handleAccountTotalBalance'
  );
  await handleAccountTotalBalance({
    ctx,
    // preProcessedTotalBalances,
  });
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: handleAccountTotalBalance'
  );

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: handleLiquidityBalancesInTotalBalances'
  );

  const allProcessedAccountsPerBlock: Map<number, Set<string>> = new Map();

  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (!allProcessedAccountsPerBlock.has(assetBalance.paraBlockHeight)) {
      allProcessedAccountsPerBlock.set(assetBalance.paraBlockHeight, new Set());
    }
    allProcessedAccountsPerBlock
      .get(assetBalance.paraBlockHeight)!
      .add(assetBalance.accountId);
  }

  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock,
  });
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: handleLiquidityBalancesInTotalBalances'
  );

  const accountTotalBalanceHistoricalDataList = Array.from(
    ctx.batchState.state.accountTotalBalanceHistoricalData.values()
  );
  const accountTotalBalancesLatest = getAccountTotalBalancesLatest({
    balances: accountTotalBalanceHistoricalDataList,
    ctx,
  });

  const accountLiquidityBalanceHistoricalDataList = Array.from(
    ctx.batchState.state.accountLiquidityBalanceHistoricalData.values()
  );

  const accountLiquidityBalancesLatest = getAccountLiquidityBalancesLatest({
    balances: accountLiquidityBalanceHistoricalDataList,
    ctx,
  });

  await Promise.all([
    ctx.storeUtils.upsertWithBatches(accountTotalBalanceHistoricalDataList),
    ctx.storeUtils.upsertWithBatches(accountTotalBalancesLatest),
    ctx.storeUtils.upsertWithBatches(accountLiquidityBalanceHistoricalDataList),
    ctx.storeUtils.upsertWithBatches(accountLiquidityBalancesLatest),
  ]);

  await BalancesLoggerManager.getInstance().flushLogs(ctx);
  console.timeEnd('accountLiquidityAndTotalBalancesProcessing');
}
