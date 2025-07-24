import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';
import { Block, BlockWithData, ProcessorContext } from '../../processor';

export async function handleAssetAccountBalancesPerBlock(
  block: BlockWithData,
  ctx: ProcessorContext<Store>
) {
  const accountIdsToProcess = await handleMmAssetAccountBalancesPerBlock(
    block,
    ctx
  );

  await handleCommonAssetAccountBalances({ accountIdsToProcess, block, ctx });

  if (!ctx.appConfig.PERSIST_HIST_DATA_ONLY_ON_CHANGE) {
    await ctx.store.save(
      Array.from(ctx.batchState.state.accAssetBalanceHistData.values())
    );
  }
}
