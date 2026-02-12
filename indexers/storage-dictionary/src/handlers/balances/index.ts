import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';
import { Block, BlockWithData, ProcessorContext } from '../../processor';
import { EvmEventName } from '../../parsers/types/events';
import { AccountMoneyMarketPositionDataManager } from '../accounts/moneyMarketPosition';

// let totalExecutionTimeBalances = 0;

export async function handleAssetAccountBalancesPerBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  // const startTimeBalances = performance.now();

  const accountIdsToProcess = await handleMmAssetAccountBalancesPerBlock(
    block,
    ctx
  );

  await handleCommonAssetAccountBalances({ accountIdsToProcess, block, ctx });

  const oracleUpdateEvent = Array.from(
    ctx.batchState.state.moneyMarketEvents.values()
  ).find(
    (event) =>
      (event.eventData.params?.eventName === EvmEventName.OracleUpdate &&
        event.paraBlockHeight) === block.header.height
  );

  if (oracleUpdateEvent) {
    await AccountMoneyMarketPositionDataManager.getInstance().handleAllAccountsMmPositionDataUpdate(
      {
        blockHeader: block.header,
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
