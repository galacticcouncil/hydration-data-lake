import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountAssetBalanceHistoricalData,
  AccountAssetBalanceLatest,
} from '../../model';

export function getAccountAssetBalancesLatest({
  balances,
}: {
  balances: AccountAssetBalanceHistoricalData[];
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
        blockId: balance.block.id,
      })
    );
  }
  return latestBalanceEntities;
}
