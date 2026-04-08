import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { initAllXykLiquidityMiningDeposits } from '../../../handlers/liquidity/xykpool/liquidityMining/depositsHandlers';
import { handleXykPoolLiquidityMiningEvents } from '../../../handlers/liquidity/xykpool/liquidityMining';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';

export async function xykDepositsProcessing(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {
  console.time('initAllXykLiquidityMiningDeposits');
  await initAllXykLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllXykLiquidityMiningDeposits');

  console.time('handleXykPoolLiquidityMiningEvents');
  await handleXykPoolLiquidityMiningEvents(ctx, parsedEvents);
  console.timeEnd('handleXykPoolLiquidityMiningEvents');
}
