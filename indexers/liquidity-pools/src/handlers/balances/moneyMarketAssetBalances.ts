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
import { getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { BigNumber } from '@galacticcouncil/sdk';

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

  const accountIdsWithCommonAssetBalanceChanges = new Set<string>();

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

  // batchState.transfers.forEach((transfer) => {
  //   const blockHeader = getBlockHeaderByBlockHeight(transfer.paraBlockHeight);
  //   if (blockHeader) {
  //     pushAccountsAssetsToBlockSlot({
  //       blockHeader,
  //       block: transfer.event.block,
  //       assets: [transfer.asset],
  //       account: transfer.from,
  //     });
  //     pushAccountsAssetsToBlockSlot({
  //       blockHeader,
  //       block: transfer.event.block,
  //       assets: [transfer.asset],
  //       account: transfer.to,
  //     });
  //   }
  // });

  console.log(
    'batchState.moneyMarketEvents - ',
    batchState.moneyMarketEvents.size
  );

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
      if (isCommonAssetInvolved)
        accountIdsWithCommonAssetBalanceChanges.add(accountId);
    }
  }

  for (const blockSlotData of [...involvedAccountsAssetsPerBlockMap.values()]) {
    accountAssetsMapLoop: for (const accountAssetsMap of [
      ...blockSlotData.accountsAssetsMap.values(),
    ]) {
      if (
        !accountAssetsMap.account.boundEvmAddress ||
        accountAssetsMap.account.boundEvmAddress === constants.AddressZero
      )
        continue accountAssetsMapLoop;

      const accountTotalBalanceHistData =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account: accountAssetsMap.account,
          blockHeader: blockSlotData.blockHeader,
          ctx,
        });

      const assetBalances = (
        await Promise.allSettled(
          [...accountAssetsMap.assets.values()]
            // .filter(
            //   (asset) =>
            //     !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
            // )
            .map(async (asset) => {
              return {
                asset,
                balance:
                  await MoneyMarketContractsManager.getInstance().getAccountTokenBalance(
                    {
                      contractAddress: asset.evmAddress!,
                      accountAddress: accountAssetsMap.account.boundEvmAddress!,
                      blockNumber: blockSlotData.block.height,
                    }
                  ),
              };
            })
        )
      )
        .filter((res) => res.status === 'fulfilled')
        .map((res) => res.value);

      assetBalancesLoop: for (const assetBalance of assetBalances) {
        if (assetBalance.balance === null || assetBalance.balance === undefined)
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

        if (
          assetBalance.asset.resourceType === ResourceType.Debt &&
          assetBalance.asset.underlyingAsset
        ) {
          let assetFull: Asset | undefined = assetBalance.asset;
          if (!assetFull.underlyingAsset) {
            /**
             * We need this re-fetch to be sure that cached Asset contains data
             * about a related underlyingAsset
             */
            assetFull = await ctx.store.findOne(Asset, {
              where: { id: assetBalance.asset.id },
              relations: {
                underlyingAsset: true,
              },
            });
            if (!assetFull || !assetFull.underlyingAsset)
              continue assetBalancesLoop;
          }
          assetInId = assetBalance.asset.underlyingAsset.id;
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

        if (assetBalance.asset.resourceType === ResourceType.Debt) {
          accountTotalBalanceHistData.totalTransferableNorm = BigNumber(
            accountTotalBalanceHistData.totalTransferableNorm
          )
            .minus(historicalDataEntity.transferableInRefAssetNorm || '0')
            .toFixed();

          accountTotalBalanceHistData.totalDebtNorm = BigNumber(
            accountTotalBalanceHistData.totalDebtNorm || '0'
          )
            .plus(historicalDataEntity.transferableInRefAssetNorm || '0')
            .toFixed();
        } else {
          accountTotalBalanceHistData.totalTransferableNorm = BigNumber(
            accountTotalBalanceHistData.totalTransferableNorm
          )
            .plus(historicalDataEntity.transferableInRefAssetNorm || '0')
            .toFixed();
        }

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          historicalDataEntity.id,
          historicalDataEntity
        );
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalanceHistData.id,
        accountTotalBalanceHistData
      );
    }
  }

  return accountIdsWithCommonAssetBalanceChanges;

  // await ctx.store.save([
  //   ...ctx.batchState.state.accountAssetBalanceHistoricalData.values(),
  // ]);
  //
  // await ctx.store.save([
  //   ...ctx.batchState.state.accountTotalBalanceHistoricalData.values(),
  // ]);
}
