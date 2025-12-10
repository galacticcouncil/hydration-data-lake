import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLiquidityAddedData,
  OmnipoolLiquidityRemovedData,
  OmnipoolPositionCreatedData,
  OmnipoolPositionDestroyedData,
  OmnipoolPositionUpdatedData,
} from '../../../../parsers/batchBlocksParser/types';
import {
  getNewOmnipoolLiquidityPosition,
  getNewOmnipoolLiquidityPositionEvent,
  getOrCreateOmnipoolLiquidityPosition,
} from './liquidityPositionUtils';
import { getOrCreateAsset } from '../../../assets/asset';
import {
  OmnipoolLiquidityPosition,
  OmnipoolLiquidityPositionStatus,
  XykYieldFarmDeposit,
  YieldFarmDepositStatus,
} from '../../../../model';
import parsers from '../../../../parsers';
import { XykpoolLMDepositData } from '../../../../parsers/types/storage/xykpoolLiquidityMining';
import { UniquesAssetData } from '../../../../parsers/types/storage/uniques';
import {
  getNewXykLiquidityMiningDepositEvent,
  getOrCreateXykLiquidityMiningDeposit,
} from '../../xykpool/liquidityMining/depositsUtils';
import pMap from 'p-map';

export async function handleOmnipoolLiquidityPositionCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner, asset, amount, shares, price } = eventParams;

  const assetEntity = await getOrCreateAsset({
    assetRegistryId: asset,
    ctx,
    blockHeader: eventMetadata.blockHeader,
    ensure: true,
  });

  if (!assetEntity) {
    throw Error(
      `handleOmnipoolLiquidityPositionCreated :: asset with id ${assetEntity} cannot be found;`
    );
  }

  const positionEntity = await getNewOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ownerAccountId: owner,
    assetId: assetEntity.id,
    amount,
    initialAmount: amount,
    sharesAmount: shares,
    price,
    ctx,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!positionEntity) throw Error(`Position ${positionId} cannot be created`);

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionCreated,
    position: positionEntity,
    assetId: positionEntity.assetId,
    ownerAccountId: owner,
    amount,
    sharesAmount: shares,
    price,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  ctx.batchState.state.omnipoolLiquidityPositions.set(
    positionEntity.id,
    positionEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );
}

export async function handleOmnipoolLiquidityPositionUpdated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner, asset, amount, shares, price } = eventParams;

  const position = await getOrCreateOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!position) throw Error(`Position ${positionId} not found`);

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionUpdated,
    position,
    assetId: position.assetId,
    ownerAccountId: owner,
    amount,
    sharesAmount: shares,
    price,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  position.amount = amount;
  position.sharesAmount = shares;
  position.price = price;

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositions.set(position.id, position);
}

export async function handleOmnipoolLiquidityPositionDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolPositionDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { positionId, owner } = eventParams;

  const position = await getOrCreateOmnipoolLiquidityPosition({
    positionId: positionId.toString(),
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
  });

  if (!position) return;

  const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
    eventName: OmnipoolLiquidityPositionStatus.PositionDestroyed,
    position,
    assetId: position.assetId,
    ownerAccountId: owner,
    ctx,
    eventId: eventMetadata.id,
    paraBlockHeight: eventMetadata.blockHeader.height,
  });

  position.status = OmnipoolLiquidityPositionStatus.PositionDestroyed;
  position.destroyedAtParaBlockHeight = eventMetadata.blockHeader.height;

  ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
    eventEntity.id,
    eventEntity
  );

  ctx.batchState.state.omnipoolLiquidityPositions.set(position.id, position);
}

