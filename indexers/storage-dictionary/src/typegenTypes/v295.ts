import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Permill = sts.number()

export const AccountId32 = sts.bytes()

export interface AssetPair {
    assetIn: number
    assetOut: number
}

export interface Trade {
    pool: PoolType
    assetIn: number
    assetOut: number
}

export type PoolType = PoolType_Aave | PoolType_LBP | PoolType_Omnipool | PoolType_Stableswap | PoolType_XYK

export interface PoolType_Aave {
    __kind: 'Aave'
}

export interface PoolType_LBP {
    __kind: 'LBP'
}

export interface PoolType_Omnipool {
    __kind: 'Omnipool'
}

export interface PoolType_Stableswap {
    __kind: 'Stableswap'
    value: number
}

export interface PoolType_XYK {
    __kind: 'XYK'
}

export const Trade: sts.Type<Trade> = sts.struct(() => {
    return  {
        pool: PoolType,
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export const PoolType: sts.Type<PoolType> = sts.closedEnum(() => {
    return  {
        Aave: sts.unit(),
        LBP: sts.unit(),
        Omnipool: sts.unit(),
        Stableswap: sts.number(),
        XYK: sts.unit(),
    }
})

export const AssetPair: sts.Type<AssetPair> = sts.struct(() => {
    return  {
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export interface Schedule {
    owner: AccountId32
    period: number
    totalAmount: bigint
    maxRetries?: (number | undefined)
    stabilityThreshold?: (Permill | undefined)
    slippage?: (Permill | undefined)
    order: Order
}

export type Order = Order_Buy | Order_Sell

export interface Order_Buy {
    __kind: 'Buy'
    assetIn: number
    assetOut: number
    amountOut: bigint
    maxAmountIn: bigint
    route: Trade[]
}

export interface Order_Sell {
    __kind: 'Sell'
    assetIn: number
    assetOut: number
    amountIn: bigint
    minAmountOut: bigint
    route: Trade[]
}

export type Permill = number

export type AccountId32 = Bytes

export const Schedule: sts.Type<Schedule> = sts.struct(() => {
    return  {
        owner: AccountId32,
        period: sts.number(),
        totalAmount: sts.bigint(),
        maxRetries: sts.option(() => sts.number()),
        stabilityThreshold: sts.option(() => Permill),
        slippage: sts.option(() => Permill),
        order: Order,
    }
})

export const Order: sts.Type<Order> = sts.closedEnum(() => {
    return  {
        Buy: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountOut: sts.bigint(),
            maxAmountIn: sts.bigint(),
            route: sts.array(() => Trade),
        }),
        Sell: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            minAmountOut: sts.bigint(),
            route: sts.array(() => Trade),
        }),
    }
})

export interface EventRecord {
    phase: Phase
    event: Event
    topics: H256[]
}

export type H256 = Bytes

export type Event = Event_AssetRegistry | Event_Balances | Event_Bonds | Event_Broadcast | Event_CircuitBreaker | Event_Claims | Event_CollatorRewards | Event_CollatorSelection | Event_ConvictionVoting | Event_Council | Event_CumulusXcm | Event_Currencies | Event_DCA | Event_Democracy | Event_Dispatcher | Event_Duster | Event_DynamicFees | Event_EVM | Event_EVMAccounts | Event_Elections | Event_EmaOracle | Event_Ethereum | Event_Identity | Event_LBP | Event_Liquidation | Event_MessageQueue | Event_MultiTransactionPayment | Event_Multisig | Event_OTC | Event_Omnipool | Event_OmnipoolLiquidityMining | Event_OmnipoolWarehouseLM | Event_OrmlXcm | Event_OtcSettlements | Event_ParachainSystem | Event_PolkadotXcm | Event_Preimage | Event_Proxy | Event_Referenda | Event_Referrals | Event_RelayChainInfo | Event_Router | Event_Scheduler | Event_Session | Event_Stableswap | Event_Staking | Event_StateTrieMigration | Event_System | Event_TechnicalCommittee | Event_Tips | Event_Tokens | Event_TransactionPause | Event_TransactionPayment | Event_Treasury | Event_Uniques | Event_UnknownTokens | Event_Utility | Event_Vesting | Event_Whitelist | Event_XTokens | Event_XYK | Event_XYKLiquidityMining | Event_XYKWarehouseLM | Event_XcmpQueue

export interface Event_AssetRegistry {
    __kind: 'AssetRegistry'
    value: AssetRegistryEvent
}

export interface Event_Balances {
    __kind: 'Balances'
    value: BalancesEvent
}

export interface Event_Bonds {
    __kind: 'Bonds'
    value: BondsEvent
}

export interface Event_Broadcast {
    __kind: 'Broadcast'
    value: BroadcastEvent
}

export interface Event_CircuitBreaker {
    __kind: 'CircuitBreaker'
    value: CircuitBreakerEvent
}

export interface Event_Claims {
    __kind: 'Claims'
    value: ClaimsEvent
}

export interface Event_CollatorRewards {
    __kind: 'CollatorRewards'
    value: CollatorRewardsEvent
}

export interface Event_CollatorSelection {
    __kind: 'CollatorSelection'
    value: CollatorSelectionEvent
}

export interface Event_ConvictionVoting {
    __kind: 'ConvictionVoting'
    value: ConvictionVotingEvent
}

export interface Event_Council {
    __kind: 'Council'
    value: CouncilEvent
}

export interface Event_CumulusXcm {
    __kind: 'CumulusXcm'
    value: CumulusXcmEvent
}

export interface Event_Currencies {
    __kind: 'Currencies'
    value: CurrenciesEvent
}

export interface Event_DCA {
    __kind: 'DCA'
    value: DCAEvent
}

export interface Event_Democracy {
    __kind: 'Democracy'
    value: DemocracyEvent
}

export interface Event_Dispatcher {
    __kind: 'Dispatcher'
    value: DispatcherEvent
}

export interface Event_Duster {
    __kind: 'Duster'
    value: DusterEvent
}

export interface Event_DynamicFees {
    __kind: 'DynamicFees'
    value: DynamicFeesEvent
}

export interface Event_EVM {
    __kind: 'EVM'
    value: EVMEvent
}

export interface Event_EVMAccounts {
    __kind: 'EVMAccounts'
    value: EVMAccountsEvent
}

export interface Event_Elections {
    __kind: 'Elections'
    value: ElectionsEvent
}

export interface Event_EmaOracle {
    __kind: 'EmaOracle'
    value: EmaOracleEvent
}

export interface Event_Ethereum {
    __kind: 'Ethereum'
    value: EthereumEvent
}

export interface Event_Identity {
    __kind: 'Identity'
    value: IdentityEvent
}

export interface Event_LBP {
    __kind: 'LBP'
    value: LBPEvent
}

export interface Event_Liquidation {
    __kind: 'Liquidation'
    value: LiquidationEvent
}

export interface Event_MessageQueue {
    __kind: 'MessageQueue'
    value: MessageQueueEvent
}

export interface Event_MultiTransactionPayment {
    __kind: 'MultiTransactionPayment'
    value: MultiTransactionPaymentEvent
}

export interface Event_Multisig {
    __kind: 'Multisig'
    value: MultisigEvent
}

export interface Event_OTC {
    __kind: 'OTC'
    value: OTCEvent
}

export interface Event_Omnipool {
    __kind: 'Omnipool'
    value: OmnipoolEvent
}

export interface Event_OmnipoolLiquidityMining {
    __kind: 'OmnipoolLiquidityMining'
    value: OmnipoolLiquidityMiningEvent
}

export interface Event_OmnipoolWarehouseLM {
    __kind: 'OmnipoolWarehouseLM'
    value: OmnipoolWarehouseLMEvent
}

export interface Event_OrmlXcm {
    __kind: 'OrmlXcm'
    value: OrmlXcmEvent
}

export interface Event_OtcSettlements {
    __kind: 'OtcSettlements'
    value: OtcSettlementsEvent
}

export interface Event_ParachainSystem {
    __kind: 'ParachainSystem'
    value: ParachainSystemEvent
}

export interface Event_PolkadotXcm {
    __kind: 'PolkadotXcm'
    value: PolkadotXcmEvent
}

export interface Event_Preimage {
    __kind: 'Preimage'
    value: PreimageEvent
}

export interface Event_Proxy {
    __kind: 'Proxy'
    value: ProxyEvent
}

export interface Event_Referenda {
    __kind: 'Referenda'
    value: ReferendaEvent
}

export interface Event_Referrals {
    __kind: 'Referrals'
    value: ReferralsEvent
}

export interface Event_RelayChainInfo {
    __kind: 'RelayChainInfo'
    value: RelayChainInfoEvent
}

export interface Event_Router {
    __kind: 'Router'
    value: RouterEvent
}

export interface Event_Scheduler {
    __kind: 'Scheduler'
    value: SchedulerEvent
}

export interface Event_Session {
    __kind: 'Session'
    value: SessionEvent
}

export interface Event_Stableswap {
    __kind: 'Stableswap'
    value: StableswapEvent
}

export interface Event_Staking {
    __kind: 'Staking'
    value: StakingEvent
}

export interface Event_StateTrieMigration {
    __kind: 'StateTrieMigration'
    value: StateTrieMigrationEvent
}

export interface Event_System {
    __kind: 'System'
    value: SystemEvent
}

export interface Event_TechnicalCommittee {
    __kind: 'TechnicalCommittee'
    value: TechnicalCommitteeEvent
}

export interface Event_Tips {
    __kind: 'Tips'
    value: TipsEvent
}

export interface Event_Tokens {
    __kind: 'Tokens'
    value: TokensEvent
}

export interface Event_TransactionPause {
    __kind: 'TransactionPause'
    value: TransactionPauseEvent
}

export interface Event_TransactionPayment {
    __kind: 'TransactionPayment'
    value: TransactionPaymentEvent
}

export interface Event_Treasury {
    __kind: 'Treasury'
    value: TreasuryEvent
}

export interface Event_Uniques {
    __kind: 'Uniques'
    value: UniquesEvent
}

export interface Event_UnknownTokens {
    __kind: 'UnknownTokens'
    value: UnknownTokensEvent
}

export interface Event_Utility {
    __kind: 'Utility'
    value: UtilityEvent
}

export interface Event_Vesting {
    __kind: 'Vesting'
    value: VestingEvent
}

export interface Event_Whitelist {
    __kind: 'Whitelist'
    value: WhitelistEvent
}

export interface Event_XTokens {
    __kind: 'XTokens'
    value: XTokensEvent
}

export interface Event_XYK {
    __kind: 'XYK'
    value: XYKEvent
}

export interface Event_XYKLiquidityMining {
    __kind: 'XYKLiquidityMining'
    value: XYKLiquidityMiningEvent
}

export interface Event_XYKWarehouseLM {
    __kind: 'XYKWarehouseLM'
    value: XYKWarehouseLMEvent
}

export interface Event_XcmpQueue {
    __kind: 'XcmpQueue'
    value: XcmpQueueEvent
}

/**
 * The `Event` enum of this pallet
 */
export type XcmpQueueEvent = XcmpQueueEvent_XcmpMessageSent

/**
 * An HRMP message was sent to a sibling parachain.
 */
export interface XcmpQueueEvent_XcmpMessageSent {
    __kind: 'XcmpMessageSent'
    messageHash: Bytes
}

/**
 * The `Event` enum of this pallet
 */
export type XYKWarehouseLMEvent = XYKWarehouseLMEvent_AllRewardsDistributed | XYKWarehouseLMEvent_GlobalFarmAccRPZUpdated | XYKWarehouseLMEvent_YieldFarmAccRPVSUpdated

/**
 * Global farm has no more rewards to distribute in the moment.
 */
export interface XYKWarehouseLMEvent_AllRewardsDistributed {
    __kind: 'AllRewardsDistributed'
    globalFarmId: number
}

/**
 * Global farm accumulated reward per share was updated.
 */
export interface XYKWarehouseLMEvent_GlobalFarmAccRPZUpdated {
    __kind: 'GlobalFarmAccRPZUpdated'
    globalFarmId: number
    accumulatedRpz: FixedU128
    totalSharesZ: bigint
}

/**
 * Yield farm accumulated reward per valued share was updated.
 */
export interface XYKWarehouseLMEvent_YieldFarmAccRPVSUpdated {
    __kind: 'YieldFarmAccRPVSUpdated'
    globalFarmId: number
    yieldFarmId: number
    accumulatedRpvs: FixedU128
    totalValuedShares: bigint
}

export type FixedU128 = bigint

/**
 * The `Event` enum of this pallet
 */
export type XYKLiquidityMiningEvent = XYKLiquidityMiningEvent_DepositDestroyed | XYKLiquidityMiningEvent_GlobalFarmCreated | XYKLiquidityMiningEvent_GlobalFarmTerminated | XYKLiquidityMiningEvent_GlobalFarmUpdated | XYKLiquidityMiningEvent_RewardClaimed | XYKLiquidityMiningEvent_SharesDeposited | XYKLiquidityMiningEvent_SharesRedeposited | XYKLiquidityMiningEvent_SharesWithdrawn | XYKLiquidityMiningEvent_YieldFarmCreated | XYKLiquidityMiningEvent_YieldFarmResumed | XYKLiquidityMiningEvent_YieldFarmStopped | XYKLiquidityMiningEvent_YieldFarmTerminated | XYKLiquidityMiningEvent_YieldFarmUpdated

/**
 * NFT representing deposit has been destroyed
 */
export interface XYKLiquidityMiningEvent_DepositDestroyed {
    __kind: 'DepositDestroyed'
    who: AccountId32
    depositId: bigint
}

/**
 * New global farm was created.
 */
export interface XYKLiquidityMiningEvent_GlobalFarmCreated {
    __kind: 'GlobalFarmCreated'
    id: number
    owner: AccountId32
    totalRewards: bigint
    rewardCurrency: number
    yieldPerPeriod: Perquintill
    plannedYieldingPeriods: number
    blocksPerPeriod: number
    incentivizedAsset: number
    maxRewardPerPeriod: bigint
    minDeposit: bigint
    priceAdjustment: FixedU128
}

/**
 * Global farm was terminated.
 */
export interface XYKLiquidityMiningEvent_GlobalFarmTerminated {
    __kind: 'GlobalFarmTerminated'
    globalFarmId: number
    who: AccountId32
    rewardCurrency: number
    undistributedRewards: bigint
}

/**
 * Global farm's `price_adjustment` was updated.
 */
export interface XYKLiquidityMiningEvent_GlobalFarmUpdated {
    __kind: 'GlobalFarmUpdated'
    id: number
    priceAdjustment: FixedU128
}

/**
 * Rewards was claimed.
 */
export interface XYKLiquidityMiningEvent_RewardClaimed {
    __kind: 'RewardClaimed'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    claimed: bigint
    rewardCurrency: number
    depositId: bigint
}

/**
 * New LP tokens was deposited.
 */
export interface XYKLiquidityMiningEvent_SharesDeposited {
    __kind: 'SharesDeposited'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    amount: bigint
    lpToken: number
    depositId: bigint
}

/**
 * LP token was redeposited for a new yield farm entry
 */
export interface XYKLiquidityMiningEvent_SharesRedeposited {
    __kind: 'SharesRedeposited'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    amount: bigint
    lpToken: number
    depositId: bigint
}

/**
 * LP tokens was withdrawn.
 */
export interface XYKLiquidityMiningEvent_SharesWithdrawn {
    __kind: 'SharesWithdrawn'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    lpToken: number
    amount: bigint
    depositId: bigint
}

/**
 * New yield farm was added into the farm.
 */
export interface XYKLiquidityMiningEvent_YieldFarmCreated {
    __kind: 'YieldFarmCreated'
    globalFarmId: number
    yieldFarmId: number
    multiplier: FixedU128
    assetPair: Type_274
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * Yield farm for asset pair was resumed.
 */
export interface XYKLiquidityMiningEvent_YieldFarmResumed {
    __kind: 'YieldFarmResumed'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    assetPair: Type_274
    multiplier: FixedU128
}

/**
 * Yield farm for asset pair was stopped.
 */
export interface XYKLiquidityMiningEvent_YieldFarmStopped {
    __kind: 'YieldFarmStopped'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    assetPair: Type_274
}

/**
 * Yield farm was terminated from global farm.
 */
export interface XYKLiquidityMiningEvent_YieldFarmTerminated {
    __kind: 'YieldFarmTerminated'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    assetPair: Type_274
}

/**
 * Yield farm multiplier was updated.
 */
export interface XYKLiquidityMiningEvent_YieldFarmUpdated {
    __kind: 'YieldFarmUpdated'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    assetPair: Type_274
    multiplier: FixedU128
}

export interface LoyaltyCurve {
    initialRewardPercentage: FixedU128
    scaleCoef: number
}

export interface Type_274 {
    assetIn: number
    assetOut: number
}

export type Perquintill = bigint

/**
 * The `Event` enum of this pallet
 */
export type XYKEvent = XYKEvent_BuyExecuted | XYKEvent_LiquidityAdded | XYKEvent_LiquidityRemoved | XYKEvent_PoolCreated | XYKEvent_PoolDestroyed | XYKEvent_SellExecuted

/**
 * Asset purchase executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface XYKEvent_BuyExecuted {
    __kind: 'BuyExecuted'
    who: AccountId32
    assetOut: number
    assetIn: number
    amount: bigint
    buyPrice: bigint
    feeAsset: number
    feeAmount: bigint
    pool: AccountId32
}

/**
 * New liquidity was provided to the pool.
 */
export interface XYKEvent_LiquidityAdded {
    __kind: 'LiquidityAdded'
    who: AccountId32
    assetA: number
    assetB: number
    amountA: bigint
    amountB: bigint
}

/**
 * Liquidity was removed from the pool.
 */
export interface XYKEvent_LiquidityRemoved {
    __kind: 'LiquidityRemoved'
    who: AccountId32
    assetA: number
    assetB: number
    shares: bigint
}

/**
 * Pool was created.
 */
export interface XYKEvent_PoolCreated {
    __kind: 'PoolCreated'
    who: AccountId32
    assetA: number
    assetB: number
    initialSharesAmount: bigint
    shareToken: number
    pool: AccountId32
}

/**
 * Pool was destroyed.
 */
export interface XYKEvent_PoolDestroyed {
    __kind: 'PoolDestroyed'
    who: AccountId32
    assetA: number
    assetB: number
    shareToken: number
    pool: AccountId32
}

/**
 * Asset sale executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface XYKEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amount: bigint
    salePrice: bigint
    feeAsset: number
    feeAmount: bigint
    pool: AccountId32
}

/**
 * The `Event` enum of this pallet
 */
export type XTokensEvent = XTokensEvent_TransferredAssets

/**
 * Transferred `Asset` with fee.
 */
export interface XTokensEvent_TransferredAssets {
    __kind: 'TransferredAssets'
    sender: AccountId32
    assets: V4Asset[]
    fee: V4Asset
    dest: V4Location
}

export interface V4Location {
    parents: number
    interior: V4Junctions
}

export type V4Junctions = V4Junctions_Here | V4Junctions_X1 | V4Junctions_X2 | V4Junctions_X3 | V4Junctions_X4 | V4Junctions_X5 | V4Junctions_X6 | V4Junctions_X7 | V4Junctions_X8

export interface V4Junctions_Here {
    __kind: 'Here'
}

export interface V4Junctions_X1 {
    __kind: 'X1'
    value: V4Junction[]
}

export interface V4Junctions_X2 {
    __kind: 'X2'
    value: V4Junction[]
}

export interface V4Junctions_X3 {
    __kind: 'X3'
    value: V4Junction[]
}

export interface V4Junctions_X4 {
    __kind: 'X4'
    value: V4Junction[]
}

export interface V4Junctions_X5 {
    __kind: 'X5'
    value: V4Junction[]
}

export interface V4Junctions_X6 {
    __kind: 'X6'
    value: V4Junction[]
}

export interface V4Junctions_X7 {
    __kind: 'X7'
    value: V4Junction[]
}

export interface V4Junctions_X8 {
    __kind: 'X8'
    value: V4Junction[]
}

export type V4Junction = V4Junction_AccountId32 | V4Junction_AccountIndex64 | V4Junction_AccountKey20 | V4Junction_GeneralIndex | V4Junction_GeneralKey | V4Junction_GlobalConsensus | V4Junction_OnlyChild | V4Junction_PalletInstance | V4Junction_Parachain | V4Junction_Plurality

export interface V4Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V4NetworkId | undefined)
    id: Bytes
}

export interface V4Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V4NetworkId | undefined)
    index: bigint
}

export interface V4Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V4NetworkId | undefined)
    key: Bytes
}

export interface V4Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V4Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V4Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V4NetworkId
}

export interface V4Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V4Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V4Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V4Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V3BodyPart = V3BodyPart_AtLeastProportion | V3BodyPart_Fraction | V3BodyPart_Members | V3BodyPart_MoreThanProportion | V3BodyPart_Voice

export interface V3BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V3BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V3BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V3BodyPart_Voice {
    __kind: 'Voice'
}

export type V3BodyId = V3BodyId_Administration | V3BodyId_Defense | V3BodyId_Executive | V3BodyId_Index | V3BodyId_Judicial | V3BodyId_Legislative | V3BodyId_Moniker | V3BodyId_Technical | V3BodyId_Treasury | V3BodyId_Unit

export interface V3BodyId_Administration {
    __kind: 'Administration'
}

export interface V3BodyId_Defense {
    __kind: 'Defense'
}

export interface V3BodyId_Executive {
    __kind: 'Executive'
}

export interface V3BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V3BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V3BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V3BodyId_Moniker {
    __kind: 'Moniker'
    value: Bytes
}

export interface V3BodyId_Technical {
    __kind: 'Technical'
}

export interface V3BodyId_Treasury {
    __kind: 'Treasury'
}

export interface V3BodyId_Unit {
    __kind: 'Unit'
}

export type V4NetworkId = V4NetworkId_BitcoinCash | V4NetworkId_BitcoinCore | V4NetworkId_ByFork | V4NetworkId_ByGenesis | V4NetworkId_Ethereum | V4NetworkId_Kusama | V4NetworkId_Polkadot | V4NetworkId_PolkadotBulletin | V4NetworkId_Rococo | V4NetworkId_Westend | V4NetworkId_Wococo

export interface V4NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V4NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V4NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V4NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V4NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V4NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V4NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V4NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V4NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V4NetworkId_Westend {
    __kind: 'Westend'
}

export interface V4NetworkId_Wococo {
    __kind: 'Wococo'
}

export interface V4Asset {
    id: V4AssetId
    fun: V4Fungibility
}

export type V4Fungibility = V4Fungibility_Fungible | V4Fungibility_NonFungible

export interface V4Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V4Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V4AssetInstance
}

export type V4AssetInstance = V4AssetInstance_Array16 | V4AssetInstance_Array32 | V4AssetInstance_Array4 | V4AssetInstance_Array8 | V4AssetInstance_Index | V4AssetInstance_Undefined

export interface V4AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V4AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V4AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V4AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V4AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V4AssetInstance_Undefined {
    __kind: 'Undefined'
}

export interface V4AssetId {
    parents: number
    interior: V4Junctions
}

/**
 * The `Event` enum of this pallet
 */
export type WhitelistEvent = WhitelistEvent_CallWhitelisted | WhitelistEvent_WhitelistedCallDispatched | WhitelistEvent_WhitelistedCallRemoved

export interface WhitelistEvent_CallWhitelisted {
    __kind: 'CallWhitelisted'
    callHash: H256
}

export interface WhitelistEvent_WhitelistedCallDispatched {
    __kind: 'WhitelistedCallDispatched'
    callHash: H256
    result: Result<PostDispatchInfo, DispatchErrorWithPostInfo>
}

export interface WhitelistEvent_WhitelistedCallRemoved {
    __kind: 'WhitelistedCallRemoved'
    callHash: H256
}

export interface DispatchErrorWithPostInfo {
    postInfo: PostDispatchInfo
    error: DispatchError
}

export type DispatchError = DispatchError_Arithmetic | DispatchError_BadOrigin | DispatchError_CannotLookup | DispatchError_ConsumerRemaining | DispatchError_Corruption | DispatchError_Exhausted | DispatchError_Module | DispatchError_NoProviders | DispatchError_Other | DispatchError_RootNotAllowed | DispatchError_Token | DispatchError_TooManyConsumers | DispatchError_Transactional | DispatchError_Unavailable

export interface DispatchError_Arithmetic {
    __kind: 'Arithmetic'
    value: ArithmeticError
}

export interface DispatchError_BadOrigin {
    __kind: 'BadOrigin'
}

export interface DispatchError_CannotLookup {
    __kind: 'CannotLookup'
}

export interface DispatchError_ConsumerRemaining {
    __kind: 'ConsumerRemaining'
}

export interface DispatchError_Corruption {
    __kind: 'Corruption'
}

export interface DispatchError_Exhausted {
    __kind: 'Exhausted'
}

export interface DispatchError_Module {
    __kind: 'Module'
    value: ModuleError
}

export interface DispatchError_NoProviders {
    __kind: 'NoProviders'
}

export interface DispatchError_Other {
    __kind: 'Other'
}

export interface DispatchError_RootNotAllowed {
    __kind: 'RootNotAllowed'
}

export interface DispatchError_Token {
    __kind: 'Token'
    value: TokenError
}

export interface DispatchError_TooManyConsumers {
    __kind: 'TooManyConsumers'
}

export interface DispatchError_Transactional {
    __kind: 'Transactional'
    value: TransactionalError
}

export interface DispatchError_Unavailable {
    __kind: 'Unavailable'
}

export type TransactionalError = TransactionalError_LimitReached | TransactionalError_NoLayer

export interface TransactionalError_LimitReached {
    __kind: 'LimitReached'
}

export interface TransactionalError_NoLayer {
    __kind: 'NoLayer'
}

export type TokenError = TokenError_BelowMinimum | TokenError_Blocked | TokenError_CannotCreate | TokenError_CannotCreateHold | TokenError_Frozen | TokenError_FundsUnavailable | TokenError_NotExpendable | TokenError_OnlyProvider | TokenError_UnknownAsset | TokenError_Unsupported

export interface TokenError_BelowMinimum {
    __kind: 'BelowMinimum'
}

export interface TokenError_Blocked {
    __kind: 'Blocked'
}

export interface TokenError_CannotCreate {
    __kind: 'CannotCreate'
}

export interface TokenError_CannotCreateHold {
    __kind: 'CannotCreateHold'
}

export interface TokenError_Frozen {
    __kind: 'Frozen'
}

export interface TokenError_FundsUnavailable {
    __kind: 'FundsUnavailable'
}

export interface TokenError_NotExpendable {
    __kind: 'NotExpendable'
}

export interface TokenError_OnlyProvider {
    __kind: 'OnlyProvider'
}

export interface TokenError_UnknownAsset {
    __kind: 'UnknownAsset'
}

export interface TokenError_Unsupported {
    __kind: 'Unsupported'
}

export interface ModuleError {
    index: number
    error: Bytes
}

export type ArithmeticError = ArithmeticError_DivisionByZero | ArithmeticError_Overflow | ArithmeticError_Underflow

export interface ArithmeticError_DivisionByZero {
    __kind: 'DivisionByZero'
}

export interface ArithmeticError_Overflow {
    __kind: 'Overflow'
}

export interface ArithmeticError_Underflow {
    __kind: 'Underflow'
}

export interface PostDispatchInfo {
    actualWeight?: (Weight | undefined)
    paysFee: Pays
}

export type Pays = Pays_No | Pays_Yes

export interface Pays_No {
    __kind: 'No'
}

export interface Pays_Yes {
    __kind: 'Yes'
}

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type VestingEvent = VestingEvent_Claimed | VestingEvent_VestingScheduleAdded | VestingEvent_VestingSchedulesUpdated

/**
 * Claimed vesting.
 */
export interface VestingEvent_Claimed {
    __kind: 'Claimed'
    who: AccountId32
    amount: bigint
}

/**
 * Added new vesting schedule.
 */
export interface VestingEvent_VestingScheduleAdded {
    __kind: 'VestingScheduleAdded'
    from: AccountId32
    to: AccountId32
    vestingSchedule: VestingSchedule
}

/**
 * Updated vesting schedules.
 */
export interface VestingEvent_VestingSchedulesUpdated {
    __kind: 'VestingSchedulesUpdated'
    who: AccountId32
}

