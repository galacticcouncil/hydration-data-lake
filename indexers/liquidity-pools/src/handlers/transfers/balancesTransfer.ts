import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BalancesTransferData } from '../../parsers/batchBlocksParser/types';
import { initTransfer } from './utils';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { AssetType } from '../../model';
import { getOrCreateAccount } from '../accounts';

export async function handleBalancesTransfer(
  ctx: SqdProcessorContext<Store>,
  eventCallData: BalancesTransferData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const transferEntity = await initTransfer({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      id: eventMetadata.id,
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      assetRegistryAssetId: 0,
      blockNumber: eventMetadata.blockHeader.height,
      timestamp: new Date(eventMetadata.blockHeader.timestamp || 0),
      from: eventParams.from,
      to: eventParams.to,
      amount: eventParams.amount,
      fee: eventMetadata.extrinsic?.fee || BigInt(0),
    },
  });

  ctx.batchState.state.transfers.set(transferEntity.id, transferEntity);

  // Get Account objects for activity trace
  const [toAccount, fromAccount] = await Promise.all([
    getOrCreateAccount({ ctx, id: eventParams.to }),
    getOrCreateAccount({ ctx, id: eventParams.from }),
  ]);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [toAccount, fromAccount],
    traceIds: transferEntity.traceIds,
    ctx,
  });
}
