import { Store } from '@subsquid/typeorm-store';

import {
  EvmEventName,
  MmReserveIndexesHistoricalData,
  MoneyMarketReserve,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { PoolReserveDataUpdatedEventParams } from '../../../parsers/types/events';
import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateMoneyMarketReserve } from './moneyMarketReserve';

export async function processMmReserveIndexesHistoricalData({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
}) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.ReserveDataUpdated>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;

  const emitterAddress = eventParams.address.toLowerCase();

  await processMmReserveIndexesHistoricalDataEntity({
    data: {
      ...parsedEvmEventData,
      mmReserveEntityId: `${emitterAddress}-${parsedEvmEventData.reserveAddress.toLowerCase()}`,
    },
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });
}

export async function processMmReserveIndexesHistoricalDataEntity({
  data,
  ctx,
  blockHeader,
}: {
  data: PoolReserveDataUpdatedEventParams & { mmReserveEntityId: string };
  blockHeader: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  const mmReserve = await getOrCreateMoneyMarketReserve({
    id: data.mmReserveEntityId,
    blockHeader,
    ctx,
  });

  if (!mmReserve) {
    console.log('Reserve not found');
    return;
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) {
    console.log(`Block not found at height ${blockHeader.height}`);
    return;
  }

  const newHistDataEntity = new MmReserveIndexesHistoricalData({
    id: `${mmReserve.id}-${blockHeader.height}`,
    reserve: mmReserve,

    liquidityRate: data.liquidityRate,
    variableBorrowRate: data.variableBorrowRate,
    liquidityIndex: data.liquidityIndex,
    variableBorrowIndex: data.variableBorrowIndex,

    paraBlockHeight: blockHeader.height,
  });

  ctx.batchState.state.moneyMarketReserveIndexesHistData.set(
    newHistDataEntity.id,
    newHistDataEntity
  );
}
