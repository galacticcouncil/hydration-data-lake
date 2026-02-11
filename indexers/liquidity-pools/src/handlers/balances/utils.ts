import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetResourceType,
  AssetType,
} from '../../model';
import { getOrCreateAsset } from '../assets/asset';
import { calcPriceNormalized } from '../../utils/helpers';
import {
  addAssetBalanceToAccountTotalBalance,
  AssetBalancesIndexedByAccountAndAssetMap,
  AssetBalancesIndexedByBlockAndAccountMap,
  RawAccountAssetBalanceHistoricalData,
  UnchangedAccountAssetBalanceHistoricalData,
  UnchangedAccountAssetBalancesPerBlockMap,
} from './accountTotalBalance';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  BalancesAccountInfoWithAccountId,
  TokenAccountBalancesWithAccountId,
} from '../../parsers/types/storage';
import { AssetBalancesStorageDataPerBlockPerAccountMap } from './commonAssetBalances';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { InvolvedAccountsAndAssetsInMmEventsPerBlockMap } from './moneyMarketAssetBalances';
import parsers from '../../parsers';
import pMap from 'p-map';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
type AssetId = string;

export async function getUnchangedAccountAssetBalanceFromCachedEntity({
  previousAssetBalanceFromCache,
  blockHeight,
  ctx,
}: {
  previousAssetBalanceFromCache: AccountAssetBalanceHistoricalData;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<UnchangedAccountAssetBalanceHistoricalData | null> {
  const latestAssetPrice =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${previousAssetBalanceFromCache.assetId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
    );

  const asset = await getOrCreateAsset({
    id: previousAssetBalanceFromCache.assetId,
    ctx,
    ensure: false,
  });
  if (!asset) return null;

  /**
   * We need to actualize normalized balances based on price at the specific block.
   * It's necessary in case of a big gap between the current processing block
   * and the latest asset balance snapshot. The price of asset can be changed
   * dramatically during this period, so account's total balance will be wrong
   * if we don't actualize balance with the latest price.
   */
  const transferableInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalanceFromCache.transferableInRefAssetNorm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalanceFromCache.transferable),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  const totalLockedInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalanceFromCache.totalLockedInRefAssetNorm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalanceFromCache.totalLocked),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  return {
    id: previousAssetBalanceFromCache.id,
    accountId: previousAssetBalanceFromCache.accountId,
    assetId: previousAssetBalanceFromCache.assetId,
    transferableInRefAssetNorm: transferableInRefAssetNorm ?? '0',
    totalLockedInRefAssetNorm: totalLockedInRefAssetNorm ?? '0',
    paraBlockHeight: previousAssetBalanceFromCache.paraBlockHeight,
    processingParaBlockHeight: blockHeight,
  };
}

