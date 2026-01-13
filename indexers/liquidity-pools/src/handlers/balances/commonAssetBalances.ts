import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { Account, Asset } from '../../model';
import { In } from 'typeorm';
import parsers from '../../parsers';
import {
  AccountData,
  TokenAccountBalancesWithAccountId,
} from '../../parsers/types/storage';
import { getOrCreateAccount } from '../accounts';
import { batchGetOrCreateAssets, getOrCreateAsset } from '../assets/asset';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { calcPriceNormalized } from '../../utils/helpers';
import { getOrCreateAccountAssetBalanceHistoricalData } from './accountAssetBalance';
import {
  addAssetBalancesToAccumulator,
  fetchBalancesForAccountsPerBlock,
} from './utils';

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

export type AssetBalancesStorageDataPerBlockPerAccountMap = Map<
  BlockHeight,
  Map<AccountId, Map<AssetId, AccountData>>
>;

export async function handleCommonAssetAccountBalances({
  accountIdsToProcess = {
    accountsFromSubstrateEventsPerBlock: new Map(),
    allProcessedAccountsPerBlock: new Map(),
  },
  prefetchedBalancesForAccountsInvolvedToMmEvents = new Map(),
  ctx,
}: {
  accountIdsToProcess?: {
    accountsFromSubstrateEventsPerBlock: Map<number, Set<string>>;
    allProcessedAccountsPerBlock: Map<number, Set<string>>;
  };
  prefetchedBalancesForAccountsInvolvedToMmEvents?: AssetBalancesStorageDataPerBlockPerAccountMap;
  ctx: SqdProcessorContext<Store>;
}): Promise<{
  assetBalancesStorageDataPerBlockPerAccountMap: AssetBalancesStorageDataPerBlockPerAccountMap;
}> {
  const { accountsFromSubstrateEventsPerBlock, allProcessedAccountsPerBlock } =
    accountIdsToProcess;

  const accountBalancesPerBlock: AccountBalancesPerBlock = new Map();

  const assetBalancesStorageDataPerBlockPerAccountMap: AssetBalancesStorageDataPerBlockPerAccountMap =
    await fetchBalancesForAccountsPerBlock({
      accountsPerBlock: accountsFromSubstrateEventsPerBlock,
      cache: prefetchedBalancesForAccountsInvolvedToMmEvents,
      ctx,
    });

  // TODO must be refactored as redundant logic
  blocksLoop: for (const [
    blockNumber,
    accountsAssetBalancesPerBlock,
  ] of assetBalancesStorageDataPerBlockPerAccountMap.entries()) {
    if (accountsAssetBalancesPerBlock.size === 0) continue blocksLoop;

    if (!accountBalancesPerBlock.has(blockNumber))
      accountBalancesPerBlock.set(blockNumber, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockNumber),
        data: new Map(),
      });

    // Cache block data reference to avoid repeated Map lookups
    const currentBlockData = accountBalancesPerBlock.get(blockNumber)!;

    for (const [
      accountId,
      accountAssetBalances,
    ] of accountsAssetBalancesPerBlock.entries()) {
      if (!currentBlockData.data.has(accountId)) {
        currentBlockData.data.set(accountId, new Map());
      }

      const accountData = currentBlockData.data.get(accountId)!;
      for (const [assetId, balance] of accountAssetBalances.entries()) {
        accountData.set(assetId, balance);
      }
    }
  }

  const allInvolvedAccountsInBatchSet = new Set(
    Array.from(allProcessedAccountsPerBlock.values())
      .map((accSet) => Array.from(accSet.values()))
      .flat()
  );

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
    // IMPORTANT: assetsCache keysare assetId but not assetRegistryId
    const assetsCache = await batchGetOrCreateAssets({
      assetRegistryIds: Array.from(allAssetRegistryIds),
      ctx,
      ensure: true,
      blockHeader: blockData.blockHeader,
    });

    const assetsCacheIndexedByAssetRegistryId: Map<string, Asset> = new Map();
    for (const asset of assetsCache.values()) {
      if (asset.assetRegistryId)
        assetsCacheIndexedByAssetRegistryId.set(asset.assetRegistryId, asset);
    }

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
        const asset = assetsCacheIndexedByAssetRegistryId.get(assetRegistryId);
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

  return { assetBalancesStorageDataPerBlockPerAccountMap };
}

export async function collectAccountsAndAssetsInvolvedToSubstrateEvents({
  accountIdsToProcess = {
    accountIdsWithCommonAssetBalanceChanges: new Map(),
    allProcessedAccountsPerBlock: new Map(),
  },
  ctx,
}: {
  accountIdsToProcess?: {
    accountIdsWithCommonAssetBalanceChanges: Map<number, Set<string>>;
    allProcessedAccountsPerBlock: Map<number, Set<string>>;
  };
  ctx: SqdProcessorContext<Store>;
}): Promise<{
  accountsFromSubstrateEventsPerBlock: Map<number, Set<string>>;
  allProcessedAccountsPerBlock: Map<number, Set<string>>;
}> {
  const {
    accountIdsWithCommonAssetBalanceChanges,
    allProcessedAccountsPerBlock,
  } = accountIdsToProcess;

  const accountsFromSubstrateEventsPerBlock: Map<
    number,
    Set<string>
  > = new Map();

  const ensureAccumulatorsPerBlock = (blockHeight: number) => {
    if (!allProcessedAccountsPerBlock.has(blockHeight))
      allProcessedAccountsPerBlock.set(
        blockHeight,
        accountIdsWithCommonAssetBalanceChanges.get(blockHeight) ?? new Set()
      );

    if (!accountsFromSubstrateEventsPerBlock.has(blockHeight))
      accountsFromSubstrateEventsPerBlock.set(
        blockHeight,
        accountIdsWithCommonAssetBalanceChanges.get(blockHeight) ?? new Set()
      );
  };

  const addAccountToAccumulatorPerBlock = (
    blockHeight: number,
    accountId: string
  ) => {
    allProcessedAccountsPerBlock.get(blockHeight)?.add(accountId);
    accountsFromSubstrateEventsPerBlock.get(blockHeight)?.add(accountId);
  };

  const palletNamesSet = ctx.appConfig.ACCOUNT_BALANCE_AGGREGATION_TRIGGERS;

  blocksLoop: for (const block of ctx.blocks) {
    ensureAccumulatorsPerBlock(block.header.height);

    eventsLoop: for (const event of block.events) {
      const eventPalletName = event.name.split('.')[0];

      if (!palletNamesSet.has(eventPalletName)) continue eventsLoop;

      if (event.args.from) {
        addAccountToAccumulatorPerBlock(block.header.height, event.args.from);
      }
      if (event.args.to) {
        addAccountToAccumulatorPerBlock(block.header.height, event.args.to);
      }
      if (event.args.who) {
        addAccountToAccumulatorPerBlock(block.header.height, event.args.who);
      }
      if (event.args.swapper) {
        addAccountToAccumulatorPerBlock(
          block.header.height,
          event.args.swapper
        );
      }
      if (event.args.filler) {
        addAccountToAccumulatorPerBlock(block.header.height, event.args.filler);
      }
    }
  }

  return { allProcessedAccountsPerBlock, accountsFromSubstrateEventsPerBlock };
}
