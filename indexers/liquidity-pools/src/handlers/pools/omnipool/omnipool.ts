import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  AccountType,
  Omnipool,
  OmnipoolAsset,
  OmnipoolAssetAddedData,
  OmnipoolAssetLifeState,
} from '../../../model';
import { getAccount } from '../../accounts';
import { getAsset } from '../../assets/assetRegistry';
import { addOmnipoolAssetAddedLifeState } from './omnipoolAssets';

export async function ensureOmnipool(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.omnipoolEntity) return;

  let omnipoolEntity =
    (await ctx.store.findOne(Omnipool, {
      where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
      relations: { assets: { asset: true }, account: true },
    })) ?? null;

  if (!!omnipoolEntity) {
    ctx.batchState.state.omnipoolEntity = omnipoolEntity;
    return;
  }

  const lrnaAssetEntity = await getAsset({
    ctx,
    id: ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID,
    ensure: true,
    blockHeader: ctx.blocks[0].header,
  });

  if (!lrnaAssetEntity) return;

  omnipoolEntity = new Omnipool();
  omnipoolEntity.id = ctx.appConfig.OMNIPOOL_ADDRESS;
  omnipoolEntity.account = await getAccount({
    ctx,
    id: ctx.appConfig.OMNIPOOL_ADDRESS,
    accountType: AccountType.Omnipool,
    ensureAccountType: true,
  });
  omnipoolEntity.isDestroyed = false;

  const internalOmnipoolToken = new OmnipoolAsset({
    id: `${omnipoolEntity.id}-${ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID}`,
    asset: lrnaAssetEntity,
    pool: omnipoolEntity,
    addedAtParaBlockHeight: ctx.blocks[0].header.height,
    addedAtRelayBlockHeight:
      ctx.batchState.getRelayChainBlockDataFromCache(
        ctx.blocks[0].header.height
      ).height,
    addedAtBlock: ctx.batchState.state.batchBlocks.get(ctx.blocks[0].header.id),
    isRemoved: false,
    lifeStates: addOmnipoolAssetAddedLifeState({
      assetAddedState: new OmnipoolAssetAddedData({
        initialAmount: '0',
        initialPrice: '0',
        paraBlockHeight: ctx.blocks[0].header.height,
        relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
          ctx.blocks[0].header.height
        ).height,
      }),
    }),
  });

  await ctx.store.save(omnipoolEntity);
  await ctx.store.save(internalOmnipoolToken);

  omnipoolEntity.account.omnipool = omnipoolEntity;
  await ctx.store.save(omnipoolEntity.account);

  ctx.batchState.state.omnipoolEntity = omnipoolEntity;
  ctx.batchState.state.accounts.set(
    omnipoolEntity.account.id,
    omnipoolEntity.account
  );
}
