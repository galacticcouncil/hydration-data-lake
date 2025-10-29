import { Store } from '@subsquid/typeorm-store';

import {
  AaveFacilitatorHistoricalData,
  EvmEventName,
} from '../../model';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { EvmLogDecoder } from '../../utils/evmTools/evmLogDecoder';
import {
  MoneyMarketContractsManager,
} from '../../utils/evmTools/moneyMarketContractsManager';
import {
  getOrCreateAaveFacilitator,
  getPreviousFacilitatorHistDataEntity,
} from './index';

export async function handleFacilitatorBucketCapacityUpdatedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
}) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.FacilitatorBucketCapacityUpdated>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  await handleFacilitatorUpdatedEvent({
    facilitatorAddress: parsedEvmEventData.facilitatorAddress,
    dataToUpdate: { bucketCapacity: parsedEvmEventData.newCapacity },
    ctx,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });
}

export async function handleFacilitatorBucketLevelUpdatedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
}) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.FacilitatorBucketLevelUpdated>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  await handleFacilitatorUpdatedEvent({
    facilitatorAddress: parsedEvmEventData.facilitatorAddress,
    dataToUpdate: { bucketLevel: parsedEvmEventData.newLevel },
    ctx,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });
}

export async function handleFacilitatorUpdatedEvent({
  facilitatorAddress,
  dataToUpdate,
  ctx,
  blockHeader,
}: {
  facilitatorAddress: string;
  dataToUpdate: Partial<
    Pick<AaveFacilitatorHistoricalData, 'bucketCapacity' | 'bucketLevel'>
  >;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
}) {
  const facilitator = await getOrCreateAaveFacilitator({
    id: facilitatorAddress,
    ctx,
    blockHeader,
  });

  if (!facilitator) {
    console.log('Could not find facilitator ', facilitatorAddress);
    return;
  }

  const facilitatorHistDataEntityId = `${facilitatorAddress}-${blockHeader.height}`;

  let currentFacilitatorHistData =
    ctx.batchState.state.aaveFacilitatorsHistData.get(
      facilitatorHistDataEntityId
    );

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) {
    console.log(`Could not find block ${blockHeader.height} in cache`);
    return;
  }

  if (!currentFacilitatorHistData) {
    const previousHistDataEntity = await getPreviousFacilitatorHistDataEntity({
      address: facilitatorAddress,
      blockHeight: blockHeader.height,
      ctx,
    });
    let bucketCapacity = previousHistDataEntity?.bucketCapacity ?? 0n;
    let bucketLevel = previousHistDataEntity?.bucketLevel ?? 0n;

    if (!previousHistDataEntity) {
      /**
       * We need get contract data in case an indexer doesn't contain any previous
       * historical data for a current facilitarot. It can happen when an indexer
       * just stated.
       */
      const facilitatorContractData =
        await MoneyMarketContractsManager.getInstance().getAaveFacilitatorWithLogs({
          facilitatorAddress,
          blockNumber: blockHeader.height,
        });

      if (facilitatorContractData) {
        bucketCapacity = BigInt(facilitatorContractData.bucketCapacity);
        bucketLevel = BigInt(facilitatorContractData.bucketLevel);
      }
    }

    currentFacilitatorHistData = new AaveFacilitatorHistoricalData({
      id: facilitatorHistDataEntityId,
      facilitator,
      bucketCapacity,
      bucketLevel,
      paraTimestamp: new Date(blockHeader.timestamp || Date.now()),
      paraBlockHeight: block.height,
      relayBlockHeight: block.relayBlockHeight,
    });
  }

  if (dataToUpdate.bucketCapacity)
    currentFacilitatorHistData.bucketCapacity = dataToUpdate.bucketCapacity;

  if (dataToUpdate.bucketLevel)
    currentFacilitatorHistData.bucketLevel = dataToUpdate.bucketLevel;

  ctx.batchState.state.aaveFacilitatorsHistData.set(
    currentFacilitatorHistData.id,
    currentFacilitatorHistData
  );
}
