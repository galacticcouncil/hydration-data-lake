import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BatchBlocksParsedDataManager } from '../../../parsers/batchBlocksParser';
import {
  initAllOmnipoolLiquidityPositions
} from '../../../handlers/liquidity/omnipool/liquidityPositions/liquidityPositionHandlers';
import {
  initAllOmnipoolLiquidityMiningDeposits
} from '../../../handlers/liquidity/omnipool/liquidityMining/depositHandlers';
import { handleOmnipoolLiquidityPositions } from '../../../handlers/liquidity/omnipool/liquidityPositions';
import { handleOmnipoolLiquidityMiningEvents } from '../../../handlers/liquidity/omnipool/liquidityMining';

export async function omnipoolPositionsDepositsProcessing(
  ctx: SqdProcessorContext<Store>,
  parsedEvents: BatchBlocksParsedDataManager
) {

  console.time('initAllOmnipoolLiquidityPositions');
  await initAllOmnipoolLiquidityPositions(ctx);
  console.timeEnd('initAllOmnipoolLiquidityPositions');

  console.time('initAllOmnipoolLiquidityMiningDeposits');
  await initAllOmnipoolLiquidityMiningDeposits(ctx);
  console.timeEnd('initAllOmnipoolLiquidityMiningDeposits');

  console.time('handleOmnipoolLiquidityPositions');
  await handleOmnipoolLiquidityPositions(ctx, parsedEvents);
  console.timeEnd('handleOmnipoolLiquidityPositions');

  console.time('handleOmnipoolLiquidityMiningEvents');
  await handleOmnipoolLiquidityMiningEvents(ctx, parsedEvents);
  console.timeEnd('handleOmnipoolLiquidityMiningEvents');

}
