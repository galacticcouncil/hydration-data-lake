import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  Asset,
  AssetType,
  Block,
} from '../../model';
import { constants } from 'ethers';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { getAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';

export async function handleAssetAccountBalancesPerBlock(
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

  batchState.transfers.forEach((transfer) => {
    const blockHeader = getBlockHeaderByBlockHeight(transfer.paraBlockHeight);
    if (blockHeader) {
      pushAccountsAssetsToBlockSlot({
        blockHeader,
        block: transfer.event.block,
        assets: [transfer.asset],
        account: transfer.from,
      });
      pushAccountsAssetsToBlockSlot({
        blockHeader,
        block: transfer.event.block,
        assets: [transfer.asset],
        account: transfer.to,
      });
    }
  });

  console.log(
    'batchState.moneyMarketEvents - ',
    batchState.moneyMarketEvents.size
  );

  for (const mmEvent of [...batchState.moneyMarketEvents.values()]) {
    const assets: Asset[] = [];
    const blockHeader = getBlockHeaderByBlockHeight(mmEvent.paraBlockHeight);

    if (!blockHeader) continue;

    for (const assetId of mmEvent.allInvolvedAssetIds) {
      const asset = await getOrCreateAsset({ ctx, id: assetId, ensure: false });
      if (!asset) continue;
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

      const assetBalances = (
        await Promise.allSettled(
          [...accountAssetsMap.assets.values()]
            .filter(
              (asset) =>
                !!asset.evmAddress && asset.assetType === AssetType.Erc20 // TODO update to process all types of assets
            )
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

        let historicalDataEntity = await getAccountAssetBalanceHistoricalData({
          ctx,
          asset: assetBalance.asset,
          account: accountAssetsMap.account,
          blockHeader: blockSlotData.blockHeader,
          fetchFromDb: false,
        });

        if (!historicalDataEntity) {
          historicalDataEntity = new AccountAssetBalanceHistoricalData({
            id: `${accountAssetsMap.account.id}-${assetBalance.asset.id}-${blockSlotData.blockHeader.height}`,
            account: accountAssetsMap.account,
            asset: assetBalance.asset,

            transferable: 0n,
            totalLocked: 0n,
            free: 0n,
            locked: 0n,
            flags: 0n,
            frozen: 0n,
            reserved: 0n,
            feeFrozen: 0n,
            miscFrozen: 0n,

            relayBlockHeight: blockSlotData.block.relayBlockHeight,
            paraBlockHeight: blockSlotData.block.height,
            block: blockSlotData.block,
          });
        }

        historicalDataEntity.transferable = assetBalance.balance;

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          historicalDataEntity.id,
          historicalDataEntity
        );
      }
    }
  }

  await ctx.store.save([
    ...ctx.batchState.state.accountAssetBalanceHistoricalData.values(),
  ]);
}
