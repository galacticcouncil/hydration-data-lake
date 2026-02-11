import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  XykYieldFarmDeposit,
  XykYieldFarmDepositEvent,
  XykYieldFarmEntry,
  YieldFarmDepositStatus,
} from '../../../../model';
import parsers from '../../../../parsers';
import { getOrCreateXykPool } from '../../../pools/pools/xykPool/xykPool';
import { getOrCreateAccount } from '../../../accounts';
import { getOrCreateAsset } from '../../../assets/asset';
import {
  AccountBalancesPerBlock,
  AccountPositionBalancesPerBlockPerAsset,
} from '../../../balances/accountTotalBalance';
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from 'typeorm';
import { BigNumber } from '@galacticcouncil/sdk';
import {
  XykpoolLMDepositData,
  XykpoolLMDepositDataWithId,
} from '../../../../parsers/types/storage/xykpoolLiquidityMining';
import { splitIntoBatches } from '../../../../utils/helpers';

export async function getOrCreateXykLiquidityMiningDeposit({
  depositId,
  ownerAccountId,
  initialAmount,
  lpTokenId,
  ensure = true,
  blockHeader,
  createdAtParaBlockHeight,
  ctx,
  noPanic = false,
  storageData,
}: {
  depositId: string;
  ownerAccountId?: string;
  initialAmount?: bigint;
  lpTokenId?: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  createdAtParaBlockHeight?: number;
  ctx: SqdProcessorContext<Store>;
  noPanic?: boolean;
  storageData?: XykpoolLMDepositDataWithId;
}) {
  if (!depositId) return null;

  let depositEntity: XykYieldFarmDeposit | null | undefined =
    ctx.batchState.state.xykYieldFarmDeposits.get(depositId);

  if (depositEntity) return depositEntity;

  depositEntity = await ctx.store.findOne(XykYieldFarmDeposit, {
    where: { id: depositId },
  });

  if (depositEntity) {
    ctx.batchState.state.xykYieldFarmDeposits.set(depositId, depositEntity);
    return depositEntity;
  }
  if (!ensure) return null;

  if (!blockHeader)
    throw Error(
      `getOrCreateXykLiquidityMiningDeposit :: blockHeader has not been provided`
    );

  try {
    const depositStorageData = storageData
      ? [storageData]
      : await parsers.storage.xykWarehouseLM.getXykpoolLMDeposits({
          depositIds: [depositId],
          block: blockHeader,
        });

    if (
      !depositStorageData ||
      depositStorageData.length === 0 ||
      !depositStorageData[0].data
    )
      throw Error(`Storage data for deposit ${depositId} cannot be found;`);

    const depositData = depositStorageData[0].data!;

    let depositOwnerAccountId = ownerAccountId;

    const nftCollectionId =
      parsers.storage.xykLiquidityMining.getNftCollectionIdConstant({
        block: blockHeader,
      });

    if (!depositOwnerAccountId) {
      const depositNftData = await parsers.storage.uniques.getAssetsData({
        collectionId: nftCollectionId.collectionId,
        assetIds: [depositId],
        block: blockHeader,
      });

      if (
        !depositNftData ||
        depositNftData.length === 0 ||
        !depositNftData[0].data
      ) {
        throw Error(`Details for deposit NFT ${depositId} cannot be found;`);
      }

      depositOwnerAccountId = depositNftData[0].data?.owner;
    }

    const xykpool = await getOrCreateXykPool({
      ctx,
      id: depositData.ammPoolId,
      blockHeader,
      ensure: true,
    });

    if (!xykpool)
      throw Error(`Xykpool with id ${depositData.ammPoolId} cannot be found;`);

    const lpAsset = await getOrCreateAsset({
      assetRegistryId: lpTokenId ?? xykpool.shareTokenId,
      ensure: true,
      ctx,
      blockHeader,
    });

    if (!lpAsset)
      throw Error(`LP Asset of Deposit ${depositId} cannot be found;`);

    const ownerAccount = await getOrCreateAccount({
      id: depositOwnerAccountId,
      ctx,
    });

    if (!ownerAccount)
      throw Error(`Account with id ${depositOwnerAccountId} cannot be found;`);

    /**
     * TODO - potentially should refactored to create XykYieldFarmDeposit entity
     * without ensuring Xykpool, Asset and Account entities to avoid dependencies
     * on these entities.
     */
    depositEntity = new XykYieldFarmDeposit({
      id: depositId,
      nftId: `${nftCollectionId.collectionId}-${depositId}`,
      xykpoolId: xykpool.id,
      accountId: depositOwnerAccountId,
      lpAssetId: lpAsset.id,
      initialAmount: initialAmount ?? depositData.shares,
      amount: depositData.shares,

      status: YieldFarmDepositStatus.SharesDeposited,
      entries: depositData.yieldFarmEntries.map(
        (entry) =>
          new XykYieldFarmEntry({
            id: `${depositId}-${entry.globalFarmId}-${entry.yieldFarmId}`,
            globalFarmId: entry.globalFarmId.toString(),
            yieldFarmId: entry.yieldFarmId.toString(),
            depositId: depositId,
            valuedShares: entry.valuedShares.toString(),
            accumulatedRpvs: entry.accumulatedRpvs.toString(),
            accumulatedClaimedRewards:
              entry.accumulatedClaimedRewards.toString(),
            enteredAtRelayBlock: entry.enteredAt.toString(),
            updatedAtRelayBlock: entry.updatedAt.toString(),
            stoppedAtCreation: entry.stoppedAtCreation.toString(),
          })
      ),

      createdAtParaBlockHeight: createdAtParaBlockHeight ?? blockHeader.height,
    });

    ctx.batchState.state.xykYieldFarmDeposits.set(
      depositEntity.id,
      depositEntity
    );

    await ctx.storeUtils.upsertWithBatches([depositEntity]);

    return depositEntity;
  } catch (e) {
    if (noPanic) return null;
    throw e;
  }
}

