import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  OmnipoolLMSharesDepositedData,
  OmnipoolLMSharesRedepositedData,
  OmnipoolLMRewardClaimedData,
  OmnipoolLMDepositDestroyedData,
} from '../../../../parsers/batchBlocksParser/types';

export async function handleOmnipoolLMSharesDeposited(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMSharesDepositedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;



}

export async function handleOmnipoolLMDepositDestroyed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMDepositDestroyedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLMSharesRedeposited(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMSharesRedepositedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}

export async function handleOmnipoolLMRewardClaimed(
  ctx: SqdProcessorContext<Store>,
  eventCallData: OmnipoolLMRewardClaimedData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
  } = eventCallData;
}