export async function getUnchangedAccountAssetBalanceFromPersistentEntity({
  previousAssetBalancePersistent,
  blockHeight,
  ctx,
}: {
  previousAssetBalancePersistent: RawAccountAssetBalanceHistoricalData;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<UnchangedAccountAssetBalanceHistoricalData | null> {
  const asset = await getOrCreateAsset({
    id: previousAssetBalancePersistent.asset_id,
    ctx,
    ensure: false,
  });
  if (!asset) return null;

  let assetInId = previousAssetBalancePersistent.asset_id;

  if (asset.resourceType === AssetResourceType.Debt) {
    assetInId =
      asset.underlyingAssetId ?? previousAssetBalancePersistent.asset_id;
  }

  const latestAssetPrice =
    ctx.batchState.state.assetsSpotPriceHistoricalDataBatch.get(
      `${assetInId}-${ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID}-${blockHeight}`
    );

  /**
   * We need to actualize normalized balances based on price at the specific block.
   * It's necessary in case of a big gap between the current processing block
   * and the latest asset balance snapshot. The price of asset can be changed
   * dramatically during this period, so account's total balance will be wrong
   * if we don't actualize balance with the latest price.
   */
  const transferableInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalancePersistent.transferable_in_ref_asset_norm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalancePersistent.transferable),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  const totalLockedInRefAssetNorm =
    !latestAssetPrice || !asset.decimals
      ? previousAssetBalancePersistent.total_locked_in_ref_asset_norm
      : calcPriceNormalized({
          amount: BigInt(previousAssetBalancePersistent.total_locked),
          assetDecimals: asset!.decimals!,
          spotPrice: latestAssetPrice.priceNormalised,
        });

  return {
    id: previousAssetBalancePersistent.id,
    accountId: previousAssetBalancePersistent.account_id,
    assetId: previousAssetBalancePersistent.asset_id,
    transferableInRefAssetNorm: transferableInRefAssetNorm ?? '0',
    totalLockedInRefAssetNorm: totalLockedInRefAssetNorm ?? '0',
    paraBlockHeight: previousAssetBalancePersistent.para_block_height,
    processingParaBlockHeight: blockHeight,
  };
}

/**
 * Double-check account asset balances with actual storage data, avoiding data
 * from storage dictionary or other caching layers.
 */
export async function ensureAccountAssetBalancesForOutdatedBalancesWithOnChainData({
  unchangedAccountAssetBalancesPerBlock,
  ctx,
}: {
  unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}) {
  const ensuredUnchangedAccountAssetBalancesByOnChainData: UnchangedAccountAssetBalancesPerBlockMap =
    new Map();

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  const assetBalancesToIncludeToTotalBalance: AccountAssetBalanceHistoricalData[] =
    [];

  await pMap(
    Array.from(unchangedAccountAssetBalancesPerBlock.entries()),
    async ([blockNumber, accountAssetBalancesAtBlock]) => {
      const blockHeader =
        ctx.batchState.getBlockHeaderByBlockHeight(blockNumber);
      if (!ensuredUnchangedAccountAssetBalancesByOnChainData.has(blockNumber))
        ensuredUnchangedAccountAssetBalancesByOnChainData.set(
          blockNumber,
          new Map()
        );

      await pMap(
        Array.from(accountAssetBalancesAtBlock.entries()),
        async ([accountId, accountBalances]) => {
          const accountEntity = await getOrCreateAccount({
            ctx,
            id: accountId,
          });
          if (
            !ensuredUnchangedAccountAssetBalancesByOnChainData
              .get(blockNumber)!
              .has(accountId)
          )
            ensuredUnchangedAccountAssetBalancesByOnChainData
              .get(blockNumber)!
              .set(accountId, new Map());

          const assetBalancesHistDataWithNoResult =
            ensuredUnchangedAccountAssetBalancesByOnChainData
              .get(blockNumber)!
              .get(accountId)!;

          await pMap(
            Array.from(accountBalances.entries()),
            async ([assetId, assetPrevBalanceData]) => {
              const assetEntity = await getOrCreateAsset({
                id: assetId,
                ctx,
                ensure: false,
              });
              if (!assetEntity) {
                assetBalancesHistDataWithNoResult.set(
                  assetId,
                  assetPrevBalanceData
                );
                return;
              }

              let totalTransferableBalance = 0n;
              let totalLockedBalance = 0n;

              if (assetEntity.assetType === AssetType.Erc20) {
                totalTransferableBalance =
                  (await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
                    {
                      contractAddress: assetEntity.evmAddress!,
                      accountAddress: accountEntity.boundEvmAddress!,
                      blockNumber,
                    }
                  )) ?? 0n;
                if (!totalTransferableBalance) {
                  assetBalancesHistDataWithNoResult.set(
                    assetId,
                    assetPrevBalanceData
                  );
                  return;
                }
              } else {
                if (assetId === '0') {
                  const balances =
                    await parsers.storage.system.getNativeTokenBalanceMany({
                      block: blockHeader,
                      accountIds: [accountId],
                      skipCache: true,
                    });

                  if (balances.length === 0 || !balances[0]?.data) {
                    assetBalancesHistDataWithNoResult.set(
                      assetId,
                      assetPrevBalanceData
                    );
                    return;
                  }

                  totalTransferableBalance = balances[0].data.free;
                  totalLockedBalance = balances[0].data.reserved;
                } else {
                  const balances =
                    await parsers.storage.tokens.getTokenBalancesMany({
                      block:
                        ctx.batchState.getBlockHeaderByBlockHeight(blockNumber),
                      accountIds: [accountId],
                      skipCache: true,
                    });

                  if (balances.length === 0 || !balances[0]?.assetBalances) {
                    assetBalancesHistDataWithNoResult.set(
                      assetId,
                      assetPrevBalanceData
                    );
                    return;
                  }

                  const assetBalance = balances[0].assetBalances.find(
                    (b) => b.assetId === assetEntity.assetRegistryId
                  );
                  if (!assetBalance) {
                    assetBalancesHistDataWithNoResult.set(
                      assetId,
                      assetPrevBalanceData
                    );
                    return;
                  }
                  totalTransferableBalance = assetBalance.data.free;
                  totalLockedBalance = assetBalance.data.reserved;
                }
              }

              const assetBalanceHistDataEntity =
                await getOrCreateAccountAssetBalanceHistoricalData({
                  ctx,
                  assetId: assetId,
                  account: accountEntity,
                  blockHeader,
                  fetchFromDb: false,
                });

              assetBalanceHistDataEntity.transferable =
                totalTransferableBalance;
              assetBalanceHistDataEntity.totalLocked = totalLockedBalance;

              assetBalanceHistDataEntity.transferableInRefAssetNorm =
                await getAssetBalanceInRefAsset({
                  balance: totalTransferableBalance ?? 0n,
                  asset: assetEntity,
                  blockHeight: blockNumber,
                  ctx,
                });

              assetBalanceHistDataEntity.totalLockedInRefAssetNorm =
                await getAssetBalanceInRefAsset({
                  balance: totalLockedBalance ?? 0n,
                  asset: assetEntity,
                  blockHeight: blockNumber,
                  ctx,
                });

              ctx.batchState.state.accountAssetBalanceHistoricalData.set(
                assetBalanceHistDataEntity.id,
                assetBalanceHistDataEntity
              );

              assetBalancesToIncludeToTotalBalance.push(
                assetBalanceHistDataEntity
              );
            },
            {
              concurrency:
                ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
            }
          );
        },
        {
          concurrency:
            ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
        }
      );
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  for (const assetBalance of assetBalancesToIncludeToTotalBalance) {
    await addAssetBalanceToAccountTotalBalance({
      refAsset,
      ctx,
      assetBalanceHistData: assetBalance,
    });
  }

  return ensuredUnchangedAccountAssetBalancesByOnChainData;
}

export async function createAccountAssetBalancesForOutdatedBalances({
  unchangedAccountAssetBalancesPerBlock,
  ctx,
}: {
  unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const [
    blockNumber,
    blockData,
  ] of unchangedAccountAssetBalancesPerBlock.entries()) {
    for (const [accountId, accountBalances] of blockData.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      for (const assetBalance of accountBalances.values()) {
        const assetBalanceHistData =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            assetId: assetBalance.assetId,
            account,
            blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
              assetBalance.processingParaBlockHeight
            ),
            fetchFromDb: false,
          });

        assetBalanceHistData.transferable = 0n;
        assetBalanceHistData.totalLocked = 0n;
        assetBalanceHistData.transferableInRefAssetNorm = '0';
        assetBalanceHistData.totalLockedInRefAssetNorm = '0';

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          assetBalanceHistData.id,
          assetBalanceHistData
        );
      }
    }
  }
}

