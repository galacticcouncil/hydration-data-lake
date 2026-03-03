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

  console.time('accountLiquidityAndTotalBalancesProcessing::Prefetch');
  const [accountAssetBalanceHistoricalData, omnipoolAssetAllHistoricalData] =
    await Promise.all([
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
        { className: 'MoneyMarketEvent' }
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
        { className: 'OmnipoolAssetHistoricalData' }
      ),
    ]);

  for (const item of accountAssetBalanceHistoricalData) {
    ctx.batchState.state.accountAssetBalanceHistoricalData.set(item.id, item);
  }

  for (const item of omnipoolAssetAllHistoricalData) {
    ctx.batchState.state.omnipoolAssetAllHistoricalData.set(item.id, item);
  }

  // ctx.batchState.state.accountAssetBalanceHistoricalData = new Map(
  //   (
  //     await ctx.storeUtils.findWithLogs(
  //       AccountAssetBalanceHistoricalData,
  //       {
  //         where: {
  //           paraBlockHeight: Between(
  //             ctx.blocks[0].header.height,
  //             ctx.blocks[ctx.blocks.length - 1].header.height
  //           ),
  //         },
  //         order: {
  //           paraBlockHeight: 'ASC',
  //         },
  //       },
  //       { className: 'MoneyMarketEvent' }
  //     )
  //   ).map((p) => [p.id, p])
  // );

  // ctx.batchState.state.omnipoolAssetAllHistoricalData = new Map(
  //   (
  //     await ctx.storeUtils.findWithLogs(
  //       OmnipoolAssetHistoricalData,
  //       {
  //         where: {
  //           paraBlockHeight: Between(
  //             ctx.blocks[0].header.height,
  //             ctx.blocks[ctx.blocks.length - 1].header.height
  //           ),
  //         },
  //         order: {
  //           paraBlockHeight: 'ASC',
  //         },
  //       },
  //       { className: 'OmnipoolAssetHistoricalData' }
  //     )
  //   ).map((p) => [p.id, p])
  // );
  console.timeEnd('accountLiquidityAndTotalBalancesProcessing::Prefetch');

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
  console.time('accountLiquidityAndTotalBalancesProcessing:: Save');

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Preparation'
  );
  const accountAssetBalancesLatest = getAccountAssetBalancesLatest({
    balances: Array.from(
      ctx.batchState.state.accountAssetBalanceHistoricalData.values()
    ),
    ctx,
  });

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
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Preparation'
  );

  console.time('accountLiquidityAndTotalBalancesProcessing:: Save :: Flush');

  // await Promise.all([
  //   ctx.storeUtils.upsertWithBatches(accountAssetBalancesLatest),
  //   ctx.storeUtils.upsertWithBatches(accountTotalBalanceHistoricalDataList),
  //   ctx.storeUtils.upsertWithBatches(accountTotalBalancesLatest),
  //   ctx.storeUtils.upsertWithBatches(accountLiquidityBalanceHistoricalDataList),
  //   ctx.storeUtils.upsertWithBatches(accountLiquidityBalancesLatest),
  // ]);

  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountAssetBalancesLatest'
  );
  await ctx.storeUtils.upsertWithBatches(accountAssetBalancesLatest);
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountAssetBalancesLatest'
  );
  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalanceHistoricalDataList'
  );
  await ctx.storeUtils.upsertWithBatches(accountTotalBalanceHistoricalDataList);
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalanceHistoricalDataList'
  );
  console.time(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalancesLatest'
  );
  await ctx.storeUtils.upsertWithBatches(accountTotalBalancesLatest);
  console.timeEnd(
    'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountTotalBalancesLatest'
  );

  if (ctx.appConfig.processingMode.ACCOUNT_LIQUIDITY_BALANCES_FLUSH_ENABLED) {
    console.time(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalanceHistoricalDataList'
    );
    await ctx.storeUtils.upsertWithBatches(
      accountLiquidityBalanceHistoricalDataList
    );
    console.timeEnd(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalanceHistoricalDataList'
    );
    console.time(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalancesLatest'
    );
    await ctx.storeUtils.upsertWithBatches(accountLiquidityBalancesLatest);
    console.timeEnd(
      'accountLiquidityAndTotalBalancesProcessing:: Save :: Flush :: accountLiquidityBalancesLatest'
    );
  }

  console.timeEnd('accountLiquidityAndTotalBalancesProcessing:: Save :: Flush');

  await BalancesLoggerManager.getInstance().flushLogs(ctx);

  console.timeEnd('accountLiquidityAndTotalBalancesProcessing:: Save');

  console.timeEnd('accountLiquidityAndTotalBalancesProcessing');
}
