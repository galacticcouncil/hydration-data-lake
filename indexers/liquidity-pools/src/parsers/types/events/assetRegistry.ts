import { AssetMultiLocationsInteriorKind, AssetType } from '../../../model';

export type AssetRegistryRegisteredEventParams = {
  assetId: number;
  assetName?: string;
  assetType: AssetType;
  existentialDeposit: bigint;
  xcmRateLimit?: bigint;
  symbol?: string;
  decimals?: number;
  isSufficient: boolean;
};

export type AssetRegistryUpdatedEventParams = {
  assetId: number;
  assetName?: string;
  assetType: AssetType;
  existentialDeposit: bigint;
  xcmRateLimit?: bigint;
  symbol?: string;
  decimals?: number;
  isSufficient: boolean;
};

export type AssetRegistryLocationSetEventParams = {
  assetId: number;
  location: AssetRegistryAssetLocation;
};

export type AssetRegistryLocationWithAssetId = {
  assetId: number;
  location: AssetRegistryAssetLocation | null;
};

export type AssetRegistryAssetLocation = {
  parents: number;
  interior: AssetLocationJunctions;
};

export type AssetLocationJunctions =
  | AssetLocationJunctions_Here
  | AssetLocationJunctions_X1
  | AssetLocationJunctions_X2
  | AssetLocationJunctions_X3
  | AssetLocationJunctions_X4
  | AssetLocationJunctions_X5
  | AssetLocationJunctions_X6
  | AssetLocationJunctions_X7
  | AssetLocationJunctions_X8;

export interface AssetLocationJunctions_Here {
  __kind: 'Here';
}

export interface AssetLocationJunctions_X1 {
  __kind: 'X1';
  value: AssetLocationJunction;
}

export interface AssetLocationJunctions_X2 {
  __kind: 'X2';
  value: [AssetLocationJunction, AssetLocationJunction];
}

export interface AssetLocationJunctions_X3 {
  __kind: 'X3';
  value: [AssetLocationJunction, AssetLocationJunction, AssetLocationJunction];
}

export interface AssetLocationJunctions_X4 {
  __kind: 'X4';
  value: [
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
  ];
}

export interface AssetLocationJunctions_X5 {
  __kind: 'X5';
  value: [
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
  ];
}

export interface AssetLocationJunctions_X6 {
  __kind: 'X6';
  value: [
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
  ];
}

export interface AssetLocationJunctions_X7 {
  __kind: 'X7';
  value: [
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
  ];
}

export interface AssetLocationJunctions_X8 {
  __kind: 'X8';
  value: [
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
    AssetLocationJunction,
  ];
}

export type AssetLocationJunction =
  | AssetLocationJunction_AccountKey20
  | AssetLocationJunction_Any;

export type AssetLocationJunction_AccountKey20 = {
  // __kind: AssetMultiLocationsInteriorKind.AccountKey20;
  __kind: 'AccountKey20';
  network?: string | undefined | null;
  key: string;
} & Record<string, any>;

export type AssetLocationJunction_Any = {
  __kind:
    | string
    | 'Here'
    | 'X1'
    | 'X2'
    | 'X3'
    | 'X4'
    | 'X5'
    | 'X6'
    | 'X7'
    | 'X8'
    | 'Plurality'
    | 'Parachain'
    | 'OnlyChild'
    | 'PalletInstance'
    | 'GlobalConsensus'
    | 'GeneralKey'
    | 'GeneralIndex'
    | 'AccountId32'
    | 'AccountIndex64'
    | 'AccountKey20';
} & Record<string, any>;
