import { EventName } from '../../../types/events';
import { TokensTransferData } from '../tokens';
import { BalancesTransferData } from '../balances';
import { CurrenciesTransferredData } from '../currencies';
import {
  AssetRegistryLocationSetData,
  AssetRegistryRegisteredData,
  AssetRegistryUpdatedData,
} from '../assetRegistry';
import {
  LbpBuyExecutedData,
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
  LbpSellExecutedData,
} from '../lbp';
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
import {
  HsmCollateralAddedData,
  HsmCollateralRemovedData,
  HsmCollateralUpdatedData,
} from '../hsm';
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
  XykLMYieldFarmTerminatedEventParsedData,
  XykLMYieldFarmUpdatedData,
} from '../xykLiquidityMining';
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
import { UniquesTransferredData } from '../uniques';

type LbpEventMap = {
  [EventName.LBP_PoolCreated]: LbpPoolCreatedData;
  [EventName.LBP_PoolUpdated]: LbpPoolUpdatedData;
  [EventName.LBP_BuyExecuted]: LbpBuyExecutedData;
  [EventName.LBP_SellExecuted]: LbpSellExecutedData;
};

type XykEventMap = {
  [EventName.XYK_PoolCreated]: XykPoolCreatedData;
  [EventName.XYK_PoolDestroyed]: XykPoolDestroyedData;
  [EventName.XYK_BuyExecuted]: XykBuyExecutedData;
  [EventName.XYK_SellExecuted]: XykSellExecutedData;
  [EventName.XYK_LiquidityAdded]: XykLiquidityAddedData;
  [EventName.XYK_LiquidityRemoved]: XykLiquidityRemovedData;
};
type XykLiquidityMiningMap = {
  [EventName.XYKLiquidityMining_GlobalFarmCreated]: XykLMGlobalFarmCreatedData;
  [EventName.XYKLiquidityMining_GlobalFarmUpdated]: XykLMGlobalFarmUpdatedData;
  [EventName.XYKLiquidityMining_GlobalFarmTerminated]: XykLMGlobalFarmTerminatedData;
  [EventName.XYKLiquidityMining_YieldFarmCreated]: XykLMYieldFarmCreatedData;
  [EventName.XYKLiquidityMining_YieldFarmStopped]: XykLMYieldFarmStoppedData;
  [EventName.XYKLiquidityMining_YieldFarmTerminated]: XykLMYieldFarmTerminatedData;
  [EventName.XYKLiquidityMining_YieldFarmResumed]: XykLMYieldFarmResumedData;
  [EventName.XYKLiquidityMining_YieldFarmUpdated]: XykLMYieldFarmUpdatedData;
  [EventName.XYKLiquidityMining_SharesDeposited]: XykLMSharesDepositedData;
  [EventName.XYKLiquidityMining_SharesRedeposited]: XykLMSharesRedepositedData;
  [EventName.XYKLiquidityMining_SharesWithdrawn]: XykLMSharesWithdrawnData;
  [EventName.XYKLiquidityMining_DepositDestroyed]: XykLMDepositDestroyedData;
  [EventName.XYKLiquidityMining_RewardClaimed]: XykLMRewardClaimedData;
};

type OmnipoolEventMap = {
  [EventName.Omnipool_TokenAdded]: OmnipoolTokenAddedData;
  [EventName.Omnipool_TokenRemoved]: OmnipoolTokenRemovedData;
  [EventName.Omnipool_BuyExecuted]: OmnipoolBuyExecutedData;
  [EventName.Omnipool_SellExecuted]: OmnipoolSellExecutedData;
  [EventName.Omnipool_SellExecuted]: OmnipoolSellExecutedData;
  [EventName.Omnipool_LiquidityAdded]: OmnipoolLiquidityAddedData;
  [EventName.Omnipool_LiquidityRemoved]: OmnipoolLiquidityRemovedData;
  [EventName.Omnipool_PositionCreated]: OmnipoolPositionCreatedData;
  [EventName.Omnipool_PositionDestroyed]: OmnipoolPositionDestroyedData;
  [EventName.Omnipool_PositionUpdated]: OmnipoolPositionUpdatedData;
};

