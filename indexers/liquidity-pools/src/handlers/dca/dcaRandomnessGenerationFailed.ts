import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { DcaRandomnessGenerationFailedData } from '../../parsers/batchBlocksParser/types';
import {
  DcaRandomnessGenerationFailedError,
  DispatchError,
  DispatchErrorValue,
} from '../../model';

export async function handleDcaRandomnessGenerationFailed(
  ctx: ProcessorContext<Store>,
  eventCallData: DcaRandomnessGenerationFailedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const newFailReport = new DcaRandomnessGenerationFailedError({
    id: eventParams.block.toString(),
    indexInBlock: eventMetadata.indexInBlock,
    relayChainBlockHeight:
      ctx.batchState.state.relayChainInfo.get(eventParams.block)
        ?.relaychainBlockNumber ?? 0,
    paraChainBlockHeight: eventParams.block,
    error: eventParams.error
      ? new DispatchError({
          kind: eventParams.error.__kind,
          value: eventParams.error.value
            ? new DispatchErrorValue({
                index: eventParams.error.value?.index,
                error: eventParams.error.value?.error,
              })
            : null,
        })
      : null,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
  });

  const state = ctx.batchState.state;

  state.dcaRandomnessGenerationFailedErrors.set(
    newFailReport.id,
    newFailReport
  );
}