export function updateAccountTotalBalanceHistoricalDataWithUnchangedBalances({
  unchangedAccountAssetBalancesPerBlock,
  ctx,
}: {
  unchangedAccountAssetBalancesPerBlock: UnchangedAccountAssetBalancesPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const accountTotalBalance of ctx.batchState.state.accountTotalBalanceHistoricalData.values()) {
    console.log(
      `accountTotalBalance OLD - ${accountTotalBalance.accountId} - ${accountTotalBalance.paraBlockHeight} - ${accountTotalBalance.totalTransferableNorm}`
    );
    const accountTotalTransferableBalanceSummaryAtBlock = Array.from(
      (
        unchangedAccountAssetBalancesPerBlock
          .get(accountTotalBalance.paraBlockHeight)
          ?.get(accountTotalBalance.accountId) ||
        new Map<AssetId, UnchangedAccountAssetBalanceHistoricalData>()
      ).values()
    ).reduce((acc, value) => {
      return acc.plus(value.transferableInRefAssetNorm);
    }, BigNumber(accountTotalBalance.totalTransferableNorm));

    accountTotalBalance.totalTransferableNorm =
      accountTotalTransferableBalanceSummaryAtBlock.toFixed(
        18,
        BigNumber.ROUND_HALF_UP
      );

    ctx.batchState.state.accountTotalBalanceHistoricalData.set(
      accountTotalBalance.id,
      accountTotalBalance
    );
  }
}

