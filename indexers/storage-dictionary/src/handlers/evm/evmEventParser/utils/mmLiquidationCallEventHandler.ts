import { ProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { EvmLogDecoder } from '../../../../utils/evm/evmLogDecoder';
import { getOrCreateAsset } from '../../../asset/asset';
import { getOrCreateAccountByBoundEvmAddress } from '../../../accounts';
import { processNewMoneyMarketEvent } from './moneyMarketEvent';
import {
  EvmEventName,
  EvmLogEventParsedData,
} from '../../../../parsers/types/events';
// import { handleAccountMmPositionDataUpdate } from '../../accounts/moneyMarketPosition';

export async function handleMmLiquidationCallEvent(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.LiquidationCall>(
      eventData.params
    );

  if (!parsedEvmEventData) return;

  const { params: eventParams, metadata: eventMetadata } = eventData;

  const collateralAssetEntity = await getOrCreateAsset({
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

  const debtAssetEntity = await getOrCreateAsset({
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

  if (!account || !liquidatorAccount) {
    if (!account)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!liquidatorAccount)
      console.log(
        `AccountFrom cannot be found for EVM Address ${parsedEvmEventData.liquidatorAddress}`
      );
    return;
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventData,
    allInvolvedAssetIds: [collateralAssetEntity.id, debtAssetEntity.id],
    allInvolvedParticipants: [account.id, liquidatorAccount.id],
  });

  // await handleAccountMmPositionDataUpdate({
  //   accountEvmAddress: parsedEvmEventData.userAddress,
  //   blockHeader: eventMetadata.blockHeader,
  //   ctx,
  // });
  // await handleAccountMmPositionDataUpdate({
  //   accountEvmAddress: parsedEvmEventData.liquidatorAddress,
  //   blockHeader: eventMetadata.blockHeader,
  //   ctx,
  // });
}
