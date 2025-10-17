import { BlockWithData, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Asset, AssetType } from '../../model';
import { constants } from 'ethers';
import { MoneyMarketContractsManager } from '../../utils/evm/moneyMarketContractsManager';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAsset } from '../asset/asset';
import { getOrCreateAccount } from '../accounts';
import pMap from 'p-map';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export async function handleMmAssetAccountBalancesPerBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  const involvedAccountsAssetsMap: Map<string, Map<string, Asset>> = new Map();
  const accountIdsWithCommonAssetBalanceChanges = new Set<string>();

  const pushAccountsAssetsToBlockSlot = ({
    assets,
    accountId,
  }: {
    accountId: string;
    assets: Asset[];
  }) => {
    if (!involvedAccountsAssetsMap.has(accountId)) {
      involvedAccountsAssetsMap.set(
        accountId,
        new Map(assets.map((a) => [a.id, a]))
      );
      return;
    }

    for (const asset of assets) {
      involvedAccountsAssetsMap.get(accountId)!.set(asset.id, asset);
    }
  };

  const batchState = ctx.batchState.state;

  for (const mmEvent of [...batchState.moneyMarketEvents.values()]) {
    const assets: Asset[] = [];
    let isCommonAssetInvolved = false;

    for (const assetId of mmEvent.allInvolvedAssetIds) {
      const asset = await getOrCreateAsset({ ctx, id: assetId, ensure: false });
      if (!asset) continue;
      if (asset.assetType !== AssetType.Erc20) isCommonAssetInvolved = true;

      assets.push(asset);
    }

    for (const accountId of mmEvent.allInvolvedParticipants) {
      pushAccountsAssetsToBlockSlot({
        assets,
        accountId,
      });
      if (isCommonAssetInvolved)
        accountIdsWithCommonAssetBalanceChanges.add(accountId);
    }
  }

  await pMap(
    involvedAccountsAssetsMap.entries(),
    async ([accountId, assetsMap]) => {
      const account = await getOrCreateAccount({ ctx, id: accountId });
      if (
        !account.boundEvmAddress ||
        account.boundEvmAddress === constants.AddressZero
      )
        return;

      const assetBalances: {
        asset: Asset;
        balance: bigint | undefined | null;
      }[] = [];

      await pMap(
        Array.from(assetsMap.values()).filter(
          (asset) => !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
        ),
        async (asset) => {
          assetBalances.push({
            asset,
            balance:
              await MoneyMarketContractsManager.getInstance().getAccountTokenBalance(
                {
                  contractAddress: asset.evmAddress!,
                  accountAddress: account.boundEvmAddress!,
                  blockNumber: block.header.height,
                }
              ),
          });
        },
        { concurrency: appConfig.concurrency.EVM_CONTRACT_CALL_CONCURRENCY }
      );

      assetBalancesLoop: for (const assetBalance of assetBalances) {
        if (assetBalance.balance === null || assetBalance.balance === undefined)
          continue assetBalancesLoop;

        const isExistingAssetBalanceHistoricalDataEntity =
          ctx.batchState.state.accAssetBalanceHistData.has(
            `${accountId}-${assetBalance.asset.id}-${block.header.height}`
          );

        if (isExistingAssetBalanceHistoricalDataEntity)
          continue assetBalancesLoop;

        const historicalDataEntity =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            assetId: assetBalance.asset.id,
            accountId,
            blockHeader: block.header,
            fetchFromDb: false,
          });

        if (!historicalDataEntity) continue assetBalancesLoop;

        historicalDataEntity.transferable = assetBalance.balance.toString();

        ctx.batchState.state.accAssetBalanceHistData.set(
          historicalDataEntity.id,
          historicalDataEntity
        );
      }
    },
    { concurrency: appConfig.concurrency.RUNTIME_API_CALLS_CONCURRENCY }
  );

  return accountIdsWithCommonAssetBalanceChanges;
}

