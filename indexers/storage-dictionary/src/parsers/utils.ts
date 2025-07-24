import { Erc20AssetContractDetails } from './types/storage';
import { AssetRegistryAssetLocation } from './types/events';

export function getErc20AssetContractFromLocation(
  location?: AssetRegistryAssetLocation
): Erc20AssetContractDetails | null {
  if (!location) return null;

  try {
    switch (location.interior.__kind) {
      case 'X1':
        return {
          address: location.interior.value.key,
        };
      case 'X2':
        return {
          address: location.interior.value[1].key,
        };
      case 'X3':
        return {
          address: location.interior.value[2].key,
        };
      case 'X4':
        return {
          address: location.interior.value[3].key,
        };
      case 'X5':
        return {
          address: location.interior.value[4].key,
        };
      case 'X6':
        return {
          address: location.interior.value[5].key,
        };
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
}
