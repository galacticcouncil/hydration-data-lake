import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleEmaOracleHistoricalData } from './emaOracle/historicalData';

export async function handleOracles(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
) {
  await handleEmaOracleHistoricalData(ctx, currentBlockHeader);
}