export interface VestingSchedule {
    start: number
    period: number
    periodCount: number
    perPeriod: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type UtilityEvent = UtilityEvent_BatchCompleted | UtilityEvent_BatchCompletedWithErrors | UtilityEvent_BatchInterrupted | UtilityEvent_DispatchedAs | UtilityEvent_ItemCompleted | UtilityEvent_ItemFailed

/**
 * Batch of dispatches completed fully with no error.
 */
export interface UtilityEvent_BatchCompleted {
    __kind: 'BatchCompleted'
}

/**
 * Batch of dispatches completed but has errors.
 */
export interface UtilityEvent_BatchCompletedWithErrors {
    __kind: 'BatchCompletedWithErrors'
}

/**
 * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
 * well as the error.
 */
export interface UtilityEvent_BatchInterrupted {
    __kind: 'BatchInterrupted'
    index: number
    error: DispatchError
}

/**
 * A call was dispatched.
 */
export interface UtilityEvent_DispatchedAs {
    __kind: 'DispatchedAs'
    result: Result<null, DispatchError>
}

/**
 * A single item within a Batch of dispatches has completed with no error.
 */
export interface UtilityEvent_ItemCompleted {
    __kind: 'ItemCompleted'
}

/**
 * A single item within a Batch of dispatches has completed with error.
 */
export interface UtilityEvent_ItemFailed {
    __kind: 'ItemFailed'
    error: DispatchError
}

/**
 * The `Event` enum of this pallet
 */
export type UnknownTokensEvent = UnknownTokensEvent_Deposited | UnknownTokensEvent_Withdrawn

/**
 * Deposit success.
 */
export interface UnknownTokensEvent_Deposited {
    __kind: 'Deposited'
    asset: V4Asset
    who: V4Location
}

/**
 * Withdraw success.
 */
export interface UnknownTokensEvent_Withdrawn {
    __kind: 'Withdrawn'
    asset: V4Asset
    who: V4Location
}

/**
 * The `Event` enum of this pallet
 */
export type UniquesEvent = UniquesEvent_ApprovalCancelled | UniquesEvent_ApprovedTransfer | UniquesEvent_AttributeCleared | UniquesEvent_AttributeSet | UniquesEvent_Burned | UniquesEvent_CollectionFrozen | UniquesEvent_CollectionMaxSupplySet | UniquesEvent_CollectionMetadataCleared | UniquesEvent_CollectionMetadataSet | UniquesEvent_CollectionThawed | UniquesEvent_Created | UniquesEvent_Destroyed | UniquesEvent_ForceCreated | UniquesEvent_Frozen | UniquesEvent_Issued | UniquesEvent_ItemBought | UniquesEvent_ItemPriceRemoved | UniquesEvent_ItemPriceSet | UniquesEvent_ItemStatusChanged | UniquesEvent_MetadataCleared | UniquesEvent_MetadataSet | UniquesEvent_OwnerChanged | UniquesEvent_OwnershipAcceptanceChanged | UniquesEvent_Redeposited | UniquesEvent_TeamChanged | UniquesEvent_Thawed | UniquesEvent_Transferred

/**
 * An approval for a `delegate` account to transfer the `item` of an item
 * `collection` was cancelled by its `owner`.
 */
export interface UniquesEvent_ApprovalCancelled {
    __kind: 'ApprovalCancelled'
    collection: bigint
    item: bigint
    owner: AccountId32
    delegate: AccountId32
}

/**
 * An `item` of a `collection` has been approved by the `owner` for transfer by
 * a `delegate`.
 */
export interface UniquesEvent_ApprovedTransfer {
    __kind: 'ApprovedTransfer'
    collection: bigint
    item: bigint
    owner: AccountId32
    delegate: AccountId32
}

/**
 * Attribute metadata has been cleared for a `collection` or `item`.
 */
export interface UniquesEvent_AttributeCleared {
    __kind: 'AttributeCleared'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
}

/**
 * New attribute metadata has been set for a `collection` or `item`.
 */
export interface UniquesEvent_AttributeSet {
    __kind: 'AttributeSet'
    collection: bigint
    maybeItem?: (bigint | undefined)
    key: Bytes
    value: Bytes
}

/**
 * An `item` was destroyed.
 */
export interface UniquesEvent_Burned {
    __kind: 'Burned'
    collection: bigint
    item: bigint
    owner: AccountId32
}

/**
 * Some `collection` was frozen.
 */
export interface UniquesEvent_CollectionFrozen {
    __kind: 'CollectionFrozen'
    collection: bigint
}

/**
 * Max supply has been set for a collection.
 */
export interface UniquesEvent_CollectionMaxSupplySet {
    __kind: 'CollectionMaxSupplySet'
    collection: bigint
    maxSupply: number
}

/**
 * Metadata has been cleared for a `collection`.
 */
export interface UniquesEvent_CollectionMetadataCleared {
    __kind: 'CollectionMetadataCleared'
    collection: bigint
}

/**
 * New metadata has been set for a `collection`.
 */
export interface UniquesEvent_CollectionMetadataSet {
    __kind: 'CollectionMetadataSet'
    collection: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * Some `collection` was thawed.
 */
export interface UniquesEvent_CollectionThawed {
    __kind: 'CollectionThawed'
    collection: bigint
}

/**
 * A `collection` was created.
 */
export interface UniquesEvent_Created {
    __kind: 'Created'
    collection: bigint
    creator: AccountId32
    owner: AccountId32
}

/**
 * A `collection` was destroyed.
 */
export interface UniquesEvent_Destroyed {
    __kind: 'Destroyed'
    collection: bigint
}

/**
 * A `collection` was force-created.
 */
export interface UniquesEvent_ForceCreated {
    __kind: 'ForceCreated'
    collection: bigint
    owner: AccountId32
}

/**
 * Some `item` was frozen.
 */
export interface UniquesEvent_Frozen {
    __kind: 'Frozen'
    collection: bigint
    item: bigint
}

/**
 * An `item` was issued.
 */
export interface UniquesEvent_Issued {
    __kind: 'Issued'
    collection: bigint
    item: bigint
    owner: AccountId32
}

/**
 * An item was bought.
 */
export interface UniquesEvent_ItemBought {
    __kind: 'ItemBought'
    collection: bigint
    item: bigint
    price: bigint
    seller: AccountId32
    buyer: AccountId32
}

/**
 * The price for the instance was removed.
 */
export interface UniquesEvent_ItemPriceRemoved {
    __kind: 'ItemPriceRemoved'
    collection: bigint
    item: bigint
}

/**
 * The price was set for the instance.
 */
export interface UniquesEvent_ItemPriceSet {
    __kind: 'ItemPriceSet'
    collection: bigint
    item: bigint
    price: bigint
    whitelistedBuyer?: (AccountId32 | undefined)
}

/**
 * A `collection` has had its attributes changed by the `Force` origin.
 */
export interface UniquesEvent_ItemStatusChanged {
    __kind: 'ItemStatusChanged'
    collection: bigint
}

/**
 * Metadata has been cleared for an item.
 */
export interface UniquesEvent_MetadataCleared {
    __kind: 'MetadataCleared'
    collection: bigint
    item: bigint
}

/**
 * New metadata has been set for an item.
 */
export interface UniquesEvent_MetadataSet {
    __kind: 'MetadataSet'
    collection: bigint
    item: bigint
    data: Bytes
    isFrozen: boolean
}

/**
 * The owner changed.
 */
export interface UniquesEvent_OwnerChanged {
    __kind: 'OwnerChanged'
    collection: bigint
    newOwner: AccountId32
}

/**
 * Ownership acceptance has changed for an account.
 */
export interface UniquesEvent_OwnershipAcceptanceChanged {
    __kind: 'OwnershipAcceptanceChanged'
    who: AccountId32
    maybeCollection?: (bigint | undefined)
}

/**
 * Metadata has been cleared for an item.
 */
export interface UniquesEvent_Redeposited {
    __kind: 'Redeposited'
    collection: bigint
    successfulItems: bigint[]
}

/**
 * The management team changed.
 */
export interface UniquesEvent_TeamChanged {
    __kind: 'TeamChanged'
    collection: bigint
    issuer: AccountId32
    admin: AccountId32
    freezer: AccountId32
}

/**
 * Some `item` was thawed.
 */
export interface UniquesEvent_Thawed {
    __kind: 'Thawed'
    collection: bigint
    item: bigint
}

/**
 * An `item` was transferred.
 */
export interface UniquesEvent_Transferred {
    __kind: 'Transferred'
    collection: bigint
    item: bigint
    from: AccountId32
    to: AccountId32
}

/**
 * The `Event` enum of this pallet
 */
export type TreasuryEvent = TreasuryEvent_AssetSpendApproved | TreasuryEvent_AssetSpendVoided | TreasuryEvent_Awarded | TreasuryEvent_Burnt | TreasuryEvent_Deposit | TreasuryEvent_Paid | TreasuryEvent_PaymentFailed | TreasuryEvent_Rollover | TreasuryEvent_SpendApproved | TreasuryEvent_SpendProcessed | TreasuryEvent_Spending | TreasuryEvent_UpdatedInactive

/**
 * A new asset spend proposal has been approved.
 */
export interface TreasuryEvent_AssetSpendApproved {
    __kind: 'AssetSpendApproved'
    index: number
    amount: bigint
    beneficiary: AccountId32
    validFrom: number
    expireAt: number
}

/**
 * An approved spend was voided.
 */
export interface TreasuryEvent_AssetSpendVoided {
    __kind: 'AssetSpendVoided'
    index: number
}

/**
 * Some funds have been allocated.
 */
export interface TreasuryEvent_Awarded {
    __kind: 'Awarded'
    proposalIndex: number
    award: bigint
    account: AccountId32
}

/**
 * Some of our funds have been burnt.
 */
export interface TreasuryEvent_Burnt {
    __kind: 'Burnt'
    burntFunds: bigint
}

/**
 * Some funds have been deposited.
 */
export interface TreasuryEvent_Deposit {
    __kind: 'Deposit'
    value: bigint
}

/**
 * A payment happened.
 */
export interface TreasuryEvent_Paid {
    __kind: 'Paid'
    index: number
}

/**
 * A payment failed and can be retried.
 */
export interface TreasuryEvent_PaymentFailed {
    __kind: 'PaymentFailed'
    index: number
}

/**
 * Spending has finished; this is the amount that rolls over until next spend.
 */
export interface TreasuryEvent_Rollover {
    __kind: 'Rollover'
    rolloverBalance: bigint
}

/**
 * A new spend proposal has been approved.
 */
export interface TreasuryEvent_SpendApproved {
    __kind: 'SpendApproved'
    proposalIndex: number
    amount: bigint
    beneficiary: AccountId32
}

/**
 * A spend was processed and removed from the storage. It might have been successfully
 * paid or it may have expired.
 */
export interface TreasuryEvent_SpendProcessed {
    __kind: 'SpendProcessed'
    index: number
}

/**
 * We have ended a spend period and will now allocate funds.
 */
export interface TreasuryEvent_Spending {
    __kind: 'Spending'
    budgetRemaining: bigint
}

/**
 * The inactive funds of the pallet have been updated.
 */
export interface TreasuryEvent_UpdatedInactive {
    __kind: 'UpdatedInactive'
    reactivated: bigint
    deactivated: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type TransactionPaymentEvent = TransactionPaymentEvent_TransactionFeePaid

/**
 * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
 * has been paid by `who`.
 */
export interface TransactionPaymentEvent_TransactionFeePaid {
    __kind: 'TransactionFeePaid'
    who: AccountId32
    actualFee: bigint
    tip: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type TransactionPauseEvent = TransactionPauseEvent_TransactionPaused | TransactionPauseEvent_TransactionUnpaused

/**
 * Paused transaction
 */
export interface TransactionPauseEvent_TransactionPaused {
    __kind: 'TransactionPaused'
    palletNameBytes: Bytes
    functionNameBytes: Bytes
}

/**
 * Unpaused transaction
 */
export interface TransactionPauseEvent_TransactionUnpaused {
    __kind: 'TransactionUnpaused'
    palletNameBytes: Bytes
    functionNameBytes: Bytes
}

/**
 * The `Event` enum of this pallet
 */
export type TokensEvent = TokensEvent_BalanceSet | TokensEvent_Deposited | TokensEvent_DustLost | TokensEvent_Endowed | TokensEvent_Issued | TokensEvent_LockRemoved | TokensEvent_LockSet | TokensEvent_Locked | TokensEvent_Rescinded | TokensEvent_ReserveRepatriated | TokensEvent_Reserved | TokensEvent_Slashed | TokensEvent_TotalIssuanceSet | TokensEvent_Transfer | TokensEvent_Unlocked | TokensEvent_Unreserved | TokensEvent_Withdrawn

/**
 * A balance was set by root.
 */
export interface TokensEvent_BalanceSet {
    __kind: 'BalanceSet'
    currencyId: number
    who: AccountId32
    free: bigint
    reserved: bigint
}

/**
 * Deposited some balance into an account
 */
export interface TokensEvent_Deposited {
    __kind: 'Deposited'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * An account was removed whose balance was non-zero but below
 * ExistentialDeposit, resulting in an outright loss.
 */
export interface TokensEvent_DustLost {
    __kind: 'DustLost'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * An account was created with some free balance.
 */
export interface TokensEvent_Endowed {
    __kind: 'Endowed'
    currencyId: number
    who: AccountId32
    amount: bigint
}

export interface TokensEvent_Issued {
    __kind: 'Issued'
    currencyId: number
    amount: bigint
}

/**
 * Some locked funds were unlocked
 */
export interface TokensEvent_LockRemoved {
    __kind: 'LockRemoved'
    lockId: Bytes
    currencyId: number
    who: AccountId32
}

/**
 * Some funds are locked
 */
export interface TokensEvent_LockSet {
    __kind: 'LockSet'
    lockId: Bytes
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Some free balance was locked.
 */
export interface TokensEvent_Locked {
    __kind: 'Locked'
    currencyId: number
    who: AccountId32
    amount: bigint
}

export interface TokensEvent_Rescinded {
    __kind: 'Rescinded'
    currencyId: number
    amount: bigint
}

/**
 * Some reserved balance was repatriated (moved from reserved to
 * another account).
 */
export interface TokensEvent_ReserveRepatriated {
    __kind: 'ReserveRepatriated'
    currencyId: number
    from: AccountId32
    to: AccountId32
    amount: bigint
    status: BalanceStatus
}

/**
 * Some balance was reserved (moved from free to reserved).
 */
export interface TokensEvent_Reserved {
    __kind: 'Reserved'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Some balances were slashed (e.g. due to mis-behavior)
 */
export interface TokensEvent_Slashed {
    __kind: 'Slashed'
    currencyId: number
    who: AccountId32
    freeAmount: bigint
    reservedAmount: bigint
}

/**
 * The total issuance of an currency has been set
 */
export interface TokensEvent_TotalIssuanceSet {
    __kind: 'TotalIssuanceSet'
    currencyId: number
    amount: bigint
}

/**
 * Transfer succeeded.
 */
export interface TokensEvent_Transfer {
    __kind: 'Transfer'
    currencyId: number
    from: AccountId32
    to: AccountId32
    amount: bigint
}

/**
 * Some locked balance was freed.
 */
export interface TokensEvent_Unlocked {
    __kind: 'Unlocked'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Some balance was unreserved (moved from reserved to free).
 */
export interface TokensEvent_Unreserved {
    __kind: 'Unreserved'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Some balances were withdrawn (e.g. pay for transaction fee)
 */
export interface TokensEvent_Withdrawn {
    __kind: 'Withdrawn'
    currencyId: number
    who: AccountId32
    amount: bigint
}

export type BalanceStatus = BalanceStatus_Free | BalanceStatus_Reserved

export interface BalanceStatus_Free {
    __kind: 'Free'
}

export interface BalanceStatus_Reserved {
    __kind: 'Reserved'
}

/**
 * The `Event` enum of this pallet
 */
export type TipsEvent = TipsEvent_NewTip | TipsEvent_TipClosed | TipsEvent_TipClosing | TipsEvent_TipRetracted | TipsEvent_TipSlashed

/**
 * A new tip suggestion has been opened.
 */
export interface TipsEvent_NewTip {
    __kind: 'NewTip'
    tipHash: H256
}

/**
 * A tip suggestion has been closed.
 */
export interface TipsEvent_TipClosed {
    __kind: 'TipClosed'
    tipHash: H256
    who: AccountId32
    payout: bigint
}

/**
 * A tip suggestion has reached threshold and is closing.
 */
export interface TipsEvent_TipClosing {
    __kind: 'TipClosing'
    tipHash: H256
}

/**
 * A tip suggestion has been retracted.
 */
export interface TipsEvent_TipRetracted {
    __kind: 'TipRetracted'
    tipHash: H256
}

/**
 * A tip suggestion has been slashed.
 */
export interface TipsEvent_TipSlashed {
    __kind: 'TipSlashed'
    tipHash: H256
    finder: AccountId32
    deposit: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type TechnicalCommitteeEvent = TechnicalCommitteeEvent_Approved | TechnicalCommitteeEvent_Closed | TechnicalCommitteeEvent_Disapproved | TechnicalCommitteeEvent_Executed | TechnicalCommitteeEvent_MemberExecuted | TechnicalCommitteeEvent_Proposed | TechnicalCommitteeEvent_Voted

/**
 * A motion was approved by the required threshold.
 */
export interface TechnicalCommitteeEvent_Approved {
    __kind: 'Approved'
    proposalHash: H256
}

/**
 * A proposal was closed because its threshold was reached or after its duration was up.
 */
export interface TechnicalCommitteeEvent_Closed {
    __kind: 'Closed'
    proposalHash: H256
    yes: number
    no: number
}

/**
 * A motion was not approved by the required threshold.
 */
export interface TechnicalCommitteeEvent_Disapproved {
    __kind: 'Disapproved'
    proposalHash: H256
}

/**
 * A motion was executed; result will be `Ok` if it returned without error.
 */
export interface TechnicalCommitteeEvent_Executed {
    __kind: 'Executed'
    proposalHash: H256
    result: Result<null, DispatchError>
}

/**
 * A single member did some action; result will be `Ok` if it returned without error.
 */
export interface TechnicalCommitteeEvent_MemberExecuted {
    __kind: 'MemberExecuted'
    proposalHash: H256
    result: Result<null, DispatchError>
}

/**
 * A motion (given hash) has been proposed (by given account) with a threshold (given
 * `MemberCount`).
 */
export interface TechnicalCommitteeEvent_Proposed {
    __kind: 'Proposed'
    account: AccountId32
    proposalIndex: number
    proposalHash: H256
    threshold: number
}

/**
 * A motion (given hash) has been voted on by given account, leaving
 * a tally (yes votes and no votes given respectively as `MemberCount`).
 */
export interface TechnicalCommitteeEvent_Voted {
    __kind: 'Voted'
    account: AccountId32
    proposalHash: H256
    voted: boolean
    yes: number
    no: number
}

/**
 * Event for the System pallet.
 */
export type SystemEvent = SystemEvent_CodeUpdated | SystemEvent_ExtrinsicFailed | SystemEvent_ExtrinsicSuccess | SystemEvent_KilledAccount | SystemEvent_NewAccount | SystemEvent_Remarked | SystemEvent_UpgradeAuthorized

/**
 * `:code` was updated.
 */
export interface SystemEvent_CodeUpdated {
    __kind: 'CodeUpdated'
}

/**
 * An extrinsic failed.
 */
export interface SystemEvent_ExtrinsicFailed {
    __kind: 'ExtrinsicFailed'
    dispatchError: DispatchError
    dispatchInfo: DispatchInfo
}

/**
 * An extrinsic completed successfully.
 */
export interface SystemEvent_ExtrinsicSuccess {
    __kind: 'ExtrinsicSuccess'
    dispatchInfo: DispatchInfo
}

/**
 * An account was reaped.
 */
export interface SystemEvent_KilledAccount {
    __kind: 'KilledAccount'
    account: AccountId32
}

/**
 * A new account was created.
 */
export interface SystemEvent_NewAccount {
    __kind: 'NewAccount'
    account: AccountId32
}

/**
 * On on-chain remark happened.
 */
export interface SystemEvent_Remarked {
    __kind: 'Remarked'
    sender: AccountId32
    hash: H256
}

/**
 * An upgrade was authorized.
 */
export interface SystemEvent_UpgradeAuthorized {
    __kind: 'UpgradeAuthorized'
    codeHash: H256
    checkVersion: boolean
}

export interface DispatchInfo {
    weight: Weight
    class: DispatchClass
    paysFee: Pays
}

export type DispatchClass = DispatchClass_Mandatory | DispatchClass_Normal | DispatchClass_Operational

export interface DispatchClass_Mandatory {
    __kind: 'Mandatory'
}

export interface DispatchClass_Normal {
    __kind: 'Normal'
}

export interface DispatchClass_Operational {
    __kind: 'Operational'
}

/**
 * Inner events of this pallet.
 */
export type StateTrieMigrationEvent = StateTrieMigrationEvent_AutoMigrationFinished | StateTrieMigrationEvent_Halted | StateTrieMigrationEvent_Migrated | StateTrieMigrationEvent_Slashed

/**
 * The auto migration task finished.
 */
export interface StateTrieMigrationEvent_AutoMigrationFinished {
    __kind: 'AutoMigrationFinished'
}

/**
 * Migration got halted due to an error or miss-configuration.
 */
export interface StateTrieMigrationEvent_Halted {
    __kind: 'Halted'
    error: Error
}

/**
 * Given number of `(top, child)` keys were migrated respectively, with the given
 * `compute`.
 */
export interface StateTrieMigrationEvent_Migrated {
    __kind: 'Migrated'
    top: number
    child: number
    compute: MigrationCompute
}

/**
 * Some account got slashed by the given amount.
 */
export interface StateTrieMigrationEvent_Slashed {
    __kind: 'Slashed'
    who: AccountId32
    amount: bigint
}

export type MigrationCompute = MigrationCompute_Auto | MigrationCompute_Signed

export interface MigrationCompute_Auto {
    __kind: 'Auto'
}

export interface MigrationCompute_Signed {
    __kind: 'Signed'
}

/**
 * The `Error` enum of this pallet.
 */
export type Error = Error_BadChildRoot | Error_BadWitness | Error_KeyTooLong | Error_MaxSignedLimits | Error_NotEnoughFunds | Error_SignedMigrationNotAllowed

/**
 * Bad child root provided.
 */
export interface Error_BadChildRoot {
    __kind: 'BadChildRoot'
}

/**
 * Bad witness data provided.
 */
export interface Error_BadWitness {
    __kind: 'BadWitness'
}

/**
 * A key was longer than the configured maximum.
 * 
 * This means that the migration halted at the current [`Progress`] and
 * can be resumed with a larger [`crate::Config::MaxKeyLen`] value.
 * Retrying with the same [`crate::Config::MaxKeyLen`] value will not work.
 * The value should only be increased to avoid a storage migration for the currently
 * stored [`crate::Progress::LastKey`].
 */
export interface Error_KeyTooLong {
    __kind: 'KeyTooLong'
}

/**
 * Max signed limits not respected.
 */
export interface Error_MaxSignedLimits {
    __kind: 'MaxSignedLimits'
}

/**
 * submitter does not have enough funds.
 */
export interface Error_NotEnoughFunds {
    __kind: 'NotEnoughFunds'
}

/**
 * Signed migration is not allowed because the maximum limit is not set yet.
 */
export interface Error_SignedMigrationNotAllowed {
    __kind: 'SignedMigrationNotAllowed'
}

/**
 * The `Event` enum of this pallet
 */
export type StakingEvent = StakingEvent_AccumulatedRpsUpdated | StakingEvent_PositionCreated | StakingEvent_RewardsClaimed | StakingEvent_StakeAdded | StakingEvent_StakingInitialized | StakingEvent_Unstaked

/**
 * Staking's `accumulated_reward_per_stake` was updated.
 */
export interface StakingEvent_AccumulatedRpsUpdated {
    __kind: 'AccumulatedRpsUpdated'
    accumulatedRps: FixedU128
    totalStake: bigint
}

/**
 * New staking position was created and NFT was minted.
 */
export interface StakingEvent_PositionCreated {
    __kind: 'PositionCreated'
    who: AccountId32
    positionId: bigint
    stake: bigint
}

/**
 * Rewards were claimed.
 */
export interface StakingEvent_RewardsClaimed {
    __kind: 'RewardsClaimed'
    who: AccountId32
    positionId: bigint
    paidRewards: bigint
    unlockedRewards: bigint
    slashedPoints: bigint
    slashedUnpaidRewards: bigint
    payablePercentage: FixedU128
}

/**
 * Staked amount for existing position was increased.
 */
export interface StakingEvent_StakeAdded {
    __kind: 'StakeAdded'
    who: AccountId32
    positionId: bigint
    stake: bigint
    totalStake: bigint
    lockedRewards: bigint
    slashedPoints: bigint
    payablePercentage: FixedU128
}

/**
 * Staking was initialized.
 */
export interface StakingEvent_StakingInitialized {
    __kind: 'StakingInitialized'
    nonDustableBalance: bigint
}

/**
 * Staked amount was withdrawn and NFT was burned.
 */
export interface StakingEvent_Unstaked {
    __kind: 'Unstaked'
    who: AccountId32
    positionId: bigint
    unlockedStake: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type StableswapEvent = StableswapEvent_AmplificationChanging | StableswapEvent_BuyExecuted | StableswapEvent_FeeUpdated | StableswapEvent_LiquidityAdded | StableswapEvent_LiquidityRemoved | StableswapEvent_PoolCreated | StableswapEvent_PoolDestroyed | StableswapEvent_SellExecuted | StableswapEvent_TradableStateUpdated

/**
 * Amplification of a pool has been scheduled to change.
 */
export interface StableswapEvent_AmplificationChanging {
    __kind: 'AmplificationChanging'
    poolId: number
    currentAmplification: NonZeroU16
    finalAmplification: NonZeroU16
    startBlock: number
    endBlock: number
}

/**
 * Buy trade executed. Trade fee paid in asset entering the pool (already included in amount_in).
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface StableswapEvent_BuyExecuted {
    __kind: 'BuyExecuted'
    who: AccountId32
    poolId: number
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    fee: bigint
}

/**
 * Pool fee has been updated.
 */
export interface StableswapEvent_FeeUpdated {
    __kind: 'FeeUpdated'
    poolId: number
    fee: Permill
}

/**
 * Liquidity of an asset was added to a pool.
 */
export interface StableswapEvent_LiquidityAdded {
    __kind: 'LiquidityAdded'
    poolId: number
    who: AccountId32
    shares: bigint
    assets: AssetAmount[]
}

/**
 * Liquidity removed.
 */
export interface StableswapEvent_LiquidityRemoved {
    __kind: 'LiquidityRemoved'
    poolId: number
    who: AccountId32
    shares: bigint
    amounts: AssetAmount[]
    fee: bigint
}

/**
 * A pool was created.
 */
export interface StableswapEvent_PoolCreated {
    __kind: 'PoolCreated'
    poolId: number
    assets: number[]
    amplification: NonZeroU16
    fee: Permill
}

/**
 * A pool has been destroyed.
 */
export interface StableswapEvent_PoolDestroyed {
    __kind: 'PoolDestroyed'
    poolId: number
}

/**
 * Sell trade executed. Trade fee paid in asset leaving the pool (already subtracted from amount_out).
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface StableswapEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    poolId: number
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    fee: bigint
}

/**
 * Asset's tradable state has been updated.
 */
export interface StableswapEvent_TradableStateUpdated {
    __kind: 'TradableStateUpdated'
    poolId: number
    assetId: number
    state: Type_240
}

export interface Type_240 {
    bits: number
}

export interface AssetAmount {
    assetId: number
    amount: bigint
}

export type NonZeroU16 = number

/**
 * The `Event` enum of this pallet
 */
export type SessionEvent = SessionEvent_NewSession

/**
 * New session has happened. Note that the argument is the session index, not the
 * block number as the type might suggest.
 */
export interface SessionEvent_NewSession {
    __kind: 'NewSession'
    sessionIndex: number
}

/**
 * Events type.
 */
export type SchedulerEvent = SchedulerEvent_CallUnavailable | SchedulerEvent_Canceled | SchedulerEvent_Dispatched | SchedulerEvent_PeriodicFailed | SchedulerEvent_PermanentlyOverweight | SchedulerEvent_RetryCancelled | SchedulerEvent_RetryFailed | SchedulerEvent_RetrySet | SchedulerEvent_Scheduled

/**
 * The call for the provided hash was not found so the task has been aborted.
 */
export interface SchedulerEvent_CallUnavailable {
    __kind: 'CallUnavailable'
    task: [number, number]
    id?: (Bytes | undefined)
}

/**
 * Canceled some task.
 */
export interface SchedulerEvent_Canceled {
    __kind: 'Canceled'
    when: number
    index: number
}

/**
 * Dispatched some task.
 */
export interface SchedulerEvent_Dispatched {
    __kind: 'Dispatched'
    task: [number, number]
    id?: (Bytes | undefined)
    result: Result<null, DispatchError>
}

/**
 * The given task was unable to be renewed since the agenda is full at that block.
 */
export interface SchedulerEvent_PeriodicFailed {
    __kind: 'PeriodicFailed'
    task: [number, number]
    id?: (Bytes | undefined)
}

/**
 * The given task can never be executed since it is overweight.
 */
export interface SchedulerEvent_PermanentlyOverweight {
    __kind: 'PermanentlyOverweight'
    task: [number, number]
    id?: (Bytes | undefined)
}

/**
 * Cancel a retry configuration for some task.
 */
export interface SchedulerEvent_RetryCancelled {
    __kind: 'RetryCancelled'
    task: [number, number]
    id?: (Bytes | undefined)
}

/**
 * The given task was unable to be retried since the agenda is full at that block or there
 * was not enough weight to reschedule it.
 */
export interface SchedulerEvent_RetryFailed {
    __kind: 'RetryFailed'
    task: [number, number]
    id?: (Bytes | undefined)
}

/**
 * Set a retry configuration for some task.
 */
export interface SchedulerEvent_RetrySet {
    __kind: 'RetrySet'
    task: [number, number]
    id?: (Bytes | undefined)
    period: number
    retries: number
}

/**
 * Scheduled some task.
 */
export interface SchedulerEvent_Scheduled {
    __kind: 'Scheduled'
    when: number
    index: number
}

/**
 * The `Event` enum of this pallet
 */
export type RouterEvent = RouterEvent_Executed | RouterEvent_RouteUpdated

/**
 * The route with trades has been successfully executed
 */
export interface RouterEvent_Executed {
    __kind: 'Executed'
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    eventId: number
}

/**
 * The route with trades has been successfully executed
 */
export interface RouterEvent_RouteUpdated {
    __kind: 'RouteUpdated'
    assetIds: number[]
}

/**
 * The `Event` enum of this pallet
 */
export type RelayChainInfoEvent = RelayChainInfoEvent_CurrentBlockNumbers

/**
 * Current block numbers
 * [ Parachain block number, Relaychain Block number ]
 */
export interface RelayChainInfoEvent_CurrentBlockNumbers {
    __kind: 'CurrentBlockNumbers'
    parachainBlockNumber: number
    relaychainBlockNumber: number
}

/**
 * The `Event` enum of this pallet
 */
export type ReferralsEvent = ReferralsEvent_AssetRewardsUpdated | ReferralsEvent_Claimed | ReferralsEvent_CodeLinked | ReferralsEvent_CodeRegistered | ReferralsEvent_Converted | ReferralsEvent_LevelUp

/**
 * New asset rewards has been set.
 */
export interface ReferralsEvent_AssetRewardsUpdated {
    __kind: 'AssetRewardsUpdated'
    assetId: number
    level: Level
    rewards: FeeDistribution
}

/**
 * Rewards claimed.
 */
export interface ReferralsEvent_Claimed {
    __kind: 'Claimed'
    who: AccountId32
    referrerRewards: bigint
    tradeRewards: bigint
}

/**
 * Referral code has been linked to an account.
 */
export interface ReferralsEvent_CodeLinked {
    __kind: 'CodeLinked'
    account: AccountId32
    code: Bytes
    referralAccount: AccountId32
}

/**
 * Referral code has been registered.
 */
export interface ReferralsEvent_CodeRegistered {
    __kind: 'CodeRegistered'
    code: Bytes
    account: AccountId32
}

/**
 * Asset has been converted to RewardAsset.
 */
export interface ReferralsEvent_Converted {
    __kind: 'Converted'
    from: Type_431
    to: Type_431
}

/**
 * Referrer reached new level.
 */
export interface ReferralsEvent_LevelUp {
    __kind: 'LevelUp'
    who: AccountId32
    level: Level
}

export interface Type_431 {
    assetId: number
    amount: bigint
}

export interface FeeDistribution {
    referrer: Permill
    trader: Permill
    external: Permill
}

export type Level = Level_None | Level_Tier0 | Level_Tier1 | Level_Tier2 | Level_Tier3 | Level_Tier4

export interface Level_None {
    __kind: 'None'
}

export interface Level_Tier0 {
    __kind: 'Tier0'
}

export interface Level_Tier1 {
    __kind: 'Tier1'
}

export interface Level_Tier2 {
    __kind: 'Tier2'
}

export interface Level_Tier3 {
    __kind: 'Tier3'
}

export interface Level_Tier4 {
    __kind: 'Tier4'
}

/**
 * The `Event` enum of this pallet
 */
export type ReferendaEvent = ReferendaEvent_Approved | ReferendaEvent_Cancelled | ReferendaEvent_ConfirmAborted | ReferendaEvent_ConfirmStarted | ReferendaEvent_Confirmed | ReferendaEvent_DecisionDepositPlaced | ReferendaEvent_DecisionDepositRefunded | ReferendaEvent_DecisionStarted | ReferendaEvent_DepositSlashed | ReferendaEvent_Killed | ReferendaEvent_MetadataCleared | ReferendaEvent_MetadataSet | ReferendaEvent_Rejected | ReferendaEvent_SubmissionDepositRefunded | ReferendaEvent_Submitted | ReferendaEvent_TimedOut

/**
 * A referendum has been approved and its proposal has been scheduled.
 */
export interface ReferendaEvent_Approved {
    __kind: 'Approved'
    /**
     * Index of the referendum.
     */
    index: number
}

/**
 * A referendum has been cancelled.
 */
export interface ReferendaEvent_Cancelled {
    __kind: 'Cancelled'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The final tally of votes in this referendum.
     */
    tally: Tally
}

export interface ReferendaEvent_ConfirmAborted {
    __kind: 'ConfirmAborted'
    /**
     * Index of the referendum.
     */
    index: number
}

export interface ReferendaEvent_ConfirmStarted {
    __kind: 'ConfirmStarted'
    /**
     * Index of the referendum.
     */
    index: number
}

/**
 * A referendum has ended its confirmation phase and is ready for approval.
 */
export interface ReferendaEvent_Confirmed {
    __kind: 'Confirmed'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The final tally of votes in this referendum.
     */
    tally: Tally
}

/**
 * The decision deposit has been placed.
 */
export interface ReferendaEvent_DecisionDepositPlaced {
    __kind: 'DecisionDepositPlaced'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The account who placed the deposit.
     */
    who: AccountId32
    /**
     * The amount placed by the account.
     */
    amount: bigint
}

/**
 * The decision deposit has been refunded.
 */
export interface ReferendaEvent_DecisionDepositRefunded {
    __kind: 'DecisionDepositRefunded'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The account who placed the deposit.
     */
    who: AccountId32
    /**
     * The amount placed by the account.
     */
    amount: bigint
}

/**
 * A referendum has moved into the deciding phase.
 */
export interface ReferendaEvent_DecisionStarted {
    __kind: 'DecisionStarted'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The track (and by extension proposal dispatch origin) of this referendum.
     */
    track: number
    /**
     * The proposal for the referendum.
     */
    proposal: Bounded
    /**
     * The current tally of votes in this referendum.
     */
    tally: Tally
}

/**
 * A deposit has been slashed.
 */
export interface ReferendaEvent_DepositSlashed {
    __kind: 'DepositSlashed'
    /**
     * The account who placed the deposit.
     */
    who: AccountId32
    /**
     * The amount placed by the account.
     */
    amount: bigint
}

/**
 * A referendum has been killed.
 */
export interface ReferendaEvent_Killed {
    __kind: 'Killed'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The final tally of votes in this referendum.
     */
    tally: Tally
}

/**
 * Metadata for a referendum has been cleared.
 */
export interface ReferendaEvent_MetadataCleared {
    __kind: 'MetadataCleared'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * Preimage hash.
     */
    hash: H256
}

/**
 * Metadata for a referendum has been set.
 */
export interface ReferendaEvent_MetadataSet {
    __kind: 'MetadataSet'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * Preimage hash.
     */
    hash: H256
}

/**
 * A proposal has been rejected by referendum.
 */
export interface ReferendaEvent_Rejected {
    __kind: 'Rejected'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The final tally of votes in this referendum.
     */
    tally: Tally
}

/**
 * The submission deposit has been refunded.
 */
export interface ReferendaEvent_SubmissionDepositRefunded {
    __kind: 'SubmissionDepositRefunded'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The account who placed the deposit.
     */
    who: AccountId32
    /**
     * The amount placed by the account.
     */
    amount: bigint
}

/**
 * A referendum has been submitted.
 */
export interface ReferendaEvent_Submitted {
    __kind: 'Submitted'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The track (and by extension proposal dispatch origin) of this referendum.
     */
    track: number
    /**
     * The proposal for the referendum.
     */
    proposal: Bounded
}

/**
 * A referendum has been timed out without being decided.
 */
export interface ReferendaEvent_TimedOut {
    __kind: 'TimedOut'
    /**
     * Index of the referendum.
     */
    index: number
    /**
     * The final tally of votes in this referendum.
     */
    tally: Tally
}

export type Bounded = Bounded_Inline | Bounded_Legacy | Bounded_Lookup

export interface Bounded_Inline {
    __kind: 'Inline'
    value: Bytes
}

export interface Bounded_Legacy {
    __kind: 'Legacy'
    hash: H256
}

export interface Bounded_Lookup {
    __kind: 'Lookup'
    hash: H256
    len: number
}

export interface Tally {
    ayes: bigint
    nays: bigint
    support: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type ProxyEvent = ProxyEvent_Announced | ProxyEvent_ProxyAdded | ProxyEvent_ProxyExecuted | ProxyEvent_ProxyRemoved | ProxyEvent_PureCreated

/**
 * An announcement was placed to make a call in the future.
 */
export interface ProxyEvent_Announced {
    __kind: 'Announced'
    real: AccountId32
    proxy: AccountId32
    callHash: H256
}

/**
 * A proxy was added.
 */
export interface ProxyEvent_ProxyAdded {
    __kind: 'ProxyAdded'
    delegator: AccountId32
    delegatee: AccountId32
    proxyType: ProxyType
    delay: number
}

/**
 * A proxy was executed correctly, with the given.
 */
export interface ProxyEvent_ProxyExecuted {
    __kind: 'ProxyExecuted'
    result: Result<null, DispatchError>
}

/**
 * A proxy was removed.
 */
export interface ProxyEvent_ProxyRemoved {
    __kind: 'ProxyRemoved'
    delegator: AccountId32
    delegatee: AccountId32
    proxyType: ProxyType
    delay: number
}

/**
 * A pure account has been created by new proxy with given
 * disambiguation index and proxy type.
 */
export interface ProxyEvent_PureCreated {
    __kind: 'PureCreated'
    pure: AccountId32
    who: AccountId32
    proxyType: ProxyType
    disambiguationIndex: number
}

export type ProxyType = ProxyType_Any | ProxyType_CancelProxy | ProxyType_Governance | ProxyType_Liquidity | ProxyType_LiquidityMining | ProxyType_Transfer

export interface ProxyType_Any {
    __kind: 'Any'
}

export interface ProxyType_CancelProxy {
    __kind: 'CancelProxy'
}

export interface ProxyType_Governance {
    __kind: 'Governance'
}

export interface ProxyType_Liquidity {
    __kind: 'Liquidity'
}

export interface ProxyType_LiquidityMining {
    __kind: 'LiquidityMining'
}

export interface ProxyType_Transfer {
    __kind: 'Transfer'
}

/**
 * The `Event` enum of this pallet
 */
export type PreimageEvent = PreimageEvent_Cleared | PreimageEvent_Noted | PreimageEvent_Requested

/**
 * A preimage has ben cleared.
 */
export interface PreimageEvent_Cleared {
    __kind: 'Cleared'
    hash: H256
}

/**
 * A preimage has been noted.
 */
export interface PreimageEvent_Noted {
    __kind: 'Noted'
    hash: H256
}

/**
 * A preimage has been requested.
 */
export interface PreimageEvent_Requested {
    __kind: 'Requested'
    hash: H256
}

/**
 * The `Event` enum of this pallet
 */
export type PolkadotXcmEvent = PolkadotXcmEvent_AssetsClaimed | PolkadotXcmEvent_AssetsTrapped | PolkadotXcmEvent_Attempted | PolkadotXcmEvent_FeesPaid | PolkadotXcmEvent_InvalidQuerier | PolkadotXcmEvent_InvalidQuerierVersion | PolkadotXcmEvent_InvalidResponder | PolkadotXcmEvent_InvalidResponderVersion | PolkadotXcmEvent_Notified | PolkadotXcmEvent_NotifyDecodeFailed | PolkadotXcmEvent_NotifyDispatchError | PolkadotXcmEvent_NotifyOverweight | PolkadotXcmEvent_NotifyTargetMigrationFail | PolkadotXcmEvent_NotifyTargetSendFail | PolkadotXcmEvent_ResponseReady | PolkadotXcmEvent_ResponseTaken | PolkadotXcmEvent_Sent | PolkadotXcmEvent_SupportedVersionChanged | PolkadotXcmEvent_UnexpectedResponse | PolkadotXcmEvent_VersionChangeNotified | PolkadotXcmEvent_VersionMigrationFinished | PolkadotXcmEvent_VersionNotifyRequested | PolkadotXcmEvent_VersionNotifyStarted | PolkadotXcmEvent_VersionNotifyUnrequested

/**
 * Some assets have been claimed from an asset trap
 */
export interface PolkadotXcmEvent_AssetsClaimed {
    __kind: 'AssetsClaimed'
    hash: H256
    origin: V4Location
    assets: VersionedAssets
}

/**
 * Some assets have been placed in an asset trap.
 */
export interface PolkadotXcmEvent_AssetsTrapped {
    __kind: 'AssetsTrapped'
    hash: H256
    origin: V4Location
    assets: VersionedAssets
}

/**
 * Execution of an XCM message was attempted.
 */
export interface PolkadotXcmEvent_Attempted {
    __kind: 'Attempted'
    outcome: V4Outcome
}

/**
 * Fees were paid from a location for an operation (often for using `SendXcm`).
 */
export interface PolkadotXcmEvent_FeesPaid {
    __kind: 'FeesPaid'
    paying: V4Location
    fees: V4Asset[]
}

/**
 * Expected query response has been received but the querier location of the response does
 * not match the expected. The query remains registered for a later, valid, response to
 * be received and acted upon.
 */
export interface PolkadotXcmEvent_InvalidQuerier {
    __kind: 'InvalidQuerier'
    origin: V4Location
    queryId: bigint
    expectedQuerier: V4Location
    maybeActualQuerier?: (V4Location | undefined)
}

/**
 * Expected query response has been received but the expected querier location placed in
 * storage by this runtime previously cannot be decoded. The query remains registered.
 * 
 * This is unexpected (since a location placed in storage in a previously executing
 * runtime should be readable prior to query timeout) and dangerous since the possibly
 * valid response will be dropped. Manual governance intervention is probably going to be
 * needed.
 */
export interface PolkadotXcmEvent_InvalidQuerierVersion {
    __kind: 'InvalidQuerierVersion'
    origin: V4Location
    queryId: bigint
}

/**
 * Expected query response has been received but the origin location of the response does
 * not match that expected. The query remains registered for a later, valid, response to
 * be received and acted upon.
 */
export interface PolkadotXcmEvent_InvalidResponder {
    __kind: 'InvalidResponder'
    origin: V4Location
    queryId: bigint
    expectedLocation?: (V4Location | undefined)
}

/**
 * Expected query response has been received but the expected origin location placed in
 * storage by this runtime previously cannot be decoded. The query remains registered.
 * 
 * This is unexpected (since a location placed in storage in a previously executing
 * runtime should be readable prior to query timeout) and dangerous since the possibly
 * valid response will be dropped. Manual governance intervention is probably going to be
 * needed.
 */
export interface PolkadotXcmEvent_InvalidResponderVersion {
    __kind: 'InvalidResponderVersion'
    origin: V4Location
    queryId: bigint
}

/**
 * Query response has been received and query is removed. The registered notification has
 * been dispatched and executed successfully.
 */
export interface PolkadotXcmEvent_Notified {
    __kind: 'Notified'
    queryId: bigint
    palletIndex: number
    callIndex: number
}

/**
 * Query response has been received and query is removed. The dispatch was unable to be
 * decoded into a `Call`; this might be due to dispatch function having a signature which
 * is not `(origin, QueryId, Response)`.
 */
export interface PolkadotXcmEvent_NotifyDecodeFailed {
    __kind: 'NotifyDecodeFailed'
    queryId: bigint
    palletIndex: number
    callIndex: number
}

/**
 * Query response has been received and query is removed. There was a general error with
 * dispatching the notification call.
 */
export interface PolkadotXcmEvent_NotifyDispatchError {
    __kind: 'NotifyDispatchError'
    queryId: bigint
    palletIndex: number
    callIndex: number
}

/**
 * Query response has been received and query is removed. The registered notification
 * could not be dispatched because the dispatch weight is greater than the maximum weight
 * originally budgeted by this runtime for the query result.
 */
export interface PolkadotXcmEvent_NotifyOverweight {
    __kind: 'NotifyOverweight'
    queryId: bigint
    palletIndex: number
    callIndex: number
    actualWeight: Weight
    maxBudgetedWeight: Weight
}

/**
 * A given location which had a version change subscription was dropped owing to an error
 * migrating the location to our new XCM format.
 */
export interface PolkadotXcmEvent_NotifyTargetMigrationFail {
    __kind: 'NotifyTargetMigrationFail'
    location: VersionedLocation
    queryId: bigint
}

/**
 * A given location which had a version change subscription was dropped owing to an error
 * sending the notification to it.
 */
export interface PolkadotXcmEvent_NotifyTargetSendFail {
    __kind: 'NotifyTargetSendFail'
    location: V4Location
    queryId: bigint
    error: V3Error
}

/**
 * Query response has been received and is ready for taking with `take_response`. There is
 * no registered notification call.
 */
export interface PolkadotXcmEvent_ResponseReady {
    __kind: 'ResponseReady'
    queryId: bigint
    response: V4Response
}

/**
 * Received query response has been read and removed.
 */
export interface PolkadotXcmEvent_ResponseTaken {
    __kind: 'ResponseTaken'
    queryId: bigint
}

/**
 * A XCM message was sent.
 */
export interface PolkadotXcmEvent_Sent {
    __kind: 'Sent'
    origin: V4Location
    destination: V4Location
    message: V4Instruction[]
    messageId: Bytes
}

/**
 * The supported version of a location has been changed. This might be through an
 * automatic notification or a manual intervention.
 */
export interface PolkadotXcmEvent_SupportedVersionChanged {
    __kind: 'SupportedVersionChanged'
    location: V4Location
    version: number
}

/**
 * Query response received which does not match a registered query. This may be because a
 * matching query was never registered, it may be because it is a duplicate response, or
 * because the query timed out.
 */
export interface PolkadotXcmEvent_UnexpectedResponse {
    __kind: 'UnexpectedResponse'
    origin: V4Location
    queryId: bigint
}

/**
 * An XCM version change notification message has been attempted to be sent.
 * 
 * The cost of sending it (borne by the chain) is included.
 */
export interface PolkadotXcmEvent_VersionChangeNotified {
    __kind: 'VersionChangeNotified'
    destination: V4Location
    result: number
    cost: V4Asset[]
    messageId: Bytes
}

/**
 * A XCM version migration finished.
 */
export interface PolkadotXcmEvent_VersionMigrationFinished {
    __kind: 'VersionMigrationFinished'
    version: number
}

/**
 * We have requested that a remote chain send us XCM version change notifications.
 */
export interface PolkadotXcmEvent_VersionNotifyRequested {
    __kind: 'VersionNotifyRequested'
    destination: V4Location
    cost: V4Asset[]
    messageId: Bytes
}

/**
 * A remote has requested XCM version change notification from us and we have honored it.
 * A version information message is sent to them and its cost is included.
 */
export interface PolkadotXcmEvent_VersionNotifyStarted {
    __kind: 'VersionNotifyStarted'
    destination: V4Location
    cost: V4Asset[]
    messageId: Bytes
}

/**
 * We have requested that a remote chain stops sending us XCM version change
 * notifications.
 */
export interface PolkadotXcmEvent_VersionNotifyUnrequested {
    __kind: 'VersionNotifyUnrequested'
    destination: V4Location
    cost: V4Asset[]
    messageId: Bytes
}

export type V4Instruction = V4Instruction_AliasOrigin | V4Instruction_BurnAsset | V4Instruction_BuyExecution | V4Instruction_ClaimAsset | V4Instruction_ClearError | V4Instruction_ClearOrigin | V4Instruction_ClearTopic | V4Instruction_ClearTransactStatus | V4Instruction_DepositAsset | V4Instruction_DepositReserveAsset | V4Instruction_DescendOrigin | V4Instruction_ExchangeAsset | V4Instruction_ExpectAsset | V4Instruction_ExpectError | V4Instruction_ExpectOrigin | V4Instruction_ExpectPallet | V4Instruction_ExpectTransactStatus | V4Instruction_ExportMessage | V4Instruction_HrmpChannelAccepted | V4Instruction_HrmpChannelClosing | V4Instruction_HrmpNewChannelOpenRequest | V4Instruction_InitiateReserveWithdraw | V4Instruction_InitiateTeleport | V4Instruction_LockAsset | V4Instruction_NoteUnlockable | V4Instruction_QueryPallet | V4Instruction_QueryResponse | V4Instruction_ReceiveTeleportedAsset | V4Instruction_RefundSurplus | V4Instruction_ReportError | V4Instruction_ReportHolding | V4Instruction_ReportTransactStatus | V4Instruction_RequestUnlock | V4Instruction_ReserveAssetDeposited | V4Instruction_SetAppendix | V4Instruction_SetErrorHandler | V4Instruction_SetFeesMode | V4Instruction_SetTopic | V4Instruction_SubscribeVersion | V4Instruction_Transact | V4Instruction_TransferAsset | V4Instruction_TransferReserveAsset | V4Instruction_Trap | V4Instruction_UniversalOrigin | V4Instruction_UnlockAsset | V4Instruction_UnpaidExecution | V4Instruction_UnsubscribeVersion | V4Instruction_WithdrawAsset

export interface V4Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V4Location
}

export interface V4Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V4Asset[]
}

export interface V4Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V4Asset
    weightLimit: V3WeightLimit
}

export interface V4Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V4Asset[]
    ticket: V4Location
}

export interface V4Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V4Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V4Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V4Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V4Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V4AssetFilter
    beneficiary: V4Location
}

export interface V4Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V4Junctions
}

export interface V4Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V4AssetFilter
    want: V4Asset[]
    maximal: boolean
}

export interface V4Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V4Asset[]
}

export interface V4Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V4Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V4Location | undefined)
}

export interface V4Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V4Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V4Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V4NetworkId
    destination: V4Junctions
    xcm: V4Instruction[]
}

export interface V4Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V4Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V4Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V4Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V4AssetFilter
    reserve: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V4AssetFilter
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V4Asset
    unlocker: V4Location
}

export interface V4Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V4Asset
    owner: V4Location
}

