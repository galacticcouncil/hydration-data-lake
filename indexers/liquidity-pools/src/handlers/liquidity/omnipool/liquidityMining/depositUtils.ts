import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { XykpoolLMDepositDataWithId } from '../../../../parsers/types/storage/xykpoolLiquidityMining';
import {
  OmnipoolYieldFarmDeposit,
  OmnipoolYieldFarmDepositEvent,
  OmnipoolYieldFarmEntry,
  YieldFarmDepositStatus,
} from '../../../../model';
import parsers from '../../../../parsers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateAccount } from '../../../accounts';
import {
  AccountBalancesPerBlock,
  AccountPositionBalancesPerBlockPerAsset,
} from '../../../balances/accountTotalBalance';
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from 'typeorm';
import { BigNumber } from '@galacticcouncil/sdk';

export async function getOrCreateOmnipoolLiquidityMiningDeposit({
  depositId,
  ownerAccountId,
  initialAmount,
  positionId,
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
  positionId?: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  createdAtParaBlockHeight?: number;
  ctx: SqdProcessorContext<Store>;
  noPanic?: boolean;
  storageData?: XykpoolLMDepositDataWithId;
}) {
  if (!depositId) return null;

  let depositEntity: OmnipoolYieldFarmDeposit | null | undefined =
    ctx.batchState.state.omnipoolYieldFarmDeposits.get(depositId);

  if (depositEntity) return depositEntity;

  depositEntity = await ctx.store.findOne(OmnipoolYieldFarmDeposit, {
    where: { id: depositId },
  });

  if (depositEntity) {
    ctx.batchState.state.omnipoolYieldFarmDeposits.set(
      depositId,
      depositEntity
    );
    return depositEntity;
  }
  if (!ensure) return null;

  if (!blockHeader)
    throw Error(
      `getOrCreateOmnipoolLiquidityMiningDeposit :: blockHeader has not been provided`
    );

  try {
    const depositStorageData = storageData
      ? [storageData]
      : await parsers.storage.omnipoolWarehouseLM.getLMDepositsData({
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
      parsers.storage.omnipoolLiquidityMining.getNftCollectionIdConstant({
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

    const relatedPositionId =
      positionId ??
      (
        await parsers.storage.omnipoolLiquidityMining.getOmniPositionId({
          depositId,
          block: blockHeader,
        })
      )?.positionId;

    if (!relatedPositionId)
      throw Error(`Position id for deposit ${depositId} cannot be found;`);

    const asset = await getOrCreateAsset({
      ctx,
      assetRegistryId: depositData.ammPoolId,
      blockHeader,
      ensure: true,
    });

    if (!asset)
      throw Error(`Asset with id ${depositData.ammPoolId} cannot be found;`);

    const ownerAccount = await getOrCreateAccount({
      id: depositOwnerAccountId,
      ctx,
    });

    if (!ownerAccount)
      throw Error(`Account with id ${depositOwnerAccountId} cannot be found;`);

    depositEntity = new OmnipoolYieldFarmDeposit({
      id: depositId,
      nftId: `${nftCollectionId.collectionId}-${depositId}`,
      positionId: relatedPositionId,
      accountId: depositOwnerAccountId,
      assetId: asset.id,
      initialSharesAmount: initialAmount ?? depositData.shares,
      sharesAmount: depositData.shares,

      status: YieldFarmDepositStatus.SharesDeposited,
      entries: depositData.yieldFarmEntries.map(
        (entry) =>
          new OmnipoolYieldFarmEntry({
            id: `${depositId}-${entry.globalFarmId}-${entry.yieldFarmId}`,
            globalFarmId: entry.globalFarmId.toString(),
            yieldFarmId: entry.yieldFarmId.toString(),
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

    ctx.batchState.state.omnipoolYieldFarmDeposits.set(
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

export function getNewOmnipoolLiquidityMiningDepositEvent({
  eventName,
  depositId,
  globalFarmId,
  yieldFarmId,
  assetId,
  accountId,
  claimedAmount,
  rewardAssetId,
  sharesAmount,
  eventId,
  paraBlockHeight,
}: {
  eventName: YieldFarmDepositStatus;
  depositId: string;
  globalFarmId?: string;
  yieldFarmId?: string;
  assetId?: string;
  accountId: string;
  sharesAmount?: bigint;
  claimedAmount?: bigint;
  rewardAssetId?: string;
  eventId?: string;
  paraBlockHeight?: number;
}) {
  return new OmnipoolYieldFarmDepositEvent({
    id: `${depositId}-${eventId ?? paraBlockHeight}`,
    depositId,
    globalFarmId,
    yieldFarmId,
    eventName,
    accountId,
    assetId,
    sharesAmount: sharesAmount ?? null,
    claimedAmount: claimedAmount ?? null,
    rewardAssetId: rewardAssetId ?? null,
    paraBlockHeight,
    eventId,
  });
}

export async function getOmnipoolLiquidityMiningDepositsForAccounts({
  involvedAccountsInBatch,
  involvedAccountsPerBlock,
  ctx,
}: {
  involvedAccountsInBatch: Set<string>;
  involvedAccountsPerBlock: AccountBalancesPerBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const allCachedDeposits = Array.from(
    ctx.batchState.state.omnipoolYieldFarmDeposits.values()
  ).filter(
    (deposit) =>
      deposit.createdAtParaBlockHeight <=
        ctx.blocks[ctx.blocks.length - 1].header.height &&
      (deposit.destroyedAtParaBlockHeight === null ||
        (!!deposit.destroyedAtParaBlockHeight &&
          deposit.destroyedAtParaBlockHeight >= ctx.blocks[0].header.height)) &&
      involvedAccountsInBatch.has(deposit?.accountId)
  );

  const allPersistentDeposits = await ctx.storeUtils.findWithLogs(
    OmnipoolYieldFarmDeposit,
    {
      where: {
        accountId: In(Array.from(involvedAccountsInBatch.values())),
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

  const allDepositsDeduped = new Map([
    ...allCachedDeposits.map((deposit): [string, OmnipoolYieldFarmDeposit] => [
      deposit.id,
      deposit,
    ]),
    ...allPersistentDeposits.map(
      (deposit): [string, OmnipoolYieldFarmDeposit] => [deposit.id, deposit]
    ),
  ]);

  const cachedDepositEvents = Array.from(
    ctx.batchState.state.omnipoolYieldFarmDepositEvents.values()
  ).filter((e) => allDepositsDeduped.has(e.depositId));

  const persistentDepositEvents = await ctx.storeUtils.findWithLogs(
    OmnipoolYieldFarmDepositEvent,
    {
      where: {
        depositId: In(Array.from(allDepositsDeduped.keys())),
      },
    }
  );

  const allDepositEventsDeduped = new Map([
    ...cachedDepositEvents.map((e): [string, OmnipoolYieldFarmDepositEvent] => [
      e.id,
      e,
    ]),
    ...persistentDepositEvents.map(
      (e): [string, OmnipoolYieldFarmDepositEvent] => [e.id, e]
    ),
  ]);

  const eventsIndexedByDepositId = new Map<
    string,
    OmnipoolYieldFarmDepositEvent[]
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
    OmnipoolYieldFarmDeposit[]
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

  for (const [blockHeight, { data }] of involvedAccountsPerBlock.entries()) {
    if (!accountDepositBalancesPerBlockPerAsset.has(blockHeight))
      accountDepositBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountId of data.keys()) {
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

      for (const position of accountActiveDepositsAtBlock) {
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
            .has(position.assetId)
        )
          accountDepositBalancesPerBlockPerAsset
            .get(blockHeight)!
            .data.get(accountId)!
            .set(position.assetId, BigNumber(0));

        const currentBalance = accountDepositBalancesPerBlockPerAsset
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
          eventsIndexedByDepositId
            .get(position.id)!
            .find((e) => e.paraBlockHeight <= blockHeight)
            ?.sharesAmount?.toString() ?? '0';

        accountDepositBalancesPerBlockPerAsset
          .get(blockHeight)!
          .data.get(accountId)!
          .set(
            position.assetId,
            currentBalance.plus(actualPositionAmountAtBlock)
          );
      }
    }
  }

  return accountDepositBalancesPerBlockPerAsset;
}
