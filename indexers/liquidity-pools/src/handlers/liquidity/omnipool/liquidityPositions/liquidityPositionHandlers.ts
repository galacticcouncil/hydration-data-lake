import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLiquidityAddedData,
  OmnipoolLiquidityRemovedData,
  OmnipoolPositionCreatedData,
  OmnipoolPositionDestroyedData,
  OmnipoolPositionUpdatedData,
  UniquesTransferredData,
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
import { getOrCreateAccount } from '../../../accounts';

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
        noPanic: true,
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
}

export async function handleOmnipoolLiquidityPositionTransferred(
  ctx: SqdProcessorContext<Store>,
  eventCallData: UniquesTransferredData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const { item, from, to } = eventParams;

  const positionEntity = await getOrCreateOmnipoolLiquidityPosition({
    positionId: item,
    ctx,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
    noPanic: true,
  });

  if (!positionEntity) return;

  positionEntity.account = await getOrCreateAccount({ id: to, ctx });

  ctx.batchState.state.omnipoolLiquidityPositions.set(
    positionEntity.id,
    positionEntity
  );

  await ctx.storeUtils.upsertWithBatches([positionEntity]);
}
