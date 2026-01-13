import {
  CurrenciesApiAccountData,
  CurrenciesApiAccountInput,
  CurrenciesApiAccountsBatchInput,
  CurrenciesApiAccountsData,
  CurrenciesApiAccountsDataForAccount,
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

  if (block.specVersion >= 264) {
    return decoders.v264.CurrenciesApi.account.dec(
      await block._runtime.rpc.call(`state_call`, [
        'CurrenciesApi_account',
        u8aToHex(u32.enc(assetId)) + address.substring(2),
        block.hash,
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

  if (block.specVersion >= 264) {
    return decoders.v264.CurrenciesApi.accounts
      .dec(
        await block._runtime.rpc.call(`state_call`, [
          'CurrenciesApi_accounts',
          address,
          block.hash,
        ])
      )
      .map(([assetId, data]) => ({
        assetId,
        data,
      }));
  }

  throw new UnknownVersionError('runtimeApi.CurrenciesApi.accounts');
}

export async function getAccountsBatch({
  block,
  accountIds,
}: CurrenciesApiAccountsBatchInput): Promise<
  CurrenciesApiAccountsDataForAccount[]
> {
  const decoders = ScaleCodecManager.getInstance().decoders;

  if (block.specVersion >= 264) {
    const rawResp = await block._runtime.rpc.batchCall(
      accountIds.map((address): { method: string; params?: any[] } => ({
        method: 'state_call',
        params: ['CurrenciesApi_accounts', address, block.hash],
      }))
    );
    const decodedResponse = rawResp.map((rawData) =>
      decoders.v264.CurrenciesApi.accounts.dec(rawData)
    );
    const decoratedResponse: CurrenciesApiAccountsDataForAccount[] = [];
    accountIds.forEach((accountId, index) => {
      decoratedResponse.push({
        accountId,
        assetBalances: decodedResponse[index].map(([assetId, data]) => ({
          assetId,
          data,
        })),
      });
    });

    return decoratedResponse;
  }

  throw new UnknownVersionError('runtimeApi.CurrenciesApi.accounts');
}

export default { getAccounts, getAccount, getAccountsBatch };
