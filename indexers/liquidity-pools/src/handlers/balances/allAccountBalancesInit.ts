import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { Account, AccountAssetBalanceHistoricalData } from '../../model';
import { AssetBalancesStorageDataPerBlockPerAccountMap } from './commonAssetBalances';
import {
  addAssetBalancesToAccumulator,
  fetchBalancesForAccountsPerBlock,
} from './utils';
import pMap from 'p-map';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import { getOrCreateAsset } from '../assets/asset';
import { AccountData } from '../../parsers/types/storage';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { batchArray, calcPriceNormalized } from '../../utils/helpers';
import {
  handleAccountTotalBalance,
  handleLiquidityBalancesInTotalBalances,
} from './accountTotalBalance';
import { initAllAccountsOnColdStart } from '../accounts/allAccountsInit';
import parsers from '../../parsers';
import { updateAccountProcessingStatusOnTotalBalanceChange } from '../accounts/accountProcessingStatus';
import { getOrCreateAccount } from '../accounts';
import { ZERO_ADDRESS_PK } from '../../utils/types';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

let coldStartDone = false;

export async function handleAllAccountBalancesInit({
  ctx,
  blockHeight,
  whitelistedAccountIds,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
  whitelistedAccountIds?: string[];
}) {
  if (!ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_INIT) return;
  console.log(
    `[ allAccountBalancesInit ] :: Initializing all account balances.`
  );

  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    AccountAssetBalanceHistoricalData,
    {
      where: {},
    },
    { className: 'AccountAssetBalanceHistoricalData' }
  );

  if (hasAnyRecord) {
    console.log(
      `[ allAccountBalancesInit ] :: DB contains historical data. Skipping allAccountBalancesInit.`
    );
    return;
  }

  return handleManyAccountBalancesInitCore({
    ctx,
    blockHeight,
    whitelistedAccountIds,
  });
}

export async function handleManyAccountBalancesInitCore({
  ctx,
  blockHeight,
  whitelistedAccountIds,
  forceFetch = false,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
  whitelistedAccountIds?: string[];
  forceFetch?: boolean;
}) {
  const accountsPerBlock = await initManyAccountAssetBalancesFromOnChainData({
    ctx,
    blockHeight,
    whitelistedAccountIds,
    forceFetch,
  });

  /**
   * Aggregate Account Total Balances
   */
  await handleAccountTotalBalance({ ctx });

  /**
   * Include Liquidity Balances in Total Balances.
   */
  await handleLiquidityBalancesInTotalBalances({
    ctx,
    allProcessedAccountsPerBlock: accountsPerBlock ?? new Map(),
  });

  await updateAccountProcessingStatusOnTotalBalanceChange({ ctx });

  const processedTotalBalances: Set<string> = new Set(
    Array.from(ctx.batchState.state.accountTotalBalanceHistoricalData.keys())
  );

  return processedTotalBalances;
}

