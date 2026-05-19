import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AaveFacilitator, AaveFacilitatorHistoricalData } from '../../model';
import { LessThan } from 'typeorm';
import { handleFacilitatorUpdatedEvent } from './facilitatorUpdated';
import { AaveNativeStableTokenManager } from '../../utils/evmTools/aave/aaveNativeStableTokenManager';
import { AaveFacilitatorContractData } from '../../utils/evmTools/aave/types';

export async function getOrCreateAaveFacilitator({
  id,
  ctx,
  facilitatorData,
  blockHeader,
}: {
  id: string;
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
  facilitatorData?: AaveFacilitatorContractData;
}) {
  if (!id) return null;
  let facilitator = ctx.batchState.state.aaveFacilitators.get(id);

  if (facilitator) return facilitator;

  facilitator = await ctx.storeUtils.findOneWithLogs(
    AaveFacilitator,
    {
      where: {
        id,
      },
    },
    { className: 'AaveFacilitator', originCallFn: 'getOrCreateAaveFacilitator' }
  );

  if (facilitator) {
    ctx.batchState.state.aaveFacilitators.set(facilitator.id, facilitator);
    return facilitator;
  }

  const facilitatorContractData = facilitatorData
    ? await AaveNativeStableTokenManager.getInstance().getAaveFacilitatorWithLogs(
        {
          facilitatorAddress: id,
          blockNumber: blockHeader.height,
        }
      )
    : null;

  if (!facilitatorContractData) {
    console.log(
      `getOrCreateAaveFacilitator :: facilitatorContractData ${id} not found.`
    );
    return null;
  }

  facilitator = new AaveFacilitator({
    id: facilitatorContractData.address,
    label: facilitatorContractData.label,
    isRemoved: false,
  });

  ctx.batchState.state.aaveFacilitators.set(facilitator.id, facilitator);
  await ctx.store.upsert(facilitator);

  if (
    facilitatorContractData.address ===
      ctx.appConfig.evm.HSMPOOL_FICILITATOR_ADDRESS &&
    ctx.batchState.state.hsmpoolEntity
  ) {
    ctx.batchState.state.hsmpoolEntity.facilitator = facilitator;
    await ctx.store.upsert(ctx.batchState.state.hsmpoolEntity);
  }

  return facilitator;
}

export async function ensureAaveFacilitators(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.aaveFacilitators.size > 0) return;

  const processingBlockHeader = ctx.blocks[ctx.blocks.length - 1].header;

  const allFacilitators =
    await AaveNativeStableTokenManager.getInstance().getAllAaveFacilitators({
      blockNumber: processingBlockHeader.height,
    });

  if (!allFacilitators || allFacilitators.length === 0) {
    console.warn(`[ensureAaveFacilitators] No facilitators returned - skipping initialization`);
    return;
  }

  for (const facilitatorData of allFacilitators) {
    if (!facilitatorData) continue;

    await getOrCreateAaveFacilitator({
      id: facilitatorData.address,
      facilitatorData,
      ctx,
      blockHeader: processingBlockHeader,
    });

    await handleFacilitatorUpdatedEvent({
      facilitatorAddress: facilitatorData.address,
      dataToUpdate: {
        bucketCapacity: BigInt(facilitatorData.bucketCapacity),
        bucketLevel: BigInt(facilitatorData.bucketLevel),
      },
      ctx,
      blockHeader: processingBlockHeader,
    });
  }
}

export async function getPreviousFacilitatorHistDataEntity({
  address,
  blockHeight,
  ctx,
}: {
  address: string;
  blockHeight: number;
  ctx: SqdProcessorContext<Store>;
}): Promise<AaveFacilitatorHistoricalData | null> {
  return (
    getPreviousHistDataEntityFromCache<AaveFacilitatorHistoricalData>(
      ctx.batchState.state.aaveFacilitatorsHistData,
      address,
      blockHeight
    ) ||
    (await getOldAaveFacilitatorHistDataEntity({
      ctx,
      address,
      currentBlockHeight: blockHeight,
    })) ||
    null
  );
}

export function getPreviousHistDataEntityFromCache<E extends { id: string }>(
  entitiesMap: Map<string, E>,
  entityId: string,
  currentBlockHeight: number
) {
  return entitiesMap.get(
    Array.from(entitiesMap.keys())
      .filter((k) => {
        return (
          k.startsWith(entityId + '-') &&
          parseInt(k.split('-')[1]) < currentBlockHeight
        );
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}

export async function getOldAaveFacilitatorHistDataEntity({
  ctx,
  address,
  currentBlockHeight,
}: {
  ctx: SqdProcessorContext<Store>;
  address: string;
  currentBlockHeight?: number;
}) {
  return await ctx.storeUtils.findOneWithLogs(
    AaveFacilitatorHistoricalData,
    {
      where: {
        facilitator: { id: address },
        ...(currentBlockHeight
          ? { paraBlockHeight: LessThan(currentBlockHeight) }
          : {}),
      },
      relations: {
        facilitator: true,
      },
      order: {
        paraBlockHeight: 'DESC',
      },
    },
    {
      className: 'AaveFacilitatorHistoricalData',
      originCallFn: 'getOldAaveFacilitatorHistDataEntity',
    }
  );
}