type OmnipoolLiquidityMiningEventMap = {
  [EventName.OmnipoolLiquidityMining_GlobalFarmCreated]: OmnipoolLMGlobalFarmCreatedData;
  [EventName.OmnipoolLiquidityMining_GlobalFarmUpdated]: OmnipoolLMGlobalFarmUpdatedData;
  [EventName.OmnipoolLiquidityMining_GlobalFarmTerminated]: OmnipoolLMGlobalFarmTerminatedData;
  [EventName.OmnipoolLiquidityMining_YieldFarmCreated]: OmnipoolLMYieldFarmCreatedData;
  [EventName.OmnipoolLiquidityMining_YieldFarmStopped]: OmnipoolLMYieldFarmStoppedData;
  [EventName.OmnipoolLiquidityMining_YieldFarmResumed]: OmnipoolLMYieldFarmResumedData;
  [EventName.OmnipoolLiquidityMining_YieldFarmUpdated]: OmnipoolLMYieldFarmUpdatedData;
  [EventName.OmnipoolLiquidityMining_YieldFarmTerminated]: OmnipoolLMYieldFarmTerminatedData;
  [EventName.OmnipoolLiquidityMining_SharesDeposited]: OmnipoolLMSharesDepositedData;
  [EventName.OmnipoolLiquidityMining_SharesRedeposited]: OmnipoolLMSharesRedepositedData;
  [EventName.OmnipoolLiquidityMining_RewardClaimed]: OmnipoolLMRewardClaimedData;
  [EventName.OmnipoolLiquidityMining_SharesWithdrawn]: OmnipoolLMSharesWithdrawnData;
  [EventName.OmnipoolLiquidityMining_DepositDestroyed]: OmnipoolLMDepositDestroyedData;
};

type OmnipoolWarehouseLMEventMap = {
  [EventName.OmnipoolWarehouseLM_GlobalFarmAccRPZUpdated]: OmnipoolWarehouseLMGlobalFarmAccRPZUpdatedData;
  [EventName.OmnipoolWarehouseLM_YieldFarmAccRPVSUpdated]: OmnipoolWarehouseLMYieldFarmAccRPVSUpdatedData;
  [EventName.OmnipoolWarehouseLM_AllRewardsDistributed]: OmnipoolWarehouseLMAllRewardsDistributedData;
};

type StableswapEventMap = {
  [EventName.Stableswap_PoolCreated]: StableswapPoolCreatedData;
  [EventName.Stableswap_BuyExecuted]: StableswapBuyExecutedData;
  [EventName.Stableswap_SellExecuted]: StableswapSellExecutedData;
  [EventName.Stableswap_LiquidityAdded]: StableswapLiquidityAddedData;
  [EventName.Stableswap_LiquidityRemoved]: StableswapLiquidityRemovedData;
};

type AssetRegistryEventMap = {
  [EventName.AssetRegistry_Registered]: AssetRegistryRegisteredData;
  [EventName.AssetRegistry_Updated]: AssetRegistryUpdatedData;
  [EventName.AssetRegistry_LocationSet]: AssetRegistryLocationSetData;
};

type DcaEventMap = {
  [EventName.DCA_Scheduled]: DcaScheduledData;
  [EventName.DCA_ExecutionPlanned]: DcaExecutionPlannedData;
  [EventName.DCA_TradeExecuted]: DcaTradeExecutedData;
  [EventName.DCA_TradeFailed]: DcaTradeFailedData;
  [EventName.DCA_Terminated]: DcaTerminatedData;
  [EventName.DCA_Completed]: DcaCompletedData;
  [EventName.DCA_RandomnessGenerationFailed]: DcaRandomnessGenerationFailedData;
};

type OtcEventMap = {
  [EventName.OTC_Placed]: OtcOrderPlacedData;
  [EventName.OTC_Cancelled]: OtcOrderCancelledData;
  [EventName.OTC_Filled]: OtcOrderFilledData;
  [EventName.OTC_PartiallyFilled]: OtcOrderPartiallyFilledData;
};

type BroadcastEventMap = {
  [EventName.Broadcast_Swapped]: BroadcastSwappedData;
  [EventName.Broadcast_Swapped2]: BroadcastSwapped2Data;
  [EventName.Broadcast_Swapped3]: BroadcastSwapped3Data;
};

type HsmEventMap = {
  [EventName.HSM_CollateralAdded]: HsmCollateralAddedData;
  [EventName.HSM_CollateralRemoved]: HsmCollateralRemovedData;
  [EventName.HSM_CollateralUpdated]: HsmCollateralUpdatedData;
};

type BalancesEventMap = {
  [EventName.Balances_Transfer]: BalancesTransferData;
};

type TokensEventMap = {
  [EventName.Tokens_Transfer]: TokensTransferData;
};

type CurrenciesEventMap = {
  [EventName.Currencies_Transferred]: CurrenciesTransferredData;
};

type EvmEventMap = {
  [EventName.EVM_Log]: EvmLogData;
};

type EvmAccountsEventMap = {
  [EventName.EVMAccounts_Bound]: EvmAccountsBoundData;
};

type UniquesEventMap = {
  [EventName.Uniques_Transferred]: UniquesTransferredData;
};

export type EventDataMap = LbpEventMap &
  XykEventMap &
  OmnipoolEventMap &
  StableswapEventMap &
  AssetRegistryEventMap &
  DcaEventMap &
  OtcEventMap &
  BroadcastEventMap &
  HsmEventMap &
  BalancesEventMap &
  TokensEventMap &
  CurrenciesEventMap &
  EvmEventMap &
  EvmAccountsEventMap &
  XykLiquidityMiningMap &
  OmnipoolLiquidityMiningEventMap &
  OmnipoolWarehouseLMEventMap &
  UniquesEventMap;

export type EventDataType<T extends keyof EventDataMap> = EventDataMap[T];
