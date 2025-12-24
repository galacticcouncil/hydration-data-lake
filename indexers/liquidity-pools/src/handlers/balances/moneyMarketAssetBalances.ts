import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetType,
  Block,
  ResourceType,
} from '../../model';
import { constants } from 'ethers';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import {
  getOrCreateAccountAssetBalanceHistoricalData,
  getOrCreateAccountTotalBalanceHistoricalData,
} from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { getAllDebtAssets, getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';
import pMap from 'p-map';
import { StorageResolver } from '../../parsers/storageResolver';
import { CommonPgPool } from '../../utils/pgConnectionManagers/pgPool';
import { getAllAccountPositiveAssetBalances } from '../../utils/pgConnectionManagers/queries/getAllAccountPositiveAssetBalances.sql';

export async function handleMmAssetAccountBalancesPerBlock(
  ctx: SqdProcessorContext<Store>
) {
  const involvedAccountsAssetsPerBlockMap: Map<
    number,
    {
      block: Block;
      blockHeader: SqdBlock;
      accountsAssetsMap: Map<
        string,
        { account: Account; assets: Map<string, Asset> }
      >;
    }
  > = new Map();

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

  const getBlockHeaderByBlockHeight = (
    blockHeight: number
  ): SqdBlock | undefined => {
    return ctx.blocks.find((block) => block.header.height === blockHeight)
      ?.header;
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
    if (!involvedAccountsAssetsPerBlockMap.has(block.height)) {
      involvedAccountsAssetsPerBlockMap.set(block.height, {
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
      involvedAccountsAssetsPerBlockMap.has(block.height) &&
      !involvedAccountsAssetsPerBlockMap
        .get(block.height)!
        .accountsAssetsMap.has(account.id)
    ) {
      involvedAccountsAssetsPerBlockMap
        .get(block.height)!
        .accountsAssetsMap.set(account.id, {
          account,
          assets: new Map(assets.map((a) => [a.id, a])),
        });
      return;
    }
    involvedAccountsAssetsPerBlockMap
      .get(block.height)!
      .accountsAssetsMap.get(account.id)!.assets = new Map(
      [
        ...[
          ...involvedAccountsAssetsPerBlockMap
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
    const blockHeader = getBlockHeaderByBlockHeight(mmEvent.paraBlockHeight);
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

        await pMap(
          Array.from(accountAssetsMap.assets.values()).filter(
            (asset) => !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
          ),
          async (asset) => {
            if (!accountAssetsMap.account.boundEvmAddress) return;

            const balance =
              accountStorageDictionaryBalancesPerAssetMap.get(
                asset?.assetRegistryId ?? ''
              ) ??
              (await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
                {
                  contractAddress: asset.evmAddress!,
                  accountAddress: accountAssetsMap.account.boundEvmAddress!,
                  blockNumber: blockSlotData.block.height,
                }
              ));

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
            assetBalance.asset.resourceType === ResourceType.Debt &&
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

  return {
    accountIdsWithCommonAssetBalanceChanges,
    allProcessedAccountsPerBlock,
  };
}

export async function handleDebtAssetBalancesForAccounts({
  allProcessedAccountsPerBlock = new Map(),
  ctx,
}: {
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}) {
  if (allProcessedAccountsPerBlock.size === 0) return;

  const allExistingDebtAssets = await getAllDebtAssets(ctx);

  const accountDebtAssetsPerBlock = await getAccountDebtAssetsPerBlock({
    ctx,
    allProcessedAccountsPerBlock,
  });

  await pMap(
    Array.from(accountDebtAssetsPerBlock.entries()),
    async ([blockHeight, accountAssetIds]) => {
      const assetSpotPricesAtBlock: Map<string, string | null> = new Map();

      for (const asset of allExistingDebtAssets) {
        if (!asset.underlyingAssetId) continue;

        const debtTokenUnderliningAsset = await getOrCreateAsset({
          id: asset.underlyingAssetId,
          ctx,
          ensure: true,
          blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        });

        if (!debtTokenUnderliningAsset) continue;

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

interface RawAccountDebtAssetBalances {
  account_id: string;
  assets: {
    asset_id: string;
    transferable_in_ref_asset_norm: string;
    total_locked_in_ref_asset_norm: string;
  }[];
}

async function getAccountDebtAssetsPerBlock({
  allProcessedAccountsPerBlock,
  ctx,
}: {
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}): Promise<Map<number, Map<string, Set<string>>>> {
  const allExistingDebtAssets = await getAllDebtAssets(ctx);
  const assetIdsList = allExistingDebtAssets.map((a) => a.id);
  const assetIdsSet = new Set(assetIdsList);
  const accountsDebtAssetsPerBlock: Map<
    number,
    Map<string, Set<string>>
  > = new Map();

  const lowestBlockNumberToProcess = Array.from(
    allProcessedAccountsPerBlock.keys()
  ).sort()[0];

  const allAccountsForMmReserveBalancesInit = new Set<Account>();

  const pgPool = CommonPgPool.getInstance();

  const addAssetIdToAccountsDebtAssetsPerBlock = (
    blockNumber: number,
    accountId: string,
    assetId: string
  ) => {
    if (!accountsDebtAssetsPerBlock.has(blockNumber))
      accountsDebtAssetsPerBlock.set(blockNumber, new Map());

    if (!accountsDebtAssetsPerBlock.get(blockNumber)!.has(accountId))
      accountsDebtAssetsPerBlock.get(blockNumber)!.set(accountId, new Set());

    accountsDebtAssetsPerBlock.get(blockNumber)!.get(accountId)!.add(assetId);
  };

  for (const [
    blockNumber,
    accountsSet,
  ] of allProcessedAccountsPerBlock.entries()) {
    for (const accountId of accountsSet) {
      const account = await getOrCreateAccount({ ctx, id: accountId });
      if (
        !account.mmReserveBalancesInitialized &&
        account.boundEvmAddress &&
        account.boundEvmAddress !== constants.AddressZero
      )
        allAccountsForMmReserveBalancesInit.add(account);
    }

    /**
     * Check persistent data from DB
     */
    try {
      const result = await pgPool.query<RawAccountDebtAssetBalances>(
        getAllAccountPositiveAssetBalances,
        [Array.from(accountsSet.values()), assetIdsList, blockNumber]
      );

      if (!accountsDebtAssetsPerBlock.has(blockNumber))
        accountsDebtAssetsPerBlock.set(blockNumber, new Map());

      resultsLoop: for (const resultItem of result.rows) {
        if (resultItem.assets.length === 0) continue resultsLoop;

        accountsDebtAssetsPerBlock
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

      addAssetIdToAccountsDebtAssetsPerBlock(
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
       * We need to mark accounts to avoid duplicated debt token balances check
       * in further processing looks.
       */
      account.mmReserveBalancesInitialized = true;
      ctx.batchState.state.accounts.set(account.id, account);
      await ctx.storeUtils.upsertWithBatches([account]);

      for (const reserve of accountReserves) {
        if (
          reserve.scaledVariableDebt === '0' ||
          !reserve.underlyingAsset ||
          reserve.underlyingAsset === ''
        ) {
          continue;
        }

        const debtUnderliningAsset = await getOrCreateAsset({
          ctx,
          evmAddress: reserve.underlyingAsset.toLowerCase(),
          ensure: false,
        });
        if (
          !debtUnderliningAsset ||
          !debtUnderliningAsset.variableDebtTokenId
        ) {
          console.log(
            `No debt asset found for reserve ${reserve.underlyingAsset} (account ${account.id})`
          );
          continue;
        }

        addAssetIdToAccountsDebtAssetsPerBlock(
          lowestBlockNumberToProcess,
          account.id,
          debtUnderliningAsset.variableDebtTokenId
        );
      }
    },
    { concurrency: ctx.appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
  );

  return accountsDebtAssetsPerBlock;
}
