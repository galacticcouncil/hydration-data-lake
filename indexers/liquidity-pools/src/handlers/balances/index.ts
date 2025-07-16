import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { handleCommonAssetAccountBalances } from './commonAssetBalances';
import { handleMmAssetAccountBalancesPerBlock } from './moneyMarketAssetBalances';

export async function handleAssetAccountBalancesPerBlock(
  ctx: SqdProcessorContext<Store>
) {
  await handleCommonAssetAccountBalances(ctx);
  await handleMmAssetAccountBalancesPerBlock(ctx);
}
