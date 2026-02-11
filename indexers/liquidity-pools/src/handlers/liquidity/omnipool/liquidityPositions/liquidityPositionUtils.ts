import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
  OmnipoolLiquidityPositionStatus,
  OmnipoolYieldFarmDeposit,
} from '../../../../model';
import parsers from '../../../../parsers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateAccount } from '../../../accounts';
import { getOrCreateOmnipoolAsset } from '../../../pools/pools/omnipool/omnipoolAssets';
import {
  AccountBalancesPerBlock,
  AccountPositionBalancesPerBlockPerAsset,
} from '../../../balances/accountTotalBalance';
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from 'typeorm';
import { BigNumber } from '@galacticcouncil/sdk';
import { splitIntoBatches } from '../../../../utils/helpers';

export async function getNewOmnipoolLiquidityPosition({
  positionId,
  assetId,
  ownerAccountId,
  amount,
  sharesAmount,
  initialAmount,
  price,
  ctx,
  blockHeader,
  eventId = null,
  noPanic = false,
}: {
  positionId: string;
  assetId?: string;
  initialAmount?: bigint;
  amount?: bigint;
  sharesAmount?: bigint;
  price?: bigint;
  ownerAccountId?: string;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  eventId?: string | null;
  noPanic?: boolean;
}) {
  try {
    if (!blockHeader)
      throw Error(
        `getNewOmnipoolLiquidityPosition :: blockHeader has not been provided`
      );

    const positionData = {
      assetId,
      ownerAccountId,
      amount,
      initialAmount,
      sharesAmount,
      price,
    };

    if (!assetId || !amount || !sharesAmount || !price) {
      const positionStorageData =
        await parsers.storage.omnipool.getOmnipoolLiquidityPositions({
          positionIds: [positionId],
          block: blockHeader,
        });

      if (
        !positionStorageData ||
        !positionStorageData[0] ||
        !positionStorageData[0].data
      )
        throw Error(`Storage data for position ${positionId} cannot be found;`);

      const data = positionStorageData[0].data!;

      const asset = await getOrCreateAsset({
        assetRegistryId: data.assetId,
        ctx,
        blockHeader,
        ensure: true,
      });

      if (!asset) {
        throw Error(
          `getNewOmnipoolLiquidityPosition :: asset with id ${data.assetId} cannot be found;`
        );
      }

      positionData.price = data.price;
      positionData.amount = data.amount;
      positionData.assetId = asset.id;
      positionData.sharesAmount = data.shares;
    }

    const nftCollectionId = parsers.storage.omnipool.getNftCollectionIdConstant(
      {
        block: blockHeader,
      }
    );

    if (!ownerAccountId) {
      const positionNftDetails = await parsers.storage.uniques.getAssetsData({
        collectionId: `${nftCollectionId.collectionId}`,
        assetIds: [positionId],
        block: blockHeader,
      });

      if (
        !positionNftDetails ||
        !positionNftDetails[0] ||
        !positionNftDetails[0].data
      ) {
        throw Error(`Details for position NFT ${positionId} cannot be found;`);
      }

      const account = await getOrCreateAccount({
        id: positionNftDetails[0].data?.owner,
        ctx,
      });

      if (!account) {
        throw Error(
          `Account with id ${positionNftDetails[0].data?.owner} cannot be found;`
        );
      }
      positionData.ownerAccountId = account.id;
    }

    const omnipoolAsset = await getOrCreateOmnipoolAsset({
      ctx,
      blockHeader,
      ensure: true,
      assetId: positionData.assetId,
    });

    if (!omnipoolAsset) {
      throw Error(
        `Omnipool Asset with Asset id ${positionData.assetId} cannot be found;`
      );
    }

    const ownerAccount = await getOrCreateAccount({
      id: positionData.ownerAccountId!,
      ctx,
    });

    if (!ownerAccount) {
      throw Error(
        `Owner Account ${positionData.ownerAccountId} cannot be found.`
      );
    }

    const positionEntity = new OmnipoolLiquidityPosition({
      id: positionId,

      accountId: ownerAccount.id,
      assetId: positionData.assetId,
      omnipoolAssetId: omnipoolAsset.id,

      initialAmount: positionData.initialAmount ?? positionData.amount,
      amount: positionData.amount,
      sharesAmount: positionData.sharesAmount,
      nftId: `${nftCollectionId.collectionId}-${positionId}`,
      price: positionData.price ?? null,

      status: OmnipoolLiquidityPositionStatus.PositionCreated,

      createdAtParaBlockHeight: blockHeader.height,
      eventId,
    });

    return positionEntity;
  } catch (e) {
    if (noPanic) return null;
    throw e;
  }
}

