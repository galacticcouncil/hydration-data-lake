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

export async function handleMmBorrowEvent(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Borrow>(
      eventData.params
    );

  if (!parsedEvmEventData) return;

  const { params: eventParams, metadata: eventMetadata } = eventData;

  const assetEntity = await getOrCreateAsset({
    ctx,
    evmAddress: parsedEvmEventData.reserveAddress,
    ensure: true,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!assetEntity) {
    console.log(
      `Asset with contract address ${parsedEvmEventData.reserveAddress} cannot be found.`
    );
    return;
  }

  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.userAddress
  );
  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.onBehalfOfUserAddress
  );

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const accountOnBehalfOf = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.onBehalfOfUserAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!account || !accountOnBehalfOf) {
    if (!account)
      console.log(
        `handleMmBorrowEvent :: account cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!accountOnBehalfOf)
      console.log(
        `handleMmBorrowEvent :: accountOnBehalfOf cannot be found for EVM Address ${parsedEvmEventData.onBehalfOfUserAddress}`
      );
    return;
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [account.id, accountOnBehalfOf.id],
  });

  AccountMoneyMarketPositionDataManager.getInstance().addAccountEvmAddressToProcessingQueue(
    {
      accountEvmAddress: parsedEvmEventData.userAddress,
      blockHeader: eventMetadata.blockHeader,
    }
  );
}
