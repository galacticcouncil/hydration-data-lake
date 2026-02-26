import { Store } from '@subsquid/typeorm-store';

import {
  AccountAssetBalanceHistoricalData,
  AccountAssetBalanceLatest,
  AccountLiquidityBalanceHistoricalData,
  AccountLiquidityBalanceLatest,
} from '../../model';
import { SqdProcessorContext } from '../../processor';

export function getAccountLiquidityBalancesLatest({
  balances,
  ctx,
}: {
  balances: AccountLiquidityBalanceHistoricalData[];
  ctx: SqdProcessorContext<Store>;
}) {
  const indexedBalances: Map<string, AccountLiquidityBalanceHistoricalData> =
    new Map();

  for (const balance of balances) {
    const splitId = balance.id.split('-');
    splitId.pop();
    const itemId = splitId.join('-');
    const indexedValue = indexedBalances.get(itemId);

    if (indexedValue && indexedValue.paraBlockHeight >= balance.paraBlockHeight)
      continue;

    indexedBalances.set(itemId, balance);
  }

  const latestBalanceEntities = [];

  for (const [id, balance] of indexedBalances.entries()) {
    latestBalanceEntities.push(
      new AccountLiquidityBalanceLatest({
        id,
        accountId: balance.accountId,
        assetId: balance.assetId,
        positionId: balance.positionId ?? undefined,
        depositId: balance.depositId ?? undefined,
        liquidityType: balance.liquidityType,
        liquidityAmount: balance.liquidityAmount ?? 0n,
        hubLiquidityAmount: balance.hubLiquidityAmount ?? 0n,
        liquidityAmountNorm: balance.liquidityAmountNorm,
        hubLiquidityAmountNorm: balance.hubLiquidityAmountNorm,
        paraBlockHeight: balance.paraBlockHeight,
      })
    );
  }
  return latestBalanceEntities;
}