export async function getOrCreateOmnipoolLiquidityPosition({
  positionId,
  ensure = false,
  blockHeader,
  ctx,
  noPanic = false,
}: {
  positionId: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  noPanic?: boolean;
}) {
  if (!positionId) return null;

  let positionEntity: OmnipoolLiquidityPosition | null | undefined =
    ctx.batchState.state.omnipoolLiquidityPositions.get(positionId);

  if (positionEntity) return positionEntity;

  positionEntity = await ctx.store.findOne(OmnipoolLiquidityPosition, {
    where: { id: positionId },
  });

  if (positionEntity) {
    ctx.batchState.state.omnipoolLiquidityPositions.set(
      positionId,
      positionEntity
    );
    return positionEntity;
  }
  if (!ensure) return null;

  if (!blockHeader) {
    throw Error(
      `getOrCreateOmnipoolLiquidityPosition :: blockHeader has not been provided`
    );
  }

  try {
    positionEntity = await getNewOmnipoolLiquidityPosition({
      positionId,
      ctx,
      blockHeader,
    });

    if (!positionEntity) return null;

    ctx.batchState.state.omnipoolLiquidityPositions.set(
      positionEntity.id,
      positionEntity
    );
    await ctx.store.upsert(positionEntity);
  } catch (e) {
    if (noPanic) return null;
    throw e;
  }

  return positionEntity;
}

export async function getNewOmnipoolLiquidityPositionEvent({
  eventName,
  position,
  assetId,
  ownerAccountId,
  amount,
  sharesAmount,
  price,
  ctx,
  eventId,
  paraBlockHeight,
}: {
  eventName: OmnipoolLiquidityPositionStatus;
  position: OmnipoolLiquidityPosition;
  assetId: string;
  amount?: bigint;
  sharesAmount?: bigint;
  price?: bigint;
  ownerAccountId: string;
  eventId: string;
  paraBlockHeight: number;
  ctx: SqdProcessorContext<Store>;
}) {
  return new OmnipoolLiquidityPositionEvent({
    id: `${position.id}-${eventId}`,
    position,
    eventName,
    accountId: ownerAccountId,
    assetId,
    amount: amount ?? null,
    sharesAmount: sharesAmount ?? null,
    price: price ?? null,
    paraBlockHeight,
    eventId,
  });
}

