import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';
import { EventName } from '../../parsers/types/events';
import { BatchBlocksParsedDataManager } from '../../parsers/batchBlocksParser';
import { EvmEventName } from '../../model';
import { handleAllAccountsMmPositionDataUpdate } from '../accounts/moneyMarketPosition';
import parsers from '../../parsers';
import { handleAccountTotalBalance } from './accountTotalBalance';

/**
 * This function requires the following data, so it should be executed only after
 * execution appropriate aggregations:
 * - asset spot prices
 * - omnipool liquidity positions
 * - xyk liquidity mining deposits
 * @param ctx
 * @param parsedEvents
 */
export async function handleAssetAccountBalances(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  const accountIdsToProcess = await handleMmAssetAccountBalancesPerBlock(ctx);

  await handleCommonAssetAccountBalances({ accountIdsToProcess, ctx });

  await handleAccountTotalBalance({ ctx });

  const blocksWithOracleUpdate: Map<number, SqdBlock> = new Map();

  for (const event of Array.from(
    parsedEvents.getSectionByEventName(EventName.EVM_Log).values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.OracleUpdate)
      blocksWithOracleUpdate.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );
  }

  if (blocksWithOracleUpdate.size === 0) return;

  const latestBlockWithOracleUpdate = Array.from(
    blocksWithOracleUpdate.keys()
  ).sort((a, b) => b - a)[0];

  const allEvmAccounts =
    await parsers.storage.evmAccounts.getAllAccountsExtensions({
      block: blocksWithOracleUpdate.get(latestBlockWithOracleUpdate)!,
    });

  if (!allEvmAccounts) return;

  for (const blockHeader of blocksWithOracleUpdate.values()) {
    await handleAllAccountsMmPositionDataUpdate({
      allEvmAccounts,
      blockHeader,
      ctx,
    });
  }
}
