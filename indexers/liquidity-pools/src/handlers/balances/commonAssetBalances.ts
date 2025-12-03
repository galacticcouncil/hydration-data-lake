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

export async function getOmnipoolLiquidityPositionsForAccounts({
  involvedAccountsInBatch,
  involvedAccountsPerBlock,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  involvedAccountsPerBlock: AccountBalancesPerBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const allCachedPositions = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositions.values()
  ).filter(
    (pos) =>
      (pos.createdAtParaBlockHeight >= ctx.blocks[0].header.height ||
        pos.createdAtParaBlockHeight <=
          ctx.blocks[ctx.blocks.length - 1].header.height) &&
      involvedAccountsInBatch.has(pos?.account?.id)
  );

  const allPersistentPositions = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPosition,
    {
      where: {
        account: { id: In(Array.from(involvedAccountsInBatch.values())) },
        createdAtParaBlockHeight: Between(
          ctx.blocks[0].header.height,
          ctx.blocks[ctx.blocks.length - 1].header.height
        ),
      },
      relations: {
        account: true,
      },
    }
  );

  const allPositionsDeduped = new Map([
    ...allCachedPositions.map((pos): [string, OmnipoolLiquidityPosition] => [
      pos.id,
      pos,
    ]),
    ...allPersistentPositions.map(
      (pos): [string, OmnipoolLiquidityPosition] => [pos.id, pos]
    ),
  ]);

  const cachedPositionEvents = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositionEvents.values()
  ).filter((e) => allPositionsDeduped.has(e.position.id));

  const persistentPositionEvents = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPositionEvent,
    {
      where: {
        position: { id: In(Array.from(allPositionsDeduped.keys())) },
      },
      relations: {
        position: true,
      },
    }
  );

  const allPositionEventsDeduped = new Map([
    ...cachedPositionEvents.map(
      (e): [string, OmnipoolLiquidityPositionEvent] => [e.id, e]
    ),
    ...persistentPositionEvents.map(
      (e): [string, OmnipoolLiquidityPositionEvent] => [e.id, e]
    ),
  ]);

  const eventsIndexedByPositionId = new Map<
    string,
    OmnipoolLiquidityPositionEvent[]
  >();

  for (const event of allPositionEventsDeduped.values()) {
    if (!eventsIndexedByPositionId.has(event.position.id)) {
      eventsIndexedByPositionId.set(event.position.id, [event]);
      continue;
    }
    eventsIndexedByPositionId.get(event.position.id)?.push(event);
  }
  for (const [posId, events] of eventsIndexedByPositionId.entries()) {
    eventsIndexedByPositionId.set(
      posId,
      events.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  const allPositionsIndexedByAccountId = new Map<
    string,
    OmnipoolLiquidityPosition[]
  >();

  for (const position of allPositionsDeduped.values()) {
    if (!allPositionsIndexedByAccountId.has(position.account.id)) {
      allPositionsIndexedByAccountId.set(position.account.id, [position]);
      continue;
    }
    allPositionsIndexedByAccountId.get(position.account.id)?.push(position);
  }

  const accountPositionBalancesPerBlockPerAsset: AccountPositionBalancesPerBlockPerAsset =
    new Map();

  for (const [blockHeight, { data }] of involvedAccountsPerBlock.entries()) {
    if (!accountPositionBalancesPerBlockPerAsset.has(blockHeight))
      accountPositionBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountId of data.keys()) {
      const accountActivePositionsAtBlock =
        allPositionsIndexedByAccountId
          .get(accountId)
          ?.filter(
            (pos) =>
              pos.createdAtParaBlockHeight <= blockHeight &&
              (!pos.destroyedAtParaBlockHeight ||
                (!!pos.destroyedAtParaBlockHeight &&
                  pos.destroyedAtParaBlockHeight > blockHeight))
          ) || [];

      for (const position of accountActivePositionsAtBlock) {
        if (
          !accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.has(accountId)
        )
          accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.set(accountId, new Map());

        if (
          !accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .has(position.assetId)
        )
          accountPositionBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .set(position.assetId, BigNumber(0));

        const currentBalance = accountPositionBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .get(position.assetId)!;

        /**
         * Retrieves the position amount from the closest event at or before the target block.
         *
         * This is necessary because during batch processing, the position entity may already
         * reflect updates from later blocks (e.g., amount changes or position destruction).
         * To ensure historical accuracy, we must use the amount recorded in the event that
         * was closest to the block being processed, rather than the current position state.
         */
        const actualPositionAmountAtBlock: string =
          eventsIndexedByPositionId
            .get(position.id)!
            .find((e) => e.paraBlockHeight <= blockHeight)
            ?.amount?.toString() ?? '0';

        accountPositionBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .set(
            position.assetId,
            currentBalance.plus(actualPositionAmountAtBlock)
          );
      }
    }
  }

  return accountPositionBalancesPerBlockPerAsset;
}
