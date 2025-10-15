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
import { EvmAccountsUtils } from '../../../../utils/evm/evmAccountsUtils';
import { AccountMoneyMarketPositionDataManager } from '../../../accounts/moneyMarketPosition';

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
    blockHeader: eventMetadata.blockHeader,
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
  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.userAddress
  );
  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.liquidatorAddress
  );

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
        `handleMmLiquidationCallEvent :: account cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!liquidatorAccount)
      console.log(
        `handleMmLiquidationCallEvent :: liquidatorAccount cannot be found for EVM Address ${parsedEvmEventData.liquidatorAddress}`
      );
    return;
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventData,
    allInvolvedAssetIds: [collateralAssetEntity.id, debtAssetEntity.id],
    allInvolvedParticipants: [account.id, liquidatorAccount.id],
  });

  AccountMoneyMarketPositionDataManager.getInstance().addAccountEvmAddressToProcessingQueue(
    {
      accountEvmAddress: parsedEvmEventData.userAddress,
      blockHeader: eventMetadata.blockHeader,
    }
  );
  AccountMoneyMarketPositionDataManager.getInstance().addAccountEvmAddressToProcessingQueue(
    {
      accountEvmAddress: parsedEvmEventData.liquidatorAddress,
      blockHeader: eventMetadata.blockHeader,
    }
  );
}
