import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Account, Asset, AssetType, Block, ResourceType } from '../../model';
import { constants } from 'ethers';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { getAllDebtAssets, getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import pMap from 'p-map';
import { StorageResolver } from '../../parsers/storageResolver';

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
              asset: assetBalance.asset,
              account: accountAssetsMap.account,
              blockHeader: blockSlotData.blockHeader,
              fetchFromDb: false,
            });

          if (!historicalDataEntity) continue assetBalancesLoop;

          historicalDataEntity.transferable = assetBalance.balance;

          let assetInId = assetBalance.asset.id;

          if (assetBalance.asset.resourceType === ResourceType.Debt) {
            let assetFull: Asset | undefined = assetBalance.asset;
            if (!assetFull.underlyingAsset) {
              /**
               * We need this re-fetch to be sure that cached Asset contains data
               * about a related underlyingAsset
               */
              assetFull = await ctx.storeUtils.findOneWithLogs(
                Asset,
                {
                  where: { id: assetBalance.asset.id },
                  relations: {
                    underlyingAsset: true,
                  },
                },
                {
                  className: 'Asset',
                  originCallFn: 'handleMmAssetAccountBalancesPerBlock',
                }
              );
            }
            if (assetFull && assetFull.underlyingAsset)
              assetInId = assetFull.underlyingAsset.id;
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

  await pMap(
    Array.from(allProcessedAccountsPerBlock.entries()),
    async ([blockHeight, accountIds]) => {
      const assetSpotPricesAtBlock: Map<string, string | null> = new Map();

      for (const asset of allExistingDebtAssets) {
        const debtTokenUnderliningAsset = asset.underlyingAsset;
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
        Array.from(accountIds.values()),
        async (accountId) => {
          const account = await getOrCreateAccount({ ctx, id: accountId });
          if (!account.boundEvmAddress) {
            return;
          }

          for (const asset of allExistingDebtAssets) {
            if (
              ctx.batchState.state.accountAssetBalanceHistoricalData.has(
                `${accountId}-${asset.id}-${blockHeight}`
              )
            ) {
              // To prevent duplicated balance check in case this asset/account
              // pair already processed in previous steps
              continue;
            }

            const balance =
              await MoneyMarketContractsManager.getInstance().getAccountTokenBalanceWithLogs(
                {
                  contractAddress: asset.evmAddress!,
                  accountAddress: account.boundEvmAddress!,
                  blockNumber: blockHeight,
                }
              );

            if (
              !balance ||
              !assetSpotPricesAtBlock.has(asset.id) ||
              !assetSpotPricesAtBlock.get(asset.id)
            ) {
              continue;
            }

            const assetBalanceHistData =
              await getOrCreateAccountAssetBalanceHistoricalData({
                ctx,
                asset,
                account,
                blockHeader:
                  ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
                fetchFromDb: false,
              });

            assetBalanceHistData.transferable = balance;
            assetBalanceHistData.transferableInRefAssetNorm = asset.decimals
              ? calcPriceNormalized({
                  amount: balance,
                  assetDecimals: asset.decimals,
                  spotPrice: assetSpotPricesAtBlock.get(asset.id)!,
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
