import { Injectable } from '@nestjs/common';
import { isAddress as isEthAddress } from 'ethers';
import { decodeAddress, isAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

@Injectable()
export class CryptoUtils {
  constructor() {}

  isEvmAddress(maybeAddress?: string): boolean {
    if (!maybeAddress) return false;
    try {
      return isEthAddress(maybeAddress);
    } catch (e) {
      return false;
    }
  }

  isSubstrateAddress(maybeAddress?: string): boolean {
    if (!maybeAddress) return false;
    try {
      return isAddress(maybeAddress);
    } catch (e) {
      return false;
    }
  }

  ss58ToHex(address: string | Uint8Array) {
    const publicKey = decodeAddress(address);
    return u8aToHex(publicKey);
  }
}
