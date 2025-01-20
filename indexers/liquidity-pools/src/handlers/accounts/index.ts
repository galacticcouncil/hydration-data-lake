import { Account, AccountType } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { FindOptionsRelations } from 'typeorm';

export async function getAccount({
  ctx,
  id,
  accountType = AccountType.User,
  ensureAccountType = false,
  relations = {
    dcaSchedules: true,
  },
}: {
  ctx: ProcessorContext<Store>;
  id: string;
  accountType?: AccountType;
  ensureAccountType?: boolean;
  relations?: FindOptionsRelations<Account>;
}): Promise<Account> {
  const batchState = ctx.batchState.state;

  let acc = batchState.accounts.get(id);
  if (acc && ensureAccountType) {
    acc.accountType = accountType;
    ctx.batchState.state.accounts.set(acc.id, acc);
  }
  if (acc) return acc;

  acc = await ctx.store.findOne(Account, { where: { id }, relations });

  if (acc && ensureAccountType) {
    acc.accountType = accountType;
    await ctx.store.save(acc);
  }

  if (!acc) {
    acc = new Account();
    acc.id = id;
    acc.accountType = accountType;
    await ctx.store.save(acc);
  }
  ctx.batchState.state.accounts.set(acc.id, acc);

  return acc;
}

export async function saveAllBatchAccounts(ctx: ProcessorContext<Store>) {
  await ctx.store.save([...ctx.batchState.state.accounts.values()]);
}
