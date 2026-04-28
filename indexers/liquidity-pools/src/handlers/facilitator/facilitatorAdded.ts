import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import { EvmLogDecoder } from '../../utils/evmTools/evmLogDecoder';
import { EvmEventName } from '../../model';
import { getOrCreateAaveFacilitator } from './index';
import { AaveFacilitatorContractData } from '../../utils/evmTools/aave/types';

export async function handleFacilitatorAddedEvent({
  ctx,
  eventCallData,
}: {
  ctx: SqdProcessorContext<Store>;
  eventCallData: EvmLogData;
}) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.FacilitatorAdded>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  await getOrCreateAaveFacilitator({
    id: parsedEvmEventData.facilitatorAddress,
    facilitatorData: {
      address: parsedEvmEventData.facilitatorAddress,
      label: parsedEvmEventData.label,
      bucketCapacity: parsedEvmEventData.bucketCapacity.toString(),
      bucketLevel: '0',
    } as AaveFacilitatorContractData,
    ctx,
    blockHeader: eventCallData.eventData.metadata.blockHeader,
  });
}
