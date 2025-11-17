import { In } from 'typeorm';

import { BigNumber } from '@galacticcouncil/sdk';
import { Store } from '@subsquid/typeorm-store';

import { Account } from '../../model';
import parsers from '../../parsers';
import { AccountData } from '../../parsers/types/storage';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { calcPriceNormalized } from '../../utils/helpers';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset, batchGetOrCreateAssets } from '../assets/asset';
import {
  getAssetsPairPrice,
} from '../assets/assetHistoricalData/assetSpotPrices';
import {
  getOrCreateAccountAssetBalanceHistoricalData,
  getOrCreateAccountTotalBalanceHistoricalData,
} from './accountAssetBalance';

type AccountId = string;
type AssetRegistryId = string;

export async function handleCommonAssetAccountBalances({
  accountIdsToProcess = new Set(),
  ctx,
}: {
  accountIdsToProcess?: Set<string>;
  ctx: SqdProcessorContext<Store>;
}) {
  const allInvolvedAccountsInBatchSet: Set<string> = accountIdsToProcess;
  const palletNamesSet = new Set([
    'Currencies',
    'Tokens',
    'Balances',
    'Duster',
  ]);
  const accountBalancesPerBlock: Map<
    number,
    {
      blockHeader: SqdBlock;
      data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
    }
  > = new Map();

  blocksLoop: for (const block of ctx.blocks) {
    const allInvolvedAccountsInBlockSet: Set<string> = new Set();
    if (!accountBalancesPerBlock.has(block.header.height))
      accountBalancesPerBlock.set(block.header.height, {
        blockHeader: block.header,
        data: new Map(),
      });

    eventsLoop: for (const event of block.events) {
      const eventPalletName = event.name.split('.')[0];

      if (!palletNamesSet.has(eventPalletName)) continue eventsLoop;

      if (event.args.from) {
        allInvolvedAccountsInBlockSet.add(event.args.from);
        allInvolvedAccountsInBatchSet.add(event.args.from);
      }
      if (event.args.to) {
        allInvolvedAccountsInBlockSet.add(event.args.to);
        allInvolvedAccountsInBatchSet.add(event.args.to);
      }
      if (event.args.who) {
        allInvolvedAccountsInBlockSet.add(event.args.who);
        allInvolvedAccountsInBatchSet.add(event.args.who);
      }
    }

    if (allInvolvedAccountsInBlockSet.size === 0) continue blocksLoop;

    // Convert Set to Array once for reuse
    const accountIdsArray = Array.from(allInvolvedAccountsInBlockSet);

    const [nativeTokenBalances, otherTokenBalances] = await Promise.all([
      parsers.storage.system.getNativeTokenBalanceMany({
        block: block.header,
        accountIds: accountIdsArray,
      }),
      parsers.storage.tokens.getTokenBalancesMany({
        block: block.header,
        accountIds: accountIdsArray,
      }),
    ]);

    // Cache block data reference to avoid repeated Map lookups
    const currentBlockData = accountBalancesPerBlock.get(block.header.height)!;

    for (const nativeTokenBalance of nativeTokenBalances) {
      if (!currentBlockData.data.has(nativeTokenBalance.accountId)) {
        currentBlockData.data.set(nativeTokenBalance.accountId, new Map());
      }

      currentBlockData.data
        .get(nativeTokenBalance.accountId)!
        .set('0', nativeTokenBalance.data);
    }

    for (const otherTokenBalance of otherTokenBalances) {
      if (!currentBlockData.data.has(otherTokenBalance.accountId)) {
        currentBlockData.data.set(otherTokenBalance.accountId, new Map());
      }

      const accountData = currentBlockData.data.get(otherTokenBalance.accountId)!;
      for (const balance of otherTokenBalance.assetBalances) {
        accountData.set(balance.assetId, balance.data);
      }
    }
  }

  const persistedAccounts = await ctx.storeUtils.findWithLogs(
    Account,
    {
      where: { id: In(Array.from(allInvolvedAccountsInBatchSet.keys())) },
    },
    { className: 'Account', originCallFn: 'handleCommonAssetAccountBalances' },
  );

  for (const acc of persistedAccounts) {
    ctx.batchState.state.accounts.set(acc.id, acc);
  }

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  for (const blockData of accountBalancesPerBlock.values()) {
    // Collect all unique asset registry IDs for this block
    const allAssetRegistryIds = new Set<string>();
    for (const accountData of blockData.data.values()) {
      for (const assetRegistryId of accountData.keys()) {
        allAssetRegistryIds.add(assetRegistryId);
      }
    }

    // Collect all unique account IDs for this block
    const allAccountIds = Array.from(blockData.data.keys());

    // Batch fetch all assets for this block in a single DB query
    const assetsCache = await batchGetOrCreateAssets({
      assetRegistryIds: Array.from(allAssetRegistryIds),
      ctx,
      ensure: true,
      blockHeader: blockData.blockHeader,
    });

    // Batch fetch all accounts for this block in parallel
    const accountsArray = await Promise.all(
      allAccountIds.map((accountId) => getOrCreateAccount({ ctx, id: accountId }))
    );
    const accountsMap = new Map(
      accountsArray.map((account) => [account.id, account])
    );

    for (const [accountId, accountData] of blockData.data.entries()) {
      const account = accountsMap.get(accountId)!;

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account,
          refAssetId: refAsset.id,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetRegistryId, balances] of accountData.entries()) {
        // Use cached asset instead of sequential DB query
        const asset = assetsCache.get(assetRegistryId);
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: asset.id,
          blockHeight: blockData.blockHeader.height,
        });

        const assetBalanceHistData =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            assetId: asset.id,
            account,
            blockHeader: blockData.blockHeader,
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

        accountTotalBalance.totalTransferableNorm = BigNumber(
          accountTotalBalance.totalTransferableNorm
        )
          .plus(assetBalanceHistData.transferableInRefAssetNorm || '0')
          .toFixed();

        accountTotalBalance.totalLockedNorm = BigNumber(
          accountTotalBalance.totalLockedNorm
        )
          .plus(assetBalanceHistData.totalLockedInRefAssetNorm || '0')
          .toFixed();

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          assetBalanceHistData.id,
          assetBalanceHistData
        );
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
    }
  }
}