export function getNewXykLiquidityMiningDepositEvent({
  eventName,
  depositId,
  globalFarmId,
  yieldFarmId,
  lpAssetId,
  accountId,
  claimedAmount,
  rewardAssetId,
  amount,
  eventId,
  paraBlockHeight,
}: {
  eventName: YieldFarmDepositStatus;
  depositId: string;
  globalFarmId?: string;
  yieldFarmId?: string;
  lpAssetId: string;
  accountId: string;
  amount?: bigint;
  claimedAmount?: bigint;
  rewardAssetId?: string;

  eventId?: string;
  paraBlockHeight?: number;
}) {
  return new XykYieldFarmDepositEvent({
    id: `${depositId}-${eventId ?? paraBlockHeight}`,
    depositId,
    globalFarmId,
    yieldFarmId,
    eventName,
    accountId: accountId,
    lpAssetId,
    amount: amount ?? null,
    claimedAmount: claimedAmount ?? null,
    rewardAssetId: rewardAssetId ?? null,
    paraBlockHeight,
    eventId,
  });
}

export async function getXykLiquidityMiningDepositsForAccounts({
  involvedAccountsInBatch,
  involvedAccountsPerBlock,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  involvedAccountsPerBlock: Map<number, Set<string>>;
  ctx: SqdProcessorContext<Store>;
}) {
  const allCachedDeposits = Array.from(
    ctx.batchState.state.xykYieldFarmDeposits.values()
  ).filter(
    (deposit) =>
      deposit.createdAtParaBlockHeight <=
        ctx.blocks[ctx.blocks.length - 1].header.height &&
      (deposit.destroyedAtParaBlockHeight === null ||
        (!!deposit.destroyedAtParaBlockHeight &&
          deposit.destroyedAtParaBlockHeight >= ctx.blocks[0].header.height)) &&
      involvedAccountsInBatch.has(deposit?.accountId)
  );

  const allPersistentDeposits: XykYieldFarmDeposit[] = [];

  for (const accountIdsBatch of splitIntoBatches(
    Array.from(involvedAccountsInBatch.values()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const batchResponse = await ctx.storeUtils.findWithLogs(
      XykYieldFarmDeposit,
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
      allPersistentDeposits.push(responseItem);
    }
  }

  const allDepositsDeduped = new Map([
    ...allCachedDeposits.map((deposit): [string, XykYieldFarmDeposit] => [
      deposit.id,
      deposit,
    ]),
    ...allPersistentDeposits.map((deposit): [string, XykYieldFarmDeposit] => [
      deposit.id,
      deposit,
    ]),
  ]);

  const cachedDepositEvents = Array.from(
    ctx.batchState.state.xykYieldFarmDepositEvents.values()
  ).filter((e) => allDepositsDeduped.has(e.depositId));

  const persistentDepositEvents: XykYieldFarmDepositEvent[] = [];

  for (const depositIdsBatch of splitIntoBatches(
    Array.from(allDepositsDeduped.keys()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const batchResponse = await ctx.storeUtils.findWithLogs(
      XykYieldFarmDepositEvent,
      {
        where: {
          depositId: In(depositIdsBatch),
        },
      }
    );
    for (const responseItem of batchResponse) {
      persistentDepositEvents.push(responseItem);
    }
  }

  const allDepositEventsDeduped = new Map([
    ...cachedDepositEvents.map((e): [string, XykYieldFarmDepositEvent] => [
      e.id,
      e,
    ]),
    ...persistentDepositEvents.map((e): [string, XykYieldFarmDepositEvent] => [
      e.id,
      e,
    ]),
  ]);

  const eventsIndexedByDepositId = new Map<
    string,
    XykYieldFarmDepositEvent[]
  >();

  for (const event of allDepositEventsDeduped.values()) {
    if (!eventsIndexedByDepositId.has(event.depositId)) {
      eventsIndexedByDepositId.set(event.depositId, [event]);
      continue;
    }
    eventsIndexedByDepositId.get(event.depositId)?.push(event);
  }

  /**
   * Sort events in DESC order to have the latest event in the first position
   * of the list.
   */
  for (const [depositId, events] of eventsIndexedByDepositId.entries()) {
    eventsIndexedByDepositId.set(
      depositId,
      events.sort((a, b) => b.paraBlockHeight - a.paraBlockHeight)
    );
  }

  const allDepositsIndexedByAccountId = new Map<
    string,
    XykYieldFarmDeposit[]
  >();

  for (const deposit of allDepositsDeduped.values()) {
    if (!allDepositsIndexedByAccountId.has(deposit.accountId)) {
      allDepositsIndexedByAccountId.set(deposit.accountId, [deposit]);
      continue;
    }
    allDepositsIndexedByAccountId.get(deposit.accountId)?.push(deposit);
  }

  const accountDepositBalancesPerBlockPerAsset: AccountPositionBalancesPerBlockPerAsset =
    new Map();

  for (const [blockHeight, accountsSet] of involvedAccountsPerBlock.entries()) {
    if (!accountDepositBalancesPerBlockPerAsset.has(blockHeight))
      accountDepositBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountId of accountsSet.values()) {
      const accountActiveDepositsAtBlock =
        allDepositsIndexedByAccountId
          .get(accountId)
          ?.filter(
            (deposit) =>
              deposit.createdAtParaBlockHeight <= blockHeight &&
              (!deposit.destroyedAtParaBlockHeight ||
                (!!deposit.destroyedAtParaBlockHeight &&
                  deposit.destroyedAtParaBlockHeight > blockHeight))
          ) || [];

      for (const deposit of accountActiveDepositsAtBlock) {
        if (
          !accountDepositBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.has(accountId)
        )
          accountDepositBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.set(accountId, new Map());

        if (
          !accountDepositBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .has(deposit.lpAssetId)
        )
          accountDepositBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .set(deposit.lpAssetId, BigNumber(0));

        const currentBalance = accountDepositBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .get(deposit.lpAssetId)!;

        /**
         * Retrieves the deposit amount from the closest event at or before the target block.
         *
         * This is necessary because during batch processing, the deposit entity may already
         * reflect updates from later blocks (e.g., amount changes or deposit destruction).
         * To ensure historical accuracy, we must use the amount recorded in the event that
         * was closest to the block being processed, rather than the current deposit state.
         */
        const actualDepositAmountAtBlock: string =
          eventsIndexedByDepositId
            .get(deposit.id)!
            .find((e) => e.paraBlockHeight <= blockHeight)
            ?.amount?.toString() ?? '0';

        accountDepositBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .set(
            deposit.lpAssetId,
            currentBalance.plus(actualDepositAmountAtBlock)
          );
      }
    }
  }

  return accountDepositBalancesPerBlockPerAsset;
}
