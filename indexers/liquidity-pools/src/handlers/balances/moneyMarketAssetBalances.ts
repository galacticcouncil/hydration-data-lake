import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  Asset,
  AssetType,
  Block,
  EvmEventName,
  AssetResourceType,
  AccountProcessingStatus,
} from '../../model';
import { constants } from 'ethers';
import { AaveMoneyMarketManager } from '../../utils/evmTools/aave/aaveMoneyMarketManager';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { getAllMoneyMarketAssets, getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import pMap from 'p-map';
import { StorageResolver } from '../../parsers/storageResolver';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { getLatestAccountAssetBalancesAtBlock } from '../../utils/pgConnectionManagers/queries/getAllAccountPositiveAssetBalances.sql';
import { getOrCreateAccountProcessingStatus } from '../accounts/accountProcessingStatus';
import { AssetBalancesStorageDataPerBlockPerAccountMap } from './commonAssetBalances';
import { getAssetBalanceInRefAsset } from './utils';
import { AssetId } from '@polkadot/types/interfaces';
import { In } from 'typeorm';
import { AaveMoneyMarketsRegistry } from '../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function handleMmAssetAccountBalancesPerBlock({
  ctx,
  involvedAccountsAssetsPerBlockMap,
  prefetchedBalancesForAccountsInvolvedToMmEvents,
}: {
  ctx: SqdProcessorContext<Store>;
  involvedAccountsAssetsPerBlockMap: InvolvedAccountsAndAssetsInMmEventsPerBlockMap;
  prefetchedBalancesForAccountsInvolvedToMmEvents: AssetBalancesStorageDataPerBlockPerAccountMap;
}) {
  for (const blockSlotData of involvedAccountsAssetsPerBlockMap.values()) {
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

            const balance =
              prefetchedBalancesAtBlock
                ?.get(accountAssetsMap.account.id)
                ?.get(asset.id)?.free ??
              accountStorageDictionaryBalancesPerAssetMap.get(
                asset?.assetRegistryId ?? ''
              ) ??
              (
                await AaveMoneyMarketsRegistry.getInstance().getAccountTokenBalanceWithLogs(
                  {
                    contractAddress: asset.evmAddress!,
                    accountAddress: accountAssetsMap.account.boundEvmAddress!,
                    blockNumber: blockSlotData.block.height,
                  }
                )
              )?.value ??
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

          historicalDataEntity.transferableInRefAssetNorm =
            await getAssetBalanceInRefAsset({
              balance: assetBalance.balance,
              asset: assetBalance.asset,
              blockHeight: blockSlotData.block.height,
              ctx,
            });

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
   * Collect Money Market assets (Debt and aToken) per block for all processing accounts.
   * We check all previous balances snapshots, and if somewhere in a history
   * account had MM asset balance, this asset will be included into the list.
   * Also, if an account is newly created and has mmReserveBalancesInitialized: false,
   * we need to check all MM asset balances for such an account.
   */
  const accountMmAssetsPerBlock = await getAccountMmAssetsPerBlock({
    ctx,
    allProcessedAccountsPerBlock,
    allMmAssets: allExistingMmAssets,
  });

  await pMap(
    Array.from(accountMmAssetsPerBlock.entries()),
    async ([blockHeight, accountAssetIds]) => {
      const assetSpotPricesAtBlock: Map<string, string | null> = new Map();

      /**
       * Get and index spot prices by asset ID for further usage.
       */
      for (const asset of allExistingMmAssets) {
        if (!asset.underlyingAssetId) continue;

        let assetInId = asset.id;

        /**
         * As we don't track debtToken spot price because it's equal with
         * underlining asset, we use underlining asset spot price instead.
         */
        if (asset.resourceType === AssetResourceType.Debt) {
          const debtTokenUnderliningAsset = await getOrCreateAsset({
            id: asset.underlyingAssetId,
            ctx,
            ensure: true,
            blockHeader:
              ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
          });

          if (!debtTokenUnderliningAsset) continue;

          assetInId = debtTokenUnderliningAsset.id;
        }

        assetSpotPricesAtBlock.set(
          asset.id,
          getAssetsPairPrice({
            assetInId,
            blockHeight,
            ctx,
          })
        );
      }

      const accountsIndexedByAssetIds = new Map<string, Set<string>>();

      for (const [accountId, mmAssetsSet] of accountAssetIds.entries()) {
        for (const id of mmAssetsSet.values()) {
          if (!accountsIndexedByAssetIds.has(id))
            accountsIndexedByAssetIds.set(id, new Set());

          accountsIndexedByAssetIds.get(id)!.add(accountId);
        }
      }

      await pMap(
        Array.from(accountsIndexedByAssetIds.entries()),
        async ([mmAssetId, accountsSet]) => {
          const mmAsset = await getOrCreateAsset({
            ctx,
            id: mmAssetId,
            ensure: false,
          });

          if (!mmAsset) return;

          for (const accountId of accountsSet.values()) {
            const account = await getOrCreateAccount({ ctx, id: accountId });
            if (!account.boundEvmAddress) {
              continue;
            }
            if (
              ctx.batchState.state.accountAssetBalanceHistoricalData.has(
                `${accountId}-${mmAssetId}-${blockHeight}`
              )
            ) {
              // To prevent duplicated balance check in case this asset/account
              // pair already processed in previous steps
              continue;
            }

            const balance = (
              await AaveMoneyMarketsRegistry.getInstance().getAccountTokenBalanceWithLogs(
                {
                  contractAddress: mmAsset.evmAddress!,
                  accountAddress: account.boundEvmAddress!,
                  blockNumber: blockHeight,
                }
              )
            )?.value;

            if (
              !balance ||
              !assetSpotPricesAtBlock.has(mmAssetId) ||
              !assetSpotPricesAtBlock.get(mmAssetId)
            ) {
              continue;
            }

            const assetBalanceHistData =
              await getOrCreateAccountAssetBalanceHistoricalData({
                ctx,
                assetId: mmAssetId,
                account,
                blockHeader:
                  ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
                fetchFromDb: false,
              });

            assetBalanceHistData.transferable = balance;
            assetBalanceHistData.transferableInRefAssetNorm = mmAsset.decimals
              ? calcPriceNormalized({
                  amount: balance,
                  assetDecimals: mmAsset.decimals,
                  spotPrice: assetSpotPricesAtBlock.get(mmAsset.id)!,
                })
              : '0';

            ctx.batchState.state.accountAssetBalanceHistoricalData.set(
              assetBalanceHistData.id,
              assetBalanceHistData
            );
          }
        },
        {
          concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY,
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
 *
 * Also, if an account is newly created and has mmReserveBalancesInitialized: false,
 * we need to check all MM asset balances for such an account.
 */
async function getAccountMmAssetsPerBlock({
  allProcessedAccountsPerBlock,
  allMmAssets,
  ctx,
}: {
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
  allMmAssets?: Asset[];
}): Promise<Map<number, Map<string, Set<string>>>> {
  const allExistingMmAssets =
    allMmAssets ?? (await getAllMoneyMarketAssets(ctx));
  const allExistingMmAssetIdsList = allExistingMmAssets.map((a) => a.id);
  const allExistingMmAssetIdsSet = new Set(allExistingMmAssetIdsList);
  const accountsMmAssetsPerBlock: Map<
    number,
    Map<string, Set<string>>
  > = new Map();

  const lowestBlockNumberToProcess = Array.from(
    allProcessedAccountsPerBlock.keys()
  ).sort()[0];

  const allAccountsForMmReserveBalancesInit = new Set<Account>();
  const allAccountsForProcessingTmp = new Set<Account>();

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
      allAccountsForProcessingTmp.add(account);
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
        getLatestAccountAssetBalancesAtBlock,
        /**
         * [
         *  <accounts to find balances for>,
         *  <assets to find balances for>,
         *  <balances must be older than this block number>
         * ]
         */
        [
          Array.from(accountsSet.values()),
          allExistingMmAssetIdsList,
          blockNumber,
        ]
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
        !allExistingMmAssetIdsSet.has(item.assetId) ||
        !accountsSet.has(item.accountId) ||
        (item.paraBlockHeight <= blockNumber &&
          accountsSet.has(item.accountId) &&
          allExistingMmAssetIdsSet.has(item.assetId) &&
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

  const allAccountsForMmReserveBalancesInitList = Array.from(
    allAccountsForMmReserveBalancesInit.values()
  );

  const prefetchedAccountProcessingStatuses = await ctx.storeUtils.findWithLogs(
    AccountProcessingStatus,
    {
      where: {
        id: In(allAccountsForMmReserveBalancesInitList.map((acc) => acc.id)),
      },
    }
  );

  for (const status of prefetchedAccountProcessingStatuses) {
    ctx.batchState.state.accountProcessingStatuses.set(status.id, status);
  }

  await pMap(
    allAccountsForMmReserveBalancesInitList,
    async (account) => {
      const mmContractsManagerInst = AaveMoneyMarketsRegistry.getInstance();

      const accountReserves =
        mmContractsManagerInst.moneyMarketReservesDetailsMap.size > 0
          ? await mmContractsManagerInst.getUserReservesDataWithLogs({
              accountAddress: account.boundEvmAddress!,
              blockNumber: lowestBlockNumberToProcess,
            })
          : [];

      if (!accountReserves || accountReserves.length === 0) {
        // console.log(`No reserves found for account ${account.id}`);
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
      // await ctx.storeUtils.upsertWithBatches([accountProcStatus]);

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

        if (
          mmTokenUnderliningAsset.variableDebtTokenId &&
          reserve.scaledVariableDebt !== '0'
        )
          addAssetIdToAccountsMmAssetsPerBlock(
            lowestBlockNumberToProcess,
            account.id,
            mmTokenUnderliningAsset.variableDebtTokenId
          );

        if (
          mmTokenUnderliningAsset.aTokenId &&
          reserve.scaledATokenBalance !== '0'
        )
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
    await AaveMoneyMarketsRegistry.getInstance().getUserReservesDataWithLogs({
      accountAddress: accountH160Address,
      blockNumber,
    });

  if (!accountReserves || accountReserves.length === 0) {
    // console.log(`No reserves found for account (h160) ${accountH160Address}`);
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