export async function initManyAccountAssetBalancesFromOnChainData({
  ctx,
  blockHeight,
  whitelistedAccountIds,
  forceFetch = false,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
  whitelistedAccountIds?: string[];
  forceFetch?: boolean;
}) {
  if (!coldStartDone) {
    const hasAnyAccountRecord = await ctx.storeUtils.findOneWithLogs(
      Account,
      {
        where: {},
      },
      { className: 'Account' }
    );

    if (!hasAnyAccountRecord) {
      console.time('initAllAccountsOnColdStart');
      await initAllAccountsOnColdStart({ ctx });
      console.timeEnd('initAllAccountsOnColdStart');
    }

    coldStartDone = true;
  }

  let allInitializedAccounts = [];

  if (whitelistedAccountIds && whitelistedAccountIds.length > 0) {
    allInitializedAccounts = [];
    for (const whitelistedAccountId of whitelistedAccountIds) {
      allInitializedAccounts.push(
        await getOrCreateAccount({ ctx, id: whitelistedAccountId })
      );
    }
  } else {
    allInitializedAccounts = (
      await ctx.storeUtils.findWithLogs(Account, {
        where: {},
      })
    ).filter((acc) => acc.id !== ZERO_ADDRESS_PK);
  }

  const accountIdsList = allInitializedAccounts.map((acc) => acc.id);

  console.log(
    `handleAssetAccountBalances :: total initialized accounts: ${allInitializedAccounts.length}`
  );
  if (!allInitializedAccounts || allInitializedAccounts.length === 0) {
    console.log(
      `handleAssetAccountBalances :: no initialized accounts found. Skipping.`
    );
    return;
  }

  const processingBlockHeader = blockHeight
    ? ctx.batchState.getBlockHeaderByBlockHeight(blockHeight)
    : ctx.blocks[0].header;

  const keepDbConnectionAliveInterval = setInterval(async () => {
    try {
      await ctx.storeUtils.findOneWithLogs(
        Account,
        { where: {} },
        { className: 'Account' }
      );
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, 300000);

  if (!processingBlockHeader) {
    clearInterval(keepDbConnectionAliveInterval);
    throw new Error('No processing block header found');
  }

  const accountsPerBlock: Map<number, Set<string>> = new Map([
    [processingBlockHeader.height, new Set(accountIdsList)],
  ]);

  const batchedAccounts = batchArray(allInitializedAccounts, 1000);

  const assetBalancesStorageDataPerBlockPerAccountMap: AssetBalancesStorageDataPerBlockPerAccountMap =
    new Map();

  await pMap(
    batchedAccounts,
    async (accountsBatch) => {
      const accountIds = accountsBatch.map((acc) => acc.id);

      const [nativeTokenBalances, commonTokenBalances] = await Promise.all([
        parsers.storage.system.getNativeTokenBalanceMany({
          block: processingBlockHeader,
          accountIds,
          skipCache: true,
        }),
        parsers.storage.tokens.getTokenBalancesMany({
          block: processingBlockHeader,
          accountIds,
          skipCache: true,
        }),
      ]);

      addAssetBalancesToAccumulator({
        accumulator: assetBalancesStorageDataPerBlockPerAccountMap,
        nativeTokenBalances,
        commonTokenBalances,
        blockNumber: processingBlockHeader.height,
      });
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  console.log(`Common assets fetched`);

  const assetBalancesStorageDataPerAccountMap: Map<
    string,
    Map<string, AccountData>
  > = assetBalancesStorageDataPerBlockPerAccountMap.get(
    processingBlockHeader.height
  ) ?? new Map();

  const mmAssetsBalancesIndexedByAccountId: Map<
    string,
    Map<string, bigint>
  > = new Map();

  const initMmAssetsBalancesIndexedByAccountIdSlot = (accountId: string) => {
    if (!mmAssetsBalancesIndexedByAccountId.has(accountId))
      mmAssetsBalancesIndexedByAccountId.set(accountId, new Map());
  };

  /**
   * Ser<string> contains not accountId but key in format <account_id>-<account_bound_evm_address>
   */
  const accountReservesAccumulatorIndexedByReserve: Map<
    string,
    Set<string>
  > = new Map();

  const initReserveSlot = (address: string) => {
    if (!accountReservesAccumulatorIndexedByReserve.has(address))
      accountReservesAccumulatorIndexedByReserve.set(address, new Set());
  };

  if (
    // AaveMoneyMarketManager.getInstance().moneyMarketReservesDetailsMap
    AaveMoneyMarketsRegistry.getInstance().moneyMarketReservesDetailsMap.size >
    0
  ) {
    await pMap(
      allInitializedAccounts,
      async (account) => {
        const accountKey = `${account.id}-${account.boundEvmAddress ?? 'null'}`;
        // const accountReserves =
        //   await AaveMoneyMarketManager.getInstance().getUserReservesDataWithLogs(
        //     {
        //       accountAddress: account.boundEvmAddress!,
        //       blockNumber: processingBlockHeader.height,
        //     }
        //   );
        const accountReserves =
          await AaveMoneyMarketsRegistry.getInstance().getUserReservesDataWithLogs(
            {
              accountAddress: account.boundEvmAddress!,
              blockNumber: processingBlockHeader.height,
            }
          );

        if (!accountReserves || accountReserves.length === 0) return;

        for (const reserve of accountReserves) {
          if (
            (reserve.scaledVariableDebt === '0' &&
              reserve.scaledATokenBalance === '0') ||
            !reserve.underlyingAsset ||
            reserve.underlyingAsset === ''
          ) {
            continue;
          }

          const mmTokenUnderliningAsset = await getOrCreateAsset({
            ctx,
            evmAddress: reserve.underlyingAsset.toLowerCase(),
            ensure: false,
          });
          if (
            !mmTokenUnderliningAsset ||
            (!mmTokenUnderliningAsset.variableDebtTokenId &&
              !mmTokenUnderliningAsset.aTokenId)
          ) {
            console.log(
              `No MM underlining asset found for reserve ${reserve.underlyingAsset} (account ${accountKey})`
            );
            continue;
          }

          const variableDebtTokenEntity =
            mmTokenUnderliningAsset.variableDebtTokenId
              ? ctx.batchState.state.assetsAll.get(
                  mmTokenUnderliningAsset.variableDebtTokenId
                )
              : null;

          const aTokenEntity = mmTokenUnderliningAsset.aTokenId
            ? ctx.batchState.state.assetsAll.get(
                mmTokenUnderliningAsset.aTokenId
              )
            : null;

          if (
            reserve.scaledVariableDebt !== '0' &&
            mmTokenUnderliningAsset.variableDebtTokenId &&
            variableDebtTokenEntity &&
            !assetBalancesStorageDataPerAccountMap
              .get(account.id)
              ?.has(variableDebtTokenEntity.assetRegistryId ?? '')
          ) {
            initReserveSlot(mmTokenUnderliningAsset.variableDebtTokenId);
            accountReservesAccumulatorIndexedByReserve
              .get(mmTokenUnderliningAsset.variableDebtTokenId)
              ?.add(accountKey);
          }

          if (
            reserve.scaledATokenBalance !== '0' &&
            mmTokenUnderliningAsset.aTokenId &&
            aTokenEntity &&
            !assetBalancesStorageDataPerAccountMap
              .get(account.id)
              ?.has(aTokenEntity.assetRegistryId ?? '')
          ) {
            initReserveSlot(mmTokenUnderliningAsset.aTokenId);
            accountReservesAccumulatorIndexedByReserve
              .get(mmTokenUnderliningAsset.aTokenId)
              ?.add(accountKey);
          }
        }
      },
      { concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
    );

    for (const [
      reserveAddress,
      accounts,
    ] of accountReservesAccumulatorIndexedByReserve.entries()) {
      await pMap(
        Array.from(accounts.values()),
        async (accountKey) => {
          const [accountId, accountBoundEvmAddress] = accountKey.split('-');
          if (accountBoundEvmAddress === 'null') return;

          // const balance =
          //   await AaveMoneyMarketManager.getInstance().getAccountTokenBalanceWithLogs(
          //     {
          //       contractAddress: reserveAddress,
          //       accountAddress: accountBoundEvmAddress,
          //       blockNumber: processingBlockHeader.height,
          //     }
          //   );

          const balance = (
            await AaveMoneyMarketsRegistry.getInstance().getAccountTokenBalanceWithLogs(
              {
                contractAddress: reserveAddress,
                accountAddress: accountBoundEvmAddress,
                blockNumber: processingBlockHeader.height,
              }
            )
          )?.value;

          initMmAssetsBalancesIndexedByAccountIdSlot(accountId);

          mmAssetsBalancesIndexedByAccountId
            .get(accountId)!
            .set(reserveAddress, balance ?? 0n);
        },
        {
          concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
        }
      );
    }
  }

  console.log(`MM assets balances fetched`);

  for (const account of allInitializedAccounts) {
    assetLoop: for (const [
      assetRegistryId,
      balances,
    ] of assetBalancesStorageDataPerAccountMap.get(account.id) ??
      new Map<string, AccountData>()) {
      const asset = await getOrCreateAsset({
        ctx,
        assetRegistryId,
        ensure: false,
      });

      if (!asset) {
        continue assetLoop;
      }
      const assetSpotPrice = getAssetsPairPrice({
        ctx,
        assetInId: asset.id,
        blockHeight: processingBlockHeader.height,
      });

      const assetBalanceHistData =
        await getOrCreateAccountAssetBalanceHistoricalData({
          ctx,
          assetId: asset.id,
          account,
          blockHeader: processingBlockHeader,
          fetchFromDb: false,
        });

      assetBalanceHistData.transferable = balances.free;
      assetBalanceHistData.totalLocked = balances.reserved;
      assetBalanceHistData.transferableInRefAssetNorm =
        assetSpotPrice && asset.decimals
          ? calcPriceNormalized({
              amount: balances.free,
              assetDecimals: asset.decimals,
              spotPrice: assetSpotPrice,
            })
          : '0';
      assetBalanceHistData.totalLockedInRefAssetNorm =
        assetSpotPrice && asset.decimals
          ? calcPriceNormalized({
              amount: balances.reserved,
              assetDecimals: asset.decimals,
              spotPrice: assetSpotPrice,
            })
          : '0';

      ctx.batchState.state.accountAssetBalanceHistoricalData.set(
        assetBalanceHistData.id,
        assetBalanceHistData
      );
    }
  }

  for (const account of allInitializedAccounts) {
    assetLoop: for (const [
      assetId,
      balanceBn,
    ] of mmAssetsBalancesIndexedByAccountId.get(account.id) ??
      new Map<string, bigint>()) {
      const asset = await getOrCreateAsset({
        ctx,
        id: assetId,
        ensure: false,
      });

      if (!asset) {
        continue assetLoop;
      }
      const assetSpotPrice = getAssetsPairPrice({
        ctx,
        assetInId: asset.id,
        blockHeight: processingBlockHeader.height,
      });

      const assetBalanceHistData =
        await getOrCreateAccountAssetBalanceHistoricalData({
          ctx,
          assetId: asset.id,
          account,
          blockHeader: processingBlockHeader,
          fetchFromDb: false,
        });

      assetBalanceHistData.transferable = balanceBn;
      assetBalanceHistData.transferableInRefAssetNorm =
        assetSpotPrice && asset.decimals
          ? calcPriceNormalized({
              amount: balanceBn,
              assetDecimals: asset.decimals,
              spotPrice: assetSpotPrice,
            })
          : '0';

      ctx.batchState.state.accountAssetBalanceHistoricalData.set(
        assetBalanceHistData.id,
        assetBalanceHistData
      );
    }
  }

  clearInterval(keepDbConnectionAliveInterval);
  return accountsPerBlock;
}
