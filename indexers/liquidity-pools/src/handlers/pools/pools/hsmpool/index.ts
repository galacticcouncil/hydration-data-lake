import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleHsmAssetHistoricalData } from './hsmpoolAssetHistData';
import { SwapFillerType } from '../../../../model';

export async function handleHsmAssetHistoricalDataOnAllSwaps(
  ctx: SqdProcessorContext<Store>
) {
  for (const swap of ctx.batchState.state.swaps.values()) {
    if (swap.fillerType !== SwapFillerType.HSM) continue;

    await handleHsmAssetHistoricalData({
      ctx,
      swap,
      blockHeader: ctx.batchState.getBlockHeaderByBlockHeight(
        swap.paraBlockHeight
      ),
    });
  }
}