export interface V4Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V4QueryResponseInfo
}

export interface V4Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V4Response
    maxWeight: Weight
    querier?: (V4Location | undefined)
}

export interface V4Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V4Asset[]
}

export interface V4Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V4Instruction_ReportError {
    __kind: 'ReportError'
    value: V4QueryResponseInfo
}

export interface V4Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V4QueryResponseInfo
    assets: V4AssetFilter
}

export interface V4Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V4QueryResponseInfo
}

export interface V4Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V4Asset
    locker: V4Location
}

export interface V4Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V4Asset[]
}

export interface V4Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V4Instruction[]
}

export interface V4Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V4Instruction[]
}

export interface V4Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V4Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V4Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V4Instruction_Transact {
    __kind: 'Transact'
    originKind: V3OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V4Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V4Asset[]
    beneficiary: V4Location
}

export interface V4Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V4Asset[]
    dest: V4Location
    xcm: V4Instruction[]
}

export interface V4Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V4Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V4Junction
}

export interface V4Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V4Asset
    target: V4Location
}

export interface V4Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V4Location | undefined)
}

export interface V4Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V4Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V4Asset[]
}

export interface DoubleEncoded {
    encoded: Bytes
}

export type V3OriginKind = V3OriginKind_Native | V3OriginKind_SovereignAccount | V3OriginKind_Superuser | V3OriginKind_Xcm

export interface V3OriginKind_Native {
    __kind: 'Native'
}

export interface V3OriginKind_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface V3OriginKind_Superuser {
    __kind: 'Superuser'
}

export interface V3OriginKind_Xcm {
    __kind: 'Xcm'
}

export interface V4QueryResponseInfo {
    destination: V4Location
    queryId: bigint
    maxWeight: Weight
}

export type V3MaybeErrorCode = V3MaybeErrorCode_Error | V3MaybeErrorCode_Success | V3MaybeErrorCode_TruncatedError

export interface V3MaybeErrorCode_Error {
    __kind: 'Error'
    value: Bytes
}

export interface V3MaybeErrorCode_Success {
    __kind: 'Success'
}

export interface V3MaybeErrorCode_TruncatedError {
    __kind: 'TruncatedError'
    value: Bytes
}

export type V4AssetFilter = V4AssetFilter_Definite | V4AssetFilter_Wild

export interface V4AssetFilter_Definite {
    __kind: 'Definite'
    value: V4Asset[]
}

export interface V4AssetFilter_Wild {
    __kind: 'Wild'
    value: V4WildAsset
}

export type V4WildAsset = V4WildAsset_All | V4WildAsset_AllCounted | V4WildAsset_AllOf | V4WildAsset_AllOfCounted

export interface V4WildAsset_All {
    __kind: 'All'
}

export interface V4WildAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V4WildAsset_AllOf {
    __kind: 'AllOf'
    id: V4AssetId
    fun: V4WildFungibility
}

export interface V4WildAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V4AssetId
    fun: V4WildFungibility
    count: number
}

export type V4WildFungibility = V4WildFungibility_Fungible | V4WildFungibility_NonFungible

export interface V4WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V4WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export type V3WeightLimit = V3WeightLimit_Limited | V3WeightLimit_Unlimited

export interface V3WeightLimit_Limited {
    __kind: 'Limited'
    value: Weight
}

export interface V3WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

export type V4Response = V4Response_Assets | V4Response_DispatchResult | V4Response_ExecutionResult | V4Response_Null | V4Response_PalletsInfo | V4Response_Version

export interface V4Response_Assets {
    __kind: 'Assets'
    value: V4Asset[]
}

export interface V4Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V4Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V4Response_Null {
    __kind: 'Null'
}

export interface V4Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V4PalletInfo[]
}

export interface V4Response_Version {
    __kind: 'Version'
    value: number
}

export interface V4PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type V3Error = V3Error_AssetNotFound | V3Error_BadOrigin | V3Error_Barrier | V3Error_DestinationUnsupported | V3Error_ExceedsMaxMessageSize | V3Error_ExceedsStackLimit | V3Error_ExpectationFalse | V3Error_ExportError | V3Error_FailedToDecode | V3Error_FailedToTransactAsset | V3Error_FeesNotMet | V3Error_HoldingWouldOverflow | V3Error_InvalidLocation | V3Error_LocationCannotHold | V3Error_LocationFull | V3Error_LocationNotInvertible | V3Error_LockError | V3Error_MaxWeightInvalid | V3Error_NameMismatch | V3Error_NoDeal | V3Error_NoPermission | V3Error_NotDepositable | V3Error_NotHoldingFees | V3Error_NotWithdrawable | V3Error_Overflow | V3Error_PalletNotFound | V3Error_ReanchorFailed | V3Error_TooExpensive | V3Error_Transport | V3Error_Trap | V3Error_Unanchored | V3Error_UnhandledXcmVersion | V3Error_Unimplemented | V3Error_UnknownClaim | V3Error_Unroutable | V3Error_UntrustedReserveLocation | V3Error_UntrustedTeleportLocation | V3Error_VersionIncompatible | V3Error_WeightLimitReached | V3Error_WeightNotComputable

export interface V3Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V3Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V3Error_Barrier {
    __kind: 'Barrier'
}

export interface V3Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V3Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V3Error_ExceedsStackLimit {
    __kind: 'ExceedsStackLimit'
}

export interface V3Error_ExpectationFalse {
    __kind: 'ExpectationFalse'
}

export interface V3Error_ExportError {
    __kind: 'ExportError'
}

export interface V3Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V3Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V3Error_FeesNotMet {
    __kind: 'FeesNotMet'
}

export interface V3Error_HoldingWouldOverflow {
    __kind: 'HoldingWouldOverflow'
}

export interface V3Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V3Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V3Error_LocationFull {
    __kind: 'LocationFull'
}

export interface V3Error_LocationNotInvertible {
    __kind: 'LocationNotInvertible'
}

export interface V3Error_LockError {
    __kind: 'LockError'
}

export interface V3Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V3Error_NameMismatch {
    __kind: 'NameMismatch'
}

export interface V3Error_NoDeal {
    __kind: 'NoDeal'
}

export interface V3Error_NoPermission {
    __kind: 'NoPermission'
}

export interface V3Error_NotDepositable {
    __kind: 'NotDepositable'
}

export interface V3Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V3Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V3Error_Overflow {
    __kind: 'Overflow'
}

export interface V3Error_PalletNotFound {
    __kind: 'PalletNotFound'
}

export interface V3Error_ReanchorFailed {
    __kind: 'ReanchorFailed'
}

export interface V3Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V3Error_Transport {
    __kind: 'Transport'
}

export interface V3Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Error_Unanchored {
    __kind: 'Unanchored'
}

export interface V3Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V3Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V3Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V3Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V3Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V3Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V3Error_VersionIncompatible {
    __kind: 'VersionIncompatible'
}

export interface V3Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: Weight
}

export interface V3Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

