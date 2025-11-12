import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLMYieldFarmCreatedData,
  OmnipoolLMYieldFarmUpdatedData,
  OmnipoolLMYieldFarmTerminatedData,
  OmnipoolLMYieldFarmStoppedData,
  OmnipoolLMYieldFarmResumedData,
} from '../../../../../parsers/batchBlocksParser/types';

export async function handleOmnipoolYieldFarmCreated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMYieldFarmCreatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolYieldFarmUpdated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMYieldFarmUpdatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolYieldFarmTerminated(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMYieldFarmTerminatedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolYieldFarmStoped(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMYieldFarmStoppedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolYieldFarmResumed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMYieldFarmResumedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}
