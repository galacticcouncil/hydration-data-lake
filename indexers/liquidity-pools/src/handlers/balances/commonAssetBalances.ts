import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
} from '../../model';
import { In, LessThanOrEqual } from 'typeorm';
import parsers from '../../parsers';
import { AccountData } from '../../parsers/types/storage';
import { getOrCreateAccount } from '../accounts';
import { getOrCreateAsset } from '../assets/asset';
import { BigNumber } from '@galacticcouncil/sdk';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import { Between } from 'typeorm/find-options/operator/Between';

type BlockHeight = number;
type AccountId = string;
type AssetRegistryId = string;
type AssetId = string;
type AccountBalancesPerBlock = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
  }
>;

type AccountPositionBalancesPerBlockPerAsset = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetId, BigNumber>>;
  }
>;

export async function handleCommonAssetAccountBalances({
  accountIdsToProcess = new Map(),
  ctx,
}: {
  accountIdsToProcess?: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}) {
  const allInvolvedAccountsInBatchSet: Set<string> = new Set(
    Array.from(accountIdsToProcess.values())
      .map((blockSlot) => Array.from(blockSlot.values()))
      .flat()
  );

  const palletNamesSet = ctx.appConfig.ACCOUNT_BALANCE_AGGREGATION_TRIGGERS;
  const accountBalancesPerBlock: AccountBalancesPerBlock = new Map();

  blocksLoop: for (const block of ctx.blocks) {
    const allInvolvedAccountsInBlockSet: Set<string> =
      accountIdsToProcess.get(block.header.height) ?? new Set();

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
      if (event.args.swapper) {
        allInvolvedAccountsInBlockSet.add(event.args.swapper);
        allInvolvedAccountsInBatchSet.add(event.args.swapper);
      }
      if (event.args.filler) {
        allInvolvedAccountsInBlockSet.add(event.args.filler);
        allInvolvedAccountsInBatchSet.add(event.args.filler);
      }
    }

    if (allInvolvedAccountsInBlockSet.size === 0) continue blocksLoop;

    const allInvolvedAccountsInBlockList = Array.from(
      allInvolvedAccountsInBlockSet.keys()
    );

    const [nativeTokenBalances, otherTokenBalances] = await Promise.all([
      parsers.storage.system.getNativeTokenBalanceMany({
        block: block.header,
        accountIds: allInvolvedAccountsInBlockList,
      }),
      parsers.storage.tokens.getTokenBalancesMany({
        block: block.header,
        accountIds: allInvolvedAccountsInBlockList,
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
      where: {
        id: In(
          Array.from(allInvolvedAccountsInBatchSet.keys()).filter(
            (acc) => !ctx.batchState.state.accounts.has(acc)
          )
        ),
      },
    },
    { className: 'Account', originCallFn: 'handleCommonAssetAccountBalances' }
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
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      for (const [assetRegistryId, balances] of accountAssetData.entries()) {
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

        /**
         * Account Asset balance calculation
         */
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

        ctx.batchState.state.accountAssetBalanceHistoricalData.set(
          assetBalanceHistData.id,
          assetBalanceHistData
        );
      }
    }
  }
}

