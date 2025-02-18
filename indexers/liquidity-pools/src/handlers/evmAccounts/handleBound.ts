import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmAccountsBoundData } from '../../parsers/batchBlocksParser/types/evmAccounts';
import { getAccount } from '../accounts';

export async function handleEvmAccountsBoundEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmAccountsBoundData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  if (!eventParams) return;

  const existingAccountEntity = await getAccount({
    ctx,
    id: eventParams.accountAddress,
  });

  existingAccountEntity.boundEvmAddress = eventParams.evmAddress;
  existingAccountEntity.evmAddressBoundEvent =
    ctx.batchState.state.batchEvents.get(eventMetadata.id);

  ctx.batchState.state.accounts.set(
    existingAccountEntity.id,
    existingAccountEntity
  );
}
