import {
  CurrenciesApiAccountData,
  CurrenciesApiAccountInput,
  CurrenciesApiAccountsData,
  CurrenciesApiAccountsInput,
} from '../types';
import { UnknownVersionError } from '../../../utils/errors';
import { ScaleCodecManager } from '../scaleCodecManager';
import { u8aToHex } from '@polkadot/util';
import { u32 } from 'scale-ts';

export async function getAccount({
  block,
  address,
  assetId,
}: CurrenciesApiAccountInput): Promise<CurrenciesApiAccountData> {
  const decoders = ScaleCodecManager.getInstance().decoders;

  if (block.specVersion === 264) {
    return decoders.v264.CurrenciesApi.account.dec(
      await block._runtime.rpc.call(`state_call`, [
        'CurrenciesApi_account',
        u8aToHex(u32.enc(assetId)) + address.substring(2),
      ])
    );
  }

  throw new UnknownVersionError('runtimeApi.CurrenciesApi.account');
}

export async function getAccounts({
  block,
  address,
}: CurrenciesApiAccountsInput): Promise<CurrenciesApiAccountsData> {
  const decoders = ScaleCodecManager.getInstance().decoders;

  if (block.specVersion === 264) {
    return decoders.v264.CurrenciesApi.accounts
      .dec(
        await block._runtime.rpc.call(`state_call`, [
          'CurrenciesApi_accounts',
          address,
        ])
      )
      .map(([assetId, data]) => ({
        assetId,
        data,
      }));
  }

  throw new UnknownVersionError('runtimeApi.CurrenciesApi.accounts');
}

export default { getAccounts, getAccount };
