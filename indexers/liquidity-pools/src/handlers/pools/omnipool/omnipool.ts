import { ProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AccountType, Omnipool, OmnipoolAsset } from '../../../model';
import { getAccount } from '../../accounts';
import { getAsset } from '../../assets/assetRegistry';

export async function ensureOmnipool(ctx: ProcessorContext<Store>) {
  if (ctx.batchState.state.omnipoolEntity) return;

  let omnipoolEntity =
    (await ctx.store.findOne(Omnipool, {
      where: { id: ctx.appConfig.OMNIPOOL_ADDRESS },
      relations: { assets: { asset: true }, account: true },
    })) ?? null;

  if (!!omnipoolEntity) {
    ctx.batchState.state = {
      omnipoolEntity,
    };
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
  omnipoolEntity.createdAt = new Date();
  omnipoolEntity.createdAtParaBlock = ctx.blocks[0].header.height;
  omnipoolEntity.isDestroyed = false;

  const internalOmnipoolToken = new OmnipoolAsset({
    id: `${omnipoolEntity.id}-${ctx.appConfig.OMNIPOOL_PROTOCOL_ASSET_ID}`,
    asset: lrnaAssetEntity,
    initialAmount: BigInt(0),
    initialPrice: BigInt(0),
    pool: omnipoolEntity,
    createdAt: new Date(),
    createdAtParaBlock: ctx.blocks[0].header.height,
    isRemoved: false,
  });

  await ctx.store.save(omnipoolEntity);
  await ctx.store.save(internalOmnipoolToken);

  omnipoolEntity.account.omnipool = omnipoolEntity;
  await ctx.store.save(omnipoolEntity.account);

  const state = ctx.batchState.state;
  state.accounts.set(omnipoolEntity.account.id, omnipoolEntity.account);

  ctx.batchState.state = {
    omnipoolEntity,
    accounts: state.accounts,
  };
}
