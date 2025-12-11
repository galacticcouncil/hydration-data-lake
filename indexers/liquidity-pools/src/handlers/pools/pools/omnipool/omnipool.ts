import { Store } from '@subsquid/typeorm-store';

import {
  AccountType,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetAddedData,
} from '../../../../model';
import { SqdProcessorContext } from '../../../../processor';
import { getOrCreateAccount } from '../../../accounts';
import { getOrCreateAsset } from '../../../assets/asset';
import { addOmnipoolAssetAddedLifeState } from './omnipoolAssets';

export async function ensureOmnipool(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.omnipoolEntity) return;

  let omnipoolEntity =
    (await ctx.storeUtils.findOneWithLogs(Omnipool, {
      where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
      relations: { assets: true },
    }, { className: 'Omnipool' })) ?? null;

  if (!!omnipoolEntity) {
    ctx.batchState.state.omnipoolEntity = omnipoolEntity;
    return;
  }

  const lrnaAssetEntity = await getOrCreateAsset({
    ctx,
    assetRegistryId: ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID,
    ensure: true,
    blockHeader: ctx.blocks[0].header,
  });

  if (!lrnaAssetEntity) return;

  omnipoolEntity = new Omnipool();
  omnipoolEntity.id = ctx.appConfig.OMNIPOOL_ADDRESS;
  omnipoolEntity.accountId = ctx.appConfig.OMNIPOOL_ADDRESS;
  
  const omniAccount = await getOrCreateAccount({
    ctx,
    id: ctx.appConfig.OMNIPOOL_ADDRESS,
    accountType: AccountType.Omnipool,
    ensureAccountType: true,
  });
  omnipoolEntity.isDestroyed = false;

  const addedAtBlock = ctx.batchState.getParaBlockFromCacheByHeight(ctx.blocks[0].header.height);
  if (!addedAtBlock) {
    throw new Error(`Block not found in cache for height ${ctx.blocks[0].header.height}`);
  }

  const internalOmnipoolToken = new OmnipoolAsset({
    id: `${omnipoolEntity.id}-${ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID}`,
    assetId: lrnaAssetEntity.id,
    pool: omnipoolEntity,
    addedAtParaBlockHeight: ctx.blocks[0].header.height,
    addedAtRelayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      ctx.blocks[0].header.height
    ).height,
    addedAtBlockId: addedAtBlock.id,
    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: '0',
        initialPrice: '0',
        paraBlockHeight: ctx.blocks[0].header.height,
      }),
    }),
  });

  await ctx.store.save(omnipoolEntity);
  await ctx.store.save(internalOmnipoolToken);

  omniAccount.omnipool = omnipoolEntity;
  // await ctx.store.save(omnipoolEntity.account);
  await ctx.storeUtils.runWithRetry(() =>
    ctx.store.save(omniAccount)
  );

  ctx.batchState.state.omnipoolEntity = omnipoolEntity;
  ctx.batchState.state.accounts.set(
    omniAccount.id,
    omniAccount
  );
}
