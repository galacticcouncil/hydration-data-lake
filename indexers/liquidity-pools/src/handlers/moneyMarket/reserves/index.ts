import { SqdBlock, SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import { EventName } from '../../../parsers/types/events';
import { EvmContractName } from '../../../model';
import { MoneyMarketContractsManager } from '../../../utils/evmTools/moneyMarketContractsManager';
import { handleMoneyMarketReserveConfigOnConfiguratorUpdate } from './moneyMarketReservesConfigHistoricalData';

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
  }

  for (const blockHeader of blocksToBeProcessed.values()) {
    const reservesData =
      await MoneyMarketContractsManager.getInstance().getReservesData({
        blockNumber: blockHeader.height,
      });
    if (!reservesData) {
      console.log(
        `handleMmReservesHistoricalData :: Reserve data cannot be found at block ${blockHeader.height}`
      );
      continue;
    }
    console.log(`-- Update MM Reserve data at block ${blockHeader.height}`);
    for (const reserveData of reservesData) {
      await handleMoneyMarketReserveConfigOnConfiguratorUpdate({
        reserveData,
        blockHeader,
        ctx,
      });
    }
  }
}
