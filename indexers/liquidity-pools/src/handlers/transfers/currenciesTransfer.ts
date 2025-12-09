import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initTransfer } from './utils';
import { ChainActivityTraceManager } from '../../chainActivityTracingManagers';
import { AssetType } from '../../model';
import { getOrCreateAsset } from '../assets/asset';
import { CurrenciesTransferredData } from '../../parsers/batchBlocksParser/types/currencies';
import { processNewMoneyMarketEvent } from '../moneyMarket/moneyMarketEvent';
import { EvmLogData } from '../../parsers/batchBlocksParser/types/evm';
import { getOrCreateAccount } from '../accounts';

export async function handleCurrenciesTransfer(
  ctx: SqdProcessorContext<Store>,
  eventCallData: CurrenciesTransferredData
) {
  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const assetEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: eventParams.currencyId,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  /**
   * This is a workaround for EVM and Currencies pallets to issue when on
   * Currencies.transfer call even EVM.Transfer will not be emitted. n such
   * cases we need process such Transfers here.
   */
  if (!assetEntity || assetEntity.assetType !== AssetType.Erc20) return;

  const existingTransfer = [...ctx.batchState.state.transfers.values()].find(
    (transfer) =>
      transfer.toId === eventParams.to &&
      transfer.fromId === eventParams.from &&
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
      assetId: assetEntity.id,
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

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData: eventCallData as unknown as EvmLogData, // TODO should be reviewed and improved
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedAssetRegistryIds: [assetEntity.assetRegistryId],
    allInvolvedAssetDetails: [assetEntity.name, assetEntity.symbol],
    allInvolvedParticipants: [transferEntity.fromId, transferEntity.toId],
    transfer: transferEntity,
  });
}
