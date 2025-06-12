import { ProcessingTopic } from '../types';
import {
  AccountBalances,
  AssetDynamicFee,
  MinifiedDataStructure,
  MinifiedDataStructureTypeName,
  OmnipoolAssetState,
  Tradability,
} from '../apiTypes/types';

export type EncodedDataStructure<T> =
  T extends MinifiedDataStructureTypeName.AccountBalances
    ? AccountBalances
    : T extends MinifiedDataStructureTypeName.OmnipoolAssetState
      ? OmnipoolAssetState
      : T extends MinifiedDataStructureTypeName.AssetDynamicFee
        ? AssetDynamicFee
        : never;

export class MinifiedDataStructureManager {
  static encodeStruct<T extends MinifiedDataStructureTypeName>(
    src: any
  ): EncodedDataStructure<T> {
    if (!src || !src.t || !src.d) return src;

    const { t, d } = src as MinifiedDataStructure;

    switch (t) {
      case MinifiedDataStructureTypeName.AccountBalances:
        return {
          free: d[0],
          reserved: d[1],
          miscFrozen: d[2],
          feeFrozen: d[3],
          frozen: d[4],
          flags: d[5],
        } as EncodedDataStructure<T>;

      case MinifiedDataStructureTypeName.OmnipoolAssetState:
        return {
          hubReserve: d[0],
          shares: d[1],
          protocolShares: d[2],
          cap: d[3],
          tradable: { bits: +d[4] } as Tradability,
        } as EncodedDataStructure<T>;

      case MinifiedDataStructureTypeName.AssetDynamicFee:
        return {
          assetFee: +d[0],
          protocolFee: +d[1],
          timestamp: +d[2],
        } as EncodedDataStructure<T>;

      default:
        return src;
    }
  }
}
