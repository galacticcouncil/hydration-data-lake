import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';
import { Block, BlockWithData, ProcessorContext } from '../../processor';
import { EvmEventName } from '../../parsers/types/events';
import { AccountMoneyMarketPositionDataManager } from '../accounts/moneyMarketPosition';

export async function handleAssetAccountBalancesPerBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  const accountIdsToProcess = await handleMmAssetAccountBalancesPerBlock(
    block,
    ctx
  );

  await handleCommonAssetAccountBalances({ accountIdsToProcess, block, ctx });

  const blocksWithOracleUpdate: Map<number, Block> = new Map();

  for (const event of Array.from(
    ctx.batchState.state.moneyMarketEvents.values()
  )) {
    if (event.eventData.params?.eventName === EvmEventName.OracleUpdate)
      blocksWithOracleUpdate.set(
        event.eventData.metadata.blockHeader.height,
        event.eventData.metadata.blockHeader
      );
  }

  for (const blockHeader of blocksWithOracleUpdate.values()) {
    await AccountMoneyMarketPositionDataManager.getInstance().handleAllAccountsMmPositionDataUpdate(
      {
        blockHeader,
        ctx,
      }
    );
  }

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.store.save(
      Array.from(ctx.batchState.state.accAssetBalanceHistData.values())
    );
  }
}
