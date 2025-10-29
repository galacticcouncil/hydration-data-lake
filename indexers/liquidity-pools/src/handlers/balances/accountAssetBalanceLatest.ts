import {
  AccountAssetBalanceHistoricalData,
  AccountAssetBalanceLatest,
} from '../../model';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';

export function getAccountAssetBalancesLatest({
  balances,
  ctx,
}: {
  balances: AccountAssetBalanceHistoricalData[];
  ctx: SqdProcessorContext<Store>;
}) {
  const indexedBalances: Map<string, AccountAssetBalanceHistoricalData> =
    new Map();

  for (const balance of balances) {
    const itemId = `${balance.account.id}-${balance.asset.id}`;
    const indexedValue = indexedBalances.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= balance.paraBlockHeight)
      continue;

    indexedBalances.set(itemId, balance);
  }

  const latestBalanceEntities = [];

  for (const [id, balance] of indexedBalances.entries()) {
    const block = ctx.batchState.getParaBlockFromCacheByHeight(balance.paraBlockHeight);

    if (!block) {
      throw new Error(`Block not found in cache for height ${balance.paraBlockHeight}`);
    }

    latestBalanceEntities.push(
      new AccountAssetBalanceLatest({
        id,
        accountId: balance.account.id,
        assetId: balance.asset.id,
        transferable: balance.transferable,
        totalLocked: balance.totalLocked,
        transferableInRefAssetNorm: balance.transferableInRefAssetNorm,
        totalLockedInRefAssetNorm: balance.totalLockedInRefAssetNorm,
        total: balance.transferable + balance.totalLocked,
        paraBlockHeight: balance.paraBlockHeight,
        blockId: block.id,
      })
    );
  }
  return latestBalanceEntities;
}
