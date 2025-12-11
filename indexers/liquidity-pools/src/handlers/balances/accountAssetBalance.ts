import { FindOptionsRelations } from 'typeorm';

import { Store } from '@subsquid/typeorm-store';

import { AppConfig } from '../../appConfig';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
} from '../../model';
import {
  SqdBlock,
  SqdProcessorContext,
} from '../../processor';
import { getOrCreateAsset } from '../assets/asset';

const appConfig = AppConfig.getInstance();

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

export async function getOrCreateAccountTotalBalanceHistoricalData({
  accountId,
  refAssetId = appConfig.ASSET_PRICE_BASE_ASSET_ID,
  ctx,
  blockHeader,
  fetchFromDb = false,
  relations = {},
}: {
  accountId: string;
  refAssetId?: string;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<AccountTotalBalanceHistoricalData>;
}) {
  const batchState = ctx.batchState.state;

  const entityId = `${accountId}-${blockHeader.height}`;

  let dataEntity = batchState.accountTotalBalanceHistoricalData.get(entityId);

  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.storeUtils.findOneWithLogs(
      AccountTotalBalanceHistoricalData,
      {
        where: { id: entityId },
        relations,
      },
      { className: 'AccountTotalBalanceHistoricalData' }
    );

    if (dataEntity) {
      ctx.batchState.state.accountTotalBalanceHistoricalData.set(
        dataEntity.id,
        dataEntity
      );
      return dataEntity;
    }
  }

  const refAsset = await getOrCreateAsset({
    id: refAssetId,
    ctx,
    ensure: true,
    blockHeader,
  });

  if (!refAsset) throw Error('Ref asset not found');

  const totalBlock = ctx.batchState.getParaBlockFromCacheByHeight(
    blockHeader.height
  );
  if (!totalBlock) {
    throw new Error(
      `Block not found in cache for height ${blockHeader.height}`
    );
  }

  dataEntity = new AccountTotalBalanceHistoricalData({
    id: `${accountId}-${blockHeader.height}`,
    accountId: accountId,
    refAssetId: refAsset.id,
    totalTransferableNorm: '0',
    totalLockedNorm: '0',
    totalDebtNorm: '0',
    paraBlockHeight: blockHeader.height,
  });

  ctx.batchState.state.accountTotalBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );

  return dataEntity;
}
