import { Store } from '@subsquid/typeorm-store';

import {
  AccountAssetBalanceHistoricalData,
  AccountAssetBalanceLatest,
  AccountTotalBalanceHistoricalData,
  AccountTotalBalanceLatest,
} from '../../model';
import { SqdProcessorContext } from '../../processor';

export function getAccountTotalBalancesLatest({
  balances,
  ctx,
}: {
  balances: AccountTotalBalanceHistoricalData[];
  ctx: SqdProcessorContext<Store>;
}) {
  const indexedBalances: Map<string, AccountTotalBalanceHistoricalData> =
    new Map();

  for (const balance of balances) {
    const indexedValue = indexedBalances.get(balance.accountId);

    if (indexedValue && indexedValue.paraBlockHeight >= balance.paraBlockHeight)
      continue;

    indexedBalances.set(balance.accountId, balance);
  }

  const latestBalanceEntities = [];

  for (const [id, balance] of indexedBalances.entries()) {
    latestBalanceEntities.push(
      new AccountTotalBalanceLatest({
        id,
        refAssetId: balance.refAssetId,
        totalTransferableNorm: balance.totalTransferableNorm,
        totalLockedNorm: balance.totalLockedNorm,
        totalDebtNorm: balance.totalDebtNorm,
        paraBlockHeight: balance.paraBlockHeight,
      })
    );
  }
  return latestBalanceEntities;
}
