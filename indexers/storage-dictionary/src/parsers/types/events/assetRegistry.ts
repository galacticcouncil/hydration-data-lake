export type AssetRegistryLocationSetEventParams = {
  assetId: number;
  location: AssetRegistryAssetLocation;
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

export interface AssetLocationJunction_AccountKey20 {
  __kind: 'AccountKey20';
  network?: string | undefined | null;
  key: string;
}

export type AssetLocationJunction_Any = {
  __kind: string;
} & Record<string, any>;
