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

export async function handleMmRepayEvent(
  ctx: ProcessorContext<Store>,
  eventData: EvmLogEventParsedData
) {
  if (!eventData.params) return;

  const parsedEvmEventData =
    EvmLogDecoder.getInstance().getEvmEventFromLog<EvmEventName.Repay>(
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
    parsedEvmEventData.repayerAddress
  );

  const account = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  const repayerAccount = await getOrCreateAccountByBoundEvmAddress({
    ctx,
    evmAddress: parsedEvmEventData.repayerAddress,
    blockHeader: eventMetadata.blockHeader,
  });

  if (!account || !repayerAccount) {
    if (!account)
      console.log(
        `liquidatorAccount :: account cannot be found for EVM Address ${parsedEvmEventData.userAddress}`
      );
    if (!repayerAccount)
      console.log(
        `liquidatorAccount :: repayerAccount cannot be found for EVM Address ${parsedEvmEventData.repayerAddress}`
      );
    return;
  }

  await processNewMoneyMarketEvent({
    ctx,
    eventData,
    allInvolvedAssetIds: [assetEntity.id],
    allInvolvedParticipants: [account.id, repayerAccount.id],
  });

  await handleAccountMmPositionDataUpdate({
    accountEvmAddress: parsedEvmEventData.userAddress,
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });

  await handleAccountMmPositionDataUpdate({
    accountEvmAddress: parsedEvmEventData.repayerAddress,
    blockHeader: eventMetadata.blockHeader,
    ctx,
  });
}
