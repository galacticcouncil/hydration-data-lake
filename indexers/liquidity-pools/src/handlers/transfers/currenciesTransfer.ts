import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initTransfer } from './utils';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { AssetType } from '../../model';
import { getAsset } from '../assets/assetRegistry';
import { CurrenciesTransferredData } from '../../parsers/batchBlocksParser/types/currencies';

export async function handleCurrenciesTransfer(
  ctx: SqdProcessorContext<Store>,
  eventCallData: CurrenciesTransferredData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const assetEntity = await getAsset({
    ctx,
    id: eventParams.currencyId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetEntity || assetEntity.assetType !== AssetType.Erc20) return;

  const existingTransfer = [...ctx.batchState.state.transfers.values()].find(
    (transfer) =>
      transfer.to.id === eventParams.to &&
      transfer.from.id === eventParams.from &&
      transfer.amount === eventParams.amount
  );

  if (!!existingTransfer) return;

  const transferEntity = await initTransfer({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      id: eventMetadata.id,
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      assetId: eventParams.currencyId,
      blockNumber: eventMetadata.blockHeader.height,
      timestamp: new Date(eventMetadata.blockHeader.timestamp || 0),
      from: eventParams.from,
      to: eventParams.to,
      amount: eventParams.amount,
      fee: eventMetadata.extrinsic?.fee || BigInt(0),
    },
  });

  ctx.batchState.state.transfers.set(transferEntity.id, transferEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [transferEntity.to, transferEntity.from],
    traceIds: transferEntity.traceIds,
    ctx,
  });
}
