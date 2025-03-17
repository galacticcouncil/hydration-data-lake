import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  Asset,
  DcaSchedule,
} from '../../model';
import { FindOptionsRelations } from 'typeorm';

export async function getAccountAssetBalanceHistoricalData({
  account,
  asset,
  ctx,
  blockHeader,
  fetchFromDb = false,
  relations = {
    account: true,
    asset: true,
  },
}: {
  account: Account;
  asset: Asset;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<AccountAssetBalanceHistoricalData>;
}) {
  const batchState = ctx.batchState.state;

  const entityId = `${account.id}-${asset.id}-${blockHeader.height}`;

  let dataEntity = batchState.accountAssetBalanceHistoricalData.get(entityId);
  if (dataEntity || (!dataEntity && !fetchFromDb)) return dataEntity ?? null;

  dataEntity = await ctx.store.findOne(AccountAssetBalanceHistoricalData, {
    where: { id: entityId },
    relations,
  });

  if (!dataEntity) return null;
  ctx.batchState.state.accountAssetBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );
  return dataEntity;
}
