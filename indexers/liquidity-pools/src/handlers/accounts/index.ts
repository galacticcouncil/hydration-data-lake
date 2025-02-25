import { Account, AccountType } from '../../model';
import { SqdBlock, SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { FindOptionsRelations, Like } from 'typeorm';
import parsers from '../../parsers';
import { EvmUtils } from '../../utils/evm';

export async function getAccount({
  ctx,
  id,
  accountType = AccountType.User,
  ensureAccountType = false,
  boundEvmAddress,
  ensureBoundEvmAddress = false,
  relations = {
    dcaSchedules: true,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  id: string;
  accountType?: AccountType;
  ensureAccountType?: boolean;
  boundEvmAddress?: string;
  ensureBoundEvmAddress?: boolean;
  relations?: FindOptionsRelations<Account>;
}): Promise<Account> {
  const batchState = ctx.batchState.state;

  let acc = batchState.accounts.get(id);

  if (
    acc &&
    (ensureAccountType || (boundEvmAddress && ensureBoundEvmAddress))
  ) {
    if (ensureAccountType) acc.accountType = accountType;

    if (boundEvmAddress && ensureBoundEvmAddress)
      acc.boundEvmAddress = boundEvmAddress;

    ctx.batchState.state.accounts.set(acc.id, acc);
  }

  if (acc) return acc;

  acc = await ctx.store.findOne(Account, { where: { id }, relations });

  if (
    acc &&
    (ensureAccountType || (boundEvmAddress && ensureBoundEvmAddress))
  ) {
    if (ensureAccountType) acc.accountType = accountType;

    if (boundEvmAddress && ensureBoundEvmAddress)
      acc.boundEvmAddress = boundEvmAddress;

    await ctx.store.save(acc);
  }

  if (!acc) {
    let boundEvmAddressToSave = boundEvmAddress ?? null;

    if (!boundEvmAddressToSave) {
      boundEvmAddressToSave = EvmUtils.isSr25519AddressDerivedFromH160Address(
        id
      )
        ? EvmUtils.getH160FromDerivedSr25519(id)
        : EvmUtils.getH160FromOriginalSr25519(id);
    }

    acc = new Account();
    acc.id = id;
    acc.accountType = accountType;
    acc.boundEvmAddress = boundEvmAddressToSave;
    await ctx.store.save(acc);
  }
  ctx.batchState.state.accounts.set(acc.id, acc);

  return acc;
}

export async function getAccountByBoundEvmAddress({
  ctx,
  evmAddress,
  relations = {
    dcaSchedules: true,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  evmAddress: string;
  relations?: FindOptionsRelations<Account>;
}) {
  const batchState = ctx.batchState.state;

  let accout = [...batchState.accounts.values()].find(
    (acc) => acc.boundEvmAddress === evmAddress
  );
  if (accout) return accout;

  accout = await ctx.store.findOne(Account, {
    where: { boundEvmAddress: evmAddress },
    relations,
  });

  if (!accout) return null;

  ctx.batchState.state.accounts.set(accout.id, accout);

  return accout;
}

export async function getAccountByAddressPart({
  ctx,
  substring,
  relations = {
    dcaSchedules: true,
  },
}: {
  ctx: SqdProcessorContext<Store>;
  substring: string;
  relations?: FindOptionsRelations<Account>;
}) {
  const batchState = ctx.batchState.state;

  let account = [...batchState.accounts.values()].find(
    (acc) => acc.id.indexOf(substring) !== -1
  );
  if (account) return account;

  account = await ctx.store.findOne(Account, {
    where: { id: Like(substring) },
    relations,
  });

  if (!account) return null;

  ctx.batchState.state.accounts.set(account.id, account);

  return account;
}

export async function getOrCreateAccountByBoundEvmAddress({
  ctx,
  evmAddress,
  blockHeader,
}: {
  ctx: SqdProcessorContext<Store>;
  evmAddress: string;
  blockHeader: SqdBlock;
}) {
  let existingAccount = await getAccountByBoundEvmAddress({
    ctx,
    evmAddress,
  });

  if (existingAccount) return existingAccount;

  const accountExtension =
    await parsers.storage.evmAccounts.getAccountExtension({
      evmAddress,
      block: blockHeader,
    });

  const accountId = EvmUtils.getSr25519FromH160AndExtension(
    evmAddress,
    accountExtension
  );

  return getAccount({
    ctx,
    id: accountId,
    boundEvmAddress: evmAddress,
    ensureBoundEvmAddress: true,
  });

  // if (!accountExtension) {
  //   // const accountId = addressToHex(convertFromH160(evmAddress));
  //   return getAccount({ ctx, id: accountId });
  // }
  //
  // existingAccount = await getAccountByAddressPart({
  //   ctx,
  //   substring: accountExtension,
  // });
  //
  // return existingAccount;
}

export async function saveAllBatchAccounts(ctx: SqdProcessorContext<Store>) {
  await ctx.store.save([...ctx.batchState.state.accounts.values()]);
}
