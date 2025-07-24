import { ProcessorContext } from '../../processor';
import { AccountAssetBalanceHistoricalData } from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { Between } from 'typeorm';

export async function prefetchAllAccountHistDataRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>,
  orderedBlockNumbers: number[]
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_ACCOUNTS
  )
    return;

  const assetBalances = await ctx.store.find(
    AccountAssetBalanceHistoricalData,
    {
      where: {
        paraBlockHeight: Between(
          orderedBlockNumbers[0],
          orderedBlockNumbers[orderedBlockNumbers.length - 1]
        ),
      },
    }
  );

  ctx.batchState.state.accAssetBalanceHistData = new Map(
    assetBalances.map((r) => [r.id, r])
  );
  ctx.batchState.state.accAssetBalanceHistDataProcessedBlocks = new Set(
    assetBalances.map((r) => r.paraBlockHeight)
  );
  console.log(
    `Blocks range: ${orderedBlockNumbers[0]}/${orderedBlockNumbers[orderedBlockNumbers.length - 1]}. 
    Number of missed blocks: ${orderedBlockNumbers.filter((b) => !ctx.batchState.state.accAssetBalanceHistDataProcessedBlocks.has(b)).length}/${orderedBlockNumbers.length}`
  );
}
