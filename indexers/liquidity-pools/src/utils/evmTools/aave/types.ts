import {
  HsmFacilitatorAddedEventParams,
  HsmFacilitatorBucketCapacityUpdatedEventParams,
  HsmFacilitatorBucketLevelUpdatedEventParams,
  HsmFacilitatorRemovedEventParams,
  MmBorrowEventParams,
  MmLiquidationCallEventParams,
  MmMintedToTreasuryEventParams,
  MmRepayEventParams,
  MmReserveUsedAsCollateralDisabledEventParams,
  MmReserveUsedAsCollateralEnabledEventParams,
  MmSupplyEventParams,
  MmTransferEventParams,
  MmUserEModeSetEventParams,
  MmWithdrawEventParams,
  OracleUpdateEventParams,
  PoolReserveDataUpdatedEventParams,
} from '../../../parsers/types/events';
import { AssetResourceType, EvmEventName } from '../../../model';
import { ContractsPoolManager } from '../contractsPoolManager';
import { Contract, ContractInterface, ethers } from 'ethers';

export type EvmEventParamsTypeDecorated<N extends EvmEventName> =
  N extends EvmEventName.Transfer
    ? MmTransferEventParams
    : N extends EvmEventName.Supply
      ? MmSupplyEventParams
      : N extends EvmEventName.Withdraw
        ? MmWithdrawEventParams
        : N extends EvmEventName.Borrow
          ? MmBorrowEventParams
          : N extends EvmEventName.Repay
            ? MmRepayEventParams
            : N extends EvmEventName.UserEModeSet
              ? MmUserEModeSetEventParams
              : N extends EvmEventName.LiquidationCall
                ? MmLiquidationCallEventParams
                : N extends EvmEventName.ReserveUsedAsCollateralEnabled
                  ? MmReserveUsedAsCollateralEnabledEventParams
                  : N extends EvmEventName.ReserveUsedAsCollateralDisabled
                    ? MmReserveUsedAsCollateralDisabledEventParams
                    : N extends EvmEventName.OracleUpdate
                      ? OracleUpdateEventParams
                      : N extends EvmEventName.ReserveDataUpdated
                        ? PoolReserveDataUpdatedEventParams
                        : N extends EvmEventName.FacilitatorBucketCapacityUpdated
                          ? HsmFacilitatorBucketCapacityUpdatedEventParams
                          : N extends EvmEventName.FacilitatorBucketLevelUpdated
                            ? HsmFacilitatorBucketLevelUpdatedEventParams
                            : N extends EvmEventName.FacilitatorAdded
                              ? HsmFacilitatorAddedEventParams
                              : N extends EvmEventName.FacilitatorRemoved
                                ? HsmFacilitatorRemovedEventParams
                                : N extends EvmEventName.MintedToTreasury
                                  ? MmMintedToTreasuryEventParams
                                  : never;

export type AccountMmPositionDataContractData = {
  totalCollateralBase: string;
  totalDebtBase: string;
  availableBorrowsBase: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
  pool: string;
};

export type UserReserveDataContractData = {
  underlyingAsset: string;
  scaledATokenBalance: string;
  usageAsCollateralEnabledOnUser: boolean;
  stableBorrowRate: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
  stableBorrowLastUpdateTimestamp: string;
};

export type AaveMoneyMarketInstanceConfig = {
  marketId: string;
  treasuryAddress: string;
  poolAddressProviderAddress: string;
  poolDataProviderAddress: string;
  poolImplementationProxyAddress: string;
};

export type MoneyMarketTokenDetails = {
  address: string;
  resourceType: AssetResourceType;
  underlyingAssetAddress?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
};

export type MoneyMarketTokenTotalSupply = {
  address: string;
  value: string;
};

export type MoneyMarketResourceDetails = {
  underlyingAssetAddress: string;
  aTokenAddress: string;
  variableDebtTokenAddress: string;
  interestRateStrategyAddress: string;

  name: string;
  symbol: string;
  decimals: number;

  priceOracle: string;
  reserveFactor: string;
  usageAsCollateralEnabled: boolean;
  borrowingEnabled: boolean;
  isActive: boolean;
  isFrozen: boolean;
  isPaused: boolean;
  isSiloedBorrowing: boolean;
  accruedToTreasury: string;
  unbacked: string;
  flashLoanEnabled: boolean;
  debtCeiling: string;
  debtCeilingDecimals: string;
  eModeCategoryId: string;
  borrowCap: string;
  supplyCap: string;
  borrowableInIsolation: boolean;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  baseVariableBorrowRate: string;
  optimalUsageRatio: string;

  liquidityIndex: string;
  variableBorrowIndex: string;
  liquidityRate: string;
  variableBorrowRate: string;

  lastUpdateTimestamp: string;
};

export type AaveFacilitatorContractData = {
  address: string;
  label: string;
  bucketCapacity: string;
  bucketLevel: string;
};

export type WithMarketTag<T> = T & {
  poolImplementationProxyAddress: string;
};

export type ReservesDetailsRegistryKey =
  `${string}::${string}`;
