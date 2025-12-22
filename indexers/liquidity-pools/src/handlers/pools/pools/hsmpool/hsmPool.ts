import { Store } from '@subsquid/typeorm-store';

import { AccountType, Hsmpool } from '../../../../model';
import { SqdProcessorContext } from '../../../../processor';
import { getOrCreateAccount } from '../../../accounts';

export async function ensureHsmpool(ctx: SqdProcessorContext<Store>) {
  if (ctx.batchState.state.hsmpoolEntity) return;

  let hsmpoolEntity =
    (await ctx.storeUtils.findOneWithLogs(
      Hsmpool,
      {
        where: { id: ctx.appConfig.HSMPOOL_ADDRESS },
        relations: {
          collaterals: { stableswap: true },
        },
      },
      { className: 'Hsmpool' }
    )) ?? null;

  if (!!hsmpoolEntity) {
    ctx.batchState.state.hsmpoolEntity = hsmpoolEntity;
    return;
  }

  hsmpoolEntity = new Hsmpool();
  hsmpoolEntity.id = ctx.appConfig.HSMPOOL_ADDRESS;
  hsmpoolEntity.accountId = ctx.appConfig.HSMPOOL_ADDRESS;

  const hsmAccount = await getOrCreateAccount({
    ctx,
    id: hsmpoolEntity.accountId,
    accountType: AccountType.Hsmpool,
    ensureAccountType: true,
  });

  await ctx.store.save(hsmpoolEntity);

  hsmAccount.hsmpool = hsmpoolEntity;
  // await ctx.store.save(hsmpoolEntity.account);
  await ctx.storeUtils.runWithRetry(() => ctx.store.save(hsmAccount));

  ctx.batchState.state.hsmpoolEntity = hsmpoolEntity;
  ctx.batchState.state.accounts.set(hsmAccount.id, hsmAccount);
}