export type VersionedLocation = VersionedLocation_V2 | VersionedLocation_V3 | VersionedLocation_V4

export interface VersionedLocation_V2 {
    __kind: 'V2'
    value: V2MultiLocation
}

export interface VersionedLocation_V3 {
    __kind: 'V3'
    value: V3MultiLocation
}

export interface VersionedLocation_V4 {
    __kind: 'V4'
    value: V4Location
}

export interface V3MultiLocation {
    parents: number
    interior: V3Junctions
}

export type V3Junctions = V3Junctions_Here | V3Junctions_X1 | V3Junctions_X2 | V3Junctions_X3 | V3Junctions_X4 | V3Junctions_X5 | V3Junctions_X6 | V3Junctions_X7 | V3Junctions_X8

export interface V3Junctions_Here {
    __kind: 'Here'
}

export interface V3Junctions_X1 {
    __kind: 'X1'
    value: V3Junction
}

export interface V3Junctions_X2 {
    __kind: 'X2'
    value: [V3Junction, V3Junction]
}

export interface V3Junctions_X3 {
    __kind: 'X3'
    value: [V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X4 {
    __kind: 'X4'
    value: [V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X5 {
    __kind: 'X5'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X6 {
    __kind: 'X6'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X7 {
    __kind: 'X7'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export interface V3Junctions_X8 {
    __kind: 'X8'
    value: [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]
}

export type V3Junction = V3Junction_AccountId32 | V3Junction_AccountIndex64 | V3Junction_AccountKey20 | V3Junction_GeneralIndex | V3Junction_GeneralKey | V3Junction_GlobalConsensus | V3Junction_OnlyChild | V3Junction_PalletInstance | V3Junction_Parachain | V3Junction_Plurality

export interface V3Junction_AccountId32 {
    __kind: 'AccountId32'
    network?: (V3NetworkId | undefined)
    id: Bytes
}

export interface V3Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network?: (V3NetworkId | undefined)
    index: bigint
}

export interface V3Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network?: (V3NetworkId | undefined)
    key: Bytes
}

export interface V3Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V3Junction_GeneralKey {
    __kind: 'GeneralKey'
    length: number
    data: Bytes
}

export interface V3Junction_GlobalConsensus {
    __kind: 'GlobalConsensus'
    value: V3NetworkId
}

export interface V3Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V3Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V3Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V3Junction_Plurality {
    __kind: 'Plurality'
    id: V3BodyId
    part: V3BodyPart
}

export type V3NetworkId = V3NetworkId_BitcoinCash | V3NetworkId_BitcoinCore | V3NetworkId_ByFork | V3NetworkId_ByGenesis | V3NetworkId_Ethereum | V3NetworkId_Kusama | V3NetworkId_Polkadot | V3NetworkId_PolkadotBulletin | V3NetworkId_Rococo | V3NetworkId_Westend | V3NetworkId_Wococo

export interface V3NetworkId_BitcoinCash {
    __kind: 'BitcoinCash'
}

export interface V3NetworkId_BitcoinCore {
    __kind: 'BitcoinCore'
}

export interface V3NetworkId_ByFork {
    __kind: 'ByFork'
    blockNumber: bigint
    blockHash: Bytes
}

export interface V3NetworkId_ByGenesis {
    __kind: 'ByGenesis'
    value: Bytes
}

export interface V3NetworkId_Ethereum {
    __kind: 'Ethereum'
    chainId: bigint
}

export interface V3NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V3NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V3NetworkId_PolkadotBulletin {
    __kind: 'PolkadotBulletin'
}

export interface V3NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V3NetworkId_Westend {
    __kind: 'Westend'
}

export interface V3NetworkId_Wococo {
    __kind: 'Wococo'
}

export interface V2MultiLocation {
    parents: number
    interior: V2Junctions
}

export type V2Junctions = V2Junctions_Here | V2Junctions_X1 | V2Junctions_X2 | V2Junctions_X3 | V2Junctions_X4 | V2Junctions_X5 | V2Junctions_X6 | V2Junctions_X7 | V2Junctions_X8

export interface V2Junctions_Here {
    __kind: 'Here'
}

export interface V2Junctions_X1 {
    __kind: 'X1'
    value: V2Junction
}

export interface V2Junctions_X2 {
    __kind: 'X2'
    value: [V2Junction, V2Junction]
}

export interface V2Junctions_X3 {
    __kind: 'X3'
    value: [V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X4 {
    __kind: 'X4'
    value: [V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X5 {
    __kind: 'X5'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X6 {
    __kind: 'X6'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X7 {
    __kind: 'X7'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export interface V2Junctions_X8 {
    __kind: 'X8'
    value: [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]
}

export type V2Junction = V2Junction_AccountId32 | V2Junction_AccountIndex64 | V2Junction_AccountKey20 | V2Junction_GeneralIndex | V2Junction_GeneralKey | V2Junction_OnlyChild | V2Junction_PalletInstance | V2Junction_Parachain | V2Junction_Plurality

export interface V2Junction_AccountId32 {
    __kind: 'AccountId32'
    network: V2NetworkId
    id: Bytes
}

export interface V2Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: V2NetworkId
    index: bigint
}

export interface V2Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network: V2NetworkId
    key: Bytes
}

export interface V2Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V2Junction_GeneralKey {
    __kind: 'GeneralKey'
    value: WeakBoundedVec
}

export interface V2Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V2Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V2Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V2Junction_Plurality {
    __kind: 'Plurality'
    id: V2BodyId
    part: V2BodyPart
}

export type V2BodyPart = V2BodyPart_AtLeastProportion | V2BodyPart_Fraction | V2BodyPart_Members | V2BodyPart_MoreThanProportion | V2BodyPart_Voice

export interface V2BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V2BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V2BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V2BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V2BodyPart_Voice {
    __kind: 'Voice'
}

export type V2BodyId = V2BodyId_Administration | V2BodyId_Defense | V2BodyId_Executive | V2BodyId_Index | V2BodyId_Judicial | V2BodyId_Legislative | V2BodyId_Named | V2BodyId_Technical | V2BodyId_Treasury | V2BodyId_Unit

export interface V2BodyId_Administration {
    __kind: 'Administration'
}

export interface V2BodyId_Defense {
    __kind: 'Defense'
}

export interface V2BodyId_Executive {
    __kind: 'Executive'
}

export interface V2BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V2BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V2BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V2BodyId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V2BodyId_Technical {
    __kind: 'Technical'
}

export interface V2BodyId_Treasury {
    __kind: 'Treasury'
}

export interface V2BodyId_Unit {
    __kind: 'Unit'
}

export type WeakBoundedVec = Bytes

export type V2NetworkId = V2NetworkId_Any | V2NetworkId_Kusama | V2NetworkId_Named | V2NetworkId_Polkadot

export interface V2NetworkId_Any {
    __kind: 'Any'
}

export interface V2NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V2NetworkId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V2NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export type V4Outcome = V4Outcome_Complete | V4Outcome_Error | V4Outcome_Incomplete

export interface V4Outcome_Complete {
    __kind: 'Complete'
    used: Weight
}

export interface V4Outcome_Error {
    __kind: 'Error'
    error: V3Error
}

export interface V4Outcome_Incomplete {
    __kind: 'Incomplete'
    used: Weight
    error: V3Error
}

export type VersionedAssets = VersionedAssets_V2 | VersionedAssets_V3 | VersionedAssets_V4

export interface VersionedAssets_V2 {
    __kind: 'V2'
    value: V2MultiAsset[]
}

export interface VersionedAssets_V3 {
    __kind: 'V3'
    value: V3MultiAsset[]
}

export interface VersionedAssets_V4 {
    __kind: 'V4'
    value: V4Asset[]
}

export interface V3MultiAsset {
    id: V3AssetId
    fun: V3Fungibility
}

export type V3Fungibility = V3Fungibility_Fungible | V3Fungibility_NonFungible

export interface V3Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V3Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V3AssetInstance
}

export type V3AssetInstance = V3AssetInstance_Array16 | V3AssetInstance_Array32 | V3AssetInstance_Array4 | V3AssetInstance_Array8 | V3AssetInstance_Index | V3AssetInstance_Undefined

export interface V3AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V3AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V3AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V3AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V3AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V3AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V3AssetId = V3AssetId_Abstract | V3AssetId_Concrete

export interface V3AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V3AssetId_Concrete {
    __kind: 'Concrete'
    value: V3MultiLocation
}

export interface V2MultiAsset {
    id: V2AssetId
    fun: V2Fungibility
}

export type V2Fungibility = V2Fungibility_Fungible | V2Fungibility_NonFungible

export interface V2Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V2Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V2AssetInstance
}

export type V2AssetInstance = V2AssetInstance_Array16 | V2AssetInstance_Array32 | V2AssetInstance_Array4 | V2AssetInstance_Array8 | V2AssetInstance_Blob | V2AssetInstance_Index | V2AssetInstance_Undefined

export interface V2AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V2AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V2AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V2AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V2AssetInstance_Blob {
    __kind: 'Blob'
    value: Bytes
}

export interface V2AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V2AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V2AssetId = V2AssetId_Abstract | V2AssetId_Concrete

export interface V2AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V2AssetId_Concrete {
    __kind: 'Concrete'
    value: V2MultiLocation
}

/**
 * The `Event` enum of this pallet
 */
export type ParachainSystemEvent = ParachainSystemEvent_DownwardMessagesProcessed | ParachainSystemEvent_DownwardMessagesReceived | ParachainSystemEvent_UpwardMessageSent | ParachainSystemEvent_ValidationFunctionApplied | ParachainSystemEvent_ValidationFunctionDiscarded | ParachainSystemEvent_ValidationFunctionStored

/**
 * Downward messages were processed using the given weight.
 */
export interface ParachainSystemEvent_DownwardMessagesProcessed {
    __kind: 'DownwardMessagesProcessed'
    weightUsed: Weight
    dmqHead: H256
}

/**
 * Some downward messages have been received and will be processed.
 */
export interface ParachainSystemEvent_DownwardMessagesReceived {
    __kind: 'DownwardMessagesReceived'
    count: number
}

/**
 * An upward message was sent to the relay chain.
 */
export interface ParachainSystemEvent_UpwardMessageSent {
    __kind: 'UpwardMessageSent'
    messageHash?: (Bytes | undefined)
}

/**
 * The validation function was applied as of the contained relay chain block number.
 */
export interface ParachainSystemEvent_ValidationFunctionApplied {
    __kind: 'ValidationFunctionApplied'
    relayChainBlockNum: number
}

/**
 * The relay-chain aborted the upgrade process.
 */
export interface ParachainSystemEvent_ValidationFunctionDiscarded {
    __kind: 'ValidationFunctionDiscarded'
}

/**
 * The validation function has been scheduled to apply.
 */
export interface ParachainSystemEvent_ValidationFunctionStored {
    __kind: 'ValidationFunctionStored'
}

/**
 * The `Event` enum of this pallet
 */
export type OtcSettlementsEvent = OtcSettlementsEvent_Executed

/**
 * A trade has been executed
 */
export interface OtcSettlementsEvent_Executed {
    __kind: 'Executed'
    assetId: number
    profit: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type OrmlXcmEvent = OrmlXcmEvent_Sent

/**
 * XCM message sent. \[to, message\]
 */
export interface OrmlXcmEvent_Sent {
    __kind: 'Sent'
    to: V4Location
    message: V4Instruction[]
}

/**
 * The `Event` enum of this pallet
 */
export type OmnipoolWarehouseLMEvent = OmnipoolWarehouseLMEvent_AllRewardsDistributed | OmnipoolWarehouseLMEvent_GlobalFarmAccRPZUpdated | OmnipoolWarehouseLMEvent_YieldFarmAccRPVSUpdated

/**
 * Global farm has no more rewards to distribute in the moment.
 */
export interface OmnipoolWarehouseLMEvent_AllRewardsDistributed {
    __kind: 'AllRewardsDistributed'
    globalFarmId: number
}

/**
 * Global farm accumulated reward per share was updated.
 */
export interface OmnipoolWarehouseLMEvent_GlobalFarmAccRPZUpdated {
    __kind: 'GlobalFarmAccRPZUpdated'
    globalFarmId: number
    accumulatedRpz: FixedU128
    totalSharesZ: bigint
}

/**
 * Yield farm accumulated reward per valued share was updated.
 */
export interface OmnipoolWarehouseLMEvent_YieldFarmAccRPVSUpdated {
    __kind: 'YieldFarmAccRPVSUpdated'
    globalFarmId: number
    yieldFarmId: number
    accumulatedRpvs: FixedU128
    totalValuedShares: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type OmnipoolLiquidityMiningEvent = OmnipoolLiquidityMiningEvent_DepositDestroyed | OmnipoolLiquidityMiningEvent_GlobalFarmCreated | OmnipoolLiquidityMiningEvent_GlobalFarmTerminated | OmnipoolLiquidityMiningEvent_GlobalFarmUpdated | OmnipoolLiquidityMiningEvent_RewardClaimed | OmnipoolLiquidityMiningEvent_SharesDeposited | OmnipoolLiquidityMiningEvent_SharesRedeposited | OmnipoolLiquidityMiningEvent_SharesWithdrawn | OmnipoolLiquidityMiningEvent_YieldFarmCreated | OmnipoolLiquidityMiningEvent_YieldFarmResumed | OmnipoolLiquidityMiningEvent_YieldFarmStopped | OmnipoolLiquidityMiningEvent_YieldFarmTerminated | OmnipoolLiquidityMiningEvent_YieldFarmUpdated

/**
 * All LP shares were unlocked and NFT representing deposit was destroyed.
 */
export interface OmnipoolLiquidityMiningEvent_DepositDestroyed {
    __kind: 'DepositDestroyed'
    who: AccountId32
    depositId: bigint
}

/**
 * New global farm was created.
 */
export interface OmnipoolLiquidityMiningEvent_GlobalFarmCreated {
    __kind: 'GlobalFarmCreated'
    id: number
    owner: AccountId32
    totalRewards: bigint
    rewardCurrency: number
    yieldPerPeriod: Perquintill
    plannedYieldingPeriods: number
    blocksPerPeriod: number
    maxRewardPerPeriod: bigint
    minDeposit: bigint
    lrnaPriceAdjustment: FixedU128
}

/**
 * Global farm was terminated.
 */
export interface OmnipoolLiquidityMiningEvent_GlobalFarmTerminated {
    __kind: 'GlobalFarmTerminated'
    globalFarmId: number
    who: AccountId32
    rewardCurrency: number
    undistributedRewards: bigint
}

/**
 * Global farm was updated
 */
export interface OmnipoolLiquidityMiningEvent_GlobalFarmUpdated {
    __kind: 'GlobalFarmUpdated'
    id: number
    plannedYieldingPeriods: number
    yieldPerPeriod: Perquintill
    minDeposit: bigint
}

/**
 * Rewards were claimed.
 */
export interface OmnipoolLiquidityMiningEvent_RewardClaimed {
    __kind: 'RewardClaimed'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    claimed: bigint
    rewardCurrency: number
    depositId: bigint
}

/**
 * New LP shares(LP position) were deposited.
 */
export interface OmnipoolLiquidityMiningEvent_SharesDeposited {
    __kind: 'SharesDeposited'
    globalFarmId: number
    yieldFarmId: number
    depositId: bigint
    assetId: number
    who: AccountId32
    sharesAmount: bigint
    positionId: bigint
}

/**
 * Already locked LP shares were redeposited to another yield farm.
 */
export interface OmnipoolLiquidityMiningEvent_SharesRedeposited {
    __kind: 'SharesRedeposited'
    globalFarmId: number
    yieldFarmId: number
    depositId: bigint
    assetId: number
    who: AccountId32
    sharesAmount: bigint
    positionId: bigint
}

/**
 * LP shares were withdrawn.
 */
export interface OmnipoolLiquidityMiningEvent_SharesWithdrawn {
    __kind: 'SharesWithdrawn'
    globalFarmId: number
    yieldFarmId: number
    who: AccountId32
    amount: bigint
    depositId: bigint
}

/**
 * New yield farm was added to the farm.
 */
export interface OmnipoolLiquidityMiningEvent_YieldFarmCreated {
    __kind: 'YieldFarmCreated'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    multiplier: FixedU128
    loyaltyCurve?: (LoyaltyCurve | undefined)
}

/**
 * Yield farm for `asset_id` was resumed.
 */
export interface OmnipoolLiquidityMiningEvent_YieldFarmResumed {
    __kind: 'YieldFarmResumed'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    who: AccountId32
    multiplier: FixedU128
}

/**
 * Yield farm for `asset_id` was stopped.
 */
export interface OmnipoolLiquidityMiningEvent_YieldFarmStopped {
    __kind: 'YieldFarmStopped'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    who: AccountId32
}

/**
 * Yield farm was terminated from the global farm.
 */
export interface OmnipoolLiquidityMiningEvent_YieldFarmTerminated {
    __kind: 'YieldFarmTerminated'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    who: AccountId32
}

/**
 * Yield farm multiplier was updated.
 */
export interface OmnipoolLiquidityMiningEvent_YieldFarmUpdated {
    __kind: 'YieldFarmUpdated'
    globalFarmId: number
    yieldFarmId: number
    assetId: number
    who: AccountId32
    multiplier: FixedU128
}

/**
 * The `Event` enum of this pallet
 */
export type OmnipoolEvent = OmnipoolEvent_AssetRefunded | OmnipoolEvent_AssetWeightCapUpdated | OmnipoolEvent_BuyExecuted | OmnipoolEvent_LiquidityAdded | OmnipoolEvent_LiquidityRemoved | OmnipoolEvent_PositionCreated | OmnipoolEvent_PositionDestroyed | OmnipoolEvent_PositionUpdated | OmnipoolEvent_ProtocolLiquidityRemoved | OmnipoolEvent_SellExecuted | OmnipoolEvent_TokenAdded | OmnipoolEvent_TokenRemoved | OmnipoolEvent_TradableStateUpdated

/**
 * Amount has been refunded for asset which has not been accepted to add to omnipool.
 */
export interface OmnipoolEvent_AssetRefunded {
    __kind: 'AssetRefunded'
    assetId: number
    amount: bigint
    recipient: AccountId32
}

/**
 * Asset's weight cap has been updated.
 */
export interface OmnipoolEvent_AssetWeightCapUpdated {
    __kind: 'AssetWeightCapUpdated'
    assetId: number
    cap: Permill
}

/**
 * Buy trade executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface OmnipoolEvent_BuyExecuted {
    __kind: 'BuyExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    hubAmountIn: bigint
    hubAmountOut: bigint
    assetFeeAmount: bigint
    protocolFeeAmount: bigint
}

/**
 * Liquidity of an asset was added to Omnipool.
 */
export interface OmnipoolEvent_LiquidityAdded {
    __kind: 'LiquidityAdded'
    who: AccountId32
    assetId: number
    amount: bigint
    positionId: bigint
}

/**
 * Liquidity of an asset was removed from Omnipool.
 */
export interface OmnipoolEvent_LiquidityRemoved {
    __kind: 'LiquidityRemoved'
    who: AccountId32
    positionId: bigint
    assetId: number
    sharesRemoved: bigint
    fee: FixedU128
}

/**
 * LP Position was created and NFT instance minted.
 */
export interface OmnipoolEvent_PositionCreated {
    __kind: 'PositionCreated'
    positionId: bigint
    owner: AccountId32
    asset: number
    amount: bigint
    shares: bigint
    price: FixedU128
}

/**
 * LP Position was destroyed and NFT instance burned.
 */
export interface OmnipoolEvent_PositionDestroyed {
    __kind: 'PositionDestroyed'
    positionId: bigint
    owner: AccountId32
}

/**
 * LP Position was updated.
 */
export interface OmnipoolEvent_PositionUpdated {
    __kind: 'PositionUpdated'
    positionId: bigint
    owner: AccountId32
    asset: number
    amount: bigint
    shares: bigint
    price: FixedU128
}

/**
 * PRotocol Liquidity was removed from Omnipool.
 */
export interface OmnipoolEvent_ProtocolLiquidityRemoved {
    __kind: 'ProtocolLiquidityRemoved'
    who: AccountId32
    assetId: number
    amount: bigint
    hubAmount: bigint
    sharesRemoved: bigint
}

/**
 * Sell trade executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface OmnipoolEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    hubAmountIn: bigint
    hubAmountOut: bigint
    assetFeeAmount: bigint
    protocolFeeAmount: bigint
}

/**
 * An asset was added to Omnipool
 */
export interface OmnipoolEvent_TokenAdded {
    __kind: 'TokenAdded'
    assetId: number
    initialAmount: bigint
    initialPrice: FixedU128
}

/**
 * An asset was removed from Omnipool
 */
export interface OmnipoolEvent_TokenRemoved {
    __kind: 'TokenRemoved'
    assetId: number
    amount: bigint
    hubWithdrawn: bigint
}

/**
 * Asset's tradable state has been updated.
 */
export interface OmnipoolEvent_TradableStateUpdated {
    __kind: 'TradableStateUpdated'
    assetId: number
    state: Tradability
}

export interface Tradability {
    bits: number
}

/**
 * The `Event` enum of this pallet
 */
export type OTCEvent = OTCEvent_Cancelled | OTCEvent_Filled | OTCEvent_PartiallyFilled | OTCEvent_Placed

/**
 * An Order has been cancelled
 */
export interface OTCEvent_Cancelled {
    __kind: 'Cancelled'
    orderId: number
}

/**
 * An Order has been completely filled
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface OTCEvent_Filled {
    __kind: 'Filled'
    orderId: number
    who: AccountId32
    amountIn: bigint
    amountOut: bigint
    fee: bigint
}

/**
 * An Order has been partially filled
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface OTCEvent_PartiallyFilled {
    __kind: 'PartiallyFilled'
    orderId: number
    who: AccountId32
    amountIn: bigint
    amountOut: bigint
    fee: bigint
}

/**
 * An Order has been placed
 */
export interface OTCEvent_Placed {
    __kind: 'Placed'
    orderId: number
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    partiallyFillable: boolean
}

/**
 * The `Event` enum of this pallet
 */
export type MultisigEvent = MultisigEvent_MultisigApproval | MultisigEvent_MultisigCancelled | MultisigEvent_MultisigExecuted | MultisigEvent_NewMultisig

/**
 * A multisig operation has been approved by someone.
 */
export interface MultisigEvent_MultisigApproval {
    __kind: 'MultisigApproval'
    approving: AccountId32
    timepoint: Timepoint
    multisig: AccountId32
    callHash: Bytes
}

/**
 * A multisig operation has been cancelled.
 */
export interface MultisigEvent_MultisigCancelled {
    __kind: 'MultisigCancelled'
    cancelling: AccountId32
    timepoint: Timepoint
    multisig: AccountId32
    callHash: Bytes
}

/**
 * A multisig operation has been executed.
 */
export interface MultisigEvent_MultisigExecuted {
    __kind: 'MultisigExecuted'
    approving: AccountId32
    timepoint: Timepoint
    multisig: AccountId32
    callHash: Bytes
    result: Result<null, DispatchError>
}

/**
 * A new multisig operation has begun.
 */
export interface MultisigEvent_NewMultisig {
    __kind: 'NewMultisig'
    approving: AccountId32
    multisig: AccountId32
    callHash: Bytes
}

export interface Timepoint {
    height: number
    index: number
}

/**
 * The `Event` enum of this pallet
 */
export type MultiTransactionPaymentEvent = MultiTransactionPaymentEvent_CurrencyAdded | MultiTransactionPaymentEvent_CurrencyRemoved | MultiTransactionPaymentEvent_CurrencySet | MultiTransactionPaymentEvent_FeeWithdrawn

/**
 * New accepted currency added
 * [currency]
 */
export interface MultiTransactionPaymentEvent_CurrencyAdded {
    __kind: 'CurrencyAdded'
    assetId: number
}

/**
 * Accepted currency removed
 * [currency]
 */
export interface MultiTransactionPaymentEvent_CurrencyRemoved {
    __kind: 'CurrencyRemoved'
    assetId: number
}

/**
 * CurrencySet
 * [who, currency]
 */
export interface MultiTransactionPaymentEvent_CurrencySet {
    __kind: 'CurrencySet'
    accountId: AccountId32
    assetId: number
}

/**
 * Transaction fee paid in non-native currency
 * [Account, Currency, Native fee amount, Non-native fee amount, Destination account]
 */
export interface MultiTransactionPaymentEvent_FeeWithdrawn {
    __kind: 'FeeWithdrawn'
    accountId: AccountId32
    assetId: number
    nativeFeeAmount: bigint
    nonNativeFeeAmount: bigint
    destinationAccountId: AccountId32
}

/**
 * The `Event` enum of this pallet
 */
export type MessageQueueEvent = MessageQueueEvent_OverweightEnqueued | MessageQueueEvent_PageReaped | MessageQueueEvent_Processed | MessageQueueEvent_ProcessingFailed

/**
 * Message placed in overweight queue.
 */
export interface MessageQueueEvent_OverweightEnqueued {
    __kind: 'OverweightEnqueued'
    /**
     * The `blake2_256` hash of the message.
     */
    id: Bytes
    /**
     * The queue of the message.
     */
    origin: AggregateMessageOrigin
    /**
     * The page of the message.
     */
    pageIndex: number
    /**
     * The index of the message within the page.
     */
    messageIndex: number
}

/**
 * This page was reaped.
 */
export interface MessageQueueEvent_PageReaped {
    __kind: 'PageReaped'
    /**
     * The queue of the page.
     */
    origin: AggregateMessageOrigin
    /**
     * The index of the page.
     */
    index: number
}

/**
 * Message is processed.
 */
export interface MessageQueueEvent_Processed {
    __kind: 'Processed'
    /**
     * The `blake2_256` hash of the message.
     */
    id: H256
    /**
     * The queue of the message.
     */
    origin: AggregateMessageOrigin
    /**
     * How much weight was used to process the message.
     */
    weightUsed: Weight
    /**
     * Whether the message was processed.
     * 
     * Note that this does not mean that the underlying `MessageProcessor` was internally
     * successful. It *solely* means that the MQ pallet will treat this as a success
     * condition and discard the message. Any internal error needs to be emitted as events
     * by the `MessageProcessor`.
     */
    success: boolean
}

/**
 * Message discarded due to an error in the `MessageProcessor` (usually a format error).
 */
export interface MessageQueueEvent_ProcessingFailed {
    __kind: 'ProcessingFailed'
    /**
     * The `blake2_256` hash of the message.
     */
    id: H256
    /**
     * The queue of the message.
     */
    origin: AggregateMessageOrigin
    /**
     * The error that occurred.
     * 
     * This error is pretty opaque. More fine-grained errors need to be emitted as events
     * by the `MessageProcessor`.
     */
    error: ProcessMessageError
}

export type ProcessMessageError = ProcessMessageError_BadFormat | ProcessMessageError_Corrupt | ProcessMessageError_Overweight | ProcessMessageError_StackLimitReached | ProcessMessageError_Unsupported | ProcessMessageError_Yield

export interface ProcessMessageError_BadFormat {
    __kind: 'BadFormat'
}

export interface ProcessMessageError_Corrupt {
    __kind: 'Corrupt'
}

export interface ProcessMessageError_Overweight {
    __kind: 'Overweight'
    value: Weight
}

export interface ProcessMessageError_StackLimitReached {
    __kind: 'StackLimitReached'
}

export interface ProcessMessageError_Unsupported {
    __kind: 'Unsupported'
}

export interface ProcessMessageError_Yield {
    __kind: 'Yield'
}

export type AggregateMessageOrigin = AggregateMessageOrigin_Here | AggregateMessageOrigin_Parent | AggregateMessageOrigin_Sibling

export interface AggregateMessageOrigin_Here {
    __kind: 'Here'
}

export interface AggregateMessageOrigin_Parent {
    __kind: 'Parent'
}

export interface AggregateMessageOrigin_Sibling {
    __kind: 'Sibling'
    value: Id
}

export type Id = number

/**
 * The `Event` enum of this pallet
 */
export type LiquidationEvent = LiquidationEvent_Liquidated

/**
 * Money market position has been liquidated
 */
export interface LiquidationEvent_Liquidated {
    __kind: 'Liquidated'
    liquidator: AccountId32
    evmAddress: H160
    collateralAsset: number
    debtAsset: number
    debtToCover: bigint
    profit: bigint
}

export type H160 = Bytes

/**
 * The `Event` enum of this pallet
 */
export type LBPEvent = LBPEvent_BuyExecuted | LBPEvent_LiquidityAdded | LBPEvent_LiquidityRemoved | LBPEvent_PoolCreated | LBPEvent_PoolUpdated | LBPEvent_SellExecuted

/**
 * Purchase executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface LBPEvent_BuyExecuted {
    __kind: 'BuyExecuted'
    who: AccountId32
    assetOut: number
    assetIn: number
    amount: bigint
    buyPrice: bigint
    feeAsset: number
    feeAmount: bigint
}

/**
 * New liquidity was provided to the pool.
 */
export interface LBPEvent_LiquidityAdded {
    __kind: 'LiquidityAdded'
    who: AccountId32
    assetA: number
    assetB: number
    amountA: bigint
    amountB: bigint
}

/**
 * Liquidity was removed from the pool and the pool was destroyed.
 */
export interface LBPEvent_LiquidityRemoved {
    __kind: 'LiquidityRemoved'
    who: AccountId32
    assetA: number
    assetB: number
    amountA: bigint
    amountB: bigint
}

/**
 * Pool was created by the `CreatePool` origin.
 */
export interface LBPEvent_PoolCreated {
    __kind: 'PoolCreated'
    pool: AccountId32
    data: Pool
}

/**
 * Pool data were updated.
 */
export interface LBPEvent_PoolUpdated {
    __kind: 'PoolUpdated'
    pool: AccountId32
    data: Pool
}

/**
 * Sale executed.
 * Deprecated. Replaced by pallet_broadcast::Swapped
 */
export interface LBPEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amount: bigint
    salePrice: bigint
    feeAsset: number
    feeAmount: bigint
}

export interface Pool {
    owner: AccountId32
    start?: (number | undefined)
    end?: (number | undefined)
    assets: [number, number]
    initialWeight: number
    finalWeight: number
    weightCurve: WeightCurveType
    fee: [number, number]
    feeCollector: AccountId32
    repayTarget: bigint
}

export type WeightCurveType = WeightCurveType_Linear

export interface WeightCurveType_Linear {
    __kind: 'Linear'
}

/**
 * The `Event` enum of this pallet
 */
export type IdentityEvent = IdentityEvent_AuthorityAdded | IdentityEvent_AuthorityRemoved | IdentityEvent_DanglingUsernameRemoved | IdentityEvent_IdentityCleared | IdentityEvent_IdentityKilled | IdentityEvent_IdentitySet | IdentityEvent_JudgementGiven | IdentityEvent_JudgementRequested | IdentityEvent_JudgementUnrequested | IdentityEvent_PreapprovalExpired | IdentityEvent_PrimaryUsernameSet | IdentityEvent_RegistrarAdded | IdentityEvent_SubIdentityAdded | IdentityEvent_SubIdentityRemoved | IdentityEvent_SubIdentityRevoked | IdentityEvent_UsernameQueued | IdentityEvent_UsernameSet

/**
 * A username authority was added.
 */
export interface IdentityEvent_AuthorityAdded {
    __kind: 'AuthorityAdded'
    authority: AccountId32
}

/**
 * A username authority was removed.
 */
export interface IdentityEvent_AuthorityRemoved {
    __kind: 'AuthorityRemoved'
    authority: AccountId32
}

/**
 * A dangling username (as in, a username corresponding to an account that has removed its
 * identity) has been removed.
 */
export interface IdentityEvent_DanglingUsernameRemoved {
    __kind: 'DanglingUsernameRemoved'
    who: AccountId32
    username: BoundedVec
}

/**
 * A name was cleared, and the given balance returned.
 */
export interface IdentityEvent_IdentityCleared {
    __kind: 'IdentityCleared'
    who: AccountId32
    deposit: bigint
}

/**
 * A name was removed and the given balance slashed.
 */
export interface IdentityEvent_IdentityKilled {
    __kind: 'IdentityKilled'
    who: AccountId32
    deposit: bigint
}

/**
 * A name was set or reset (which will remove all judgements).
 */
export interface IdentityEvent_IdentitySet {
    __kind: 'IdentitySet'
    who: AccountId32
}

/**
 * A judgement was given by a registrar.
 */
export interface IdentityEvent_JudgementGiven {
    __kind: 'JudgementGiven'
    target: AccountId32
    registrarIndex: number
}

/**
 * A judgement was asked from a registrar.
 */
export interface IdentityEvent_JudgementRequested {
    __kind: 'JudgementRequested'
    who: AccountId32
    registrarIndex: number
}

/**
 * A judgement request was retracted.
 */
export interface IdentityEvent_JudgementUnrequested {
    __kind: 'JudgementUnrequested'
    who: AccountId32
    registrarIndex: number
}

/**
 * A queued username passed its expiration without being claimed and was removed.
 */
export interface IdentityEvent_PreapprovalExpired {
    __kind: 'PreapprovalExpired'
    whose: AccountId32
}

/**
 * A username was set as a primary and can be looked up from `who`.
 */
export interface IdentityEvent_PrimaryUsernameSet {
    __kind: 'PrimaryUsernameSet'
    who: AccountId32
    username: BoundedVec
}

/**
 * A registrar was added.
 */
export interface IdentityEvent_RegistrarAdded {
    __kind: 'RegistrarAdded'
    registrarIndex: number
}

/**
 * A sub-identity was added to an identity and the deposit paid.
 */
export interface IdentityEvent_SubIdentityAdded {
    __kind: 'SubIdentityAdded'
    sub: AccountId32
    main: AccountId32
    deposit: bigint
}

/**
 * A sub-identity was removed from an identity and the deposit freed.
 */
export interface IdentityEvent_SubIdentityRemoved {
    __kind: 'SubIdentityRemoved'
    sub: AccountId32
    main: AccountId32
    deposit: bigint
}

/**
 * A sub-identity was cleared, and the given deposit repatriated from the
 * main identity account to the sub-identity account.
 */
export interface IdentityEvent_SubIdentityRevoked {
    __kind: 'SubIdentityRevoked'
    sub: AccountId32
    main: AccountId32
    deposit: bigint
}

/**
 * A username was queued, but `who` must accept it prior to `expiration`.
 */
export interface IdentityEvent_UsernameQueued {
    __kind: 'UsernameQueued'
    who: AccountId32
    username: BoundedVec
    expiration: number
}

/**
 * A username was set for `who`.
 */
export interface IdentityEvent_UsernameSet {
    __kind: 'UsernameSet'
    who: AccountId32
    username: BoundedVec
}

export type BoundedVec = Bytes

/**
 * The `Event` enum of this pallet
 */
export type EthereumEvent = EthereumEvent_Executed

/**
 * An ethereum transaction was successfully executed.
 */
export interface EthereumEvent_Executed {
    __kind: 'Executed'
    from: H160
    to: H160
    transactionHash: H256
    exitReason: ExitReason
    extraData: Bytes
}

export type ExitReason = ExitReason_Error | ExitReason_Fatal | ExitReason_Revert | ExitReason_Succeed

export interface ExitReason_Error {
    __kind: 'Error'
    value: ExitError
}

export interface ExitReason_Fatal {
    __kind: 'Fatal'
    value: ExitFatal
}

export interface ExitReason_Revert {
    __kind: 'Revert'
    value: ExitRevert
}

export interface ExitReason_Succeed {
    __kind: 'Succeed'
    value: ExitSucceed
}

export type ExitSucceed = ExitSucceed_Returned | ExitSucceed_Stopped | ExitSucceed_Suicided

export interface ExitSucceed_Returned {
    __kind: 'Returned'
}

export interface ExitSucceed_Stopped {
    __kind: 'Stopped'
}

export interface ExitSucceed_Suicided {
    __kind: 'Suicided'
}

export type ExitRevert = ExitRevert_Reverted

export interface ExitRevert_Reverted {
    __kind: 'Reverted'
}

export type ExitFatal = ExitFatal_CallErrorAsFatal | ExitFatal_NotSupported | ExitFatal_Other | ExitFatal_UnhandledInterrupt

export interface ExitFatal_CallErrorAsFatal {
    __kind: 'CallErrorAsFatal'
    value: ExitError
}

export interface ExitFatal_NotSupported {
    __kind: 'NotSupported'
}

export interface ExitFatal_Other {
    __kind: 'Other'
    value: Cow
}

export interface ExitFatal_UnhandledInterrupt {
    __kind: 'UnhandledInterrupt'
}

export type Cow = string

export type ExitError = ExitError_CallTooDeep | ExitError_CreateCollision | ExitError_CreateContractLimit | ExitError_CreateEmpty | ExitError_DesignatedInvalid | ExitError_InvalidCode | ExitError_InvalidJump | ExitError_InvalidRange | ExitError_MaxNonce | ExitError_Other | ExitError_OutOfFund | ExitError_OutOfGas | ExitError_OutOfOffset | ExitError_PCUnderflow | ExitError_StackOverflow | ExitError_StackUnderflow

export interface ExitError_CallTooDeep {
    __kind: 'CallTooDeep'
}

export interface ExitError_CreateCollision {
    __kind: 'CreateCollision'
}

export interface ExitError_CreateContractLimit {
    __kind: 'CreateContractLimit'
}

export interface ExitError_CreateEmpty {
    __kind: 'CreateEmpty'
}

export interface ExitError_DesignatedInvalid {
    __kind: 'DesignatedInvalid'
}

export interface ExitError_InvalidCode {
    __kind: 'InvalidCode'
    value: Opcode
}

export interface ExitError_InvalidJump {
    __kind: 'InvalidJump'
}

export interface ExitError_InvalidRange {
    __kind: 'InvalidRange'
}

export interface ExitError_MaxNonce {
    __kind: 'MaxNonce'
}

export interface ExitError_Other {
    __kind: 'Other'
    value: Cow
}

export interface ExitError_OutOfFund {
    __kind: 'OutOfFund'
}

export interface ExitError_OutOfGas {
    __kind: 'OutOfGas'
}

export interface ExitError_OutOfOffset {
    __kind: 'OutOfOffset'
}

export interface ExitError_PCUnderflow {
    __kind: 'PCUnderflow'
}

export interface ExitError_StackOverflow {
    __kind: 'StackOverflow'
}

export interface ExitError_StackUnderflow {
    __kind: 'StackUnderflow'
}

export type Opcode = number

/**
 * The `Event` enum of this pallet
 */
export type EmaOracleEvent = EmaOracleEvent_AddedToWhitelist | EmaOracleEvent_RemovedFromWhitelist

/**
 * Oracle was added to the whitelist.
 */
export interface EmaOracleEvent_AddedToWhitelist {
    __kind: 'AddedToWhitelist'
    source: Bytes
    assets: [number, number]
}

/**
 * Oracle was removed from the whitelist.
 */
export interface EmaOracleEvent_RemovedFromWhitelist {
    __kind: 'RemovedFromWhitelist'
    source: Bytes
    assets: [number, number]
}

/**
 * The `Event` enum of this pallet
 */
export type ElectionsEvent = ElectionsEvent_CandidateSlashed | ElectionsEvent_ElectionError | ElectionsEvent_EmptyTerm | ElectionsEvent_MemberKicked | ElectionsEvent_NewTerm | ElectionsEvent_Renounced | ElectionsEvent_SeatHolderSlashed

/**
 * A candidate was slashed by amount due to failing to obtain a seat as member or
 * runner-up.
 * 
 * Note that old members and runners-up are also candidates.
 */
export interface ElectionsEvent_CandidateSlashed {
    __kind: 'CandidateSlashed'
    candidate: AccountId32
    amount: bigint
}

/**
 * Internal error happened while trying to perform election.
 */
export interface ElectionsEvent_ElectionError {
    __kind: 'ElectionError'
}

/**
 * No (or not enough) candidates existed for this round. This is different from
 * `NewTerm(\[\])`. See the description of `NewTerm`.
 */
export interface ElectionsEvent_EmptyTerm {
    __kind: 'EmptyTerm'
}

/**
 * A member has been removed. This should always be followed by either `NewTerm` or
 * `EmptyTerm`.
 */
export interface ElectionsEvent_MemberKicked {
    __kind: 'MemberKicked'
    member: AccountId32
}

/**
 * A new term with new_members. This indicates that enough candidates existed to run
 * the election, not that enough have has been elected. The inner value must be examined
 * for this purpose. A `NewTerm(\[\])` indicates that some candidates got their bond
 * slashed and none were elected, whilst `EmptyTerm` means that no candidates existed to
 * begin with.
 */
export interface ElectionsEvent_NewTerm {
    __kind: 'NewTerm'
    newMembers: [AccountId32, bigint][]
}

/**
 * Someone has renounced their candidacy.
 */
export interface ElectionsEvent_Renounced {
    __kind: 'Renounced'
    candidate: AccountId32
}

/**
 * A seat holder was slashed by amount by being forcefully removed from the set.
 */
export interface ElectionsEvent_SeatHolderSlashed {
    __kind: 'SeatHolderSlashed'
    seatHolder: AccountId32
    amount: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type EVMAccountsEvent = EVMAccountsEvent_Bound | EVMAccountsEvent_ContractApproved | EVMAccountsEvent_ContractDisapproved | EVMAccountsEvent_DeployerAdded | EVMAccountsEvent_DeployerRemoved

/**
 * Binding was created.
 */
export interface EVMAccountsEvent_Bound {
    __kind: 'Bound'
    account: AccountId32
    address: H160
}

/**
 * Contract was approved.
 */
export interface EVMAccountsEvent_ContractApproved {
    __kind: 'ContractApproved'
    address: H160
}

/**
 * Contract was disapproved.
 */
export interface EVMAccountsEvent_ContractDisapproved {
    __kind: 'ContractDisapproved'
    address: H160
}

/**
 * Deployer was added.
 */
export interface EVMAccountsEvent_DeployerAdded {
    __kind: 'DeployerAdded'
    who: H160
}

/**
 * Deployer was removed.
 */
export interface EVMAccountsEvent_DeployerRemoved {
    __kind: 'DeployerRemoved'
    who: H160
}

/**
 * The `Event` enum of this pallet
 */
export type EVMEvent = EVMEvent_Created | EVMEvent_CreatedFailed | EVMEvent_Executed | EVMEvent_ExecutedFailed | EVMEvent_Log

/**
 * A contract has been created at given address.
 */
export interface EVMEvent_Created {
    __kind: 'Created'
    address: H160
}

/**
 * A contract was attempted to be created, but the execution failed.
 */
export interface EVMEvent_CreatedFailed {
    __kind: 'CreatedFailed'
    address: H160
}

/**
 * A contract has been executed successfully with states applied.
 */
export interface EVMEvent_Executed {
    __kind: 'Executed'
    address: H160
}

/**
 * A contract has been executed with errors. States are reverted with only gas fees applied.
 */
export interface EVMEvent_ExecutedFailed {
    __kind: 'ExecutedFailed'
    address: H160
}

/**
 * Ethereum events from contracts.
 */
export interface EVMEvent_Log {
    __kind: 'Log'
    log: Log
}

export interface Log {
    address: H160
    topics: H256[]
    data: Bytes
}

/**
 * The `Event` enum of this pallet
 */
export type DynamicFeesEvent = never

/**
 * The `Event` enum of this pallet
 */
export type DusterEvent = DusterEvent_Added | DusterEvent_Dusted | DusterEvent_Removed

/**
 * Account added to non-dustable list.
 */
export interface DusterEvent_Added {
    __kind: 'Added'
    who: AccountId32
}

/**
 * Account dusted.
 */
export interface DusterEvent_Dusted {
    __kind: 'Dusted'
    who: AccountId32
    amount: bigint
}

/**
 * Account removed from non-dustable list.
 */
export interface DusterEvent_Removed {
    __kind: 'Removed'
    who: AccountId32
}

/**
 * The `Event` enum of this pallet
 */
export type DispatcherEvent = DispatcherEvent_AaveManagerCallDispatched | DispatcherEvent_TreasuryManagerCallDispatched

export interface DispatcherEvent_AaveManagerCallDispatched {
    __kind: 'AaveManagerCallDispatched'
    callHash: H256
    result: Result<PostDispatchInfo, DispatchErrorWithPostInfo>
}

export interface DispatcherEvent_TreasuryManagerCallDispatched {
    __kind: 'TreasuryManagerCallDispatched'
    callHash: H256
    result: Result<PostDispatchInfo, DispatchErrorWithPostInfo>
}

/**
 * The `Event` enum of this pallet
 */
export type DemocracyEvent = DemocracyEvent_Blacklisted | DemocracyEvent_Cancelled | DemocracyEvent_Delegated | DemocracyEvent_ExternalTabled | DemocracyEvent_MetadataCleared | DemocracyEvent_MetadataSet | DemocracyEvent_MetadataTransferred | DemocracyEvent_NotPassed | DemocracyEvent_Passed | DemocracyEvent_ProposalCanceled | DemocracyEvent_Proposed | DemocracyEvent_Seconded | DemocracyEvent_Started | DemocracyEvent_Tabled | DemocracyEvent_Undelegated | DemocracyEvent_Vetoed | DemocracyEvent_Voted

/**
 * A proposal_hash has been blacklisted permanently.
 */
export interface DemocracyEvent_Blacklisted {
    __kind: 'Blacklisted'
    proposalHash: H256
}

/**
 * A referendum has been cancelled.
 */
export interface DemocracyEvent_Cancelled {
    __kind: 'Cancelled'
    refIndex: number
}

/**
 * An account has delegated their vote to another account.
 */
export interface DemocracyEvent_Delegated {
    __kind: 'Delegated'
    who: AccountId32
    target: AccountId32
}

/**
 * An external proposal has been tabled.
 */
export interface DemocracyEvent_ExternalTabled {
    __kind: 'ExternalTabled'
}

/**
 * Metadata for a proposal or a referendum has been cleared.
 */
export interface DemocracyEvent_MetadataCleared {
    __kind: 'MetadataCleared'
    /**
     * Metadata owner.
     */
    owner: MetadataOwner
    /**
     * Preimage hash.
     */
    hash: H256
}

/**
 * Metadata for a proposal or a referendum has been set.
 */
export interface DemocracyEvent_MetadataSet {
    __kind: 'MetadataSet'
    /**
     * Metadata owner.
     */
    owner: MetadataOwner
    /**
     * Preimage hash.
     */
    hash: H256
}

/**
 * Metadata has been transferred to new owner.
 */
export interface DemocracyEvent_MetadataTransferred {
    __kind: 'MetadataTransferred'
    /**
     * Previous metadata owner.
     */
    prevOwner: MetadataOwner
    /**
     * New metadata owner.
     */
    owner: MetadataOwner
    /**
     * Preimage hash.
     */
    hash: H256
}

/**
 * A proposal has been rejected by referendum.
 */
export interface DemocracyEvent_NotPassed {
    __kind: 'NotPassed'
    refIndex: number
}

/**
 * A proposal has been approved by referendum.
 */
export interface DemocracyEvent_Passed {
    __kind: 'Passed'
    refIndex: number
}

/**
 * A proposal got canceled.
 */
export interface DemocracyEvent_ProposalCanceled {
    __kind: 'ProposalCanceled'
    propIndex: number
}

/**
 * A motion has been proposed by a public account.
 */
export interface DemocracyEvent_Proposed {
    __kind: 'Proposed'
    proposalIndex: number
    deposit: bigint
}

/**
 * An account has secconded a proposal
 */
export interface DemocracyEvent_Seconded {
    __kind: 'Seconded'
    seconder: AccountId32
    propIndex: number
}

/**
 * A referendum has begun.
 */
export interface DemocracyEvent_Started {
    __kind: 'Started'
    refIndex: number
    threshold: VoteThreshold
}

/**
 * A public proposal has been tabled for referendum vote.
 */
export interface DemocracyEvent_Tabled {
    __kind: 'Tabled'
    proposalIndex: number
    deposit: bigint
}

/**
 * An account has cancelled a previous delegation operation.
 */
export interface DemocracyEvent_Undelegated {
    __kind: 'Undelegated'
    account: AccountId32
}

/**
 * An external proposal has been vetoed.
 */
export interface DemocracyEvent_Vetoed {
    __kind: 'Vetoed'
    who: AccountId32
    proposalHash: H256
    until: number
}

/**
 * An account has voted in a referendum
 */
export interface DemocracyEvent_Voted {
    __kind: 'Voted'
    voter: AccountId32
    refIndex: number
    vote: AccountVote
}

export type AccountVote = AccountVote_Split | AccountVote_Standard

export interface AccountVote_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface AccountVote_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}

export type VoteThreshold = VoteThreshold_SimpleMajority | VoteThreshold_SuperMajorityAgainst | VoteThreshold_SuperMajorityApprove

export interface VoteThreshold_SimpleMajority {
    __kind: 'SimpleMajority'
}

export interface VoteThreshold_SuperMajorityAgainst {
    __kind: 'SuperMajorityAgainst'
}

export interface VoteThreshold_SuperMajorityApprove {
    __kind: 'SuperMajorityApprove'
}

export type MetadataOwner = MetadataOwner_External | MetadataOwner_Proposal | MetadataOwner_Referendum

export interface MetadataOwner_External {
    __kind: 'External'
}

export interface MetadataOwner_Proposal {
    __kind: 'Proposal'
    value: number
}

export interface MetadataOwner_Referendum {
    __kind: 'Referendum'
    value: number
}

/**
 * The `Event` enum of this pallet
 */
export type DCAEvent = DCAEvent_Completed | DCAEvent_ExecutionPlanned | DCAEvent_ExecutionStarted | DCAEvent_RandomnessGenerationFailed | DCAEvent_Scheduled | DCAEvent_Terminated | DCAEvent_TradeExecuted | DCAEvent_TradeFailed

/**
 * The DCA is completed and completely removed from the chain
 */
export interface DCAEvent_Completed {
    __kind: 'Completed'
    id: number
    who: AccountId32
}

/**
 * The DCA is planned for blocknumber
 */
export interface DCAEvent_ExecutionPlanned {
    __kind: 'ExecutionPlanned'
    id: number
    who: AccountId32
    block: number
}

/**
 * The DCA execution is started
 */
export interface DCAEvent_ExecutionStarted {
    __kind: 'ExecutionStarted'
    id: number
    block: number
}

/**
 * Randomness generation failed possibly coming from missing data about relay chain
 */
export interface DCAEvent_RandomnessGenerationFailed {
    __kind: 'RandomnessGenerationFailed'
    block: number
    error: DispatchError
}

/**
 * The DCA is scheduled for next execution
 */
export interface DCAEvent_Scheduled {
    __kind: 'Scheduled'
    id: number
    who: AccountId32
    period: number
    totalAmount: bigint
    order: Order
}

/**
 * The DCA is terminated and completely removed from the chain
 */
export interface DCAEvent_Terminated {
    __kind: 'Terminated'
    id: number
    who: AccountId32
    error: DispatchError
}

/**
 * Deprecated. Use pallet_amm::Event::Swapped instead.
 * The DCA trade is successfully executed
 */
export interface DCAEvent_TradeExecuted {
    __kind: 'TradeExecuted'
    id: number
    who: AccountId32
    amountIn: bigint
    amountOut: bigint
}

/**
 * The DCA trade execution is failed
 */
export interface DCAEvent_TradeFailed {
    __kind: 'TradeFailed'
    id: number
    who: AccountId32
    error: DispatchError
}

/**
 * The `Event` enum of this pallet
 */
export type CurrenciesEvent = CurrenciesEvent_BalanceUpdated | CurrenciesEvent_Deposited | CurrenciesEvent_Transferred | CurrenciesEvent_Withdrawn

/**
 * Update balance success.
 */
export interface CurrenciesEvent_BalanceUpdated {
    __kind: 'BalanceUpdated'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Deposit success.
 */
export interface CurrenciesEvent_Deposited {
    __kind: 'Deposited'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * Currency transfer success.
 */
export interface CurrenciesEvent_Transferred {
    __kind: 'Transferred'
    currencyId: number
    from: AccountId32
    to: AccountId32
    amount: bigint
}

/**
 * Withdraw success.
 */
export interface CurrenciesEvent_Withdrawn {
    __kind: 'Withdrawn'
    currencyId: number
    who: AccountId32
    amount: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type CumulusXcmEvent = CumulusXcmEvent_ExecutedDownward | CumulusXcmEvent_InvalidFormat | CumulusXcmEvent_UnsupportedVersion

/**
 * Downward message executed with the given outcome.
 * \[ id, outcome \]
 */
export interface CumulusXcmEvent_ExecutedDownward {
    __kind: 'ExecutedDownward'
    value: [Bytes, V4Outcome]
}

/**
 * Downward message is invalid XCM.
 * \[ id \]
 */
export interface CumulusXcmEvent_InvalidFormat {
    __kind: 'InvalidFormat'
    value: Bytes
}

/**
 * Downward message is unsupported version of XCM.
 * \[ id \]
 */
export interface CumulusXcmEvent_UnsupportedVersion {
    __kind: 'UnsupportedVersion'
    value: Bytes
}

/**
 * The `Event` enum of this pallet
 */
export type CouncilEvent = CouncilEvent_Approved | CouncilEvent_Closed | CouncilEvent_Disapproved | CouncilEvent_Executed | CouncilEvent_MemberExecuted | CouncilEvent_Proposed | CouncilEvent_Voted

/**
 * A motion was approved by the required threshold.
 */
export interface CouncilEvent_Approved {
    __kind: 'Approved'
    proposalHash: H256
}

/**
 * A proposal was closed because its threshold was reached or after its duration was up.
 */
export interface CouncilEvent_Closed {
    __kind: 'Closed'
    proposalHash: H256
    yes: number
    no: number
}

/**
 * A motion was not approved by the required threshold.
 */
export interface CouncilEvent_Disapproved {
    __kind: 'Disapproved'
    proposalHash: H256
}

/**
 * A motion was executed; result will be `Ok` if it returned without error.
 */
export interface CouncilEvent_Executed {
    __kind: 'Executed'
    proposalHash: H256
    result: Result<null, DispatchError>
}

/**
 * A single member did some action; result will be `Ok` if it returned without error.
 */
export interface CouncilEvent_MemberExecuted {
    __kind: 'MemberExecuted'
    proposalHash: H256
    result: Result<null, DispatchError>
}

/**
 * A motion (given hash) has been proposed (by given account) with a threshold (given
 * `MemberCount`).
 */
export interface CouncilEvent_Proposed {
    __kind: 'Proposed'
    account: AccountId32
    proposalIndex: number
    proposalHash: H256
    threshold: number
}

/**
 * A motion (given hash) has been voted on by given account, leaving
 * a tally (yes votes and no votes given respectively as `MemberCount`).
 */
export interface CouncilEvent_Voted {
    __kind: 'Voted'
    account: AccountId32
    proposalHash: H256
    voted: boolean
    yes: number
    no: number
}

/**
 * The `Event` enum of this pallet
 */
export type ConvictionVotingEvent = ConvictionVotingEvent_Delegated | ConvictionVotingEvent_Undelegated | ConvictionVotingEvent_VoteRemoved | ConvictionVotingEvent_Voted

/**
 * An account has delegated their vote to another account. \[who, target\]
 */
export interface ConvictionVotingEvent_Delegated {
    __kind: 'Delegated'
    value: [AccountId32, AccountId32]
}

/**
 * An \[account\] has cancelled a previous delegation operation.
 */
export interface ConvictionVotingEvent_Undelegated {
    __kind: 'Undelegated'
    value: AccountId32
}

/**
 * A vote that been removed
 */
export interface ConvictionVotingEvent_VoteRemoved {
    __kind: 'VoteRemoved'
    who: AccountId32
    vote: Type_69
}

/**
 * An account that has voted
 */
export interface ConvictionVotingEvent_Voted {
    __kind: 'Voted'
    who: AccountId32
    vote: Type_69
}

export type Type_69 = Type_69_Split | Type_69_SplitAbstain | Type_69_Standard

export interface Type_69_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_69_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_69_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type CollatorSelectionEvent = CollatorSelectionEvent_CandidateAdded | CollatorSelectionEvent_CandidateBondUpdated | CollatorSelectionEvent_CandidateRemoved | CollatorSelectionEvent_CandidateReplaced | CollatorSelectionEvent_InvalidInvulnerableSkipped | CollatorSelectionEvent_InvulnerableAdded | CollatorSelectionEvent_InvulnerableRemoved | CollatorSelectionEvent_NewCandidacyBond | CollatorSelectionEvent_NewDesiredCandidates | CollatorSelectionEvent_NewInvulnerables

/**
 * A new candidate joined.
 */
export interface CollatorSelectionEvent_CandidateAdded {
    __kind: 'CandidateAdded'
    accountId: AccountId32
    deposit: bigint
}

/**
 * Bond of a candidate updated.
 */
export interface CollatorSelectionEvent_CandidateBondUpdated {
    __kind: 'CandidateBondUpdated'
    accountId: AccountId32
    deposit: bigint
}

/**
 * A candidate was removed.
 */
export interface CollatorSelectionEvent_CandidateRemoved {
    __kind: 'CandidateRemoved'
    accountId: AccountId32
}

/**
 * An account was replaced in the candidate list by another one.
 */
export interface CollatorSelectionEvent_CandidateReplaced {
    __kind: 'CandidateReplaced'
    old: AccountId32
    new: AccountId32
    deposit: bigint
}

/**
 * An account was unable to be added to the Invulnerables because they did not have keys
 * registered. Other Invulnerables may have been set.
 */
export interface CollatorSelectionEvent_InvalidInvulnerableSkipped {
    __kind: 'InvalidInvulnerableSkipped'
    accountId: AccountId32
}

/**
 * A new Invulnerable was added.
 */
export interface CollatorSelectionEvent_InvulnerableAdded {
    __kind: 'InvulnerableAdded'
    accountId: AccountId32
}

/**
 * An Invulnerable was removed.
 */
export interface CollatorSelectionEvent_InvulnerableRemoved {
    __kind: 'InvulnerableRemoved'
    accountId: AccountId32
}

/**
 * The candidacy bond was set.
 */
export interface CollatorSelectionEvent_NewCandidacyBond {
    __kind: 'NewCandidacyBond'
    bondAmount: bigint
}

/**
 * The number of desired candidates was set.
 */
export interface CollatorSelectionEvent_NewDesiredCandidates {
    __kind: 'NewDesiredCandidates'
    desiredCandidates: number
}

/**
 * New Invulnerables were set.
 */
export interface CollatorSelectionEvent_NewInvulnerables {
    __kind: 'NewInvulnerables'
    invulnerables: AccountId32[]
}

/**
 * The `Event` enum of this pallet
 */
export type CollatorRewardsEvent = CollatorRewardsEvent_CollatorRewarded

/**
 * Collator was rewarded.
 */
export interface CollatorRewardsEvent_CollatorRewarded {
    __kind: 'CollatorRewarded'
    who: AccountId32
    amount: bigint
    currency: number
}

/**
 * The `Event` enum of this pallet
 */
export type ClaimsEvent = ClaimsEvent_Claim

export interface ClaimsEvent_Claim {
    __kind: 'Claim'
    value: [AccountId32, EthereumAddress, bigint]
}

export type EthereumAddress = Bytes

/**
 * The `Event` enum of this pallet
 */
export type CircuitBreakerEvent = CircuitBreakerEvent_AddLiquidityLimitChanged | CircuitBreakerEvent_RemoveLiquidityLimitChanged | CircuitBreakerEvent_TradeVolumeLimitChanged

/**
 * Add liquidity limit of an asset was changed.
 */
export interface CircuitBreakerEvent_AddLiquidityLimitChanged {
    __kind: 'AddLiquidityLimitChanged'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * Remove liquidity limit of an asset was changed.
 */
export interface CircuitBreakerEvent_RemoveLiquidityLimitChanged {
    __kind: 'RemoveLiquidityLimitChanged'
    assetId: number
    liquidityLimit?: ([number, number] | undefined)
}

/**
 * Trade volume limit of an asset was changed.
 */
export interface CircuitBreakerEvent_TradeVolumeLimitChanged {
    __kind: 'TradeVolumeLimitChanged'
    assetId: number
    tradeVolumeLimit: [number, number]
}

/**
 * The `Event` enum of this pallet
 */
export type BroadcastEvent = BroadcastEvent_Swapped

/**
 * Trade executed.
 */
export interface BroadcastEvent_Swapped {
    __kind: 'Swapped'
    swapper: AccountId32
    filler: AccountId32
    fillerType: Filler
    operation: TradeOperation
    inputs: Asset[]
    outputs: Asset[]
    fees: Fee[]
    operationStack: ExecutionType[]
}

export type ExecutionType = ExecutionType_Batch | ExecutionType_DCA | ExecutionType_Omnipool | ExecutionType_Router | ExecutionType_Xcm | ExecutionType_XcmExchange

export interface ExecutionType_Batch {
    __kind: 'Batch'
    value: number
}

export interface ExecutionType_DCA {
    __kind: 'DCA'
    value: [number, number]
}

export interface ExecutionType_Omnipool {
    __kind: 'Omnipool'
    value: number
}

export interface ExecutionType_Router {
    __kind: 'Router'
    value: number
}

export interface ExecutionType_Xcm {
    __kind: 'Xcm'
    value: [Bytes, number]
}

export interface ExecutionType_XcmExchange {
    __kind: 'XcmExchange'
    value: number
}

export interface Fee {
    asset: number
    amount: bigint
    destination: Destination
}

export type Destination = Destination_Account | Destination_Burned

export interface Destination_Account {
    __kind: 'Account'
    value: AccountId32
}

export interface Destination_Burned {
    __kind: 'Burned'
}

export interface Asset {
    asset: number
    amount: bigint
}

export type TradeOperation = TradeOperation_ExactIn | TradeOperation_ExactOut | TradeOperation_Limit | TradeOperation_LiquidityAdd | TradeOperation_LiquidityRemove

export interface TradeOperation_ExactIn {
    __kind: 'ExactIn'
}

export interface TradeOperation_ExactOut {
    __kind: 'ExactOut'
}

export interface TradeOperation_Limit {
    __kind: 'Limit'
}

export interface TradeOperation_LiquidityAdd {
    __kind: 'LiquidityAdd'
}

export interface TradeOperation_LiquidityRemove {
    __kind: 'LiquidityRemove'
}

export type Filler = Filler_LBP | Filler_OTC | Filler_Omnipool | Filler_Stableswap | Filler_XYK

export interface Filler_LBP {
    __kind: 'LBP'
}

export interface Filler_OTC {
    __kind: 'OTC'
    value: number
}

export interface Filler_Omnipool {
    __kind: 'Omnipool'
}

export interface Filler_Stableswap {
    __kind: 'Stableswap'
    value: number
}

export interface Filler_XYK {
    __kind: 'XYK'
    value: number
}

/**
 * The `Event` enum of this pallet
 */
export type BondsEvent = BondsEvent_Issued | BondsEvent_Redeemed | BondsEvent_TokenCreated

/**
 * New bond were issued
 */
export interface BondsEvent_Issued {
    __kind: 'Issued'
    issuer: AccountId32
    bondId: number
    amount: bigint
    fee: bigint
}

/**
 * Bonds were redeemed
 */
export interface BondsEvent_Redeemed {
    __kind: 'Redeemed'
    who: AccountId32
    bondId: number
    amount: bigint
}

/**
 * A bond asset was registered
 */
export interface BondsEvent_TokenCreated {
    __kind: 'TokenCreated'
    issuer: AccountId32
    assetId: number
    bondId: number
    maturity: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type BalancesEvent = BalancesEvent_BalanceSet | BalancesEvent_Burned | BalancesEvent_Deposit | BalancesEvent_DustLost | BalancesEvent_Endowed | BalancesEvent_Frozen | BalancesEvent_Issued | BalancesEvent_Locked | BalancesEvent_Minted | BalancesEvent_Rescinded | BalancesEvent_ReserveRepatriated | BalancesEvent_Reserved | BalancesEvent_Restored | BalancesEvent_Slashed | BalancesEvent_Suspended | BalancesEvent_Thawed | BalancesEvent_TotalIssuanceForced | BalancesEvent_Transfer | BalancesEvent_Unlocked | BalancesEvent_Unreserved | BalancesEvent_Upgraded | BalancesEvent_Withdraw

/**
 * A balance was set by root.
 */
export interface BalancesEvent_BalanceSet {
    __kind: 'BalanceSet'
    who: AccountId32
    free: bigint
}

/**
 * Some amount was burned from an account.
 */
export interface BalancesEvent_Burned {
    __kind: 'Burned'
    who: AccountId32
    amount: bigint
}

/**
 * Some amount was deposited (e.g. for transaction fees).
 */
export interface BalancesEvent_Deposit {
    __kind: 'Deposit'
    who: AccountId32
    amount: bigint
}

/**
 * An account was removed whose balance was non-zero but below ExistentialDeposit,
 * resulting in an outright loss.
 */
export interface BalancesEvent_DustLost {
    __kind: 'DustLost'
    account: AccountId32
    amount: bigint
}

/**
 * An account was created with some free balance.
 */
export interface BalancesEvent_Endowed {
    __kind: 'Endowed'
    account: AccountId32
    freeBalance: bigint
}

/**
 * Some balance was frozen.
 */
export interface BalancesEvent_Frozen {
    __kind: 'Frozen'
    who: AccountId32
    amount: bigint
}

/**
 * Total issuance was increased by `amount`, creating a credit to be balanced.
 */
export interface BalancesEvent_Issued {
    __kind: 'Issued'
    amount: bigint
}

/**
 * Some balance was locked.
 */
export interface BalancesEvent_Locked {
    __kind: 'Locked'
    who: AccountId32
    amount: bigint
}

/**
 * Some amount was minted into an account.
 */
export interface BalancesEvent_Minted {
    __kind: 'Minted'
    who: AccountId32
    amount: bigint
}

/**
 * Total issuance was decreased by `amount`, creating a debt to be balanced.
 */
export interface BalancesEvent_Rescinded {
    __kind: 'Rescinded'
    amount: bigint
}

/**
 * Some balance was moved from the reserve of the first account to the second account.
 * Final argument indicates the destination balance type.
 */
export interface BalancesEvent_ReserveRepatriated {
    __kind: 'ReserveRepatriated'
    from: AccountId32
    to: AccountId32
    amount: bigint
    destinationStatus: BalanceStatus
}

/**
 * Some balance was reserved (moved from free to reserved).
 */
export interface BalancesEvent_Reserved {
    __kind: 'Reserved'
    who: AccountId32
    amount: bigint
}

/**
 * Some amount was restored into an account.
 */
export interface BalancesEvent_Restored {
    __kind: 'Restored'
    who: AccountId32
    amount: bigint
}

/**
 * Some amount was removed from the account (e.g. for misbehavior).
 */
export interface BalancesEvent_Slashed {
    __kind: 'Slashed'
    who: AccountId32
    amount: bigint
}

/**
 * Some amount was suspended from an account (it can be restored later).
 */
export interface BalancesEvent_Suspended {
    __kind: 'Suspended'
    who: AccountId32
    amount: bigint
}

/**
 * Some balance was thawed.
 */
export interface BalancesEvent_Thawed {
    __kind: 'Thawed'
    who: AccountId32
    amount: bigint
}

/**
 * The `TotalIssuance` was forcefully changed.
 */
export interface BalancesEvent_TotalIssuanceForced {
    __kind: 'TotalIssuanceForced'
    old: bigint
    new: bigint
}

/**
 * Transfer succeeded.
 */
export interface BalancesEvent_Transfer {
    __kind: 'Transfer'
    from: AccountId32
    to: AccountId32
    amount: bigint
}

/**
 * Some balance was unlocked.
 */
export interface BalancesEvent_Unlocked {
    __kind: 'Unlocked'
    who: AccountId32
    amount: bigint
}

/**
 * Some balance was unreserved (moved from reserved to free).
 */
export interface BalancesEvent_Unreserved {
    __kind: 'Unreserved'
    who: AccountId32
    amount: bigint
}

/**
 * An account was upgraded.
 */
export interface BalancesEvent_Upgraded {
    __kind: 'Upgraded'
    who: AccountId32
}

/**
 * Some amount was withdrawn from the account (e.g. for transaction fees).
 */
export interface BalancesEvent_Withdraw {
    __kind: 'Withdraw'
    who: AccountId32
    amount: bigint
}

/**
 * The `Event` enum of this pallet
 */
export type AssetRegistryEvent = AssetRegistryEvent_AssetBanned | AssetRegistryEvent_AssetUnbanned | AssetRegistryEvent_ExistentialDepositPaid | AssetRegistryEvent_LocationSet | AssetRegistryEvent_Registered | AssetRegistryEvent_Updated

/**
 * Asset was banned.
 */
export interface AssetRegistryEvent_AssetBanned {
    __kind: 'AssetBanned'
    assetId: number
}

/**
 * Asset's ban was removed.
 */
export interface AssetRegistryEvent_AssetUnbanned {
    __kind: 'AssetUnbanned'
    assetId: number
}

/**
 * Existential deposit for insufficinet asset was paid.
 * `SufficiencyCheck` triggers this event.
 */
export interface AssetRegistryEvent_ExistentialDepositPaid {
    __kind: 'ExistentialDepositPaid'
    who: AccountId32
    feeAsset: number
    amount: bigint
}

/**
 * Native location set for an asset.
 */
export interface AssetRegistryEvent_LocationSet {
    __kind: 'LocationSet'
    assetId: number
    location: AssetLocation
}

/**
 * Asset was registered.
 */
export interface AssetRegistryEvent_Registered {
    __kind: 'Registered'
    assetId: number
    assetName?: (Bytes | undefined)
    assetType: AssetType
    existentialDeposit: bigint
    xcmRateLimit?: (bigint | undefined)
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    isSufficient: boolean
}

/**
 * Asset was updated.
 */
export interface AssetRegistryEvent_Updated {
    __kind: 'Updated'
    assetId: number
    assetName?: (Bytes | undefined)
    assetType: AssetType
    existentialDeposit: bigint
    xcmRateLimit?: (bigint | undefined)
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    isSufficient: boolean
}

export type AssetType = AssetType_Bond | AssetType_Erc20 | AssetType_External | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
}

export interface AssetType_Erc20 {
    __kind: 'Erc20'
}

export interface AssetType_External {
    __kind: 'External'
}

export interface AssetType_StableSwap {
    __kind: 'StableSwap'
}

export interface AssetType_Token {
    __kind: 'Token'
}

export interface AssetType_XYK {
    __kind: 'XYK'
}

export interface AssetLocation {
    parents: number
    interior: V3Junctions
}

export type Phase = Phase_ApplyExtrinsic | Phase_Finalization | Phase_Initialization

export interface Phase_ApplyExtrinsic {
    __kind: 'ApplyExtrinsic'
    value: number
}

export interface Phase_Finalization {
    __kind: 'Finalization'
}

export interface Phase_Initialization {
    __kind: 'Initialization'
}

export const EventRecord: sts.Type<EventRecord> = sts.struct(() => {
    return  {
        phase: Phase,
        event: Event,
        topics: sts.array(() => H256),
    }
})

export const H256 = sts.bytes()

export const Event: sts.Type<Event> = sts.closedEnum(() => {
    return  {
        AssetRegistry: AssetRegistryEvent,
        Balances: BalancesEvent,
        Bonds: BondsEvent,
        Broadcast: BroadcastEvent,
        CircuitBreaker: CircuitBreakerEvent,
        Claims: ClaimsEvent,
        CollatorRewards: CollatorRewardsEvent,
        CollatorSelection: CollatorSelectionEvent,
        ConvictionVoting: ConvictionVotingEvent,
        Council: CouncilEvent,
        CumulusXcm: CumulusXcmEvent,
        Currencies: CurrenciesEvent,
        DCA: DCAEvent,
        Democracy: DemocracyEvent,
        Dispatcher: DispatcherEvent,
        Duster: DusterEvent,
        DynamicFees: DynamicFeesEvent,
        EVM: EVMEvent,
        EVMAccounts: EVMAccountsEvent,
        Elections: ElectionsEvent,
        EmaOracle: EmaOracleEvent,
        Ethereum: EthereumEvent,
        Identity: IdentityEvent,
        LBP: LBPEvent,
        Liquidation: LiquidationEvent,
        MessageQueue: MessageQueueEvent,
        MultiTransactionPayment: MultiTransactionPaymentEvent,
        Multisig: MultisigEvent,
        OTC: OTCEvent,
        Omnipool: OmnipoolEvent,
        OmnipoolLiquidityMining: OmnipoolLiquidityMiningEvent,
        OmnipoolWarehouseLM: OmnipoolWarehouseLMEvent,
        OrmlXcm: OrmlXcmEvent,
        OtcSettlements: OtcSettlementsEvent,
        ParachainSystem: ParachainSystemEvent,
        PolkadotXcm: PolkadotXcmEvent,
        Preimage: PreimageEvent,
        Proxy: ProxyEvent,
        Referenda: ReferendaEvent,
        Referrals: ReferralsEvent,
        RelayChainInfo: RelayChainInfoEvent,
        Router: RouterEvent,
        Scheduler: SchedulerEvent,
        Session: SessionEvent,
        Stableswap: StableswapEvent,
        Staking: StakingEvent,
        StateTrieMigration: StateTrieMigrationEvent,
        System: SystemEvent,
        TechnicalCommittee: TechnicalCommitteeEvent,
        Tips: TipsEvent,
        Tokens: TokensEvent,
        TransactionPause: TransactionPauseEvent,
        TransactionPayment: TransactionPaymentEvent,
        Treasury: TreasuryEvent,
        Uniques: UniquesEvent,
        UnknownTokens: UnknownTokensEvent,
        Utility: UtilityEvent,
        Vesting: VestingEvent,
        Whitelist: WhitelistEvent,
        XTokens: XTokensEvent,
        XYK: XYKEvent,
        XYKLiquidityMining: XYKLiquidityMiningEvent,
        XYKWarehouseLM: XYKWarehouseLMEvent,
        XcmpQueue: XcmpQueueEvent,
    }
})

/**
 * The `Event` enum of this pallet
 */
export const XcmpQueueEvent: sts.Type<XcmpQueueEvent> = sts.closedEnum(() => {
    return  {
        XcmpMessageSent: sts.enumStruct({
            messageHash: sts.bytes(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const XYKWarehouseLMEvent: sts.Type<XYKWarehouseLMEvent> = sts.closedEnum(() => {
    return  {
        AllRewardsDistributed: sts.enumStruct({
            globalFarmId: sts.number(),
        }),
        GlobalFarmAccRPZUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            accumulatedRpz: FixedU128,
            totalSharesZ: sts.bigint(),
        }),
        YieldFarmAccRPVSUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: FixedU128,
            totalValuedShares: sts.bigint(),
        }),
    }
})

export const FixedU128 = sts.bigint()

/**
 * The `Event` enum of this pallet
 */
export const XYKLiquidityMiningEvent: sts.Type<XYKLiquidityMiningEvent> = sts.closedEnum(() => {
    return  {
        DepositDestroyed: sts.enumStruct({
            who: AccountId32,
            depositId: sts.bigint(),
        }),
        GlobalFarmCreated: sts.enumStruct({
            id: sts.number(),
            owner: AccountId32,
            totalRewards: sts.bigint(),
            rewardCurrency: sts.number(),
            yieldPerPeriod: Perquintill,
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            incentivizedAsset: sts.number(),
            maxRewardPerPeriod: sts.bigint(),
            minDeposit: sts.bigint(),
            priceAdjustment: FixedU128,
        }),
        GlobalFarmTerminated: sts.enumStruct({
            globalFarmId: sts.number(),
            who: AccountId32,
            rewardCurrency: sts.number(),
            undistributedRewards: sts.bigint(),
        }),
        GlobalFarmUpdated: sts.enumStruct({
            id: sts.number(),
            priceAdjustment: FixedU128,
        }),
        RewardClaimed: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            claimed: sts.bigint(),
            rewardCurrency: sts.number(),
            depositId: sts.bigint(),
        }),
        SharesDeposited: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
            lpToken: sts.number(),
            depositId: sts.bigint(),
        }),
        SharesRedeposited: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
            lpToken: sts.number(),
            depositId: sts.bigint(),
        }),
        SharesWithdrawn: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            lpToken: sts.number(),
            amount: sts.bigint(),
            depositId: sts.bigint(),
        }),
        YieldFarmCreated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            multiplier: FixedU128,
            assetPair: Type_274,
            loyaltyCurve: sts.option(() => LoyaltyCurve),
        }),
        YieldFarmResumed: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            assetPair: Type_274,
            multiplier: FixedU128,
        }),
        YieldFarmStopped: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            assetPair: Type_274,
        }),
        YieldFarmTerminated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            assetPair: Type_274,
        }),
        YieldFarmUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            assetPair: Type_274,
            multiplier: FixedU128,
        }),
    }
})