export function indexAccountAssetBalancesAccumulators({
  assetBalancesIndexedByBlockAndAccountMap,
  assetBalancesIndexedByAccountAndAssetMap,
  ctx,
}: {
  assetBalancesIndexedByBlockAndAccountMap: AssetBalancesIndexedByBlockAndAccountMap;
  assetBalancesIndexedByAccountAndAssetMap: AssetBalancesIndexedByAccountAndAssetMap;
  ctx: SqdProcessorContext<Store>;
}) {
  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (
      !assetBalancesIndexedByBlockAndAccountMap.has(
        assetBalance.paraBlockHeight
      )
    )
      assetBalancesIndexedByBlockAndAccountMap.set(
        assetBalance.paraBlockHeight,
        new Map()
      );

    if (
      !assetBalancesIndexedByBlockAndAccountMap
        .get(assetBalance.paraBlockHeight)!
        .has(assetBalance.accountId)
    )
      assetBalancesIndexedByBlockAndAccountMap
        .get(assetBalance.paraBlockHeight)!
        .set(assetBalance.accountId, []);

    assetBalancesIndexedByBlockAndAccountMap
      .get(assetBalance.paraBlockHeight)!
      .get(assetBalance.accountId)!
      .push(assetBalance);

    if (!assetBalancesIndexedByAccountAndAssetMap.has(assetBalance.accountId))
      assetBalancesIndexedByAccountAndAssetMap.set(
        assetBalance.accountId,
        new Map()
      );

    if (
      !assetBalancesIndexedByAccountAndAssetMap
        .get(assetBalance.accountId)!
        .has(assetBalance.assetId)
    )
      assetBalancesIndexedByAccountAndAssetMap
        .get(assetBalance.accountId)!
        .set(assetBalance.assetId, []);

    assetBalancesIndexedByAccountAndAssetMap
      .get(assetBalance.accountId)!
      .get(assetBalance.assetId)!
      .push(assetBalance);
  }

  for (const [
    accountId,
    accountBalancesByAsset,
  ] of assetBalancesIndexedByAccountAndAssetMap.entries()) {
    for (const [assetId, accountBalances] of accountBalancesByAsset.entries()) {
      assetBalancesIndexedByAccountAndAssetMap.get(accountId)!.set(
        assetId,
        accountBalances.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
      );
    }
  }
}

export function addAssetBalancesToAccumulator({
  commonTokenBalances,
  nativeTokenBalances,
  accumulator,
  blockNumber,
}: {
  accumulator: AssetBalancesStorageDataPerBlockPerAccountMap;
  nativeTokenBalances: BalancesAccountInfoWithAccountId[];
  commonTokenBalances: TokenAccountBalancesWithAccountId[];
  blockNumber: number;
}) {
  if (!accumulator.has(blockNumber)) accumulator.set(blockNumber, new Map());

  const currentBlockData = accumulator.get(blockNumber)!;

  for (const nativeTokenBalance of nativeTokenBalances) {
    if (!currentBlockData.has(nativeTokenBalance.accountId)) {
      currentBlockData.set(nativeTokenBalance.accountId, new Map());
    }

    currentBlockData
      .get(nativeTokenBalance.accountId)!
      .set('0', nativeTokenBalance.data);
  }

  for (const commonTokenBalance of commonTokenBalances) {
    if (!currentBlockData.has(commonTokenBalance.accountId)) {
      currentBlockData.set(commonTokenBalance.accountId, new Map());
    }

    const accountData = currentBlockData.get(commonTokenBalance.accountId)!;
    for (const balance of commonTokenBalance.assetBalances) {
      accountData.set(balance.assetId, balance.data);
    }
  }
}

