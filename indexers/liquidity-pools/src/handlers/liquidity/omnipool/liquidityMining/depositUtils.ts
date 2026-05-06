import { SqdBlock, SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { XykpoolLMDepositDataWithId } from '../../../../parsers/types/storage/xykpoolLiquidityMining';
import {
  AccountLiquidityType,
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionEvent,
  OmnipoolYieldFarmDeposit,
  OmnipoolYieldFarmDepositEvent,
  OmnipoolYieldFarmEntry,
  YieldFarmDepositStatus,
} from '../../../../model';
import parsers from '../../../../parsers';
import { getOrCreateAsset } from '../../../assets/asset';
import { getOrCreateAccount } from '../../../accounts';
import { AccountPositionBalancesPerBlockPerAsset } from '../../../balances/accountTotalBalance';
import { In, IsNull, LessThanOrEqual, MoreThanOrEqual, Or } from 'typeorm';
import { splitIntoBatches } from '../../../../utils/helpers';
import { getOrCreateAccountLiquidityBalanceWithAmounts } from '../../../balances/accountLiquidityBalance';

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
  involvedAccountsPerBlock: Map<number, Set<string>>;
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

  const allPersistentDeposits: OmnipoolYieldFarmDeposit[] = [];

  for (const accountIdsBatch of splitIntoBatches(
    Array.from(involvedAccountsInBatch.values()),
    ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
  )) {
    const batchResponse = await ctx.storeUtils.findWithLogs(
      OmnipoolYieldFarmDeposit,
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
      },
      {
        className: 'OmnipoolYieldFarmDeposit',
        originCallFn: 'getOmnipoolLiquidityMiningDepositsForAccounts',
      }
    );

    for (const responseItem of batchResponse) {
      allPersistentDeposits.push(responseItem);
    }
  }

  const allDepositsDeduped = new Map([
    ...allCachedDeposits.map((deposit): [string, OmnipoolYieldFarmDeposit] => [
      deposit.id,
      deposit,
    ]),
    ...allPersistentDeposits.map(
      (deposit): [string, OmnipoolYieldFarmDeposit] => [deposit.id, deposit]
    ),
  ]);

  const allDepositsIndexedByPositionId = new Map<
    string,
    OmnipoolYieldFarmDeposit
  >();
  for (const deposit of allDepositsDeduped.values()) {
    allDepositsIndexedByPositionId.set(deposit.positionId, deposit);
  }

  /**
   * Collect Positions related with involved Deposits
   */

  const cachedDepositPositions = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositions.values()
  ).filter((p) => allDepositsIndexedByPositionId.has(p.id));

  const persistentDepositPositions = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPosition,
    {
      where: {
        id: In(Array.from(allDepositsIndexedByPositionId.keys())),
      },
    },
    {
      className: 'OmnipoolLiquidityPosition',
      originCallFn: 'getOmnipoolLiquidityMiningDepositsForAccounts',
    }
  );

  const allDepositPositionsDeduped = new Map([
    ...cachedDepositPositions.map((p): [string, OmnipoolLiquidityPosition] => [
      p.id,
      p,
    ]),
    ...persistentDepositPositions.map(
      (p): [string, OmnipoolLiquidityPosition] => [p.id, p]
    ),
  ]);

  const positionsIndexedByDepositId = new Map<
    string,
    OmnipoolLiquidityPosition
  >();

  for (const position of allDepositPositionsDeduped.values()) {
    const positionDeposit = allDepositsIndexedByPositionId.get(position.id);
    if (!positionDeposit) continue;
    positionsIndexedByDepositId.set(positionDeposit.id, position);
  }

  /**
   * Collect Position Events related with involved Deposits
   */

  /**
   * To aggregate deposited asset amounts, we need to use related to deposits
   * position events as deposit doesn't manipulate by asset amounts but only
   * position shares amount.
   */

  const cachedDepositPositionEvents = Array.from(
    ctx.batchState.state.omnipoolLiquidityPositionEvents.values()
  ).filter((e) => allDepositsIndexedByPositionId.has(e.position.id));

  const persistentDepositPositionEvents = await ctx.storeUtils.findWithLogs(
    OmnipoolLiquidityPositionEvent,
    {
      where: {
        position: {
          id: In(Array.from(allDepositsIndexedByPositionId.keys())),
        },
      },
      relations: {
        position: true,
      },
    },
    {
      className: 'OmnipoolLiquidityPositionEvent',
      originCallFn: 'getOmnipoolLiquidityMiningDepositsForAccounts',
    }
  );

  const allDepositPositionEventsDeduped = new Map([
    ...cachedDepositPositionEvents.map(
      (e): [string, OmnipoolLiquidityPositionEvent] => [e.id, e]
    ),
    ...persistentDepositPositionEvents.map(
      (e): [string, OmnipoolLiquidityPositionEvent] => [e.id, e]
    ),
  ]);

  /**
   * IMPORTANT:
   * positionEventsIndexedByDepositId contains OmnipoolLiquidityPositionEvent
   */
  const positionEventsIndexedByDepositId = new Map<
    string,
    OmnipoolLiquidityPositionEvent[]
  >();

  for (const event of allDepositPositionEventsDeduped.values()) {
    const positionDeposit = allDepositsIndexedByPositionId.get(
      event.position.id
    );
    if (!positionDeposit) continue;
    if (!positionEventsIndexedByDepositId.has(positionDeposit.id)) {
      positionEventsIndexedByDepositId.set(positionDeposit.id, [event]);
      continue;
    }
    positionEventsIndexedByDepositId.get(positionDeposit.id)?.push(event);
  }

  /**
   * Sort events in DESC order to have the latest event in the first position
   * of the list.
   */
  for (const [
    depositId,
    events,
  ] of positionEventsIndexedByDepositId.entries()) {
    positionEventsIndexedByDepositId.set(
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

  for (const [blockHeight, accountsSet] of involvedAccountsPerBlock.entries()) {
    if (!accountDepositBalancesPerBlockPerAsset.has(blockHeight))
      accountDepositBalancesPerBlockPerAsset.set(blockHeight, {
        blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
        data: new Map(),
      });

    for (const accountIdsBatch of splitIntoBatches(
      Array.from(accountsSet.values()),
      ctx.appConfig.concurrency.BD_FETCH_BATCH_SIZE
    )) {
      for (const accountId of accountIdsBatch) {
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
          /**
           * Retrieves the deposit amount from the closest event at or before the target block.
           *
           * This is necessary because during batch processing, the deposit entity may already
           * reflect updates from later blocks (e.g., amount changes or deposit destruction).
           * To ensure historical accuracy, we must use the amount recorded in the event that
           * was closest to the block being processed, rather than the current deposit state.
           */

          const latestPositionEvent = positionEventsIndexedByDepositId
            .get(deposit.id)
            ?.find((e) => e.paraBlockHeight <= blockHeight);

          const position = positionsIndexedByDepositId.get(deposit.id);

          if (!position) continue;

          const liquidityBalanceEntity =
            await getOrCreateAccountLiquidityBalanceWithAmounts({
              accountId,
              assetId: position.assetId,
              position,
              depositId: deposit.id,
              actualAssetAmount: latestPositionEvent?.amount ?? 0n,
              actualSharesAmount: latestPositionEvent?.sharesAmount ?? 0n,
              actualPrice: latestPositionEvent?.price ?? 0n,
              liquidityType: AccountLiquidityType.OmnipoolDeposit,
              ctx,
              blockHeader:
                ctx.batchState.getBlockHeaderByBlockHeight(blockHeight),
            });

          ctx.batchState.state.accountLiquidityBalanceHistoricalData.set(
            liquidityBalanceEntity.id,
            liquidityBalanceEntity
          );
        }
      }
    }
  }

  return {
    accountDepositBalancesPerBlockPerAsset,
    allDepositsInvolvedInBatch: Array.from(allDepositsDeduped.values()),
  };
}