export const LoyaltyCurve: sts.Type<LoyaltyCurve> = sts.struct(() => {
    return  {
        initialRewardPercentage: FixedU128,
        scaleCoef: sts.number(),
    }
})

export const Type_274: sts.Type<Type_274> = sts.struct(() => {
    return  {
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export const Perquintill = sts.bigint()

/**
 * The `Event` enum of this pallet
 */
export const XYKEvent: sts.Type<XYKEvent> = sts.closedEnum(() => {
    return  {
        BuyExecuted: sts.enumStruct({
            who: AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
            pool: AccountId32,
        }),
        LiquidityAdded: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            amountA: sts.bigint(),
            amountB: sts.bigint(),
        }),
        LiquidityRemoved: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            shares: sts.bigint(),
        }),
        PoolCreated: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            initialSharesAmount: sts.bigint(),
            shareToken: sts.number(),
            pool: AccountId32,
        }),
        PoolDestroyed: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            shareToken: sts.number(),
            pool: AccountId32,
        }),
        SellExecuted: sts.enumStruct({
            who: AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            salePrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
            pool: AccountId32,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const XTokensEvent: sts.Type<XTokensEvent> = sts.closedEnum(() => {
    return  {
        TransferredAssets: sts.enumStruct({
            sender: AccountId32,
            assets: sts.array(() => V4Asset),
            fee: V4Asset,
            dest: V4Location,
        }),
    }
})

export const V4Location: sts.Type<V4Location> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

export const V4Junctions: sts.Type<V4Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: sts.array(() => V4Junction),
        X2: sts.array(() => V4Junction),
        X3: sts.array(() => V4Junction),
        X4: sts.array(() => V4Junction),
        X5: sts.array(() => V4Junction),
        X6: sts.array(() => V4Junction),
        X7: sts.array(() => V4Junction),
        X8: sts.array(() => V4Junction),
    }
})

