import { HYDRADX_SS58_PREFIX } from './consts';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { Buffer } from 'buffer';
import { hexToU8a, stringToU8a, u8aConcat, u8aToHex } from '@polkadot/util';
import { ethers } from 'ethers';

export class EvmUtils {
  static ETH_PREFIX_ENCODED = '45544800';
  static ETH_PREFIX = 'ETH\0';
  static ASSET_PREFIX_BUFFER = Buffer.from(
    '0000000000000000000000000000000100000000',
    'hex'
  );

  static isAssetAddress(address: string) {
    const addressBuffer = Buffer.from(address.replace('0x', ''), 'hex');

    if (addressBuffer.length !== 20) return false;

    return addressBuffer
      .subarray(0, 16)
      .equals(this.ASSET_PREFIX_BUFFER.subarray(0, 16));
  }

  static convertH160ToAssetId(h160Address: string) {
    if (h160Address === undefined || h160Address === null) return null;
    try {
      const addressNormalized = ethers.utils.getAddress(h160Address);

      const addressBuffer = Buffer.from(
        addressNormalized.replace('0x', ''),
        'hex'
      );

      if (
        addressBuffer.length !== 20 ||
        !this.isAssetAddress(addressNormalized)
      )
        return null;

      return addressBuffer.readUInt32BE(16);
    } catch (e) {
      return null;
    }
  }
  static convertAssetIdToH160Address(assetId: number, normalize = false) {
    if (assetId === undefined || assetId === null) return null;
    try {
      if (!Number.isInteger(assetId) || assetId < 0) return null;

      const evmAddressBuffer = Buffer.alloc(20, 0);
      evmAddressBuffer[15] = 1;
      evmAddressBuffer.writeUInt32BE(assetId, 16);

      return normalize
        ? ethers.utils.getAddress('0x' + evmAddressBuffer.toString('hex'))
        : `0x${evmAddressBuffer.toString('hex')}`;
    } catch (e) {
      return null;
    }
  }

  static addressToHex(address: string | Uint8Array) {
    const publicKey = decodeAddress(address);
    return u8aToHex(publicKey);
  }

  static getSr25519FromH160AndExtension(
    evmAddress: string,
    extension?: string | null
  ) {
    const publicKey = extension
      ? u8aConcat(hexToU8a(evmAddress), hexToU8a(extension))
      : u8aConcat(
          stringToU8a(this.ETH_PREFIX),
          hexToU8a(evmAddress),
          new Uint8Array(8)
        );
    return u8aToHex(publicKey);
  }

  /**
   * Get H160 address from Sr25519 public key of ss58 address, which is derived
   * from root H160 address
   * @param ss58Addr
   */
  static getH160FromDerivedSr25519(ss58Addr: string) {
    const decodedBytes = decodeAddress(ss58Addr);
    const prefixBytes = Buffer.from(this.ETH_PREFIX);
    const addressBytes = decodedBytes.slice(prefixBytes.length, -8);
    return '0x' + Buffer.from(addressBytes).toString('hex');
  }

  /**
   * Get H160 address from Sr25519 public key of ss58 address, which is
   * original account. Result H160 address is source Sr25519 subtract last 12 bytes
   * @param ss58Addr
   */
  static getH160FromOriginalSr25519(ss58Addr: string) {
    const decodedBytes = decodeAddress(ss58Addr);
    const addressBytes = decodedBytes.slice(0, decodedBytes.length - 12);
    return '0x' + Buffer.from(addressBytes).toString('hex');
  }

  static getDerivedSs58FromH160(
    h160Addr: string,
    ss58prefix = HYDRADX_SS58_PREFIX
  ) {
    const addressBytes = Buffer.from(h160Addr.slice(2), 'hex');
    const prefixBytes = Buffer.from(this.ETH_PREFIX);
    const convertBytes = Uint8Array.from(
      Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)])
    );
    return encodeAddress(convertBytes, ss58prefix);
  }

  static isSr25519AddressDerivedFromH160Address(address: string) {
    if (!address) return false;

    try {
      const pub = decodeAddress(address, true);
      const prefixBytes = Buffer.from(this.ETH_PREFIX);
      return Buffer.from(pub.subarray(0, prefixBytes.length)).equals(
        prefixBytes
      );
    } catch {
      return false;
    }
  }
}
