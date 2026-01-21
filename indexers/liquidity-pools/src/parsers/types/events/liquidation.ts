export type LiquidationLiquidatedEventParams = {
  userEvmAddress: string;
  collateralAssetRegistryId: string;
  debtAssetRegistryId: string;
  profit: bigint;
};