export const V4Junction: sts.Type<V4Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V4NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V4NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export const V3BodyPart: sts.Type<V3BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.enumStruct({
            count: sts.number(),
        }),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export const V3BodyId: sts.Type<V3BodyId> = sts.closedEnum(() => {
    return  {
        Administration: sts.unit(),
        Defense: sts.unit(),
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Moniker: sts.bytes(),
        Technical: sts.unit(),
        Treasury: sts.unit(),
        Unit: sts.unit(),
    }
})

export const V4NetworkId: sts.Type<V4NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export const V4Asset: sts.Type<V4Asset> = sts.struct(() => {
    return  {
        id: V4AssetId,
        fun: V4Fungibility,
    }
})

export const V4Fungibility: sts.Type<V4Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V4AssetInstance,
    }
})

export const V4AssetInstance: sts.Type<V4AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V4AssetId: sts.Type<V4AssetId> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V4Junctions,
    }
})

/**
 * The `Event` enum of this pallet
 */
export const WhitelistEvent: sts.Type<WhitelistEvent> = sts.closedEnum(() => {
    return  {
        CallWhitelisted: sts.enumStruct({
            callHash: H256,
        }),
        WhitelistedCallDispatched: sts.enumStruct({
            callHash: H256,
            result: sts.result(() => PostDispatchInfo, () => DispatchErrorWithPostInfo),
        }),
        WhitelistedCallRemoved: sts.enumStruct({
            callHash: H256,
        }),
    }
})

export const DispatchErrorWithPostInfo: sts.Type<DispatchErrorWithPostInfo> = sts.struct(() => {
    return  {
        postInfo: PostDispatchInfo,
        error: DispatchError,
    }
})

export const DispatchError: sts.Type<DispatchError> = sts.closedEnum(() => {
    return  {
        Arithmetic: ArithmeticError,
        BadOrigin: sts.unit(),
        CannotLookup: sts.unit(),
        ConsumerRemaining: sts.unit(),
        Corruption: sts.unit(),
        Exhausted: sts.unit(),
        Module: ModuleError,
        NoProviders: sts.unit(),
        Other: sts.unit(),
        RootNotAllowed: sts.unit(),
        Token: TokenError,
        TooManyConsumers: sts.unit(),
        Transactional: TransactionalError,
        Unavailable: sts.unit(),
    }
})

export const TransactionalError: sts.Type<TransactionalError> = sts.closedEnum(() => {
    return  {
        LimitReached: sts.unit(),
        NoLayer: sts.unit(),
    }
})

export const TokenError: sts.Type<TokenError> = sts.closedEnum(() => {
    return  {
        BelowMinimum: sts.unit(),
        Blocked: sts.unit(),
        CannotCreate: sts.unit(),
        CannotCreateHold: sts.unit(),
        Frozen: sts.unit(),
        FundsUnavailable: sts.unit(),
        NotExpendable: sts.unit(),
        OnlyProvider: sts.unit(),
        UnknownAsset: sts.unit(),
        Unsupported: sts.unit(),
    }
})

export const ModuleError: sts.Type<ModuleError> = sts.struct(() => {
    return  {
        index: sts.number(),
        error: sts.bytes(),
    }
})

export const ArithmeticError: sts.Type<ArithmeticError> = sts.closedEnum(() => {
    return  {
        DivisionByZero: sts.unit(),
        Overflow: sts.unit(),
        Underflow: sts.unit(),
    }
})

export const PostDispatchInfo: sts.Type<PostDispatchInfo> = sts.struct(() => {
    return  {
        actualWeight: sts.option(() => Weight),
        paysFee: Pays,
    }
})

export const Pays: sts.Type<Pays> = sts.closedEnum(() => {
    return  {
        No: sts.unit(),
        Yes: sts.unit(),
    }
})

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const VestingEvent: sts.Type<VestingEvent> = sts.closedEnum(() => {
    return  {
        Claimed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        VestingScheduleAdded: sts.enumStruct({
            from: AccountId32,
            to: AccountId32,
            vestingSchedule: VestingSchedule,
        }),
        VestingSchedulesUpdated: sts.enumStruct({
            who: AccountId32,
        }),
    }
})

