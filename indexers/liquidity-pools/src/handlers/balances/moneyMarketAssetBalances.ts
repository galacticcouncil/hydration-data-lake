import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  Asset,
  AssetType,
  Block,
  EvmEventName,
  AssetResourceType,
} from '../../model';
import { constants } from 'ethers';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { getAllMoneyMarketAssets, getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import pMap from 'p-map';
import { StorageResolver } from '../../parsers/storageResolver';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { getAllAccountPositiveAssetBalances } from '../../utils/pgConnectionManagers/queries/getAllAccountPositiveAssetBalances.sql';
import { getOrCreateAccountProcessingStatus } from '../accounts/accountProcessingStatus';
import { AssetBalancesStorageDataPerBlockPerAccountMap } from './commonAssetBalances';

export async function handleMmAssetAccountBalancesPerBlock({
  ctx,
  involvedAccountsAssetsPerBlockMap,
  prefetchedBalancesForAccountsInvolvedToMmEvents,
}: {
  ctx: SqdProcessorContext<Store>;
  involvedAccountsAssetsPerBlockMap: InvolvedAccountsAndAssetsInMmEventsPerBlockMap;
  prefetchedBalancesForAccountsInvolvedToMmEvents: AssetBalancesStorageDataPerBlockPerAccountMap;
}) {
  for (const blockSlotData of [...involvedAccountsAssetsPerBlockMap.values()]) {
    await pMap(
      Array.from(blockSlotData.accountsAssetsMap.values()),
      async (accountAssetsMap) => {
        if (
          !accountAssetsMap.account.boundEvmAddress ||
          accountAssetsMap.account.boundEvmAddress === constants.AddressZero
        )
          return;

        const accountStorageDictionaryBalancesPerAsset =
          (StorageResolver.getInstance().storageDictionaryManager?.getTokenBalancesMany(
            {
              accountIds: [accountAssetsMap.account.id],
              block: blockSlotData.blockHeader,
            }
          ) || [])[0];

        const accountStorageDictionaryBalancesPerAssetMap: Map<string, bigint> =
          accountStorageDictionaryBalancesPerAsset
            ? new Map(
                accountStorageDictionaryBalancesPerAsset.assetBalances.map(
                  (assetData) => [assetData.assetId, assetData.data.free]
                )
              )
            : new Map();

        const assetBalances: {
          asset: Asset;
          balance: bigint | null | undefined;
        }[] = [];

        const prefetchedBalancesAtBlock =
          prefetchedBalancesForAccountsInvolvedToMmEvents.get(
            blockSlotData.blockHeader.height
          );

        await pMap(
          Array.from(accountAssetsMap.assets.values()).filter(
            (asset) => !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
          ),
          async (asset) => {
            if (!accountAssetsMap.account.boundEvmAddress) return;

            // const accountReserves =
            //   await MoneyMarketContractsManager.getInstance().getUserReservesDataWithLogs(
            //     {
            //       accountAddress: accountAssetsMap.account.boundEvmAddress!,
            //       blockNumber: blockSlotData.block.height,
            //     }
            //   );
            //
            // console.log(
            //   'accountReserves - ',
            //   accountAssetsMap.account.id,
            //   blockSlotData.block.height
            // );
            // console.dir(accountReserves, { depth: null });

            const balance =
              prefetchedBalancesAtBlock
                ?.get(accountAssetsMap.account.id)
                ?.get(asset.id)?.free ??
              accountStorageDictionaryBalancesPerAssetMap.get(
                asset?.assetRegistryId ?? ''
              ) ??
              (await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
                {
                  contractAddress: asset.evmAddress!,
                  accountAddress: accountAssetsMap.account.boundEvmAddress!,
                  blockNumber: blockSlotData.block.height,
                }
              )) ??
              0n;

            assetBalances.push({
              asset,
              balance,
            });
          },
          {
            concurrency:
              ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
          }
        );

        assetBalancesLoop: for (const assetBalance of assetBalances) {
          if (
            assetBalance.balance === null ||
            assetBalance.balance === undefined
          )
            continue assetBalancesLoop;

          const isExistingAssetBalanceHistoricalDataEntity =
            ctx.batchState.state.accountAssetBalanceHistoricalData.has(
              `${accountAssetsMap.account.id}-${assetBalance.asset.id}-${blockSlotData.blockHeader.height}`
            );

          if (isExistingAssetBalanceHistoricalDataEntity)
            continue assetBalancesLoop;

          const historicalDataEntity =
            await getOrCreateAccountAssetBalanceHistoricalData({
              ctx,
              assetId: assetBalance.asset.id,
              account: accountAssetsMap.account,
              blockHeader: blockSlotData.blockHeader,
              fetchFromDb: false,
            });

          if (!historicalDataEntity) continue assetBalancesLoop;

          historicalDataEntity.transferable = assetBalance.balance;

          let assetInId = assetBalance.asset.id;

          if (
            assetBalance.asset.resourceType === AssetResourceType.Debt &&
            !!assetBalance.asset.underlyingAssetId
          ) {
            const assetFull: Asset | undefined = assetBalance.asset;
            let underlyingAsset: Asset | undefined =
              ctx.batchState.state.assetsAll.get(
                assetBalance.asset.underlyingAssetId
              );
            if (!underlyingAsset) {
              /**
               * We need this re-fetch to be sure that cached Asset contains data
               * about a related underlyingAsset
               */
              // assetFull = await ctx.storeUtils.findOneWithLogs(
              //   Asset,
              //   {
              //     where: { id: assetBalance.asset.id },
              //     relations: {
              //       underlyingAsset: true,
              //     },
              //   },
              //   {
              //     className: 'Asset',
              //     originCallFn: 'handleMmAssetAccountBalancesPerBlock',
              //   }
              // );
              underlyingAsset =
                (await ctx.storeUtils.findOneWithLogs(
                  Asset,
                  {
                    where: {
                      assetRegistryId: assetFull.underlyingAssetId as string,
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
            blockHeight: blockSlotData.block.height,
          });

          historicalDataEntity.transferableInRefAssetNorm =
            assetSpotPrice && assetBalance.asset.decimals
              ? calcPriceNormalized({
                  amount: assetBalance.balance,
                  assetDecimals: assetBalance.asset.decimals,
                  spotPrice: assetSpotPrice,
                })
              : '0';

          ctx.batchState.state.accountAssetBalanceHistoricalData.set(
            historicalDataEntity.id,
            historicalDataEntity
          );
        }
      },
      { concurrency: 30 }
    );
  }
}

export type InvolvedAccountsAndAssetsInMmEventsPerBlockMap = Map<
  number,
  {
    block: Block;
    blockHeader: SqdBlock;
    accountsAssetsMap: Map<
      string,
      { account: Account; assets: Map<string, Asset> }
    >;
  }
>;

export async function collectAccountsAndAssetsInvolvedToMmEvents(
  ctx: SqdProcessorContext<Store>
): Promise<{
  involvedAccountsAndAssetsInMmEventsPerBlockMap: InvolvedAccountsAndAssetsInMmEventsPerBlockMap;
  accountIdsWithCommonAssetBalanceChanges: Map<number, Set<string>>;
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
}> {
  const involvedAccountsAndAssetsInMmEventsPerBlockMap: InvolvedAccountsAndAssetsInMmEventsPerBlockMap =
    new Map();

  const accountIdsWithCommonAssetBalanceChanges = new Map<
    number,
    Set<string>
  >();

  const allProcessedAccountsPerBlock = new Map<number, Set<string>>();

  const addAccountToAccountIdsWithCommonAssetBalanceChanges = (
    blockHeight: number,
    accountId: string
  ) => {
    if (!accountIdsWithCommonAssetBalanceChanges.has(blockHeight))
      accountIdsWithCommonAssetBalanceChanges.set(blockHeight, new Set());
    accountIdsWithCommonAssetBalanceChanges.get(blockHeight)?.add(accountId);
  };

  const addAccountToProcessedAccountsPerBlock = (
    blockHeight: number,
    accountId: string
  ) => {
    if (!allProcessedAccountsPerBlock.has(blockHeight))
      allProcessedAccountsPerBlock.set(blockHeight, new Set());
    allProcessedAccountsPerBlock.get(blockHeight)?.add(accountId);
  };

  const pushAccountsAssetsToBlockSlot = ({
    blockHeader,
    block,
    assets,
    account,
  }: {
    blockHeader: SqdBlock;
    block: Block;
    account: Account;
    assets: Asset[];
  }) => {
    if (!involvedAccountsAndAssetsInMmEventsPerBlockMap.has(block.height)) {
      involvedAccountsAndAssetsInMmEventsPerBlockMap.set(block.height, {
        block,
        blockHeader,
        accountsAssetsMap: new Map([
          [
            account.id,
            { account, assets: new Map(assets.map((a) => [a.id, a])) },
          ],
        ]),
      });
      return;
    }
    if (
      involvedAccountsAndAssetsInMmEventsPerBlockMap.has(block.height) &&
      !involvedAccountsAndAssetsInMmEventsPerBlockMap
        .get(block.height)!
        .accountsAssetsMap.has(account.id)
    ) {
      involvedAccountsAndAssetsInMmEventsPerBlockMap
        .get(block.height)!
        .accountsAssetsMap.set(account.id, {
          account,
          assets: new Map(assets.map((a) => [a.id, a])),
        });
      return;
    }
    involvedAccountsAndAssetsInMmEventsPerBlockMap
      .get(block.height)!
      .accountsAssetsMap.get(account.id)!.assets = new Map(
      [
        ...[
          ...involvedAccountsAndAssetsInMmEventsPerBlockMap
            .get(block.height)!
            .accountsAssetsMap.get(account.id)!
            .assets.values(),
        ],
        ...assets,
      ].map((a) => [a.id, a])
    );
  };

  const batchState = ctx.batchState.state;

  for (const mmEvent of [...batchState.moneyMarketEvents.values()]) {
    const assets: Asset[] = [];
    const blockHeader = ctx.batchState.getBlockHeaderByBlockHeight(
      mmEvent.paraBlockHeight
    );
    let isCommonAssetInvolved = false;

    if (!blockHeader) continue;

    for (const assetId of mmEvent.allInvolvedAssetIds) {
      const asset = await getOrCreateAsset({ ctx, id: assetId, ensure: false });
      if (!asset) continue;
      if (asset.assetType !== AssetType.Erc20) isCommonAssetInvolved = true;

      assets.push(asset);
    }

    for (const accountId of mmEvent.allInvolvedParticipants) {
      const account = await getOrCreateAccount({ ctx, id: accountId });
      if (!account) continue;

      // TODO add fetch aTokens
      // if (account.boundEvmAddress) {
      //   const implicitlyInvolvedAssets = await getAccountATokensOnBorrowEvents({
      //     mmEventName: mmEvent.eventName ?? EvmEventName.Transfer,
      //     accountH160Address: account.boundEvmAddress,
      //     blockNumber: mmEvent.event.block.height,
      //     ctx,
      //   });
      //
      //   for (const implicitlyInvolvedAsset of implicitlyInvolvedAssets) {
      //     assets.push(implicitlyInvolvedAsset);
      //   }
      // }

      pushAccountsAssetsToBlockSlot({
        blockHeader,
        block: mmEvent.event.block,
        assets,
        account,
      });

      addAccountToProcessedAccountsPerBlock(blockHeader.height, accountId);

      if (isCommonAssetInvolved) {
        addAccountToAccountIdsWithCommonAssetBalanceChanges(
          blockHeader.height,
          accountId
        );
      }
    }
  }

  return {
    involvedAccountsAndAssetsInMmEventsPerBlockMap,
    accountIdsWithCommonAssetBalanceChanges,
    allProcessedAccountsPerBlock,
  };
}

export async function handleMoneyMarketAssetBalancesForAccounts({
  allProcessedAccountsPerBlock = new Map(),
  ctx,
}: {
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}) {
  if (allProcessedAccountsPerBlock.size === 0) return;

  const allExistingMmAssets = await getAllMoneyMarketAssets(ctx);

  /**
   * Collect debt assets per block for all processing accounts.
   * We check all previous balances snapshots, and if somewhere in a history
   * account had debt asset balance, this asset will be included into the list.
   * Also, if an account is newly created and has mmReserveBalancesInitialized: false,
   * we need to check all debt token balances for such an account.
   */
  const accountMmAssetsPerBlock = await getAccountMmAssetsPerBlock({
    ctx,
    allProcessedAccountsPerBlock,
  });

  await pMap(
    Array.from(accountMmAssetsPerBlock.entries()),
    async ([blockHeight, accountAssetIds]) => {
      const assetSpotPricesAtBlock: Map<string, string | null> = new Map();

      for (const asset of allExistingMmAssets) {
        if (!asset.underlyingAssetId) continue;

        if (asset.resourceType === AssetResourceType.aToken) {
          assetSpotPricesAtBlock.set(
            asset.id,
            getAssetsPairPrice({
              assetInId: asset.id,
              blockHeight,
              ctx,
            })
          );
          continue;
        }

        const debtTokenUnderliningAsset = await getOrCreateAsset({
          id: asset.underlyingAssetId,
          ctx,
          ensure: true,
          blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        });

        if (!debtTokenUnderliningAsset) continue;

        /**
         * As we don't track debtToken spot price because it's equal with
         * underlining asset, we use underlining asset spot price instead.
         */
        assetSpotPricesAtBlock.set(
          asset.id,
          getAssetsPairPrice({
            assetInId: debtTokenUnderliningAsset.id,
            blockHeight,
            ctx,
          })
        );
      }

      await pMap(
        Array.from(accountAssetIds.entries()),
        async ([accountId, debtAssetsSet]) => {
          const account = await getOrCreateAccount({ ctx, id: accountId });
          if (!account.boundEvmAddress) {
            return;
          }

          for (const debtAssetId of debtAssetsSet) {
            if (
              ctx.batchState.state.accountAssetBalanceHistoricalData.has(
                `${accountId}-${debtAssetId}-${blockHeight}`
              )
            ) {
              // To prevent duplicated balance check in case this asset/account
              // pair already processed in previous steps
              continue;
            }

            const debtAsset = await getOrCreateAsset({
              ctx,
              id: debtAssetId,
              ensure: false,
            });

            if (!debtAsset) continue;

            const balance =
              await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
                {
                  contractAddress: debtAsset.evmAddress!,
                  accountAddress: account.boundEvmAddress!,
                  blockNumber: blockHeight,
                }
              );

            if (
              !balance ||
              !assetSpotPricesAtBlock.has(debtAssetId) ||
              !assetSpotPricesAtBlock.get(debtAssetId)
            ) {
              continue;
            }

            const assetBalanceHistData =
              await getOrCreateAccountAssetBalanceHistoricalData({
                ctx,
                assetId: debtAssetId,
                account,
                blockHeader:
                  ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
                fetchFromDb: false,
              });

            assetBalanceHistData.transferable = balance;
            assetBalanceHistData.transferableInRefAssetNorm = debtAsset.decimals
              ? calcPriceNormalized({
                  amount: balance,
                  assetDecimals: debtAsset.decimals,
                  spotPrice: assetSpotPricesAtBlock.get(debtAsset.id)!,
                })
              : '0';

            ctx.batchState.state.accountAssetBalanceHistoricalData.set(
              assetBalanceHistData.id,
              assetBalanceHistData
            );
          }
        },
        {
          concurrency: 5,
        }
      );
    },
    { concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
  );
}

interface RawAccountMmAssetBalances {
  account_id: string;
  assets: {
    asset_id: string;
    transferable_in_ref_asset_norm: string;
    total_locked_in_ref_asset_norm: string;
  }[];
}

/**
 * Collect Money Market assets (aToken || debtToken) per block for all processing
 * accounts. We check all previous balances snapshots, and if somewhere in a history
 * account had MM asset balance, this asset will be included into the list.
 */
async function getAccountMmAssetsPerBlock({
  allProcessedAccountsPerBlock,
  ctx,
}: {
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}): Promise<Map<number, Map<string, Set<string>>>> {
  const allExistingMmAssets = await getAllMoneyMarketAssets(ctx);
  const assetIdsList = allExistingMmAssets.map((a) => a.id);
  const assetIdsSet = new Set(assetIdsList);
  const accountsMmAssetsPerBlock: Map<
    number,
    Map<string, Set<string>>
  > = new Map();

  const lowestBlockNumberToProcess = Array.from(
    allProcessedAccountsPerBlock.keys()
  ).sort()[0];

  const allAccountsForMmReserveBalancesInit = new Set<Account>();

  const pgPool = CommonPgPool.getInstance();

  const addAssetIdToAccountsMmAssetsPerBlock = (
    blockNumber: number,
    accountId: string,
    assetId: string
  ) => {
    if (!accountsMmAssetsPerBlock.has(blockNumber))
      accountsMmAssetsPerBlock.set(blockNumber, new Map());

    if (!accountsMmAssetsPerBlock.get(blockNumber)!.has(accountId))
      accountsMmAssetsPerBlock.get(blockNumber)!.set(accountId, new Set());

    accountsMmAssetsPerBlock.get(blockNumber)!.get(accountId)!.add(assetId);
  };

  for (const [
    blockNumber,
    accountsSet,
  ] of allProcessedAccountsPerBlock.entries()) {
    for (const accountId of accountsSet) {
      const account = await getOrCreateAccount({ ctx, id: accountId });
      const accountProcStatus = await getOrCreateAccountProcessingStatus({
        id: accountId,
        ctx,
      });
      if (
        !accountProcStatus.mmReserveBalancesInitializedAtParaBlock &&
        account.boundEvmAddress &&
        account.boundEvmAddress !== constants.AddressZero
      )
        allAccountsForMmReserveBalancesInit.add(account);
    }

    /**
     * Check persistent data from DB
     */
    try {
      const result = await pgPool.query<RawAccountMmAssetBalances>(
        getAllAccountPositiveAssetBalances,
        [Array.from(accountsSet.values()), assetIdsList, blockNumber]
      );

      if (!accountsMmAssetsPerBlock.has(blockNumber))
        accountsMmAssetsPerBlock.set(blockNumber, new Map());

      resultsLoop: for (const resultItem of result.rows) {
        if (resultItem.assets.length === 0) continue resultsLoop;

        accountsMmAssetsPerBlock
          .get(blockNumber)!
          .set(
            resultItem.account_id,
            new Set(resultItem.assets.map((a) => a.asset_id))
          );
      }
    } catch (e) {
      console.log(e);
    }

    /**
     * Check cached data from local state
     */

    for (const item of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
      if (
        item.paraBlockHeight >= blockNumber ||
        !assetIdsSet.has(item.assetId) ||
        !accountsSet.has(item.accountId) ||
        (item.paraBlockHeight <= blockNumber &&
          accountsSet.has(item.accountId) &&
          assetIdsSet.has(item.assetId) &&
          !item.transferable)
      )
        continue;

      addAssetIdToAccountsMmAssetsPerBlock(
        blockNumber,
        item.accountId,
        item.assetId
      );
    }
  }

  await pMap(
    Array.from(allAccountsForMmReserveBalancesInit.values()),
    async (account) => {
      const accountReserves =
        await MoneyMarketContractsManager.getInstance().getUserReservesDataWithLogs(
          {
            accountAddress: account.boundEvmAddress!,
            blockNumber: lowestBlockNumberToProcess,
          }
        );

      if (!accountReserves || accountReserves.length === 0) {
        console.log(`No reserves found for account ${account.id}`);
        return;
      }

      // TODO this account mutation block should be moved to better place where
      //  "balances init" status will be ensured (aka after saving balances of
      //  debt tokens).
      /**
       * We need to mark accounts to avoid duplicated MM token balances check
       * in further processing looks.
       */
      const accountProcStatus = await getOrCreateAccountProcessingStatus({
        id: account.id,
        ctx,
      });
      accountProcStatus.mmReserveBalancesInitializedAtParaBlock =
        lowestBlockNumberToProcess;
      ctx.batchState.state.accountProcessingStatuses.set(
        accountProcStatus.id,
        accountProcStatus
      );
      await ctx.storeUtils.upsertWithBatches([accountProcStatus]);

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
            `No MM underlining asset found for reserve ${reserve.underlyingAsset} (account ${account.id})`
          );
          continue;
        }

        if (mmTokenUnderliningAsset.variableDebtTokenId)
          addAssetIdToAccountsMmAssetsPerBlock(
            lowestBlockNumberToProcess,
            account.id,
            mmTokenUnderliningAsset.variableDebtTokenId
          );

        if (mmTokenUnderliningAsset.aTokenId)
          addAssetIdToAccountsMmAssetsPerBlock(
            lowestBlockNumberToProcess,
            account.id,
            mmTokenUnderliningAsset.aTokenId
          );
      }
    },
    { concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
  );

  return accountsMmAssetsPerBlock;
}

async function getAccountATokensOnBorrowEvents({
  mmEventName,
  accountH160Address,
  blockNumber,
  ctx,
}: {
  mmEventName: EvmEventName;
  accountH160Address: string;
  blockNumber: number;
  ctx: SqdProcessorContext<Store>;
}) {
  if (mmEventName !== EvmEventName.Borrow && mmEventName !== EvmEventName.Repay)
    return [];

  const accountReserves =
    await MoneyMarketContractsManager.getInstance().getUserReservesDataWithLogs(
      {
        accountAddress: accountH160Address,
        blockNumber,
      }
    );

  if (!accountReserves || accountReserves.length === 0) {
    console.log(`No reserves found for account (h160) ${accountH160Address}`);
    return [];
  }

  const assetIds: Asset[] = [];

  for (const reserve of accountReserves) {
    if (
      reserve.scaledATokenBalance === '0' ||
      !reserve.underlyingAsset ||
      reserve.underlyingAsset === ''
    ) {
      continue;
    }

    const aTokenUnderliningAsset = await getOrCreateAsset({
      ctx,
      evmAddress: reserve.underlyingAsset.toLowerCase(),
      ensure: false,
    });
    if (!aTokenUnderliningAsset || !aTokenUnderliningAsset.aTokenId) {
      console.log(
        `No debt asset found for reserve ${reserve.underlyingAsset} (account (h160) ${accountH160Address})`
      );
      continue;
    }

    const aToken = await getOrCreateAsset({
      id: aTokenUnderliningAsset.aTokenId,
      ctx,
      ensure: false,
    });

    if (aToken) assetIds.push(aToken);
  }
  return assetIds;
}
