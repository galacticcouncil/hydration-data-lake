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
import { getOrCreateAccountOwnedAsset } from './accountOwnedAssets';

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
  if (!ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_INIT) return new Set<string>();
  console.log(
    `[ allAccountBalancesInit ] :: Initializing all account balances.`
  );

  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    AccountAssetBalanceHistoricalData,
    {
      where: {},
    },
    {
      className: 'AccountAssetBalanceHistoricalData',
      originCallFn: 'handleAllAccountBalancesInit',
    }
  );

  if (hasAnyRecord) {
    console.log(
      `[ allAccountBalancesInit ] :: DB contains historical data. Skipping allAccountBalancesInit.`
    );
    return new Set<string>();
  }

  return handleManyAccountBalancesInitCore({
    ctx,
    blockHeight,
    whitelistedAccountIds,
  });
}

export async function handleAllAccountBalancesRefresh({
  ctx,
  blockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
}) {
  if (!ctx.appConfig.ENABLE_ALL_ACCOUNT_BALANCES_REFRESH) return;
  console.log(
    `[ ALL_ACCOUNT_BALANCES_REFRESH ] :: Initializing all account balances.`
  );

  return handleManyAccountBalancesInitCore({
    ctx,
    blockHeight,
    fillOwnershipGapsWithZeros: true,
  });
}

export async function handleManyAccountBalancesInitCore({
  ctx,
  blockHeight,
  whitelistedAccountIds,
  forceFetch = false,
  fillOwnershipGapsWithZeros,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
  whitelistedAccountIds?: string[];
  forceFetch?: boolean;
  fillOwnershipGapsWithZeros?: boolean;
}) {
  const accountsPerBlock = await initManyAccountAssetBalancesFromOnChainData({
    ctx,
    blockHeight,
    whitelistedAccountIds,
    forceFetch,
    fillOwnershipGapsWithZeros,
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
  // When true, after the storage-driven init pass, also write zero-balance
  // AccountAssetBalanceHistoricalData rows for any asset that
  // ctx.batchState.state.accountOwnedAssets says the whitelisted account owns
  // but storage did not return (tokens.accounts and similar storage maps omit
  // zero-balance entries). Without this, an account's first-encounter init at
  // a block where it has fully sold some previously-held asset leaves no
  // tombstone row, and downstream delta math / total composition keep using
  // the stale non-zero "latest" row from DB. Default off to preserve existing
  // behavior for cold-start / reaggregation callers that must not synthesize
  // zero rows for assets the account did not yet own at the processing block.
  fillOwnershipGapsWithZeros = false,
}: {
  ctx: SqdProcessorContext<Store>;
  blockHeight?: number;
  whitelistedAccountIds?: string[];
  forceFetch?: boolean;
  fillOwnershipGapsWithZeros?: boolean;
}) {
  if (!coldStartDone) {
    const hasAnyAccountRecord = await ctx.storeUtils.findOneWithLogs(
      Account,
      {
        where: {},
      },
      {
        className: 'Account',
        originCallFn: 'initManyAccountAssetBalancesFromOnChainData',
      }
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
      await ctx.storeUtils.findWithLogs(
        Account,
        {
          where: {},
        },
        {
          className: 'Account',
          originCallFn: 'initManyAccountAssetBalancesFromOnChainData',
        }
      )
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
        {
          className: 'Account',
          originCallFn: 'initManyAccountAssetBalancesFromOnChainData',
        }
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
    AaveMoneyMarketsRegistry.getInstance().moneyMarketReservesDetailsMap.size >
    0
  ) {
    await pMap(
      allInitializedAccounts,
      async (account) => {
        const accountKey = `${account.id}-${account.boundEvmAddress ?? 'null'}`;
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

      await getOrCreateAccountOwnedAsset({
        ctx,
        accountId: account.id,
        assetId: asset.id,
        firstSeenParaBlockHeight: processingBlockHeader.height,
      });
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

      await getOrCreateAccountOwnedAsset({
        ctx,
        accountId: account.id,
        assetId: asset.id,
        firstSeenParaBlockHeight: processingBlockHeader.height,
      });
    }
  }

  // Second pass: zero-balance ownership gap fill.
  // Storage maps (tokens.accounts, AAVE reserves) omit zero-balance entries,
  // so the storage-driven loop above never produces an AABHD for an asset the
  // account fully sold. This pass cross-references batchState ownership and
  // writes a zero AABHD for every owned (account, asset) pair the storage
  // pass did not cover, so the tombstone row lands and downstream delta math
  // / total composition stop reading the stale non-zero "latest" row from DB.
  if (fillOwnershipGapsWithZeros) {
    for (const account of allInitializedAccounts) {
      const ownedAssetIds = new Set<string>();
      for (const ownedAsset of ctx.batchState.state.accountOwnedAssets.values()) {
        if (ownedAsset.accountId === account.id) {
          ownedAssetIds.add(ownedAsset.assetId);
        }
      }
      if (ownedAssetIds.size === 0) continue;

      for (const assetId of ownedAssetIds) {
        const entityId = `${account.id}-${assetId}-${processingBlockHeader.height}`;
        if (
          ctx.batchState.state.accountAssetBalanceHistoricalData.has(entityId)
        ) {
          continue;
        }

        const asset = await getOrCreateAsset({
          id: assetId,
          ctx,
          ensure: false,
        });
        if (!asset) continue;

        const entity = await getOrCreateAccountAssetBalanceHistoricalData({
          ctx,
          assetId,
          account,
          blockHeader: processingBlockHeader,
          fetchFromDb: false,
        });
        // Zero balance — price math is skipped; norm fields stay at '0'.
        entity.transferable = 0n;
        entity.totalLocked = 0n;
        entity.transferableInRefAssetNorm = '0';
        entity.totalLockedInRefAssetNorm = '0';

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          entity.id,
          entity
        );

        await getOrCreateAccountOwnedAsset({
          ctx,
          accountId: account.id,
          assetId,
          firstSeenParaBlockHeight: processingBlockHeader.height,
        });
      }
    }
  }

  clearInterval(keepDbConnectionAliveInterval);
  return accountsPerBlock;
}
