import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  UniquesTransferredData,
  XykLMDepositDestroyedData,
  XykLMSharesDepositedData,
} from '../../../../parsers/batchBlocksParser/types';
import {
  getNewXykLiquidityMiningDepositEvent,
  getOrCreateXykLiquidityMiningDeposit,
} from './depositsUtils';
import { XykYieldFarmDeposit, YieldFarmDepositStatus } from '../../../../model';
import parsers from '../../../../parsers';
import { XykpoolLMDepositData } from '../../../../parsers/types/storage/xykpoolLiquidityMining';
import { UniquesAssetData } from '../../../../parsers/types/storage/uniques';

export async function handleXylpoolLMSharesDeposited(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykLMSharesDepositedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const depositEntity = await getOrCreateXykLiquidityMiningDeposit({
    depositId: eventParams.depositId.toString(),
    ownerAccountId: eventParams.who,
    initialAmount: eventParams.amount,
    lpTokenId: `${eventParams.lpToken}`,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
    ctx,
  });

  if (!depositEntity) {
    console.log(`Deposit ${eventParams.depositId} not found`);
    return;
  }

  const depositEvent = getNewXykLiquidityMiningDepositEvent({
    eventName: YieldFarmDepositStatus.SharesDeposited,
    depositId: eventParams.depositId.toString(),
    globalFarmId: eventParams.globalFarmId.toString(),
    yieldFarmId: eventParams.yieldFarmId.toString(),
    lpAssetId: eventParams.lpToken.toString(),
    accountId: eventParams.who,
    amount: eventParams.amount,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  depositEntity.amount = eventParams.amount;

  ctx.batchState.state.xykYieldFarmDepositEvents.set(
    depositEvent.id,
    depositEvent
  );

  ctx.batchState.state.xykYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );
}

export async function handleXylpoolLMDepositDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: XykLMDepositDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const depositEntity = await getOrCreateXykLiquidityMiningDeposit({
    depositId: eventParams.depositId.toString(),
    ownerAccountId: eventParams.who,
    blockHeader: eventMetadata.blockHeader,
    ctx,
    noPanic: true,
  });

  if (!depositEntity) return;

  const depositEvent = getNewXykLiquidityMiningDepositEvent({
    eventName: YieldFarmDepositStatus.DepositDestroyed,
    depositId: eventParams.depositId.toString(),
    lpAssetId: depositEntity.lpAssetId,
    accountId: eventParams.who,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  depositEntity.status = YieldFarmDepositStatus.DepositDestroyed;
  depositEntity.destroyedAtParaBlockHeight = eventMetadata.blockHeader.height;

  ctx.batchState.state.xykYieldFarmDepositEvents.set(
    depositEvent.id,
    depositEvent
  );

  ctx.batchState.state.xykYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );
}

/**
 * Function to initialize XYK Liquidity Mining Deposits on cold start of indexer.
 * It's required to have correct users total balances.
 * @param ctx
 */
export async function initAllXykLiquidityMiningDeposits(
  ctx: SqdProcessorContext<Store>
) {
  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    XykYieldFarmDeposit,
    {
      where: {},
      order: {
        createdAtParaBlockHeight: 'DESC',
      },
    },
    {
      className: 'XykYieldFarmDeposit',
      originCallFn: 'initAllXykLiquidityMiningDeposits',
    }
  );

  if (hasAnyRecord) return;

  const blockToProcess = ctx.blocks[0];

  const xykLMNftCollectionId =
    parsers.storage.xykLiquidityMining.getNftCollectionIdConstant({
      block: blockToProcess.header,
    });

  if (!xykLMNftCollectionId) {
    console.log(`XYK LM NFT collection ID can not be foud`);
    return;
  }

  const [allNftsWithOwners, allExistingDeposits] = await Promise.all([
    parsers.storage.uniques.getAllAssetsData({
      collectionId: xykLMNftCollectionId.collectionId,
      block: blockToProcess.header,
    }),
    parsers.storage.xykWarehouseLM.getAllDepositsData({
      block: blockToProcess.header,
    }),
  ]);

  if (!allNftsWithOwners) {
    console.log(`All XYK LM Uniques can not be found`);
    return;
  }

  if (!allExistingDeposits) {
    console.log(`All XYK LM Deposits can not be found`);
    return;
  }

  const allExistingDepositsIndexedByDepositId: Map<
    string,
    XykpoolLMDepositData
  > = new Map();

  for (const { depositId, data } of allExistingDeposits) {
    if (!data) continue;
    allExistingDepositsIndexedByDepositId.set(depositId, data);
  }

  const allNftsWithOwnersIndexedById: Map<string, UniquesAssetData> = new Map();

  for (const { assetId, data } of allNftsWithOwners) {
    if (!data) continue;
    allNftsWithOwnersIndexedById.set(assetId, data);
  }

  for (const depositStorageData of allExistingDeposits) {
    const deposit = await getOrCreateXykLiquidityMiningDeposit({
      depositId: depositStorageData.depositId,
      ownerAccountId:
        allNftsWithOwnersIndexedById.get(depositStorageData.depositId)?.owner ??
        undefined,
      createdAtParaBlockHeight: blockToProcess.header.height,
      ensure: true,
      blockHeader: blockToProcess.header,
      ctx,
      noPanic: true,
      storageData: depositStorageData,
    });

    if (!deposit) continue;

    const depositEvent = getNewXykLiquidityMiningDepositEvent({
      eventName: YieldFarmDepositStatus.SharesDeposited,
      depositId: deposit.id,
      globalFarmId:
        depositStorageData.data?.yieldFarmEntries[0].globalFarmId.toString(),
      yieldFarmId:
        depositStorageData.data?.yieldFarmEntries[0].yieldFarmId.toString(),
      lpAssetId: deposit.lpAssetId,
      accountId: deposit.accountId,
      amount: deposit.amount,
      paraBlockHeight: blockToProcess.header.height,
    });

    ctx.batchState.state.xykYieldFarmDepositEvents.set(
      depositEvent.id,
      depositEvent
    );
  }

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.xykYieldFarmDepositEvents.values())
  );
}

export async function handleXykLMDepositTransferred(
  ctx: SqdProcessorContext<Store>,
  eventCallData: UniquesTransferredData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { item, from, to } = eventParams;

  const depositEntity = await getOrCreateXykLiquidityMiningDeposit({
    depositId: item,
    ownerAccountId: from,
    blockHeader: eventMetadata.blockHeader,
    ctx,
    noPanic: true,
  });

  if (!depositEntity) return;

  depositEntity.accountId = to;

  ctx.batchState.state.xykYieldFarmDeposits.set(
    depositEntity.id,
    depositEntity
  );
  await ctx.storeUtils.upsertWithBatches([depositEntity]);
}
