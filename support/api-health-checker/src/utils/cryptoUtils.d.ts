export declare class CryptoUtils {
    constructor();
    isEvmAddress(maybeAddress?: string): boolean;
    isSubstrateAddress(maybeAddress?: string): boolean;
    substrateAddressToHex(address: string | Uint8Array): `0x${string}`;
}
