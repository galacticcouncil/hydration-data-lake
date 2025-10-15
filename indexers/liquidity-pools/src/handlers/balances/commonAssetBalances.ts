import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
} from '../../model';
import { In } from 'typeorm';
import parsers from '../../parsers';
import { AccountData } from '../../parsers/types/storage';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';
import { BigNumber } from '@galacticcouncil/sdk';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
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

    const [nativeTokenBalances, otherTokenBalances] = await Promise.all([
      parsers.storage.system.getNativeTokenBalanceMany({
        block: block.header,
        accountIds: Array.from(allInvolvedAccountsInBlockSet.keys()),
      }),
      parsers.storage.tokens.getTokenBalancesMany({
        block: block.header,
        accountIds: Array.from(allInvolvedAccountsInBlockSet.keys()),
      }),
    ]);

    for (const nativeTokenBalance of nativeTokenBalances) {
      if (
        !accountBalancesPerBlock
          .get(block.header.height)!
          .data.has(nativeTokenBalance.accountId)
      )
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.set(nativeTokenBalance.accountId, new Map());

      accountBalancesPerBlock
        .get(block.header.height)!
        .data.get(nativeTokenBalance.accountId)!
        .set('0', nativeTokenBalance.data);
    }

    for (const otherTokenBalance of otherTokenBalances) {
      if (
        !accountBalancesPerBlock
          .get(block.header.height)!
          .data.has(otherTokenBalance.accountId)
      )
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.set(otherTokenBalance.accountId, new Map());

      for (const balance of otherTokenBalance.assetBalances) {
        accountBalancesPerBlock
          .get(block.header.height)!
          .data.get(otherTokenBalance.accountId)!
          .set(balance.assetId, balance.data);
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
    for (const [accountId, accountData] of blockData.data.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account,
          refAssetId: refAsset.id,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetRegistryId, balances] of accountData.entries()) {
        const asset = await getOrCreateAsset({
          assetRegistryId,
          ctx,
          ensure: true,
          blockHeader: blockData.blockHeader,
        });
        if (!asset) continue;

        const assetSpotPrice = getAssetsPairPrice({
          ctx,
          assetInId: asset.id,
          blockHeight: blockData.blockHeader.height,
        });

        const assetBalanceHistData =
          await getOrCreateAccountAssetBalanceHistoricalData({
            ctx,
            asset,
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
