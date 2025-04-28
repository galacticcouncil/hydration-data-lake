import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleEmaOracleHistoricalData } from './historicalData';

export async function handleOracles(ctx: SqdProcessorContext<Store>) {
  await handleEmaOracleHistoricalData(ctx);
}