export async function fetchBalancesForAccountsPerBlock({
  accountsPerBlock,
  cache = new Map(),
  skipStorageReadCache = false,
  ctx,
}: {
  accountsPerBlock: Map<number, Set<string>>;
  cache?: AssetBalancesStorageDataPerBlockPerAccountMap;
  skipStorageReadCache?: boolean;
  ctx: SqdProcessorContext<Store>;
}): Promise<AssetBalancesStorageDataPerBlockPerAccountMap> {
  const assetBalancesStorageDataPerBlockPerAccountMap: AssetBalancesStorageDataPerBlockPerAccountMap =
    new Map();

  await pMap(
    Array.from(accountsPerBlock.entries()),
    async ([blockNumber, accountsSetPerBlock]) => {
      if (accountsSetPerBlock.size === 0) return;

      const accountsInBlockList: string[] = [];

      for (const accountId of Array.from(accountsSetPerBlock.keys())) {
        const cachedAccountBalance = cache?.get(blockNumber)?.get(accountId);
        if (!cachedAccountBalance) {
          accountsInBlockList.push(accountId);
          continue;
        }
        if (!assetBalancesStorageDataPerBlockPerAccountMap.has(blockNumber))
          assetBalancesStorageDataPerBlockPerAccountMap.set(
            blockNumber,
            new Map()
          );

        assetBalancesStorageDataPerBlockPerAccountMap
          .get(blockNumber)!
          .set(accountId, cachedAccountBalance);
      }

      const [nativeTokenBalances, commonTokenBalances] = await Promise.all([
        parsers.storage.system.getNativeTokenBalanceMany({
          block: ctx.batchState.getBlockHeaderByBlockHeight(blockNumber),
          accountIds: accountsInBlockList,
          skipCache: skipStorageReadCache,
        }),
        parsers.storage.tokens.getTokenBalancesMany({
          block: ctx.batchState.getBlockHeaderByBlockHeight(blockNumber),
          accountIds: accountsInBlockList,
          skipCache: skipStorageReadCache,
        }),
      ]);

      addAssetBalancesToAccumulator({
        accumulator: assetBalancesStorageDataPerBlockPerAccountMap,
        nativeTokenBalances,
        commonTokenBalances,
        blockNumber,
      });
    },
    {
      concurrency:
        ctx.appConfig.concurrency.ASYNC_OPERATIONS_CONCURRENCY_COMMON,
    }
  );

  return assetBalancesStorageDataPerBlockPerAccountMap;
}

export async function prefetchBalancesForAccountsInvolvedToMmEvents({
  involvedAccountsAndAssetsInMmEventsPerBlockMap,
  ctx,
}: {
  involvedAccountsAndAssetsInMmEventsPerBlockMap: InvolvedAccountsAndAssetsInMmEventsPerBlockMap;
  ctx: SqdProcessorContext<Store>;
}): Promise<AssetBalancesStorageDataPerBlockPerAccountMap> {
  const accountsPerBlock: Map<number, Set<string>> = new Map();

  for (const [
    blockNumber,
    { accountsAssetsMap },
  ] of involvedAccountsAndAssetsInMmEventsPerBlockMap.entries()) {
    accountsPerBlock.set(blockNumber, new Set(accountsAssetsMap.keys()));
  }

  const assetBalancesStorageDataPerBlockPerAccountMap: AssetBalancesStorageDataPerBlockPerAccountMap =
    await fetchBalancesForAccountsPerBlock({
      accountsPerBlock,
      ctx,
    });

  return assetBalancesStorageDataPerBlockPerAccountMap;
}

export async function getAssetBalanceInRefAsset({
  balance,
  blockHeight,
  ctx,
  asset,
}: {
  balance: bigint;
  asset: Asset;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}) {
  let assetInId = asset.id;

  if (
    asset.resourceType === AssetResourceType.Debt &&
    !!asset.underlyingAssetId
  ) {
    let underlyingAsset: Asset | undefined = ctx.batchState.state.assetsAll.get(
      asset.underlyingAssetId
    );
    if (!underlyingAsset) {
      underlyingAsset =
        (await ctx.storeUtils.findOneWithLogs(
          Asset,
          {
            where: {
              assetRegistryId: asset.underlyingAssetId,
            },
            relations: {},
          },
          {
            className: 'Asset',
            originCallFn: 'handleMmAssetAccountBalancesPerBlock',
          }
        )) ?? undefined;
    }
    if (underlyingAsset) assetInId = underlyingAsset.id;
  }

  const assetSpotPrice = getAssetsPairPrice({
    ctx,
    assetInId,
    blockHeight,
  });

  const balanceInRefAssetNorm =
    assetSpotPrice && asset.decimals
      ? calcPriceNormalized({
          amount: balance,
          assetDecimals: asset.decimals,
          spotPrice: assetSpotPrice,
        })
      : '0';

  return balanceInRefAssetNorm;
}
