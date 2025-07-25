import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';
import { EventName } from '../../parsers/types/events';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmEventName } from '../../model';
import { handleAllAccountsMmPositionDataUpdate } from '../accounts/moneyMarketPosition';

export async function handleAssetAccountBalancesPerBlock(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const accountIdsToProcess = await handleMmAssetAccountBalancesPerBlock(ctx);
  await handleCommonAssetAccountBalances({ accountIdsToProcess, ctx });

  const diaOracleUpdatedEvent = Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  ).find((e) => e.eventData.params?.eventName === EvmEventName.OracleUpdate);

  if (diaOracleUpdatedEvent)
    await handleAllAccountsMmPositionDataUpdate({
      blockHeader: ctx.blocks[ctx.blocks.length - 1].header,
      ctx,
    });
}
