import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { Account, AccountAssetBalanceHistoricalData } from '../../model';
import { SqdBlock, SqdProcessorContext } from '../../processor';

export async function getOrCreateAccountAssetBalanceHistoricalData({
  account,
  assetId,
  ctx,
  blockHeader,
  fetchFromDb = false,
  relations = {},
}: {
  account: Account;
  assetId: string;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<AccountAssetBalanceHistoricalData>;
}) {
  const batchState = ctx.batchState.state;

  const entityId = `${account.id}-${assetId}-${blockHeader.height}`;

  let dataEntity = batchState.accountAssetBalanceHistoricalData.get(entityId);
  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.storeUtils.findOneWithLogs(
      AccountAssetBalanceHistoricalData,
      {
        where: { id: entityId },
        relations,
      },
      {
        className: 'AccountAssetBalanceHistoricalData',
        originCallFn: 'getOrCreateAccountAssetBalanceHistoricalData',
      }
    );

    if (dataEntity) {
      ctx.batchState.state.accountAssetBalanceHistoricalData.set(
        dataEntity.id,
        dataEntity
      );
      return dataEntity;
    }
  }

  const block = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );

  if (!block) throw Error('Block not found');

  dataEntity = new AccountAssetBalanceHistoricalData({
    id: `${account.id}-${assetId}-${blockHeader.height}`,
    accountId: account.id,
    assetId,

    transferable: 0n,
    totalLocked: 0n,

    transferableInRefAssetNorm: '0',
    totalLockedInRefAssetNorm: '0',

    paraBlockHeight: block.height,
  });

  ctx.batchState.state.accountAssetBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );
  return dataEntity;
}