export const VestingSchedule: sts.Type<VestingSchedule> = sts.struct(() => {
    return  {
        start: sts.number(),
        period: sts.number(),
        periodCount: sts.number(),
        perPeriod: sts.bigint(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const UtilityEvent: sts.Type<UtilityEvent> = sts.closedEnum(() => {
    return  {
        BatchCompleted: sts.unit(),
        BatchCompletedWithErrors: sts.unit(),
        BatchInterrupted: sts.enumStruct({
            index: sts.number(),
            error: DispatchError,
        }),
        DispatchedAs: sts.enumStruct({
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        ItemCompleted: sts.unit(),
        ItemFailed: sts.enumStruct({
            error: DispatchError,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const UnknownTokensEvent: sts.Type<UnknownTokensEvent> = sts.closedEnum(() => {
    return  {
        Deposited: sts.enumStruct({
            asset: V4Asset,
            who: V4Location,
        }),
        Withdrawn: sts.enumStruct({
            asset: V4Asset,
            who: V4Location,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const UniquesEvent: sts.Type<UniquesEvent> = sts.closedEnum(() => {
    return  {
        ApprovalCancelled: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: AccountId32,
            delegate: AccountId32,
        }),
        ApprovedTransfer: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: AccountId32,
            delegate: AccountId32,
        }),
        AttributeCleared: sts.enumStruct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
        }),
        AttributeSet: sts.enumStruct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
            value: sts.bytes(),
        }),
        Burned: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: AccountId32,
        }),
        CollectionFrozen: sts.enumStruct({
            collection: sts.bigint(),
        }),
        CollectionMaxSupplySet: sts.enumStruct({
            collection: sts.bigint(),
            maxSupply: sts.number(),
        }),
        CollectionMetadataCleared: sts.enumStruct({
            collection: sts.bigint(),
        }),
        CollectionMetadataSet: sts.enumStruct({
            collection: sts.bigint(),
            data: sts.bytes(),
            isFrozen: sts.boolean(),
        }),
        CollectionThawed: sts.enumStruct({
            collection: sts.bigint(),
        }),
        Created: sts.enumStruct({
            collection: sts.bigint(),
            creator: AccountId32,
            owner: AccountId32,
        }),
        Destroyed: sts.enumStruct({
            collection: sts.bigint(),
        }),
        ForceCreated: sts.enumStruct({
            collection: sts.bigint(),
            owner: AccountId32,
        }),
        Frozen: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        Issued: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: AccountId32,
        }),
        ItemBought: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            price: sts.bigint(),
            seller: AccountId32,
            buyer: AccountId32,
        }),
        ItemPriceRemoved: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        ItemPriceSet: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            price: sts.bigint(),
            whitelistedBuyer: sts.option(() => AccountId32),
        }),
        ItemStatusChanged: sts.enumStruct({
            collection: sts.bigint(),
        }),
        MetadataCleared: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        MetadataSet: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            data: sts.bytes(),
            isFrozen: sts.boolean(),
        }),
        OwnerChanged: sts.enumStruct({
            collection: sts.bigint(),
            newOwner: AccountId32,
        }),
        OwnershipAcceptanceChanged: sts.enumStruct({
            who: AccountId32,
            maybeCollection: sts.option(() => sts.bigint()),
        }),
        Redeposited: sts.enumStruct({
            collection: sts.bigint(),
            successfulItems: sts.array(() => sts.bigint()),
        }),
        TeamChanged: sts.enumStruct({
            collection: sts.bigint(),
            issuer: AccountId32,
            admin: AccountId32,
            freezer: AccountId32,
        }),
        Thawed: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
        }),
        Transferred: sts.enumStruct({
            collection: sts.bigint(),
            item: sts.bigint(),
            from: AccountId32,
            to: AccountId32,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TreasuryEvent: sts.Type<TreasuryEvent> = sts.closedEnum(() => {
    return  {
        AssetSpendApproved: sts.enumStruct({
            index: sts.number(),
            amount: sts.bigint(),
            beneficiary: AccountId32,
            validFrom: sts.number(),
            expireAt: sts.number(),
        }),
        AssetSpendVoided: sts.enumStruct({
            index: sts.number(),
        }),
        Awarded: sts.enumStruct({
            proposalIndex: sts.number(),
            award: sts.bigint(),
            account: AccountId32,
        }),
        Burnt: sts.enumStruct({
            burntFunds: sts.bigint(),
        }),
        Deposit: sts.enumStruct({
            value: sts.bigint(),
        }),
        Paid: sts.enumStruct({
            index: sts.number(),
        }),
        PaymentFailed: sts.enumStruct({
            index: sts.number(),
        }),
        Rollover: sts.enumStruct({
            rolloverBalance: sts.bigint(),
        }),
        SpendApproved: sts.enumStruct({
            proposalIndex: sts.number(),
            amount: sts.bigint(),
            beneficiary: AccountId32,
        }),
        SpendProcessed: sts.enumStruct({
            index: sts.number(),
        }),
        Spending: sts.enumStruct({
            budgetRemaining: sts.bigint(),
        }),
        UpdatedInactive: sts.enumStruct({
            reactivated: sts.bigint(),
            deactivated: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TransactionPaymentEvent: sts.Type<TransactionPaymentEvent> = sts.closedEnum(() => {
    return  {
        TransactionFeePaid: sts.enumStruct({
            who: AccountId32,
            actualFee: sts.bigint(),
            tip: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TransactionPauseEvent: sts.Type<TransactionPauseEvent> = sts.closedEnum(() => {
    return  {
        TransactionPaused: sts.enumStruct({
            palletNameBytes: sts.bytes(),
            functionNameBytes: sts.bytes(),
        }),
        TransactionUnpaused: sts.enumStruct({
            palletNameBytes: sts.bytes(),
            functionNameBytes: sts.bytes(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TokensEvent: sts.Type<TokensEvent> = sts.closedEnum(() => {
    return  {
        BalanceSet: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            free: sts.bigint(),
            reserved: sts.bigint(),
        }),
        Deposited: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        DustLost: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Endowed: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Issued: sts.enumStruct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        LockRemoved: sts.enumStruct({
            lockId: sts.bytes(),
            currencyId: sts.number(),
            who: AccountId32,
        }),
        LockSet: sts.enumStruct({
            lockId: sts.bytes(),
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Locked: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Rescinded: sts.enumStruct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        ReserveRepatriated: sts.enumStruct({
            currencyId: sts.number(),
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
            status: BalanceStatus,
        }),
        Reserved: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Slashed: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            freeAmount: sts.bigint(),
            reservedAmount: sts.bigint(),
        }),
        TotalIssuanceSet: sts.enumStruct({
            currencyId: sts.number(),
            amount: sts.bigint(),
        }),
        Transfer: sts.enumStruct({
            currencyId: sts.number(),
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
        }),
        Unlocked: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Unreserved: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Withdrawn: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

export const BalanceStatus: sts.Type<BalanceStatus> = sts.closedEnum(() => {
    return  {
        Free: sts.unit(),
        Reserved: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TipsEvent: sts.Type<TipsEvent> = sts.closedEnum(() => {
    return  {
        NewTip: sts.enumStruct({
            tipHash: H256,
        }),
        TipClosed: sts.enumStruct({
            tipHash: H256,
            who: AccountId32,
            payout: sts.bigint(),
        }),
        TipClosing: sts.enumStruct({
            tipHash: H256,
        }),
        TipRetracted: sts.enumStruct({
            tipHash: H256,
        }),
        TipSlashed: sts.enumStruct({
            tipHash: H256,
            finder: AccountId32,
            deposit: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const TechnicalCommitteeEvent: sts.Type<TechnicalCommitteeEvent> = sts.closedEnum(() => {
    return  {
        Approved: sts.enumStruct({
            proposalHash: H256,
        }),
        Closed: sts.enumStruct({
            proposalHash: H256,
            yes: sts.number(),
            no: sts.number(),
        }),
        Disapproved: sts.enumStruct({
            proposalHash: H256,
        }),
        Executed: sts.enumStruct({
            proposalHash: H256,
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        MemberExecuted: sts.enumStruct({
            proposalHash: H256,
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        Proposed: sts.enumStruct({
            account: AccountId32,
            proposalIndex: sts.number(),
            proposalHash: H256,
            threshold: sts.number(),
        }),
        Voted: sts.enumStruct({
            account: AccountId32,
            proposalHash: H256,
            voted: sts.boolean(),
            yes: sts.number(),
            no: sts.number(),
        }),
    }
})

/**
 * Event for the System pallet.
 */
export const SystemEvent: sts.Type<SystemEvent> = sts.closedEnum(() => {
    return  {
        CodeUpdated: sts.unit(),
        ExtrinsicFailed: sts.enumStruct({
            dispatchError: DispatchError,
            dispatchInfo: DispatchInfo,
        }),
        ExtrinsicSuccess: sts.enumStruct({
            dispatchInfo: DispatchInfo,
        }),
        KilledAccount: sts.enumStruct({
            account: AccountId32,
        }),
        NewAccount: sts.enumStruct({
            account: AccountId32,
        }),
        Remarked: sts.enumStruct({
            sender: AccountId32,
            hash: H256,
        }),
        UpgradeAuthorized: sts.enumStruct({
            codeHash: H256,
            checkVersion: sts.boolean(),
        }),
    }
})

export const DispatchInfo: sts.Type<DispatchInfo> = sts.struct(() => {
    return  {
        weight: Weight,
        class: DispatchClass,
        paysFee: Pays,
    }
})

export const DispatchClass: sts.Type<DispatchClass> = sts.closedEnum(() => {
    return  {
        Mandatory: sts.unit(),
        Normal: sts.unit(),
        Operational: sts.unit(),
    }
})

/**
 * Inner events of this pallet.
 */
export const StateTrieMigrationEvent: sts.Type<StateTrieMigrationEvent> = sts.closedEnum(() => {
    return  {
        AutoMigrationFinished: sts.unit(),
        Halted: sts.enumStruct({
            error: Error,
        }),
        Migrated: sts.enumStruct({
            top: sts.number(),
            child: sts.number(),
            compute: MigrationCompute,
        }),
        Slashed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

export const MigrationCompute: sts.Type<MigrationCompute> = sts.closedEnum(() => {
    return  {
        Auto: sts.unit(),
        Signed: sts.unit(),
    }
})

/**
 * The `Error` enum of this pallet.
 */
export const Error: sts.Type<Error> = sts.closedEnum(() => {
    return  {
        BadChildRoot: sts.unit(),
        BadWitness: sts.unit(),
        KeyTooLong: sts.unit(),
        MaxSignedLimits: sts.unit(),
        NotEnoughFunds: sts.unit(),
        SignedMigrationNotAllowed: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const StakingEvent: sts.Type<StakingEvent> = sts.closedEnum(() => {
    return  {
        AccumulatedRpsUpdated: sts.enumStruct({
            accumulatedRps: FixedU128,
            totalStake: sts.bigint(),
        }),
        PositionCreated: sts.enumStruct({
            who: AccountId32,
            positionId: sts.bigint(),
            stake: sts.bigint(),
        }),
        RewardsClaimed: sts.enumStruct({
            who: AccountId32,
            positionId: sts.bigint(),
            paidRewards: sts.bigint(),
            unlockedRewards: sts.bigint(),
            slashedPoints: sts.bigint(),
            slashedUnpaidRewards: sts.bigint(),
            payablePercentage: FixedU128,
        }),
        StakeAdded: sts.enumStruct({
            who: AccountId32,
            positionId: sts.bigint(),
            stake: sts.bigint(),
            totalStake: sts.bigint(),
            lockedRewards: sts.bigint(),
            slashedPoints: sts.bigint(),
            payablePercentage: FixedU128,
        }),
        StakingInitialized: sts.enumStruct({
            nonDustableBalance: sts.bigint(),
        }),
        Unstaked: sts.enumStruct({
            who: AccountId32,
            positionId: sts.bigint(),
            unlockedStake: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const StableswapEvent: sts.Type<StableswapEvent> = sts.closedEnum(() => {
    return  {
        AmplificationChanging: sts.enumStruct({
            poolId: sts.number(),
            currentAmplification: NonZeroU16,
            finalAmplification: NonZeroU16,
            startBlock: sts.number(),
            endBlock: sts.number(),
        }),
        BuyExecuted: sts.enumStruct({
            who: AccountId32,
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        }),
        FeeUpdated: sts.enumStruct({
            poolId: sts.number(),
            fee: Permill,
        }),
        LiquidityAdded: sts.enumStruct({
            poolId: sts.number(),
            who: AccountId32,
            shares: sts.bigint(),
            assets: sts.array(() => AssetAmount),
        }),
        LiquidityRemoved: sts.enumStruct({
            poolId: sts.number(),
            who: AccountId32,
            shares: sts.bigint(),
            amounts: sts.array(() => AssetAmount),
            fee: sts.bigint(),
        }),
        PoolCreated: sts.enumStruct({
            poolId: sts.number(),
            assets: sts.array(() => sts.number()),
            amplification: NonZeroU16,
            fee: Permill,
        }),
        PoolDestroyed: sts.enumStruct({
            poolId: sts.number(),
        }),
        SellExecuted: sts.enumStruct({
            who: AccountId32,
            poolId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        }),
        TradableStateUpdated: sts.enumStruct({
            poolId: sts.number(),
            assetId: sts.number(),
            state: Type_240,
        }),
    }
})

export const Type_240: sts.Type<Type_240> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export const AssetAmount: sts.Type<AssetAmount> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
    }
})

export const NonZeroU16 = sts.number()

/**
 * The `Event` enum of this pallet
 */
export const SessionEvent: sts.Type<SessionEvent> = sts.closedEnum(() => {
    return  {
        NewSession: sts.enumStruct({
            sessionIndex: sts.number(),
        }),
    }
})

/**
 * Events type.
 */
export const SchedulerEvent: sts.Type<SchedulerEvent> = sts.closedEnum(() => {
    return  {
        CallUnavailable: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
        }),
        Canceled: sts.enumStruct({
            when: sts.number(),
            index: sts.number(),
        }),
        Dispatched: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        PeriodicFailed: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
        }),
        PermanentlyOverweight: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
        }),
        RetryCancelled: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
        }),
        RetryFailed: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
        }),
        RetrySet: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
            period: sts.number(),
            retries: sts.number(),
        }),
        Scheduled: sts.enumStruct({
            when: sts.number(),
            index: sts.number(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const RouterEvent: sts.Type<RouterEvent> = sts.closedEnum(() => {
    return  {
        Executed: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            eventId: sts.number(),
        }),
        RouteUpdated: sts.enumStruct({
            assetIds: sts.array(() => sts.number()),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const RelayChainInfoEvent: sts.Type<RelayChainInfoEvent> = sts.closedEnum(() => {
    return  {
        CurrentBlockNumbers: sts.enumStruct({
            parachainBlockNumber: sts.number(),
            relaychainBlockNumber: sts.number(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ReferralsEvent: sts.Type<ReferralsEvent> = sts.closedEnum(() => {
    return  {
        AssetRewardsUpdated: sts.enumStruct({
            assetId: sts.number(),
            level: Level,
            rewards: FeeDistribution,
        }),
        Claimed: sts.enumStruct({
            who: AccountId32,
            referrerRewards: sts.bigint(),
            tradeRewards: sts.bigint(),
        }),
        CodeLinked: sts.enumStruct({
            account: AccountId32,
            code: sts.bytes(),
            referralAccount: AccountId32,
        }),
        CodeRegistered: sts.enumStruct({
            code: sts.bytes(),
            account: AccountId32,
        }),
        Converted: sts.enumStruct({
            from: Type_431,
            to: Type_431,
        }),
        LevelUp: sts.enumStruct({
            who: AccountId32,
            level: Level,
        }),
    }
})

export const Type_431: sts.Type<Type_431> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
    }
})

export const FeeDistribution: sts.Type<FeeDistribution> = sts.struct(() => {
    return  {
        referrer: Permill,
        trader: Permill,
        external: Permill,
    }
})

export const Level: sts.Type<Level> = sts.closedEnum(() => {
    return  {
        None: sts.unit(),
        Tier0: sts.unit(),
        Tier1: sts.unit(),
        Tier2: sts.unit(),
        Tier3: sts.unit(),
        Tier4: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ReferendaEvent: sts.Type<ReferendaEvent> = sts.closedEnum(() => {
    return  {
        Approved: sts.enumStruct({
            index: sts.number(),
        }),
        Cancelled: sts.enumStruct({
            index: sts.number(),
            tally: Tally,
        }),
        ConfirmAborted: sts.enumStruct({
            index: sts.number(),
        }),
        ConfirmStarted: sts.enumStruct({
            index: sts.number(),
        }),
        Confirmed: sts.enumStruct({
            index: sts.number(),
            tally: Tally,
        }),
        DecisionDepositPlaced: sts.enumStruct({
            index: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        DecisionDepositRefunded: sts.enumStruct({
            index: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        DecisionStarted: sts.enumStruct({
            index: sts.number(),
            track: sts.number(),
            proposal: Bounded,
            tally: Tally,
        }),
        DepositSlashed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Killed: sts.enumStruct({
            index: sts.number(),
            tally: Tally,
        }),
        MetadataCleared: sts.enumStruct({
            index: sts.number(),
            hash: H256,
        }),
        MetadataSet: sts.enumStruct({
            index: sts.number(),
            hash: H256,
        }),
        Rejected: sts.enumStruct({
            index: sts.number(),
            tally: Tally,
        }),
        SubmissionDepositRefunded: sts.enumStruct({
            index: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Submitted: sts.enumStruct({
            index: sts.number(),
            track: sts.number(),
            proposal: Bounded,
        }),
        TimedOut: sts.enumStruct({
            index: sts.number(),
            tally: Tally,
        }),
    }
})

export const Bounded: sts.Type<Bounded> = sts.closedEnum(() => {
    return  {
        Inline: sts.bytes(),
        Legacy: sts.enumStruct({
            hash: H256,
        }),
        Lookup: sts.enumStruct({
            hash: H256,
            len: sts.number(),
        }),
    }
})

export const Tally: sts.Type<Tally> = sts.struct(() => {
    return  {
        ayes: sts.bigint(),
        nays: sts.bigint(),
        support: sts.bigint(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ProxyEvent: sts.Type<ProxyEvent> = sts.closedEnum(() => {
    return  {
        Announced: sts.enumStruct({
            real: AccountId32,
            proxy: AccountId32,
            callHash: H256,
        }),
        ProxyAdded: sts.enumStruct({
            delegator: AccountId32,
            delegatee: AccountId32,
            proxyType: ProxyType,
            delay: sts.number(),
        }),
        ProxyExecuted: sts.enumStruct({
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        ProxyRemoved: sts.enumStruct({
            delegator: AccountId32,
            delegatee: AccountId32,
            proxyType: ProxyType,
            delay: sts.number(),
        }),
        PureCreated: sts.enumStruct({
            pure: AccountId32,
            who: AccountId32,
            proxyType: ProxyType,
            disambiguationIndex: sts.number(),
        }),
    }
})

export const ProxyType: sts.Type<ProxyType> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        CancelProxy: sts.unit(),
        Governance: sts.unit(),
        Liquidity: sts.unit(),
        LiquidityMining: sts.unit(),
        Transfer: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const PreimageEvent: sts.Type<PreimageEvent> = sts.closedEnum(() => {
    return  {
        Cleared: sts.enumStruct({
            hash: H256,
        }),
        Noted: sts.enumStruct({
            hash: H256,
        }),
        Requested: sts.enumStruct({
            hash: H256,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const PolkadotXcmEvent: sts.Type<PolkadotXcmEvent> = sts.closedEnum(() => {
    return  {
        AssetsClaimed: sts.enumStruct({
            hash: H256,
            origin: V4Location,
            assets: VersionedAssets,
        }),
        AssetsTrapped: sts.enumStruct({
            hash: H256,
            origin: V4Location,
            assets: VersionedAssets,
        }),
        Attempted: sts.enumStruct({
            outcome: V4Outcome,
        }),
        FeesPaid: sts.enumStruct({
            paying: V4Location,
            fees: sts.array(() => V4Asset),
        }),
        InvalidQuerier: sts.enumStruct({
            origin: V4Location,
            queryId: sts.bigint(),
            expectedQuerier: V4Location,
            maybeActualQuerier: sts.option(() => V4Location),
        }),
        InvalidQuerierVersion: sts.enumStruct({
            origin: V4Location,
            queryId: sts.bigint(),
        }),
        InvalidResponder: sts.enumStruct({
            origin: V4Location,
            queryId: sts.bigint(),
            expectedLocation: sts.option(() => V4Location),
        }),
        InvalidResponderVersion: sts.enumStruct({
            origin: V4Location,
            queryId: sts.bigint(),
        }),
        Notified: sts.enumStruct({
            queryId: sts.bigint(),
            palletIndex: sts.number(),
            callIndex: sts.number(),
        }),
        NotifyDecodeFailed: sts.enumStruct({
            queryId: sts.bigint(),
            palletIndex: sts.number(),
            callIndex: sts.number(),
        }),
        NotifyDispatchError: sts.enumStruct({
            queryId: sts.bigint(),
            palletIndex: sts.number(),
            callIndex: sts.number(),
        }),
        NotifyOverweight: sts.enumStruct({
            queryId: sts.bigint(),
            palletIndex: sts.number(),
            callIndex: sts.number(),
            actualWeight: Weight,
            maxBudgetedWeight: Weight,
        }),
        NotifyTargetMigrationFail: sts.enumStruct({
            location: VersionedLocation,
            queryId: sts.bigint(),
        }),
        NotifyTargetSendFail: sts.enumStruct({
            location: V4Location,
            queryId: sts.bigint(),
            error: V3Error,
        }),
        ResponseReady: sts.enumStruct({
            queryId: sts.bigint(),
            response: V4Response,
        }),
        ResponseTaken: sts.enumStruct({
            queryId: sts.bigint(),
        }),
        Sent: sts.enumStruct({
            origin: V4Location,
            destination: V4Location,
            message: sts.array(() => V4Instruction),
            messageId: sts.bytes(),
        }),
        SupportedVersionChanged: sts.enumStruct({
            location: V4Location,
            version: sts.number(),
        }),
        UnexpectedResponse: sts.enumStruct({
            origin: V4Location,
            queryId: sts.bigint(),
        }),
        VersionChangeNotified: sts.enumStruct({
            destination: V4Location,
            result: sts.number(),
            cost: sts.array(() => V4Asset),
            messageId: sts.bytes(),
        }),
        VersionMigrationFinished: sts.enumStruct({
            version: sts.number(),
        }),
        VersionNotifyRequested: sts.enumStruct({
            destination: V4Location,
            cost: sts.array(() => V4Asset),
            messageId: sts.bytes(),
        }),
        VersionNotifyStarted: sts.enumStruct({
            destination: V4Location,
            cost: sts.array(() => V4Asset),
            messageId: sts.bytes(),
        }),
        VersionNotifyUnrequested: sts.enumStruct({
            destination: V4Location,
            cost: sts.array(() => V4Asset),
            messageId: sts.bytes(),
        }),
    }
})

export const V4Instruction: sts.Type<V4Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V4Location,
        BurnAsset: sts.array(() => V4Asset),
        BuyExecution: sts.enumStruct({
            fees: V4Asset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            ticket: V4Location,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V4AssetFilter,
            beneficiary: V4Location,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        DescendOrigin: V4Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V4AssetFilter,
            want: sts.array(() => V4Asset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V4Asset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V4Location),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V4NetworkId,
            destination: V4Junctions,
            xcm: sts.array(() => V4Instruction),
        }),
        HrmpChannelAccepted: sts.enumStruct({
            recipient: sts.number(),
        }),
        HrmpChannelClosing: sts.enumStruct({
            initiator: sts.number(),
            sender: sts.number(),
            recipient: sts.number(),
        }),
        HrmpNewChannelOpenRequest: sts.enumStruct({
            sender: sts.number(),
            maxMessageSize: sts.number(),
            maxCapacity: sts.number(),
        }),
        InitiateReserveWithdraw: sts.enumStruct({
            assets: V4AssetFilter,
            reserve: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V4AssetFilter,
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V4Asset,
            unlocker: V4Location,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V4Asset,
            owner: V4Location,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V4QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V4Response,
            maxWeight: Weight,
            querier: sts.option(() => V4Location),
        }),
        ReceiveTeleportedAsset: sts.array(() => V4Asset),
        RefundSurplus: sts.unit(),
        ReportError: V4QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V4QueryResponseInfo,
            assets: V4AssetFilter,
        }),
        ReportTransactStatus: V4QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V4Asset,
            locker: V4Location,
        }),
        ReserveAssetDeposited: sts.array(() => V4Asset),
        SetAppendix: sts.array(() => V4Instruction),
        SetErrorHandler: sts.array(() => V4Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V3OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            beneficiary: V4Location,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V4Asset),
            dest: V4Location,
            xcm: sts.array(() => V4Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V4Junction,
        UnlockAsset: sts.enumStruct({
            asset: V4Asset,
            target: V4Location,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V4Location),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V4Asset),
    }
})

export const DoubleEncoded: sts.Type<DoubleEncoded> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export const V3OriginKind: sts.Type<V3OriginKind> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export const V4QueryResponseInfo: sts.Type<V4QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V4Location,
        queryId: sts.bigint(),
        maxWeight: Weight,
    }
})

export const V3MaybeErrorCode: sts.Type<V3MaybeErrorCode> = sts.closedEnum(() => {
    return  {
        Error: sts.bytes(),
        Success: sts.unit(),
        TruncatedError: sts.bytes(),
    }
})

export const V4AssetFilter: sts.Type<V4AssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V4Asset),
        Wild: V4WildAsset,
    }
})

export const V4WildAsset: sts.Type<V4WildAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V4AssetId,
            fun: V4WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V4WildFungibility: sts.Type<V4WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export const V3WeightLimit: sts.Type<V3WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: Weight,
        Unlimited: sts.unit(),
    }
})

export const V4Response: sts.Type<V4Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V4Asset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V4PalletInfo),
        Version: sts.number(),
    }
})

export const V4PalletInfo: sts.Type<V4PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export const V3Error: sts.Type<V3Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        ExceedsStackLimit: sts.unit(),
        ExpectationFalse: sts.unit(),
        ExportError: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        FeesNotMet: sts.unit(),
        HoldingWouldOverflow: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        LocationFull: sts.unit(),
        LocationNotInvertible: sts.unit(),
        LockError: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        NameMismatch: sts.unit(),
        NoDeal: sts.unit(),
        NoPermission: sts.unit(),
        NotDepositable: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        PalletNotFound: sts.unit(),
        ReanchorFailed: sts.unit(),
        TooExpensive: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        Unanchored: sts.unit(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        VersionIncompatible: sts.unit(),
        WeightLimitReached: Weight,
        WeightNotComputable: sts.unit(),
    }
})

export const VersionedLocation: sts.Type<VersionedLocation> = sts.closedEnum(() => {
    return  {
        V2: V2MultiLocation,
        V3: V3MultiLocation,
        V4: V4Location,
    }
})

export const V3MultiLocation: sts.Type<V3MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V3Junctions,
    }
})

export const V3Junctions: sts.Type<V3Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V3Junction,
        X2: sts.tuple(() => [V3Junction, V3Junction]),
        X3: sts.tuple(() => [V3Junction, V3Junction, V3Junction]),
        X4: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction]),
        X5: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X6: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X7: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
        X8: sts.tuple(() => [V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction, V3Junction]),
    }
})

export const V3Junction: sts.Type<V3Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: sts.option(() => V3NetworkId),
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: sts.enumStruct({
            length: sts.number(),
            data: sts.bytes(),
        }),
        GlobalConsensus: V3NetworkId,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V3BodyId,
            part: V3BodyPart,
        }),
    }
})

export const V3NetworkId: sts.Type<V3NetworkId> = sts.closedEnum(() => {
    return  {
        BitcoinCash: sts.unit(),
        BitcoinCore: sts.unit(),
        ByFork: sts.enumStruct({
            blockNumber: sts.bigint(),
            blockHash: sts.bytes(),
        }),
        ByGenesis: sts.bytes(),
        Ethereum: sts.enumStruct({
            chainId: sts.bigint(),
        }),
        Kusama: sts.unit(),
        Polkadot: sts.unit(),
        PolkadotBulletin: sts.unit(),
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
    }
})

export const V2MultiLocation: sts.Type<V2MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V2Junctions,
    }
})

export const V2Junctions: sts.Type<V2Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V2Junction,
        X2: sts.tuple(() => [V2Junction, V2Junction]),
        X3: sts.tuple(() => [V2Junction, V2Junction, V2Junction]),
        X4: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction]),
        X5: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X6: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X7: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
        X8: sts.tuple(() => [V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction, V2Junction]),
    }
})

export const V2Junction: sts.Type<V2Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: V2NetworkId,
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: V2NetworkId,
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: V2NetworkId,
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: WeakBoundedVec,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V2BodyId,
            part: V2BodyPart,
        }),
    }
})

export const V2BodyPart: sts.Type<V2BodyPart> = sts.closedEnum(() => {
    return  {
        AtLeastProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Fraction: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Members: sts.enumStruct({
            count: sts.number(),
        }),
        MoreThanProportion: sts.enumStruct({
            nom: sts.number(),
            denom: sts.number(),
        }),
        Voice: sts.unit(),
    }
})

export const V2BodyId: sts.Type<V2BodyId> = sts.closedEnum(() => {
    return  {
        Administration: sts.unit(),
        Defense: sts.unit(),
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Named: WeakBoundedVec,
        Technical: sts.unit(),
        Treasury: sts.unit(),
        Unit: sts.unit(),
    }
})

export const WeakBoundedVec = sts.bytes()

export const V2NetworkId: sts.Type<V2NetworkId> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        Kusama: sts.unit(),
        Named: WeakBoundedVec,
        Polkadot: sts.unit(),
    }
})

export const V4Outcome: sts.Type<V4Outcome> = sts.closedEnum(() => {
    return  {
        Complete: sts.enumStruct({
            used: Weight,
        }),
        Error: sts.enumStruct({
            error: V3Error,
        }),
        Incomplete: sts.enumStruct({
            used: Weight,
            error: V3Error,
        }),
    }
})

export const VersionedAssets: sts.Type<VersionedAssets> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => V2MultiAsset),
        V3: sts.array(() => V3MultiAsset),
        V4: sts.array(() => V4Asset),
    }
})

export const V3MultiAsset: sts.Type<V3MultiAsset> = sts.struct(() => {
    return  {
        id: V3AssetId,
        fun: V3Fungibility,
    }
})

export const V3Fungibility: sts.Type<V3Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V3AssetInstance,
    }
})

export const V3AssetInstance: sts.Type<V3AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V3AssetId: sts.Type<V3AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V3MultiLocation,
    }
})

export const V2MultiAsset: sts.Type<V2MultiAsset> = sts.struct(() => {
    return  {
        id: V2AssetId,
        fun: V2Fungibility,
    }
})

export const V2Fungibility: sts.Type<V2Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V2AssetInstance,
    }
})

export const V2AssetInstance: sts.Type<V2AssetInstance> = sts.closedEnum(() => {
    return  {
        Array16: sts.bytes(),
        Array32: sts.bytes(),
        Array4: sts.bytes(),
        Array8: sts.bytes(),
        Blob: sts.bytes(),
        Index: sts.bigint(),
        Undefined: sts.unit(),
    }
})

