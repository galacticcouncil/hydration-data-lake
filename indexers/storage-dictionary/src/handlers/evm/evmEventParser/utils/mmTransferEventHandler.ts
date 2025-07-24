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
import { handleAccountMmPositionDataUpdate } from '../../../accounts/moneyMarketPosition';
import { EvmAccountsUtils } from '../../../../utils/evm/evmAccountsUtils';

export async function handleMmTransferEvent(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Transfer>(
      eventData.params
    );

  if (!parsedEvmEventData) return;

  const { metadata: eventMetadata } = eventData;

  const assetEntity = await getOrCreateAsset({
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

  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.fromAddress
  );
  EvmAccountsUtils.getInstance().addAddressToCache(
    parsedEvmEventData.toAddress
  );

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
        `handleMmTransferEvent :: accountFrom cannot be found for EVM Address ${parsedEvmEventData.fromAddress}`
      );
    if (!accountTo)
      console.log(
        `handleMmTransferEvent :: accountTo cannot be found for EVM Address ${parsedEvmEventData.toAddress}`
      );
    return;
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [accountFrom.id, accountTo.id],
  });

  await handleAccountMmPositionDataUpdate({
    accountEvmAddress: parsedEvmEventData.fromAddress,
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });
  await handleAccountMmPositionDataUpdate({
    accountEvmAddress: parsedEvmEventData.toAddress,
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });
}
