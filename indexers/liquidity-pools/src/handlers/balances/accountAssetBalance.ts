import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  Account,
  AccountAssetBalanceHistoricalData,
  AccountTotalBalanceHistoricalData,
  Asset,
  DcaSchedule,
} from '../../model';
import { FindOptionsRelations } from 'typeorm';
import { getOrCreateAsset } from '../assets/asset';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export async function getOrCreateAccountAssetBalanceHistoricalData({
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
  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.storeUtils.findOneWithLogs(AccountAssetBalanceHistoricalData, {
      where: { id: entityId },
      relations,
    }, { className: 'AccountAssetBalanceHistoricalData' });

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
    id: `${account.id}-${asset.id}-${blockHeader.height}`,
    account,
    asset,

    transferable: 0n,
    totalLocked: 0n,

    transferableInRefAssetNorm: '0',
    totalLockedInRefAssetNorm: '0',

    relayBlockHeight: block.relayBlockHeight,
    paraBlockHeight: block.height,
    block,
  });

  ctx.batchState.state.accountAssetBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );
  return dataEntity;
}

export async function getOrCreateAccountTotalBalanceHistoricalData({
  account,
  refAssetId = appConfig.ASSET_PRICE_BASE_ASSET_ID,
  ctx,
  blockHeader,
  fetchFromDb = false,
  relations = {
    account: true,
    refAsset: true,
  },
}: {
  account: Account;
  refAssetId?: string;
  ctx: SqdProcessorContext<Store>;
  blockHeader: SqdBlock;
  fetchFromDb?: boolean;
  relations?: FindOptionsRelations<AccountTotalBalanceHistoricalData>;
}) {
  const batchState = ctx.batchState.state;

  const entityId = `${account.id}-${blockHeader.height}`;

  let dataEntity = batchState.accountTotalBalanceHistoricalData.get(entityId);

  if (dataEntity) return dataEntity;

  if (!dataEntity && fetchFromDb) {
    dataEntity = await ctx.storeUtils.findOneWithLogs(AccountTotalBalanceHistoricalData, {
      where: { id: entityId },
      relations,
    }, { className: 'AccountTotalBalanceHistoricalData' });

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

  dataEntity = new AccountTotalBalanceHistoricalData({
    id: `${account.id}-${blockHeader.height}`,
    account,
    refAsset,
    totalTransferableNorm: '0',
    totalLockedNorm: '0',
    totalDebtNorm: '0',
    paraBlockHeight: blockHeader.height,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
    block: ctx.batchState.getParaBlockFromCacheByHeight(blockHeader.height),
  });

  ctx.batchState.state.accountTotalBalanceHistoricalData.set(
    dataEntity.id,
    dataEntity
  );

  return dataEntity;
}
