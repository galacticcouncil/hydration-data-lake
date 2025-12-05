import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { calcPriceNormalized } from '../../utils/helpers';
import { getAssetsPairPrice } from '../assets/assetHistoricalData/assetSpotPrices';
import { getOrCreateAsset } from '../assets/asset';
import { getOrCreateAccountTotalBalanceHistoricalData } from './accountAssetBalance';
import { getOrCreateAccount } from '../accounts';
import { AccountData } from '../../parsers/types/storage';
import { SqdBlock } from '../../processor';
import {
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
  ResourceType,
} from '../../model';
import { BigNumber } from '@galacticcouncil/sdk';
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from 'typeorm';

type BlockHeight = number;
type AccountId = string;
type AssetRegistryId = string;
type AssetId = string;
export type AccountBalancesPerBlock = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetRegistryId, AccountData>>;
  }
>;

export type AccountPositionBalancesPerBlockPerAsset = Map<
  BlockHeight,
  {
    blockHeader: SqdBlock;
    data: Map<AccountId, Map<AssetId, BigNumber>>;
  }
>;

export async function handleAccountTotalBalance({
  ctx,
}: {
  ctx: SqdProcessorContext<Store>;
}) {
  const allInvolvedAccountsInBatchSet: Set<string> = new Set();

  const accountBalancesPerBlock: AccountBalancesPerBlock = new Map();

  const refAsset = await getOrCreateAsset({
    assetRegistryId: ctx.appConfig.ASSET_PRICE_BASE_ASSET_ID,
    ctx,
    ensure: true,
    blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
  });

  if (!refAsset) throw Error('Ref asset not found');

  for (const assetBalance of ctx.batchState.state.accountAssetBalanceHistoricalData.values()) {
    if (!accountBalancesPerBlock.has(assetBalance.paraBlockHeight))
      accountBalancesPerBlock.set(assetBalance.paraBlockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
          assetBalance.paraBlockHeight
        ),
        data: new Map(),
      });

    accountBalancesPerBlock
      .get(assetBalance.paraBlockHeight)!
      .data.set(assetBalance.account.id, new Map());

    allInvolvedAccountsInBatchSet.add(assetBalance.account.id);

    const accountTotalBalance =
      await getOrCreateAccountTotalBalanceHistoricalData({
        account: assetBalance.account,
        refAssetId: refAsset.id,
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
          assetBalance.paraBlockHeight
        ),
        ctx,
      });

    if (assetBalance.asset.id === refAsset.id) {
      assetBalance.transferableInRefAssetNorm = calcPriceNormalized({
        amount: BigInt(assetBalance.transferable.toString() ?? '0'),
        assetDecimals: assetBalance.asset.decimals!,
        spotPrice: '1',
      });
    }

    /**
     * When we process DEbd token, we need to subtract the debt from the total
     * transferable balance.
     */
    if (assetBalance.asset.resourceType === ResourceType.Debt) {
      accountTotalBalance.totalTransferableNorm = BigNumber(
        accountTotalBalance.totalTransferableNorm
      )
        .minus(assetBalance.transferableInRefAssetNorm || '0')
        .toFixed();

      accountTotalBalance.totalDebtNorm = BigNumber(
        accountTotalBalance.totalDebtNorm || '0'
      )
        .plus(assetBalance.transferableInRefAssetNorm || '0')
        .toFixed();
    } else {
      accountTotalBalance.totalTransferableNorm = BigNumber(
        accountTotalBalance.totalTransferableNorm
      )
        .plus(assetBalance.transferableInRefAssetNorm || '0')
        .toFixed();
    }

    accountTotalBalance.totalLockedNorm = BigNumber(
      accountTotalBalance.totalLockedNorm
    )
      .plus(assetBalance.totalLockedInRefAssetNorm || '0')
      .toFixed();

    ctx.batchState.state.accountAssetBalanceHistoricalData.set(
      assetBalance.id,
      assetBalance
    );

    ctx.batchState.state.accountTotalBalanceHistoricalData.set(
      accountTotalBalance.id,
      accountTotalBalance
    );
  }

  const omnipoolLiquidityPositionsMap =
    await getOmnipoolLiquidityPositionsForAccounts({
      ctx,
      involvedAccountsPerBlock: accountBalancesPerBlock,
      involvedAccountsInBatch: allInvolvedAccountsInBatchSet,
    });

  /**
   * Add Omnipool liquidity positions to the total transferable balance.
   */
  for (const blockData of omnipoolLiquidityPositionsMap.values()) {
    for (const [accountId, accountAssetData] of blockData.data.entries()) {
      const account = await getOrCreateAccount({ ctx, id: accountId });

      const accountTotalBalance =
        await getOrCreateAccountTotalBalanceHistoricalData({
          account,
          refAssetId: refAsset.id,
          blockHeader: blockData.blockHeader,
          ctx,
        });

      for (const [assetId, balanceBn] of accountAssetData.entries()) {
        const asset = await getOrCreateAsset({
          id: assetId,
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

        /**
         * Account total balance calculation
         */
        accountTotalBalance.totalTransferableNorm = BigNumber(
          accountTotalBalance.totalTransferableNorm
        )
          .plus(
            assetSpotPrice && asset.decimals
              ? calcPriceNormalized({
                  amount: BigInt(balanceBn.toFixed() ?? '0'),
                  assetDecimals: asset.decimals,
                  spotPrice: assetSpotPrice,
                })
              : '0'
          )
          .toFixed();
      }

      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        accountTotalBalance.id,
        accountTotalBalance
      );
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
      pos.createdAtParaBlockHeight <=
        ctx.blocks[ctx.blocks.length - 1].header.height &&
      (pos.destroyedAtParaBlockHeight === null ||
        (!!pos.destroyedAtParaBlockHeight &&
          pos.destroyedAtParaBlockHeight >= ctx.blocks[0].header.height)) &&
      involvedAccountsInBatch.has(pos?.account?.id)
  );

  const allPersistentPositions = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPosition,
    {
      where: {
        account: { id: In(Array.from(involvedAccountsInBatch.values())) },
        createdAtParaBlockHeight: LessThanOrEqual(
          ctx.blocks[ctx.blocks.length - 1].header.height
        ),
        destroyedAtParaBlockHeight: Or(
          IsNull(),
          MoreThanOrEqual(ctx.blocks[0].header.height)
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

  /**
   * Sort events in DESC order to have the latest event in the first position
   * of the list.
   */
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
