import { SqdProcessorContext } from '../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AccountType, Hsmpool } from '../../../../model';
import { getOrCreateAccount } from '../../../accounts';

export async function ensureHsmpool(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.hsmpoolEntity) return;

  let hsmpoolEntity =
    (await ctx.store.findOne(Hsmpool, {
      where: { id: ctx.appConfig.HSMPOOL_ADDRESS },
      relations: {
        collaterals: { asset: true, stableswap: true },
        account: true,
      },
    })) ?? null;

  if (!!hsmpoolEntity) {
    ctx.batchState.state.hsmpoolEntity = hsmpoolEntity;
    return;
  }

  hsmpoolEntity = new Hsmpool();
  hsmpoolEntity.id = ctx.appConfig.HSMPOOL_ADDRESS;
  hsmpoolEntity.account = await getOrCreateAccount({
    ctx,
    id: ctx.appConfig.HSMPOOL_ADDRESS,
    accountType: AccountType.Hsmpool,
    ensureAccountType: true,
  });

  await ctx.store.save(hsmpoolEntity);

  hsmpoolEntity.account.hsmpool = hsmpoolEntity;
  // await ctx.store.save(hsmpoolEntity.account);
  await ctx.storeUtils.runWithRetry(() =>
    ctx.store.save(hsmpoolEntity.account)
  );

  ctx.batchState.state.hsmpoolEntity = hsmpoolEntity;
  ctx.batchState.state.accounts.set(
    hsmpoolEntity.account.id,
    hsmpoolEntity.account
  );
}
