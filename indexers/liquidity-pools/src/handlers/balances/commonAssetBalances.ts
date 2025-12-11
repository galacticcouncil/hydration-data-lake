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
import { batchGetOrCreateAssets, getOrCreateAsset } from '../assets/asset';
import { BigNumber } from '@galacticcouncil/sdk';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import {
  getOrCreateAccountAssetBalanceHistoricalData,
  getOrCreateAccountTotalBalanceHistoricalData,
} from './accountAssetBalance';

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

      const accountData = currentBlockData.data.get(
        otherTokenBalance.accountId
      )!;
      for (const balance of otherTokenBalance.assetBalances) {
        accountData.set(balance.assetId, balance.data);
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
      allAccountIds.map((accountId) =>
        getOrCreateAccount({ ctx, id: accountId })
      )
    );
    const accountsMap = new Map(
      accountsArray.map((account) => [account.id, account])
    );

    for (const [accountId, accountData] of blockData.data.entries()) {
      const account = accountsMap.get(accountId)!;

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