//
//
// export async function handleMmAssetAccountBalancesPerBlock(
//   ctx: SqdProcessorContext<Store>
// ) {
//   const involvedAccountsAssetsPerBlockMap: Map<
//     number,
//     {
//       block: Block;
//       blockHeader: SqdBlock;
//       accountsAssetsMap: Map<
//         string,
//         { account: Account; assets: Map<string, Asset> }
//       >;
//     }
//   > = new Map();
//
//   const getBlockHeaderByBlockHeight = (
//     blockHeight: number
//   ): SqdBlock | undefined => {
//     return ctx.blocks.find((block) => block.header.height === blockHeight)
//       ?.header;
//   };
//
//   const pushAccountsAssetsToBlockSlot = ({
//                                            blockHeader,
//                                            block,
//                                            assets,
//                                            account,
//                                          }: {
//     blockHeader: SqdBlock;
//     block: Block;
//     account: Account;
//     assets: Asset[];
//   }) => {
//     if (!involvedAccountsAssetsPerBlockMap.has(block.height)) {
//       involvedAccountsAssetsPerBlockMap.set(block.height, {
//         block,
//         blockHeader,
//         accountsAssetsMap: new Map([
//           [
//             account.id,
//             { account, assets: new Map(assets.map((a) => [a.id, a])) },
//           ],
//         ]),
//       });
//       return;
//     }
//     if (
//       involvedAccountsAssetsPerBlockMap.has(block.height) &&
//       !involvedAccountsAssetsPerBlockMap
//         .get(block.height)!
//         .accountsAssetsMap.has(account.id)
//     ) {
//       involvedAccountsAssetsPerBlockMap
//         .get(block.height)!
//         .accountsAssetsMap.set(account.id, {
//         account,
//         assets: new Map(assets.map((a) => [a.id, a])),
//       });
//       return;
//     }
//     involvedAccountsAssetsPerBlockMap
//       .get(block.height)!
//       .accountsAssetsMap.get(account.id)!.assets = new Map(
//       [
//         ...[
//           ...involvedAccountsAssetsPerBlockMap
//             .get(block.height)!
//             .accountsAssetsMap.get(account.id)!
//             .assets.values(),
//         ],
//         ...assets,
//       ].map((a) => [a.id, a])
//     );
//   };
//
//   const batchState = ctx.batchState.state;
//
//   // batchState.transfers.forEach((transfer) => {
//   //   const blockHeader = getBlockHeaderByBlockHeight(transfer.paraBlockHeight);
//   //   if (blockHeader) {
//   //     pushAccountsAssetsToBlockSlot({
//   //       blockHeader,
//   //       block: transfer.event.block,
//   //       assets: [transfer.asset],
//   //       account: transfer.from,
//   //     });
//   //     pushAccountsAssetsToBlockSlot({
//   //       blockHeader,
//   //       block: transfer.event.block,
//   //       assets: [transfer.asset],
//   //       account: transfer.to,
//   //     });
//   //   }
//   // });
//
//   console.log(
//     'batchState.moneyMarketEvents - ',
//     batchState.moneyMarketEvents.size
//   );
//
//   for (const mmEvent of [...batchState.moneyMarketEvents.values()]) {
//     const assets: Asset[] = [];
//     const blockHeader = getBlockHeaderByBlockHeight(mmEvent.paraBlockHeight);
//
//     if (!blockHeader) continue;
//
//     for (const assetId of mmEvent.allInvolvedAssetIds) {
//       const asset = await getOrCreateAsset({ ctx, id: assetId, ensure: false });
//       if (!asset) continue;
//       assets.push(asset);
//     }
//
//     for (const accountId of mmEvent.allInvolvedParticipants) {
//       const account = await getOrCreateAccount({ ctx, id: accountId });
//       if (!account) continue;
//       pushAccountsAssetsToBlockSlot({
//         blockHeader,
//         block: mmEvent.event.block,
//         assets,
//         account,
//       });
//     }
//   }
//
//   for (const blockSlotData of [...involvedAccountsAssetsPerBlockMap.values()]) {
//     accountAssetsMapLoop: for (const accountAssetsMap of [
//       ...blockSlotData.accountsAssetsMap.values(),
//     ]) {
//       if (
//         !accountAssetsMap.account.boundEvmAddress ||
//         accountAssetsMap.account.boundEvmAddress === constants.AddressZero
//       )
//         continue accountAssetsMapLoop;
//
//       const accountTotalBalanceHistData =
//         await getOrCreateAccountTotalBalanceHistoricalData({
//           account: accountAssetsMap.account,
//           blockHeader: blockSlotData.blockHeader,
//           ctx,
//         });
//
//       const assetBalances = (
//         await Promise.allSettled(
//           [...accountAssetsMap.assets.values()]
//             .filter(
//               (asset) =>
//                 !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
//             )
//             .map(async (asset) => {
//               return {
//                 asset,
//                 balance:
//                   await MoneyMarketContractsManager.getInstance().getAccountTokenBalance(
//                     {
//                       contractAddress: asset.evmAddress!,
//                       accountAddress: accountAssetsMap.account.boundEvmAddress!,
//                       blockNumber: blockSlotData.block.height,
//                     }
//                   ),
//               };
//             })
//         )
//       )
//         .filter((res) => res.status === 'fulfilled')
//         .map((res) => res.value);
//
//       assetBalancesLoop: for (const assetBalance of assetBalances) {
//         if (assetBalance.balance === null || assetBalance.balance === undefined)
//           continue assetBalancesLoop;
//
//         const isExistingAssetBalanceHistoricalDataEntity =
//           ctx.batchState.state.accountAssetBalanceHistoricalData.has(
//             `${accountAssetsMap.account.id}-${assetBalance.asset.id}-${blockSlotData.blockHeader.height}`
//           );
//
//         if (isExistingAssetBalanceHistoricalDataEntity)
//           continue assetBalancesLoop;
//
//         const historicalDataEntity =
//           await getOrCreateAccountAssetBalanceHistoricalData({
//             ctx,
//             asset: assetBalance.asset,
//             account: accountAssetsMap.account,
//             blockHeader: blockSlotData.blockHeader,
//             fetchFromDb: false,
//           });
//
//         if (!historicalDataEntity) continue assetBalancesLoop;
//
//         historicalDataEntity.transferable = assetBalance.balance;
//
//         let assetInId = assetBalance.asset.id;
//
//         if (
//           assetBalance.asset.resourceType === ResourceType.Debt &&
//           assetBalance.asset.underlyingAsset
//         ) {
//           let assetFull: Asset | undefined = assetBalance.asset;
//           if (!assetFull.underlyingAsset) {
//             /**
//              * We need this re-fetch to be sure that cached Asset contains data
//              * about a related underlyingAsset
//              */
//             assetFull = await ctx.store.findOne(Asset, {
//               where: { id: assetBalance.asset.id },
//               relations: {
//                 underlyingAsset: true,
//               },
//             });
//             if (!assetFull || !assetFull.underlyingAsset)
//               continue assetBalancesLoop;
//           }
//           assetInId = assetBalance.asset.underlyingAsset.id;
//         }
//
//         const assetSpotPrice = getAssetsPairPrice({
//           ctx,
//           assetInId,
//           blockHeight: blockSlotData.block.height,
//         });
//
//         historicalDataEntity.transferableInRefAssetNorm =
//           assetSpotPrice && assetBalance.asset.decimals
//             ? calcPriceNormalized({
//               amount: assetBalance.balance,
//               assetDecimals: assetBalance.asset.decimals,
//               spotPrice: assetSpotPrice,
//             })
//             : '0';
//
//         if (assetBalance.asset.resourceType === ResourceType.Debt) {
//           accountTotalBalanceHistData.totalTransferableNorm = BigNumber(
//             accountTotalBalanceHistData.totalTransferableNorm
//           )
//             .minus(historicalDataEntity.transferableInRefAssetNorm || '0')
//             .toFixed();
//
//           accountTotalBalanceHistData.totalDebtNorm = BigNumber(
//             accountTotalBalanceHistData.totalDebtNorm || '0'
//           )
//             .plus(historicalDataEntity.transferableInRefAssetNorm || '0')
//             .toFixed();
//         } else {
//           accountTotalBalanceHistData.totalTransferableNorm = BigNumber(
//             accountTotalBalanceHistData.totalTransferableNorm
//           )
//             .plus(historicalDataEntity.transferableInRefAssetNorm || '0')
//             .toFixed();
//         }
//
//         ctx.batchState.state.accountAssetBalanceHistoricalData.set(
//           historicalDataEntity.id,
//           historicalDataEntity
//         );
//       }
//
//       ctx.batchState.state.accountTotalBalanceHistoricalData.set(
//         accountTotalBalanceHistData.id,
//         accountTotalBalanceHistData
//       );
//     }
//   }
//
//   // await ctx.store.save([
//   //   ...ctx.batchState.state.accountAssetBalanceHistoricalData.values(),
//   // ]);
//   //
//   // await ctx.store.save([
//   //   ...ctx.batchState.state.accountTotalBalanceHistoricalData.values(),
//   // ]);
// }
