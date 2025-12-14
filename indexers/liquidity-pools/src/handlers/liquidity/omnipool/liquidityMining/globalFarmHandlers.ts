import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLMGlobalFarmCreatedData,
  OmnipoolLMGlobalFarmUpdatedData,
  OmnipoolLMGlobalFarmTerminatedData,
} from '../../../../parsers/batchBlocksParser/types';

export async function handleOmnipoolGlobalFarmCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMGlobalFarmCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolGlobalFarmUpdated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMGlobalFarmUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolGlobalFarmTerminated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMGlobalFarmTerminatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}
