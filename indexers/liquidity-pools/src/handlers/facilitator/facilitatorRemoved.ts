import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../utils/evmTools/evmLogDecoder';
import { EvmEventName } from '../../model';
import { getOrCreateAaveFacilitator } from './index';

export async function handleFacilitatorRemovedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
}) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.FacilitatorRemoved>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  console.log('handleFacilitatorRemovedEvent');
  console.dir(parsedEvmEventData, { depth: null });

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const facilitator = await getOrCreateAaveFacilitator({
    id: parsedEvmEventData.facilitatorAddress,
    ctx,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });

  if (!facilitator) {
    console.log(
      'handleFacilitatorRemovedEvent :: Could not find facilitator ',
      parsedEvmEventData.facilitatorAddress
    );
    return;
  }

  facilitator.isRemoved = true;

  await ctx.store.upsert(facilitator);
  ctx.batchState.state.aaveFacilitators.set(facilitator.id, facilitator);
}