export async function handleOmnipoolLiquidityAdded(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLiquidityAddedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLiquidityRemoved(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLiquidityRemovedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

/**
 * Function to initialize Omnipool Liquidity Positions on cold start of indexer.
 * It's required to have correct user's total balances.
 * @param ctx
 */
export async function initAllOmnipoolLiquidityPositions(
  ctx: SqdProcessorContext<Store>
) {
  const hasAnyRecord = await ctx.storeUtils.findOneWithLogs(
    OmnipoolLiquidityPosition,
    {
      where: {},
      order: {
        createdAtParaBlockHeight: 'DESC',
      },
    },
    { className: 'OmnipoolLiquidityPosition' }
  );

  if (hasAnyRecord) return;

  const blockToProcess = ctx.blocks[0];
  //
  // const omnipoolLMNftCollectionId =
  //   parsers.storage.omnipool.getNftCollectionIdConstant({
  //     block: blockToProcess.header,
  //   });
  // const omnipoolLMDepositsNftCollectionId =
  //   parsers.storage.omnipoolLiquidityMining.getNftCollectionIdConstant({
  //     block: blockToProcess.header,
  //   });
  //
  // if (!omnipoolLMNftCollectionId) {
  //   console.log(`Omnipool LM NFT collection ID can not be foud`);
  // }
  //
  // console.log(
  //   'omnipoolLMNftCollectionId.collectionId - ',
  //   omnipoolLMNftCollectionId.collectionId
  // );
  // console.log(
  //   'omnipoolLMDepositsNftCollectionId.collectionId - ',
  //   omnipoolLMDepositsNftCollectionId.collectionId
  // );
  //
  // const [
  //   allPositionNftsWithOwners,
  //   allDepositsNftsWithOwners,
  //   allExistingDeposits,
  // ] = await Promise.all([
  //   parsers.storage.uniques.getAllAssetsData({
  //     collectionId: omnipoolLMNftCollectionId.collectionId,
  //     block: blockToProcess.header,
  //   }),
  //   parsers.storage.uniques.getAllAssetsData({
  //     collectionId: omnipoolLMDepositsNftCollectionId.collectionId,
  //     block: blockToProcess.header,
  //   }),
  //   parsers.storage.omnipoolWarehouseLM.getAllDepositsData({
  //     block: blockToProcess.header,
  //   }),
  // ]);
  //
  // if (!allPositionNftsWithOwners) {
  //   console.log(`All Omnipool Positions Uniques can not be found`);
  //   return;
  // }
  // if (!allDepositsNftsWithOwners) {
  //   console.log(`All Omnipool Deposits Uniques can not be found`);
  //   return;
  // }
  //
  // if (!allExistingDeposits) {
  //   console.log(`All Omnipool Deposits can not be found`);
  //   return;
  // }
  //
  // console.log('allPositionNftsWithOwners - ', allPositionNftsWithOwners.length);
  // console.log('allDepositsNftsWithOwners - ', allDepositsNftsWithOwners.length);
  //
  // const depositPositionIdsMapping: Map<string, string> = new Map();
  //
  // await pMap(
  //   allDepositsNftsWithOwners,
  //   async ({ assetId, data }) => {
  //     const omniPositionId =
  //       await parsers.storage.omnipoolLiquidityMining.getOmniPositionId({
  //         block: blockToProcess.header,
  //         depositId: assetId,
  //       });
  //
  //     console.log(
  //       `Deposite ${assetId} >>> positions ${!!omniPositionId ? omniPositionId.positionId.toString() : 'not found'}`
  //     );
  //
  //     if (omniPositionId)
  //       depositPositionIdsMapping.set(
  //         assetId.toString(),
  //         omniPositionId.positionId.toString()
  //       );
  //   },
  //   { concurrency: 300 }
  // );
  //
  // const allExistingDepositsIndexedByDepositId: Map<
  //   string,
  //   XykpoolLMDepositData
  // > = new Map();
  //
  // for (const { depositId, data } of allExistingDeposits) {
  //   if (!data) continue;
  //   allExistingDepositsIndexedByDepositId.set(depositId, data);
  // }
  //
  // const allPositionNftsWithOwnersIndexedById: Map<string, UniquesAssetData> =
  //   new Map();
  //
  // for (const { assetId, data } of allPositionNftsWithOwners) {
  //   if (!data) continue;
  //   allPositionNftsWithOwnersIndexedById.set(assetId, data);
  // }
  //
  // const allDepositNftsWithOwnersIndexedById: Map<string, UniquesAssetData> =
  //   new Map();
  // for (const { assetId, data } of allDepositsNftsWithOwners) {
  //   if (!data) continue;
  //   allDepositNftsWithOwnersIndexedById.set(assetId, data);
  // }
  //
  // const positionsFullyInDeposit: string[] = [];
  // const positionsFullyInDepositMapping: Map<string, string> = new Map();
  // const positionDepositMapping: Map<string, string> = new Map();
  //
  // for (const [
  //   depositId,
  //   positionIdWithDeposit,
  // ] of depositPositionIdsMapping.entries()) {
  //   positionDepositMapping.set(positionIdWithDeposit, depositId);
  //
  //   if (!allPositionNftsWithOwnersIndexedById.has(positionIdWithDeposit)) {
  //     positionsFullyInDeposit.push(positionIdWithDeposit);
  //     positionsFullyInDepositMapping.set(depositId, positionIdWithDeposit);
  //   }
  // }
  //
  // console.log('positionsFullyInDeposit - ');
  // console.dir(positionsFullyInDeposit, { depth: null });

  // await pMap(
  //   Array.from(allPositionNftsWithOwnersIndexedById.entries()),
  //   async ([positionId, data]) => {
  //     const positionEntity = await getOrCreateOmnipoolLiquidityPosition({
  //       positionId: positionId,
  //       ensure: true,
  //       blockHeader: blockToProcess.header,
  //       ctx,
  //       noPanic: true,
  //     });
  //
  //     if (positionEntity) {
  //       ctx.batchState.state.omnipoolLiquidityPositions.set(
  //         positionEntity.id,
  //         positionEntity
  //       );
  //     } else {
  //       console.log(
  //         `No position found with ID ${positionId}. Appropriate deposit ${positionDepositMapping.get(positionId) ?? 'not found'} [${blockToProcess.header.hash}]`
  //       );
  //     }
  //   },
  //   { concurrency: 150 }
  // );

  const allPositions =
    await parsers.storage.omnipool.getAllOmnipoolLiquidityPositions({
      block: blockToProcess.header,
    });

  await pMap(
    allPositions || [],
    async (positionData) => {
      const positionEntity = await getOrCreateOmnipoolLiquidityPosition({
        positionId: positionData.positionId.toString(),
        ensure: true,
        blockHeader: blockToProcess.header,
        ctx,
        noPanic: false,
      });

      if (!positionEntity) {
        console.log(
          `No position found with ID ${positionData.positionId.toString()}. [${blockToProcess.header.hash}]`
        );
        return;
      }
      const eventEntity = await getNewOmnipoolLiquidityPositionEvent({
        eventName: OmnipoolLiquidityPositionStatus.PositionCreated,
        position: positionEntity,
        assetId: positionEntity.assetId,
        ownerAccountId: positionEntity.account.id,
        amount: positionEntity.initialAmount,
        sharesAmount: positionEntity.sharesAmount,
        price: positionEntity.price ?? BigInt(0),
        ctx,
        eventId: `${blockToProcess.header.height}`,
        paraBlockHeight: blockToProcess.header.height,
      });

      ctx.batchState.state.omnipoolLiquidityPositions.set(
        positionEntity.id,
        positionEntity
      );
      ctx.batchState.state.omnipoolLiquidityPositionEvents.set(
        eventEntity.id,
        eventEntity
      );
    },
    { concurrency: 150 }
  );

  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolLiquidityPositions.values())
  );
  await ctx.storeUtils.upsertWithBatches(
    Array.from(ctx.batchState.state.omnipoolLiquidityPositionEvents.values())
  );

  // for (const depositStorageData of allExistingDeposits) {
  //   const deposit = await getOrCreateXykLiquidityMiningDeposit({
  //     depositId: depositStorageData.depositId,
  //     ownerAccountId:
  //       allNftsWithOwnersIndexedById.get(depositStorageData.depositId)?.owner ??
  //       undefined,
  //     createdAtParaBlockHeight: blockToProcess.header.height,
  //     ensure: true,
  //     blockHeader: blockToProcess.header,
  //     ctx,
  //     noPanic: true,
  //     storageData: depositStorageData,
  //   });
  //
  //   if (!deposit) continue;
  //
  //   const depositEvent = getNewXykLiquidityMiningDepositEvent({
  //     eventName: YieldFarmDepositStatus.SharesDeposited,
  //     depositId: deposit.id,
  //     globalFarmId:
  //       depositStorageData.data?.yieldFarmEntries[0].globalFarmId.toString(),
  //     yieldFarmId:
  //       depositStorageData.data?.yieldFarmEntries[0].yieldFarmId.toString(),
  //     lpAssetId: deposit.lpAssetId,
  //     accountId: deposit.accountId,
  //     amount: deposit.amount,
  //     paraBlockHeight: blockToProcess.header.height,
  //   });
  //
  //   ctx.batchState.state.xykYieldFarmDepositEvents.set(
  //     depositEvent.id,
  //     depositEvent
  //   );
  // }
  //
  // await ctx.storeUtils.upsertWithBatches(
  //   Array.from(ctx.batchState.state.xykYieldFarmDepositEvents.values())
  // );
}
