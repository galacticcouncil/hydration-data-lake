import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { EvmContractName, EvmEventName } from '../../../model';
import { AaveMoneyMarketManager } from '../../../utils/evmTools/aave/aaveMoneyMarketManager';
import { handleMoneyMarketReserveConfigOnConfiguratorUpdate } from './moneyMarketReservesConfigHistoricalData';
import { processMmReserveIndexesHistoricalData } from './moneyMarketReservesIndexesHistoricalData';
import { AaveMoneyMarketsRegistry } from '../../../utils/evmTools/aave/aaveMoneyMarketsRegistry/aaveMoneyMarketsRegistry';

export async function handleMmReservesConfigsHistoricalData(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const blocksToBeProcessed: Map<number, SqdBlock> = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (
      event.eventData.params?.contractName ===
      EvmContractName.AavePoolConfiguratorImpl
    ) {
      blocksToBeProcessed.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );
    }
    if (event.eventData.params?.eventName === EvmEventName.ReserveDataUpdated) {
      await processMmReserveIndexesHistoricalData({
        ctx,
        eventCallData: event,
      });
    }
  }

  for (const blockHeader of blocksToBeProcessed.values()) {
    const reservesData =
      await AaveMoneyMarketsRegistry.getInstance().getAllMarketsReservesData({
        blockNumber: blockHeader.height,
      });

    if (!reservesData) {
      console.log(
        `handleMmReservesHistoricalData :: Reserve data cannot be found at block ${blockHeader.height}`
      );
      continue;
    }
    for (const reserveData of reservesData) {
      await handleMoneyMarketReserveConfigOnConfiguratorUpdate({
        reserveData,
        blockHeader,
        ctx,
      });
    }
  }
}
