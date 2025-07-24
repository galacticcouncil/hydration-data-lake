import { Block, ProcessorContext } from '../../processor';
import { Account, AccountType } from '../../model';
import { Store } from '@subsquid/typeorm-store';
import { EvmUtils } from '../../utils/evm/evmUtils';
import parsers from '../../parsers';
import { constants } from 'ethers';
import { EvmAccountsUtils } from '../../utils/evm/evmAccountsUtils';

export async function getOrCreateAccount({
  ctx,
  id,
  accountType = AccountType.User,
  ensureAccountType = false,
  boundEvmAddress,
  ensureBoundEvmAddress = false,
}: {
  ctx: ProcessorContext<Store>;
  id: string;
  accountType?: AccountType;
  ensureAccountType?: boolean;
  boundEvmAddress?: string;
  ensureBoundEvmAddress?: boolean;
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
    await ctx.store.save(acc);
  }

  if (acc) return acc;

  acc = await ctx.store.findOne(Account, { where: { id } });

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
}: {
  ctx: ProcessorContext<Store>;
  evmAddress: string;
}) {
  const batchState = ctx.batchState.state;

  let accout = [...batchState.accounts.values()].find(
    (acc) => acc.boundEvmAddress === evmAddress
  );
  if (accout) return accout;

  accout = await ctx.store.findOne(Account, {
    where: { boundEvmAddress: evmAddress },
  });

  if (!accout) return null;

  ctx.batchState.state.accounts.set(accout.id, accout);

  return accout;
}

export async function getOrCreateAccountByBoundEvmAddress({
  ctx,
  evmAddress,
  blockHeader,
}: {
  ctx: ProcessorContext<Store>;
  evmAddress: string;
  blockHeader: Block;
}) {
  const existingAccount = await getAccountByBoundEvmAddress({
    ctx,
    evmAddress,
  });

  if (existingAccount && existingAccount.boundEvmAddress)
    return existingAccount;

  const accountExtension =
    await parsers.storage.evmAccounts.getAccountExtension({
      evmAddress,
      block: blockHeader,
    });

  const addressFromPrevBlocks =
    EvmAccountsUtils.getInstance().extractAddressFromHistoryCache(evmAddress);

  if (
    !accountExtension &&
    evmAddress !== constants.AddressZero &&
    !addressFromPrevBlocks
  )
    return existingAccount;

  const accountId = accountExtension
    ? EvmUtils.getSr25519FromH160AndExtension(evmAddress, accountExtension)
    : EvmUtils.addressToHex(EvmUtils.getDerivedSs58FromH160(evmAddress));

  return getOrCreateAccount({
    ctx,
    id: accountId,
    boundEvmAddress: evmAddress,
    ensureBoundEvmAddress: true,
  });
}
