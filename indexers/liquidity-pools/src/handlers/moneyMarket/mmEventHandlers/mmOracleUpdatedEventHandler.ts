import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { EvmEventName, MmUserEModeSet } from '../../../model';
import {
  handleAllAccountsMmPositionDataUpdate,
} from '../../accounts/moneyMarketPosition';

export async function handleOracleUpdatedEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.OracleUpdate>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  console.log(`DIA Oracle has emitted Update event`);

  await handleAllAccountsMmPositionDataUpdate({
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });
}
