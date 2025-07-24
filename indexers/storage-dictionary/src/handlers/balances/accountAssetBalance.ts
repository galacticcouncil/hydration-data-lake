import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AccountAssetBalanceHistoricalData } from '../../model';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export async function getOrCreateAccountAssetBalanceHistoricalData({
  accountId,
  assetId,
  ctx,
  blockHeader,
  fetchFromDb = false,
}: {
  accountId: string;
  assetId: string;
  ctx: ProcessorContext<Store>;
  blockHeader: Block;
  fetchFromDb?: boolean;
}) {
  const batchState = ctx.batchState.state;

  const entityId = `${accountId}-${assetId}-${blockHeader.height}`;

  let dataEntity = batchState.accAssetBalanceHistData.get(entityId);
  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.store.findOne(AccountAssetBalanceHistoricalData, {
      where: { id: entityId },
    });

    if (dataEntity) {
      ctx.batchState.state.accAssetBalanceHistData.set(
        dataEntity.id,
        dataEntity
      );
      return dataEntity;
    }
  }

  dataEntity = new AccountAssetBalanceHistoricalData({
    id: entityId,
    accountId,
    assetId,

    transferable: '0',
    totalLocked: '0',

    paraBlockHeight: blockHeader.height,
  });

  ctx.batchState.state.accAssetBalanceHistData.set(dataEntity.id, dataEntity);
  return dataEntity;
}
