import { EventName } from '../../../types/events';
import {
  LbpBuyExecutedData,
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
  LbpSellExecutedData,
} from '../lbp';
import { TokensTransferData } from '../tokens';
import { BalancesTransferData } from '../balances';
import {
  XykBuyExecutedData,
  XykLiquidityAddedData,
  XykLiquidityRemovedData,
  XykPoolCreatedData,
  XykPoolDestroyedData,
  XykSellExecutedData,
} from '../xyk';
import {
  OmnipoolBuyExecutedData,
  OmnipoolLiquidityAddedData,
  OmnipoolLiquidityRemovedData,
  OmnipoolPositionCreatedData,
  OmnipoolPositionDestroyedData,
  OmnipoolPositionUpdatedData,
  OmnipoolSellExecutedData,
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
} from '../omnipool';
import {
  StableswapBuyExecutedData,
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
  StableswapPoolCreatedData,
  StableswapSellExecutedData,
} from '../stableswap';
import {
  AssetRegistryLocationSetData,
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../assetRegistry';
import {
  DcaCompletedData,
  DcaExecutionPlannedData,
  DcaRandomnessGenerationFailedData,
  DcaScheduledData,
  DcaTerminatedData,
  DcaTradeExecutedData,
  DcaTradeFailedData,
} from '../dca';
import {
  OtcOrderCancelledData,
  OtcOrderFilledData,
  OtcOrderPartiallyFilledData,
  OtcOrderPlacedData,
} from '../otc';
import {
  BroadcastSwapped2Data,
  BroadcastSwapped3Data,
  BroadcastSwappedData,
} from '../broadcast';
import { EvmLogData } from '../evm';
import { EvmAccountsBoundData } from '../evmAccounts';
import { CurrenciesTransferredData } from '../currencies';
import {
  HsmCollateralAddedData,
  HsmCollateralRemovedData,
  HsmCollateralUpdatedData,
} from '../hsm';
import { EventId, UniquesTransferredData } from '../index';
import {
  OmnipoolLMDepositDestroyedData,
  OmnipoolLMGlobalFarmCreatedData,
  OmnipoolLMGlobalFarmTerminatedData,
  OmnipoolLMGlobalFarmUpdatedData,
  OmnipoolLMRewardClaimedData,
  OmnipoolLMSharesDepositedData,
  OmnipoolLMSharesRedepositedData,
  OmnipoolLMSharesWithdrawnData,
  OmnipoolLMYieldFarmCreatedData,
  OmnipoolLMYieldFarmResumedData,
  OmnipoolLMYieldFarmStoppedData,
  OmnipoolLMYieldFarmTerminatedData,
  OmnipoolLMYieldFarmUpdatedData,
} from '../omnipoolLiquidityMining';
import {
  OmnipoolWarehouseLMAllRewardsDistributedData,
  OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedData,
  OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedData,
} from '../omnipoolWarehouseLM';
import {
  XykLMDepositDestroyedData,
  XykLMGlobalFarmCreatedData,
  XykLMGlobalFarmTerminatedData,
  XykLMGlobalFarmUpdatedData,
  XykLMRewardClaimedData,
  XykLMSharesDepositedData,
  XykLMSharesRedepositedData,
  XykLMSharesWithdrawnData,
  XykLMYieldFarmCreatedData,
  XykLMYieldFarmResumedData,
  XykLMYieldFarmStoppedData,
  XykLMYieldFarmTerminatedData,
  XykLMYieldFarmUpdatedData,
} from '../xykLiquidityMining';

export type BatchBlocksParsedDataScope = Map<
  EventName,
  Map<EventId, ParsedEventsCallsData>
>;

type LbpEventData =
  | LbpPoolCreatedData
  | LbpPoolUpdatedData
  | LbpBuyExecutedData
  | LbpSellExecutedData;

type XykEventData =
  | XykPoolCreatedData
  | XykPoolDestroyedData
  | XykBuyExecutedData
  | XykSellExecutedData
  | XykLiquidityAddedData
  | XykLiquidityRemovedData;

type XykLMEventData =
  | XykLMGlobalFarmCreatedData
  | XykLMGlobalFarmUpdatedData
  | XykLMGlobalFarmTerminatedData
  | XykLMYieldFarmCreatedData
  | XykLMYieldFarmStoppedData
  | XykLMYieldFarmTerminatedData
  | XykLMYieldFarmResumedData
  | XykLMYieldFarmUpdatedData
  | XykLMSharesDepositedData
  | XykLMSharesRedepositedData
  | XykLMSharesWithdrawnData
  | XykLMDepositDestroyedData
  | XykLMRewardClaimedData;

type OmnipoolEventData =
  | OmnipoolTokenAddedData
  | OmnipoolTokenRemovedData
  | OmnipoolBuyExecutedData
  | OmnipoolSellExecutedData
  | OmnipoolLiquidityAddedData
  | OmnipoolLiquidityRemovedData
  | OmnipoolPositionCreatedData
  | OmnipoolPositionDestroyedData
  | OmnipoolPositionUpdatedData;

type OmnipoolLMEventData =
  | OmnipoolLMGlobalFarmCreatedData
  | OmnipoolLMGlobalFarmUpdatedData
  | OmnipoolLMGlobalFarmTerminatedData
  | OmnipoolLMYieldFarmCreatedData
  | OmnipoolLMYieldFarmStoppedData
  | OmnipoolLMYieldFarmResumedData
  | OmnipoolLMYieldFarmUpdatedData
  | OmnipoolLMYieldFarmTerminatedData
  | OmnipoolLMSharesDepositedData
  | OmnipoolLMSharesRedepositedData
  | OmnipoolLMRewardClaimedData
  | OmnipoolLMSharesWithdrawnData
  | OmnipoolLMDepositDestroyedData;

type OmnipoolWarehouseLMEventData =
  | OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedData
  | OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedData
  | OmnipoolWarehouseLMAllRewardsDistributedData;

type StableswapEventData =
  | StableswapPoolCreatedData
  | StableswapBuyExecutedData
  | StableswapSellExecutedData
  | StableswapLiquidityAddedData
  | StableswapLiquidityRemovedData;

type HsmEventData =
  | HsmCollateralAddedData
  | HsmCollateralRemovedData
  | HsmCollateralUpdatedData;

type DcaEventData =
  | DcaScheduledData
  | DcaExecutionPlannedData
  | DcaTradeExecutedData
  | DcaTradeFailedData
  | DcaTerminatedData
  | DcaCompletedData
  | DcaRandomnessGenerationFailedData;

type OtcEventData =
  | OtcOrderPlacedData
  | OtcOrderCancelledData
  | OtcOrderFilledData
  | OtcOrderPartiallyFilledData;

type AssetRegistryEventData =
  | AssetRegistryRegisteredData
  | AssetRegistryUpdatedData
  | AssetRegistryLocationSetData;

type BalancesEventData = BalancesTransferData;

type BroadcastEventData =
  | BroadcastSwappedData
  | BroadcastSwapped2Data
  | BroadcastSwapped3Data;

type TokensEventData = TokensTransferData;

type EvmEventData = EvmLogData;

type EvmAccountsEventData = EvmAccountsBoundData;

type CurrenciesEventData = CurrenciesTransferredData;

type UniquesEventData = UniquesTransferredData;

export type ParsedEventsCallsData =
  | LbpEventData
  | XykEventData
  | XykLMEventData
  | OmnipoolEventData
  | OmnipoolLMEventData
  | OmnipoolWarehouseLMEventData
  | StableswapEventData
  | HsmEventData
  | DcaEventData
  | OtcEventData
  | AssetRegistryEventData
  | BalancesEventData
  | BroadcastEventData
  | TokensEventData
  | EvmEventData
  | EvmAccountsEventData
  | CurrenciesEventData
  | UniquesEventData;
