import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import { EvmEventName } from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import {
  getOrCreateAsset,
  getOrCreateMoneyMarketAsset,
} from '../../assets/asset';
import { initTransfer } from '../../transfers/utils';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmTransferEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Transfer>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { metadata: eventMetadata },
    callData,
  } = eventCallData;

  const existingTransfer = Array.from(
    ctx.batchState.state.transfers.values()
  ).find(
    (transfer) =>
      transfer.toId === parsedEvmEventData.toAddress &&
      transfer.fromId === parsedEvmEventData.fromAddress &&
      transfer.amount === parsedEvmEventData.amount
  );

  if (!!existingTransfer) {
    const assetEntity = existingTransfer.assetId ? await getOrCreateAsset({
      ctx,
      id: existingTransfer.assetId,
      ensure: true,
      blockHeader: eventMetadata.blockHeader,
    }) : null;

    if (!assetEntity) {
      console.log(
        `Asset with id ${existingTransfer.assetId} cannot be found.`
      );
      return
    };

    await processNewMoneyMarketEvent({
      ctx,
      eventCallData,
      allInvolvedAssetIds: [assetEntity.id],
      allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
      allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
      allInvolvedParticipants: [
        existingTransfer.fromId,
        existingTransfer.toId,
      ],
      transfer: existingTransfer,
    });
    return;
  }

  const assetEntity = await getOrCreateMoneyMarketAsset({
    ctx,
    evmAddress: parsedEvmEventData.reserveAddress,
    ensure: true,
  });

  if (!assetEntity) {
    console.log(
      `Asset with contract address ${parsedEvmEventData.reserveAddress} cannot be found.`
    );
    return;
  }

  const accountFrom = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.fromAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const accountTo = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.toAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!accountFrom || !accountTo) {
    if (!accountFrom)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.fromAddress}`
      );
    if (!accountTo)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.toAddress}`
      );
    return;
  }

  const transferEntity = await initTransfer({
    ctx,
    blockHeader: eventMetadata.blockHeader,
    data: {
      id: eventMetadata.id,
      traceIds: [
        ...(callData.traceId ? [callData.traceId] : []),
        eventMetadata.traceId,
      ],
      assetId: assetEntity.id,
      blockNumber: eventMetadata.blockHeader.height,
      timestamp: new Date(eventMetadata.blockHeader.timestamp || 0),
      from: accountFrom.id,
      to: accountTo.id,
      amount: parsedEvmEventData.amount,
      fee: eventMetadata.extrinsic?.fee || BigInt(0),
    },
  });

  ctx.batchState.state.transfers.set(transferEntity.id, transferEntity);

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [accountTo, accountFrom],
    traceIds: transferEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [accountFrom.id, accountTo.id],
    transfer: transferEntity,
  });
}