export async function getOmnipoolLiquidityPositionsForAccounts({
  involvedAccountsInBatch,
  involvedAccountsPerBlock,
  allDepositsInvolvedInBatch,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  involvedAccountsPerBlock: Map<number, Set<string>>;
  allDepositsInvolvedInBatch: OmnipoolYieldFarmDeposit[];
  ctx: SqdProcessorContext<Store>;
}) {
  const allDepositsInvolvedInBatchIndexedByAccountId: Map<
    string,
    OmnipoolYieldFarmDeposit[]
  > = new Map();

  for (const dep of allDepositsInvolvedInBatch) {
    if (!allDepositsInvolvedInBatchIndexedByAccountId.has(dep.accountId)) {
      allDepositsInvolvedInBatchIndexedByAccountId.set(dep.accountId, []);
    }
    allDepositsInvolvedInBatchIndexedByAccountId.get(dep.accountId)?.push(dep);
  }

  const allCachedPositions = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositions.values()
  ).filter(
    (pos) =>
      pos.createdAtParaBlockHeight <=
        ctx.blocks[ctx.blocks.length - 1].header.height &&
      (pos.destroyedAtParaBlockHeight === null ||
        (!!pos.destroyedAtParaBlockHeight &&
          pos.destroyedAtParaBlockHeight >= ctx.blocks[0].header.height)) &&
      involvedAccountsInBatch.has(pos?.accountId)
  );

  const allPersistentPositions: OmnipoolLiquidityPosition[] = [];

  for (const accountIdsBatch of splitIntoBatches(
    Array.from(involvedAccountsInBatch.values()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const batchResponse = await ctx.storeUtils.findWithLogs(
      OmnipoolLiquidityPosition,
      {
        where: {
          accountId: In(accountIdsBatch),
          createdAtParaBlockHeight: LessThanOrEqual(
            ctx.blocks[ctx.blocks.length - 1].header.height
          ),
          destroyedAtParaBlockHeight: Or(
            IsNull(),
            MoreThanOrEqual(ctx.blocks[0].header.height)
          ),
        },
      }
    );

    for (const responseItem of batchResponse) {
      allPersistentPositions.push(responseItem);
    }
  }

  const allPositionsDeduped = new Map([
    ...allPersistentPositions.map(
      (pos): [string, OmnipoolLiquidityPosition] => [pos.id, pos]
    ),
    ...allCachedPositions.map((pos): [string, OmnipoolLiquidityPosition] => [
      pos.id,
      pos,
    ]),
  ]);

  const cachedPositionEvents = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositionEvents.values()
  ).filter((e) => allPositionsDeduped.has(e.position.id));

  const persistentPositionEvents: OmnipoolLiquidityPositionEvent[] = [];

  for (const positionIdsBatch of splitIntoBatches(
    Array.from(allPositionsDeduped.keys()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const batchResponse = await ctx.storeUtils.findWithLogs(
      OmnipoolLiquidityPositionEvent,
      {
        where: {
          position: { id: In(positionIdsBatch) },
        },
        relations: {
          position: true,
        },
      }
    );

    for (const responseItem of batchResponse) {
      persistentPositionEvents.push(responseItem);
    }
  }

  const allPositionEventsDeduped = new Map([
    ...persistentPositionEvents.map(
      (e): [string, OmnipoolLiquidityPositionEvent] => [e.id, e]
    ),
    ...cachedPositionEvents.map(
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
    if (!allPositionsIndexedByAccountId.has(position.accountId)) {
      allPositionsIndexedByAccountId.set(position.accountId, [position]);
      continue;
    }
    allPositionsIndexedByAccountId.get(position.accountId)?.push(position);
  }

  const accountPositionBalancesPerBlockPerAsset: AccountPositionBalancesPerBlockPerAsset =
    new Map();

  for (const [blockHeight, accountsSet] of involvedAccountsPerBlock.entries()) {
    if (!accountPositionBalancesPerBlockPerAsset.has(blockHeight))
      accountPositionBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountId of accountsSet.values()) {
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

      const accountActivePositionsAtBlockWithoutDeposits = [];

      for (const position of accountActivePositionsAtBlock) {
        const activeDepositAtBlock =
          allDepositsInvolvedInBatchIndexedByAccountId
            .get(accountId)
            ?.find(
              (dep) =>
                dep.positionId === position.id &&
                dep.createdAtParaBlockHeight >=
                  position.createdAtParaBlockHeight &&
                (!dep.destroyedAtParaBlockHeight ||
                  (!!dep.destroyedAtParaBlockHeight &&
                    dep.destroyedAtParaBlockHeight > blockHeight))
            );

        if (!activeDepositAtBlock)
          accountActivePositionsAtBlockWithoutDeposits.push(position);
      }

      for (const position of accountActivePositionsAtBlockWithoutDeposits) {
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
            .get(position.id)
            ?.find((e) => e.paraBlockHeight <= blockHeight)
            ?.amount?.toString() ??
          position?.amount.toString() ??
          '0';

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
