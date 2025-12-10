import { Store } from '@subsquid/typeorm-store';

import {
  ChainActivityTraceManager,
} from '../../../chainActivityTracingManagers';
import {
  EvmEventName,
  MmLiquidationCall,
} from '../../../model';
import { EvmLogData } from '../../../parsers/batchBlocksParser/types/evm';
import { SqdProcessorContext } from '../../../processor';
import { EvmLogDecoder } from '../../../utils/evmTools/evmLogDecoder';
import { getOrCreateAccountByBoundEvmAddress } from '../../accounts';
import { getOrCreateMoneyMarketAsset } from '../../assets/asset';
import { processNewMoneyMarketEvent } from '../moneyMarketEvent';

export async function handleMmLiquidationCallEvent(
  ctx: SqdProcessorContext<Store>,
  eventCallData: EvmLogData
) {
  if (!eventCallData.eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.LiquidationCall>(
      eventCallData.eventData.params
    );

  if (!parsedEvmEventData) return;

  const {
    eventData: { params: eventParams, metadata: eventMetadata },
    callData,
  } = eventCallData;

  const collateralAssetEntity = await getOrCreateMoneyMarketAsset({
    ctx,
    evmAddress: parsedEvmEventData.collateralAssetAddress,
    ensure: true,
  });

  if (!collateralAssetEntity) {
    console.log(
      `Asset with contract address ${parsedEvmEventData.collateralAssetAddress} cannot be found.`
    );
    return;
  }

  const debtAssetEntity = await getOrCreateMoneyMarketAsset({
    ctx,
    evmAddress: parsedEvmEventData.debtAssetAddress,
    ensure: true,
  });
  if (!debtAssetEntity) {
    console.log(
      `Asset with contract address ${parsedEvmEventData.debtAssetAddress} cannot be found.`
    );
    return;
  }

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const liquidatorAccount = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.liquidatorAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const mmLiquidationCallEntity = new MmLiquidationCall({
    id: eventMetadata.id,
    traceIds: [
      ...(callData.traceId ? [callData.traceId] : []),
      eventMetadata.traceId,
    ],
    collateralAssetId: collateralAssetEntity.id,
    debtAssetId: debtAssetEntity.id,
    accountId: account.id,
    liquidatorAccountId: liquidatorAccount.id,
    liquidatedCollateralAmount: parsedEvmEventData.liquidatedCollateralAmount,
    debtToCoverAmount: parsedEvmEventData.debtToCoverAmount,
    receiveAToken: parsedEvmEventData.receiveAToken,

    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      eventMetadata.blockHeader.height
    ).height,
    paraBlockHeight: eventMetadata.blockHeader.height,
    event: ctx.batchState.state.batchEvents.get(eventMetadata.id),
  });

  ctx.batchState.state.mmLiquidationCalls.set(
    mmLiquidationCallEntity.id,
    mmLiquidationCallEntity
  );

  await ChainActivityTraceManager.addParticipantsToActivityTracesBulk({
    participants: [
      account,
      liquidatorAccount,
    ],
    traceIds: mmLiquidationCallEntity.traceIds,
    ctx,
  });

  await processNewMoneyMarketEvent({
    ctx,
    eventCallData,
    allInvolvedAssetIds: [collateralAssetEntity.id, debtAssetEntity.id],
    allInvolvedAssetRegistryIds: [
      collateralAssetEntity.assetRegistryId,
      debtAssetEntity.assetRegistryId,
    ],
    allInvolvedAssetDetails: [
      collateralAssetEntity.name,
      collateralAssetEntity.symbol,
      debtAssetEntity.name,
      debtAssetEntity.symbol,
    ],
    allInvolvedParticipants: [account.id, liquidatorAccount.id],
    liquidationCall: mmLiquidationCallEntity,
  });

}
