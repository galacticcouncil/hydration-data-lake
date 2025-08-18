export type HsmCollateralAddedEventParams = {
  assetId: number;
  poolId: number;
  purchaseFee: number;
  maxBuyPriceCoefficient: bigint;
  buyBackFee: number;
  buybackRate: number;
};

export type HsmCollateralRemovedEventParams = {
  assetId: number;
  amount?: bigint;
};

export type HsmCollateralUpdatedEventParams = {
  assetId: number;
  purchaseFee?: number;
  buyBackFee?: number;
  buybackRate?: number;
};