export const V2AssetId: sts.Type<V2AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V2MultiLocation,
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ParachainSystemEvent: sts.Type<ParachainSystemEvent> = sts.closedEnum(() => {
    return  {
        DownwardMessagesProcessed: sts.enumStruct({
            weightUsed: Weight,
            dmqHead: H256,
        }),
        DownwardMessagesReceived: sts.enumStruct({
            count: sts.number(),
        }),
        UpwardMessageSent: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
        }),
        ValidationFunctionApplied: sts.enumStruct({
            relayChainBlockNum: sts.number(),
        }),
        ValidationFunctionDiscarded: sts.unit(),
        ValidationFunctionStored: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OtcSettlementsEvent: sts.Type<OtcSettlementsEvent> = sts.closedEnum(() => {
    return  {
        Executed: sts.enumStruct({
            assetId: sts.number(),
            profit: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OrmlXcmEvent: sts.Type<OrmlXcmEvent> = sts.closedEnum(() => {
    return  {
        Sent: sts.enumStruct({
            to: V4Location,
            message: sts.array(() => V4Instruction),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OmnipoolWarehouseLMEvent: sts.Type<OmnipoolWarehouseLMEvent> = sts.closedEnum(() => {
    return  {
        AllRewardsDistributed: sts.enumStruct({
            globalFarmId: sts.number(),
        }),
        GlobalFarmAccRPZUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            accumulatedRpz: FixedU128,
            totalSharesZ: sts.bigint(),
        }),
        YieldFarmAccRPVSUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: FixedU128,
            totalValuedShares: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OmnipoolLiquidityMiningEvent: sts.Type<OmnipoolLiquidityMiningEvent> = sts.closedEnum(() => {
    return  {
        DepositDestroyed: sts.enumStruct({
            who: AccountId32,
            depositId: sts.bigint(),
        }),
        GlobalFarmCreated: sts.enumStruct({
            id: sts.number(),
            owner: AccountId32,
            totalRewards: sts.bigint(),
            rewardCurrency: sts.number(),
            yieldPerPeriod: Perquintill,
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            maxRewardPerPeriod: sts.bigint(),
            minDeposit: sts.bigint(),
            lrnaPriceAdjustment: FixedU128,
        }),
        GlobalFarmTerminated: sts.enumStruct({
            globalFarmId: sts.number(),
            who: AccountId32,
            rewardCurrency: sts.number(),
            undistributedRewards: sts.bigint(),
        }),
        GlobalFarmUpdated: sts.enumStruct({
            id: sts.number(),
            plannedYieldingPeriods: sts.number(),
            yieldPerPeriod: Perquintill,
            minDeposit: sts.bigint(),
        }),
        RewardClaimed: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            claimed: sts.bigint(),
            rewardCurrency: sts.number(),
            depositId: sts.bigint(),
        }),
        SharesDeposited: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: AccountId32,
            sharesAmount: sts.bigint(),
            positionId: sts.bigint(),
        }),
        SharesRedeposited: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: AccountId32,
            sharesAmount: sts.bigint(),
            positionId: sts.bigint(),
        }),
        SharesWithdrawn: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
            depositId: sts.bigint(),
        }),
        YieldFarmCreated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: FixedU128,
            loyaltyCurve: sts.option(() => LoyaltyCurve),
        }),
        YieldFarmResumed: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: AccountId32,
            multiplier: FixedU128,
        }),
        YieldFarmStopped: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: AccountId32,
        }),
        YieldFarmTerminated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: AccountId32,
        }),
        YieldFarmUpdated: sts.enumStruct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: AccountId32,
            multiplier: FixedU128,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OmnipoolEvent: sts.Type<OmnipoolEvent> = sts.closedEnum(() => {
    return  {
        AssetRefunded: sts.enumStruct({
            assetId: sts.number(),
            amount: sts.bigint(),
            recipient: AccountId32,
        }),
        AssetWeightCapUpdated: sts.enumStruct({
            assetId: sts.number(),
            cap: Permill,
        }),
        BuyExecuted: sts.enumStruct({
            who: AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        }),
        LiquidityAdded: sts.enumStruct({
            who: AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            positionId: sts.bigint(),
        }),
        LiquidityRemoved: sts.enumStruct({
            who: AccountId32,
            positionId: sts.bigint(),
            assetId: sts.number(),
            sharesRemoved: sts.bigint(),
            fee: FixedU128,
        }),
        PositionCreated: sts.enumStruct({
            positionId: sts.bigint(),
            owner: AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: FixedU128,
        }),
        PositionDestroyed: sts.enumStruct({
            positionId: sts.bigint(),
            owner: AccountId32,
        }),
        PositionUpdated: sts.enumStruct({
            positionId: sts.bigint(),
            owner: AccountId32,
            asset: sts.number(),
            amount: sts.bigint(),
            shares: sts.bigint(),
            price: FixedU128,
        }),
        ProtocolLiquidityRemoved: sts.enumStruct({
            who: AccountId32,
            assetId: sts.number(),
            amount: sts.bigint(),
            hubAmount: sts.bigint(),
            sharesRemoved: sts.bigint(),
        }),
        SellExecuted: sts.enumStruct({
            who: AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        }),
        TokenAdded: sts.enumStruct({
            assetId: sts.number(),
            initialAmount: sts.bigint(),
            initialPrice: FixedU128,
        }),
        TokenRemoved: sts.enumStruct({
            assetId: sts.number(),
            amount: sts.bigint(),
            hubWithdrawn: sts.bigint(),
        }),
        TradableStateUpdated: sts.enumStruct({
            assetId: sts.number(),
            state: Tradability,
        }),
    }
})

export const Tradability: sts.Type<Tradability> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const OTCEvent: sts.Type<OTCEvent> = sts.closedEnum(() => {
    return  {
        Cancelled: sts.enumStruct({
            orderId: sts.number(),
        }),
        Filled: sts.enumStruct({
            orderId: sts.number(),
            who: AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        }),
        PartiallyFilled: sts.enumStruct({
            orderId: sts.number(),
            who: AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            fee: sts.bigint(),
        }),
        Placed: sts.enumStruct({
            orderId: sts.number(),
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            partiallyFillable: sts.boolean(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const MultisigEvent: sts.Type<MultisigEvent> = sts.closedEnum(() => {
    return  {
        MultisigApproval: sts.enumStruct({
            approving: AccountId32,
            timepoint: Timepoint,
            multisig: AccountId32,
            callHash: sts.bytes(),
        }),
        MultisigCancelled: sts.enumStruct({
            cancelling: AccountId32,
            timepoint: Timepoint,
            multisig: AccountId32,
            callHash: sts.bytes(),
        }),
        MultisigExecuted: sts.enumStruct({
            approving: AccountId32,
            timepoint: Timepoint,
            multisig: AccountId32,
            callHash: sts.bytes(),
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        NewMultisig: sts.enumStruct({
            approving: AccountId32,
            multisig: AccountId32,
            callHash: sts.bytes(),
        }),
    }
})

export const Timepoint: sts.Type<Timepoint> = sts.struct(() => {
    return  {
        height: sts.number(),
        index: sts.number(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const MultiTransactionPaymentEvent: sts.Type<MultiTransactionPaymentEvent> = sts.closedEnum(() => {
    return  {
        CurrencyAdded: sts.enumStruct({
            assetId: sts.number(),
        }),
        CurrencyRemoved: sts.enumStruct({
            assetId: sts.number(),
        }),
        CurrencySet: sts.enumStruct({
            accountId: AccountId32,
            assetId: sts.number(),
        }),
        FeeWithdrawn: sts.enumStruct({
            accountId: AccountId32,
            assetId: sts.number(),
            nativeFeeAmount: sts.bigint(),
            nonNativeFeeAmount: sts.bigint(),
            destinationAccountId: AccountId32,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const MessageQueueEvent: sts.Type<MessageQueueEvent> = sts.closedEnum(() => {
    return  {
        OverweightEnqueued: sts.enumStruct({
            id: sts.bytes(),
            origin: AggregateMessageOrigin,
            pageIndex: sts.number(),
            messageIndex: sts.number(),
        }),
        PageReaped: sts.enumStruct({
            origin: AggregateMessageOrigin,
            index: sts.number(),
        }),
        Processed: sts.enumStruct({
            id: H256,
            origin: AggregateMessageOrigin,
            weightUsed: Weight,
            success: sts.boolean(),
        }),
        ProcessingFailed: sts.enumStruct({
            id: H256,
            origin: AggregateMessageOrigin,
            error: ProcessMessageError,
        }),
    }
})

export const ProcessMessageError: sts.Type<ProcessMessageError> = sts.closedEnum(() => {
    return  {
        BadFormat: sts.unit(),
        Corrupt: sts.unit(),
        Overweight: Weight,
        StackLimitReached: sts.unit(),
        Unsupported: sts.unit(),
        Yield: sts.unit(),
    }
})

export const AggregateMessageOrigin: sts.Type<AggregateMessageOrigin> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        Parent: sts.unit(),
        Sibling: Id,
    }
})

export const Id = sts.number()

/**
 * The `Event` enum of this pallet
 */
export const LiquidationEvent: sts.Type<LiquidationEvent> = sts.closedEnum(() => {
    return  {
        Liquidated: sts.enumStruct({
            liquidator: AccountId32,
            evmAddress: H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        }),
    }
})

export const H160 = sts.bytes()

/**
 * The `Event` enum of this pallet
 */
export const LBPEvent: sts.Type<LBPEvent> = sts.closedEnum(() => {
    return  {
        BuyExecuted: sts.enumStruct({
            who: AccountId32,
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            buyPrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        }),
        LiquidityAdded: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            amountA: sts.bigint(),
            amountB: sts.bigint(),
        }),
        LiquidityRemoved: sts.enumStruct({
            who: AccountId32,
            assetA: sts.number(),
            assetB: sts.number(),
            amountA: sts.bigint(),
            amountB: sts.bigint(),
        }),
        PoolCreated: sts.enumStruct({
            pool: AccountId32,
            data: Pool,
        }),
        PoolUpdated: sts.enumStruct({
            pool: AccountId32,
            data: Pool,
        }),
        SellExecuted: sts.enumStruct({
            who: AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            salePrice: sts.bigint(),
            feeAsset: sts.number(),
            feeAmount: sts.bigint(),
        }),
    }
})

export const Pool: sts.Type<Pool> = sts.struct(() => {
    return  {
        owner: AccountId32,
        start: sts.option(() => sts.number()),
        end: sts.option(() => sts.number()),
        assets: sts.tuple(() => [sts.number(), sts.number()]),
        initialWeight: sts.number(),
        finalWeight: sts.number(),
        weightCurve: WeightCurveType,
        fee: sts.tuple(() => [sts.number(), sts.number()]),
        feeCollector: AccountId32,
        repayTarget: sts.bigint(),
    }
})

export const WeightCurveType: sts.Type<WeightCurveType> = sts.closedEnum(() => {
    return  {
        Linear: sts.unit(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const IdentityEvent: sts.Type<IdentityEvent> = sts.closedEnum(() => {
    return  {
        AuthorityAdded: sts.enumStruct({
            authority: AccountId32,
        }),
        AuthorityRemoved: sts.enumStruct({
            authority: AccountId32,
        }),
        DanglingUsernameRemoved: sts.enumStruct({
            who: AccountId32,
            username: BoundedVec,
        }),
        IdentityCleared: sts.enumStruct({
            who: AccountId32,
            deposit: sts.bigint(),
        }),
        IdentityKilled: sts.enumStruct({
            who: AccountId32,
            deposit: sts.bigint(),
        }),
        IdentitySet: sts.enumStruct({
            who: AccountId32,
        }),
        JudgementGiven: sts.enumStruct({
            target: AccountId32,
            registrarIndex: sts.number(),
        }),
        JudgementRequested: sts.enumStruct({
            who: AccountId32,
            registrarIndex: sts.number(),
        }),
        JudgementUnrequested: sts.enumStruct({
            who: AccountId32,
            registrarIndex: sts.number(),
        }),
        PreapprovalExpired: sts.enumStruct({
            whose: AccountId32,
        }),
        PrimaryUsernameSet: sts.enumStruct({
            who: AccountId32,
            username: BoundedVec,
        }),
        RegistrarAdded: sts.enumStruct({
            registrarIndex: sts.number(),
        }),
        SubIdentityAdded: sts.enumStruct({
            sub: AccountId32,
            main: AccountId32,
            deposit: sts.bigint(),
        }),
        SubIdentityRemoved: sts.enumStruct({
            sub: AccountId32,
            main: AccountId32,
            deposit: sts.bigint(),
        }),
        SubIdentityRevoked: sts.enumStruct({
            sub: AccountId32,
            main: AccountId32,
            deposit: sts.bigint(),
        }),
        UsernameQueued: sts.enumStruct({
            who: AccountId32,
            username: BoundedVec,
            expiration: sts.number(),
        }),
        UsernameSet: sts.enumStruct({
            who: AccountId32,
            username: BoundedVec,
        }),
    }
})

export const BoundedVec = sts.bytes()

/**
 * The `Event` enum of this pallet
 */
export const EthereumEvent: sts.Type<EthereumEvent> = sts.closedEnum(() => {
    return  {
        Executed: sts.enumStruct({
            from: H160,
            to: H160,
            transactionHash: H256,
            exitReason: ExitReason,
            extraData: sts.bytes(),
        }),
    }
})

export const ExitReason: sts.Type<ExitReason> = sts.closedEnum(() => {
    return  {
        Error: ExitError,
        Fatal: ExitFatal,
        Revert: ExitRevert,
        Succeed: ExitSucceed,
    }
})

export const ExitSucceed: sts.Type<ExitSucceed> = sts.closedEnum(() => {
    return  {
        Returned: sts.unit(),
        Stopped: sts.unit(),
        Suicided: sts.unit(),
    }
})

export const ExitRevert: sts.Type<ExitRevert> = sts.closedEnum(() => {
    return  {
        Reverted: sts.unit(),
    }
})

export const ExitFatal: sts.Type<ExitFatal> = sts.closedEnum(() => {
    return  {
        CallErrorAsFatal: ExitError,
        NotSupported: sts.unit(),
        Other: Cow,
        UnhandledInterrupt: sts.unit(),
    }
})

export const Cow = sts.string()

export const ExitError: sts.Type<ExitError> = sts.closedEnum(() => {
    return  {
        CallTooDeep: sts.unit(),
        CreateCollision: sts.unit(),
        CreateContractLimit: sts.unit(),
        CreateEmpty: sts.unit(),
        DesignatedInvalid: sts.unit(),
        InvalidCode: Opcode,
        InvalidJump: sts.unit(),
        InvalidRange: sts.unit(),
        MaxNonce: sts.unit(),
        Other: Cow,
        OutOfFund: sts.unit(),
        OutOfGas: sts.unit(),
        OutOfOffset: sts.unit(),
        PCUnderflow: sts.unit(),
        StackOverflow: sts.unit(),
        StackUnderflow: sts.unit(),
    }
})

export const Opcode = sts.number()

/**
 * The `Event` enum of this pallet
 */
export const EmaOracleEvent: sts.Type<EmaOracleEvent> = sts.closedEnum(() => {
    return  {
        AddedToWhitelist: sts.enumStruct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        }),
        RemovedFromWhitelist: sts.enumStruct({
            source: sts.bytes(),
            assets: sts.tuple(() => [sts.number(), sts.number()]),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ElectionsEvent: sts.Type<ElectionsEvent> = sts.closedEnum(() => {
    return  {
        CandidateSlashed: sts.enumStruct({
            candidate: AccountId32,
            amount: sts.bigint(),
        }),
        ElectionError: sts.unit(),
        EmptyTerm: sts.unit(),
        MemberKicked: sts.enumStruct({
            member: AccountId32,
        }),
        NewTerm: sts.enumStruct({
            newMembers: sts.array(() => sts.tuple(() => [AccountId32, sts.bigint()])),
        }),
        Renounced: sts.enumStruct({
            candidate: AccountId32,
        }),
        SeatHolderSlashed: sts.enumStruct({
            seatHolder: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const EVMAccountsEvent: sts.Type<EVMAccountsEvent> = sts.closedEnum(() => {
    return  {
        Bound: sts.enumStruct({
            account: AccountId32,
            address: H160,
        }),
        ContractApproved: sts.enumStruct({
            address: H160,
        }),
        ContractDisapproved: sts.enumStruct({
            address: H160,
        }),
        DeployerAdded: sts.enumStruct({
            who: H160,
        }),
        DeployerRemoved: sts.enumStruct({
            who: H160,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const EVMEvent: sts.Type<EVMEvent> = sts.closedEnum(() => {
    return  {
        Created: sts.enumStruct({
            address: H160,
        }),
        CreatedFailed: sts.enumStruct({
            address: H160,
        }),
        Executed: sts.enumStruct({
            address: H160,
        }),
        ExecutedFailed: sts.enumStruct({
            address: H160,
        }),
        Log: sts.enumStruct({
            log: Log,
        }),
    }
})

export const Log: sts.Type<Log> = sts.struct(() => {
    return  {
        address: H160,
        topics: sts.array(() => H256),
        data: sts.bytes(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const DynamicFeesEvent: sts.Type<DynamicFeesEvent> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * The `Event` enum of this pallet
 */
export const DusterEvent: sts.Type<DusterEvent> = sts.closedEnum(() => {
    return  {
        Added: sts.enumStruct({
            who: AccountId32,
        }),
        Dusted: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Removed: sts.enumStruct({
            who: AccountId32,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const DispatcherEvent: sts.Type<DispatcherEvent> = sts.closedEnum(() => {
    return  {
        AaveManagerCallDispatched: sts.enumStruct({
            callHash: H256,
            result: sts.result(() => PostDispatchInfo, () => DispatchErrorWithPostInfo),
        }),
        TreasuryManagerCallDispatched: sts.enumStruct({
            callHash: H256,
            result: sts.result(() => PostDispatchInfo, () => DispatchErrorWithPostInfo),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const DemocracyEvent: sts.Type<DemocracyEvent> = sts.closedEnum(() => {
    return  {
        Blacklisted: sts.enumStruct({
            proposalHash: H256,
        }),
        Cancelled: sts.enumStruct({
            refIndex: sts.number(),
        }),
        Delegated: sts.enumStruct({
            who: AccountId32,
            target: AccountId32,
        }),
        ExternalTabled: sts.unit(),
        MetadataCleared: sts.enumStruct({
            owner: MetadataOwner,
            hash: H256,
        }),
        MetadataSet: sts.enumStruct({
            owner: MetadataOwner,
            hash: H256,
        }),
        MetadataTransferred: sts.enumStruct({
            prevOwner: MetadataOwner,
            owner: MetadataOwner,
            hash: H256,
        }),
        NotPassed: sts.enumStruct({
            refIndex: sts.number(),
        }),
        Passed: sts.enumStruct({
            refIndex: sts.number(),
        }),
        ProposalCanceled: sts.enumStruct({
            propIndex: sts.number(),
        }),
        Proposed: sts.enumStruct({
            proposalIndex: sts.number(),
            deposit: sts.bigint(),
        }),
        Seconded: sts.enumStruct({
            seconder: AccountId32,
            propIndex: sts.number(),
        }),
        Started: sts.enumStruct({
            refIndex: sts.number(),
            threshold: VoteThreshold,
        }),
        Tabled: sts.enumStruct({
            proposalIndex: sts.number(),
            deposit: sts.bigint(),
        }),
        Undelegated: sts.enumStruct({
            account: AccountId32,
        }),
        Vetoed: sts.enumStruct({
            who: AccountId32,
            proposalHash: H256,
            until: sts.number(),
        }),
        Voted: sts.enumStruct({
            voter: AccountId32,
            refIndex: sts.number(),
            vote: AccountVote,
        }),
    }
})

export const AccountVote: sts.Type<AccountVote> = sts.closedEnum(() => {
    return  {
        Split: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
        }),
        Standard: sts.enumStruct({
            vote: sts.number(),
            balance: sts.bigint(),
        }),
    }
})

export const VoteThreshold: sts.Type<VoteThreshold> = sts.closedEnum(() => {
    return  {
        SimpleMajority: sts.unit(),
        SuperMajorityAgainst: sts.unit(),
        SuperMajorityApprove: sts.unit(),
    }
})

export const MetadataOwner: sts.Type<MetadataOwner> = sts.closedEnum(() => {
    return  {
        External: sts.unit(),
        Proposal: sts.number(),
        Referendum: sts.number(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const DCAEvent: sts.Type<DCAEvent> = sts.closedEnum(() => {
    return  {
        Completed: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
        }),
        ExecutionPlanned: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
            block: sts.number(),
        }),
        ExecutionStarted: sts.enumStruct({
            id: sts.number(),
            block: sts.number(),
        }),
        RandomnessGenerationFailed: sts.enumStruct({
            block: sts.number(),
            error: DispatchError,
        }),
        Scheduled: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
            period: sts.number(),
            totalAmount: sts.bigint(),
            order: Order,
        }),
        Terminated: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
            error: DispatchError,
        }),
        TradeExecuted: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        }),
        TradeFailed: sts.enumStruct({
            id: sts.number(),
            who: AccountId32,
            error: DispatchError,
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const CurrenciesEvent: sts.Type<CurrenciesEvent> = sts.closedEnum(() => {
    return  {
        BalanceUpdated: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Deposited: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Transferred: sts.enumStruct({
            currencyId: sts.number(),
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
        }),
        Withdrawn: sts.enumStruct({
            currencyId: sts.number(),
            who: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const CumulusXcmEvent: sts.Type<CumulusXcmEvent> = sts.closedEnum(() => {
    return  {
        ExecutedDownward: sts.tuple(() => [sts.bytes(), V4Outcome]),
        InvalidFormat: sts.bytes(),
        UnsupportedVersion: sts.bytes(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const CouncilEvent: sts.Type<CouncilEvent> = sts.closedEnum(() => {
    return  {
        Approved: sts.enumStruct({
            proposalHash: H256,
        }),
        Closed: sts.enumStruct({
            proposalHash: H256,
            yes: sts.number(),
            no: sts.number(),
        }),
        Disapproved: sts.enumStruct({
            proposalHash: H256,
        }),
        Executed: sts.enumStruct({
            proposalHash: H256,
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        MemberExecuted: sts.enumStruct({
            proposalHash: H256,
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        Proposed: sts.enumStruct({
            account: AccountId32,
            proposalIndex: sts.number(),
            proposalHash: H256,
            threshold: sts.number(),
        }),
        Voted: sts.enumStruct({
            account: AccountId32,
            proposalHash: H256,
            voted: sts.boolean(),
            yes: sts.number(),
            no: sts.number(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ConvictionVotingEvent: sts.Type<ConvictionVotingEvent> = sts.closedEnum(() => {
    return  {
        Delegated: sts.tuple(() => [AccountId32, AccountId32]),
        Undelegated: AccountId32,
        VoteRemoved: sts.enumStruct({
            who: AccountId32,
            vote: Type_69,
        }),
        Voted: sts.enumStruct({
            who: AccountId32,
            vote: Type_69,
        }),
    }
})

export const Type_69: sts.Type<Type_69> = sts.closedEnum(() => {
    return  {
        Split: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
        }),
        SplitAbstain: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
            abstain: sts.bigint(),
        }),
        Standard: sts.enumStruct({
            vote: sts.number(),
            balance: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const CollatorSelectionEvent: sts.Type<CollatorSelectionEvent> = sts.closedEnum(() => {
    return  {
        CandidateAdded: sts.enumStruct({
            accountId: AccountId32,
            deposit: sts.bigint(),
        }),
        CandidateBondUpdated: sts.enumStruct({
            accountId: AccountId32,
            deposit: sts.bigint(),
        }),
        CandidateRemoved: sts.enumStruct({
            accountId: AccountId32,
        }),
        CandidateReplaced: sts.enumStruct({
            old: AccountId32,
            new: AccountId32,
            deposit: sts.bigint(),
        }),
        InvalidInvulnerableSkipped: sts.enumStruct({
            accountId: AccountId32,
        }),
        InvulnerableAdded: sts.enumStruct({
            accountId: AccountId32,
        }),
        InvulnerableRemoved: sts.enumStruct({
            accountId: AccountId32,
        }),
        NewCandidacyBond: sts.enumStruct({
            bondAmount: sts.bigint(),
        }),
        NewDesiredCandidates: sts.enumStruct({
            desiredCandidates: sts.number(),
        }),
        NewInvulnerables: sts.enumStruct({
            invulnerables: sts.array(() => AccountId32),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const CollatorRewardsEvent: sts.Type<CollatorRewardsEvent> = sts.closedEnum(() => {
    return  {
        CollatorRewarded: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
            currency: sts.number(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const ClaimsEvent: sts.Type<ClaimsEvent> = sts.closedEnum(() => {
    return  {
        Claim: sts.tuple(() => [AccountId32, EthereumAddress, sts.bigint()]),
    }
})

export const EthereumAddress = sts.bytes()

/**
 * The `Event` enum of this pallet
 */
export const CircuitBreakerEvent: sts.Type<CircuitBreakerEvent> = sts.closedEnum(() => {
    return  {
        AddLiquidityLimitChanged: sts.enumStruct({
            assetId: sts.number(),
            liquidityLimit: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
        }),
        RemoveLiquidityLimitChanged: sts.enumStruct({
            assetId: sts.number(),
            liquidityLimit: sts.option(() => sts.tuple(() => [sts.number(), sts.number()])),
        }),
        TradeVolumeLimitChanged: sts.enumStruct({
            assetId: sts.number(),
            tradeVolumeLimit: sts.tuple(() => [sts.number(), sts.number()]),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const BroadcastEvent: sts.Type<BroadcastEvent> = sts.closedEnum(() => {
    return  {
        Swapped: sts.enumStruct({
            swapper: AccountId32,
            filler: AccountId32,
            fillerType: Filler,
            operation: TradeOperation,
            inputs: sts.array(() => Asset),
            outputs: sts.array(() => Asset),
            fees: sts.array(() => Fee),
            operationStack: sts.array(() => ExecutionType),
        }),
    }
})

export const ExecutionType: sts.Type<ExecutionType> = sts.closedEnum(() => {
    return  {
        Batch: sts.number(),
        DCA: sts.tuple(() => [sts.number(), sts.number()]),
        Omnipool: sts.number(),
        Router: sts.number(),
        Xcm: sts.tuple(() => [sts.bytes(), sts.number()]),
        XcmExchange: sts.number(),
    }
})

export const Fee: sts.Type<Fee> = sts.struct(() => {
    return  {
        asset: sts.number(),
        amount: sts.bigint(),
        destination: Destination,
    }
})

export const Destination: sts.Type<Destination> = sts.closedEnum(() => {
    return  {
        Account: AccountId32,
        Burned: sts.unit(),
    }
})

export const Asset: sts.Type<Asset> = sts.struct(() => {
    return  {
        asset: sts.number(),
        amount: sts.bigint(),
    }
})

export const TradeOperation: sts.Type<TradeOperation> = sts.closedEnum(() => {
    return  {
        ExactIn: sts.unit(),
        ExactOut: sts.unit(),
        Limit: sts.unit(),
        LiquidityAdd: sts.unit(),
        LiquidityRemove: sts.unit(),
    }
})

export const Filler: sts.Type<Filler> = sts.closedEnum(() => {
    return  {
        LBP: sts.unit(),
        OTC: sts.number(),
        Omnipool: sts.unit(),
        Stableswap: sts.number(),
        XYK: sts.number(),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const BondsEvent: sts.Type<BondsEvent> = sts.closedEnum(() => {
    return  {
        Issued: sts.enumStruct({
            issuer: AccountId32,
            bondId: sts.number(),
            amount: sts.bigint(),
            fee: sts.bigint(),
        }),
        Redeemed: sts.enumStruct({
            who: AccountId32,
            bondId: sts.number(),
            amount: sts.bigint(),
        }),
        TokenCreated: sts.enumStruct({
            issuer: AccountId32,
            assetId: sts.number(),
            bondId: sts.number(),
            maturity: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const BalancesEvent: sts.Type<BalancesEvent> = sts.closedEnum(() => {
    return  {
        BalanceSet: sts.enumStruct({
            who: AccountId32,
            free: sts.bigint(),
        }),
        Burned: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Deposit: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        DustLost: sts.enumStruct({
            account: AccountId32,
            amount: sts.bigint(),
        }),
        Endowed: sts.enumStruct({
            account: AccountId32,
            freeBalance: sts.bigint(),
        }),
        Frozen: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Issued: sts.enumStruct({
            amount: sts.bigint(),
        }),
        Locked: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Minted: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Rescinded: sts.enumStruct({
            amount: sts.bigint(),
        }),
        ReserveRepatriated: sts.enumStruct({
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
            destinationStatus: BalanceStatus,
        }),
        Reserved: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Restored: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Slashed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Suspended: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Thawed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        TotalIssuanceForced: sts.enumStruct({
            old: sts.bigint(),
            new: sts.bigint(),
        }),
        Transfer: sts.enumStruct({
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
        }),
        Unlocked: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Unreserved: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Upgraded: sts.enumStruct({
            who: AccountId32,
        }),
        Withdraw: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

/**
 * The `Event` enum of this pallet
 */
export const AssetRegistryEvent: sts.Type<AssetRegistryEvent> = sts.closedEnum(() => {
    return  {
        AssetBanned: sts.enumStruct({
            assetId: sts.number(),
        }),
        AssetUnbanned: sts.enumStruct({
            assetId: sts.number(),
        }),
        ExistentialDepositPaid: sts.enumStruct({
            who: AccountId32,
            feeAsset: sts.number(),
            amount: sts.bigint(),
        }),
        LocationSet: sts.enumStruct({
            assetId: sts.number(),
            location: AssetLocation,
        }),
        Registered: sts.enumStruct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        }),
        Updated: sts.enumStruct({
            assetId: sts.number(),
            assetName: sts.option(() => sts.bytes()),
            assetType: AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
            symbol: sts.option(() => sts.bytes()),
            decimals: sts.option(() => sts.number()),
            isSufficient: sts.boolean(),
        }),
    }
})

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        Erc20: sts.unit(),
        External: sts.unit(),
        StableSwap: sts.unit(),
        Token: sts.unit(),
        XYK: sts.unit(),
    }
})

export const AssetLocation: sts.Type<AssetLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V3Junctions,
    }
})

export const Phase: sts.Type<Phase> = sts.closedEnum(() => {
    return  {
        ApplyExtrinsic: sts.number(),
        Finalization: sts.unit(),
        Initialization: sts.unit(),
    }
})
