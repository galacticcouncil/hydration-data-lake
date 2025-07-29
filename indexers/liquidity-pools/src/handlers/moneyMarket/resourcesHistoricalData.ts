import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { MoneyMarketContractsManager } from '../../utils/evmTools/moneyMarketContractsManager';
import { EventName } from '../../parsers/types/events';
import { EvmEventName } from '../../model';

export async function handleMmResourcesHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const blocksToBeProcessed: Map<number, SqdBlock> = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.ReserveDataUpdated)
      blocksToBeProcessed.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );
  }

  for (const blockHeader of blocksToBeProcessed.values()) {
    const resourcesData =
      await MoneyMarketContractsManager.getInstance().getReservesData({
        blockNumber: blockHeader.height,
      });
  }
}
