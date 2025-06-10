import {
  DataStructureTypeName,
  MinifiedDataStructure,
  Tradability,
} from '../model';
import {
  AccountData,
  AssetDynamicFeeData,
  OmnipoolAssetState,
} from '../parsers/types/storage';

export type MinifiedDataStructureSrc<T extends DataStructureTypeName> =
  T extends DataStructureTypeName.AccountBalances
    ? AccountData
    : T extends DataStructureTypeName.AssetDynamicFee
      ? AssetDynamicFeeData
      : T extends DataStructureTypeName.OmnipoolAssetState
        ? OmnipoolAssetState
        : never;

export class MinifiedDataStructuresManager {
  static getMinifiedDataStructure<T extends DataStructureTypeName>(
    src: MinifiedDataStructureSrc<T>,
    typeName: T
  ) {
    let data: string[] = [];
    switch (typeName) {
      case DataStructureTypeName.AccountBalances: {
        const { free, reserved, miscFrozen, frozen, feeFrozen, flags } =
          src as AccountData;
        data = [
          free.toString(),
          reserved.toString(),
          miscFrozen.toString(),
          feeFrozen.toString(),
          frozen.toString(),
          flags.toString(),
        ];
        break;
      }
      case DataStructureTypeName.AssetDynamicFee: {
        const { assetFee, protocolFee, timestamp } = src as AssetDynamicFeeData;
        data = [`${assetFee}`, `${protocolFee}`, `${timestamp}`];
        break;
      }
      case DataStructureTypeName.OmnipoolAssetState: {
        const { hubReserve, cap, shares, protocolShares, tradable } =
          src as OmnipoolAssetState;
        data = [
          hubReserve.toString(),
          shares.toString(),
          protocolShares.toString(),
          cap.toString(),
          `${tradable.bits}`,
        ];
        break;
      }
      default:
    }

    return new MinifiedDataStructure({
      t: typeName,
      d: data,
    });
  }
}
