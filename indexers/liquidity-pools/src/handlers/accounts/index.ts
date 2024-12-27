import { Account } from '../../model';
import { ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { FindOptionsRelations } from 'typeorm';
import { Entity } from '@subsquid/typeorm-store/src/store';

export async function getAccount(
  ctx: ProcessorContext<Store>,
  id: string,
  relations: FindOptionsRelations<Account> = {
    dcaSchedules: true,
  }
): Promise<Account> {
  const batchState = ctx.batchState.state;

  let acc = batchState.accounts.get(id);
  if (!acc)
    acc = await ctx.store.findOne(Account, { where: { id }, relations });

  if (!acc) {
    acc = new Account();
    acc.id = id;
    batchState.accounts.set(id, acc);
    ctx.batchState.state = { accounts: batchState.accounts };
    await ctx.store.save(acc);
  }
  return acc;
}

export async function saveAllBatchAccounts(ctx: ProcessorContext<Store>) {
  await ctx.store.save([...ctx.batchState.state.accounts.values()]);
}
