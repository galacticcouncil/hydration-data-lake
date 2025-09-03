import { ProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogDecoder } from '../../../../utils/evm/evmLogDecoder';
import {
  EvmEventName,
  EvmLogEventParsedData,
} from '../../../../parsers/types/events';

export async function handleOracleUpdatedEvent(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.OracleUpdate>(
      eventData.params
    );

  if (!parsedEvmEventData) return;

  const { params: eventParams, metadata: eventMetadata } = eventData;

  // await handleAllAccountsMmPositionDataUpdate({
  //   blockHeader: eventMetadata.blockHeader,
  //   ctx,
  // });
}
