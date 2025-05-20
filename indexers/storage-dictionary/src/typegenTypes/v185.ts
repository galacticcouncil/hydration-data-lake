import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface EventRecord {
    phase: Phase
    event: Event
    topics: H256[]
}

export type H256 = Bytes

export type Event = Event_AssetRegistry | Event_Balances | Event_Bonds | Event_CircuitBreaker | Event_Claims | Event_CollatorRewards | Event_CollatorSelection | Event_Council | Event_CumulusXcm | Event_Currencies | Event_DCA | Event_Democracy | Event_DmpQueue | Event_Duster | Event_DynamicFees | Event_Elections | Event_EmaOracle | Event_Identity | Event_LBP | Event_MultiTransactionPayment | Event_Multisig | Event_OTC | Event_Omnipool | Event_OmnipoolLiquidityMining | Event_OmnipoolWarehouseLM | Event_OrmlXcm | Event_ParachainSystem | Event_PolkadotXcm | Event_Preimage | Event_Proxy | Event_RelayChainInfo | Event_Router | Event_Scheduler | Event_Session | Event_Stableswap | Event_Staking | Event_System | Event_TechnicalCommittee | Event_Tips | Event_Tokens | Event_TransactionPause | Event_TransactionPayment | Event_Treasury | Event_Uniques | Event_UnknownTokens | Event_Utility | Event_Vesting | Event_XTokens | Event_XYK | Event_XcmpQueue

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

export interface Event_DmpQueue {
    __kind: 'DmpQueue'
    value: DmpQueueEvent
}

export interface Event_Duster {
    __kind: 'Duster'
    value: DusterEvent
}

export interface Event_DynamicFees {
    __kind: 'DynamicFees'
    value: DynamicFeesEvent
}

export interface Event_Elections {
    __kind: 'Elections'
    value: ElectionsEvent
}

export interface Event_EmaOracle {
    __kind: 'EmaOracle'
    value: EmaOracleEvent
}

export interface Event_Identity {
    __kind: 'Identity'
    value: IdentityEvent
}

export interface Event_LBP {
    __kind: 'LBP'
    value: LBPEvent
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

export interface Event_XTokens {
    __kind: 'XTokens'
    value: XTokensEvent
}

export interface Event_XYK {
    __kind: 'XYK'
    value: XYKEvent
}

export interface Event_XcmpQueue {
    __kind: 'XcmpQueue'
    value: XcmpQueueEvent
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type XcmpQueueEvent = XcmpQueueEvent_BadFormat | XcmpQueueEvent_BadVersion | XcmpQueueEvent_Fail | XcmpQueueEvent_OverweightEnqueued | XcmpQueueEvent_OverweightServiced | XcmpQueueEvent_Success | XcmpQueueEvent_XcmDeferred | XcmpQueueEvent_XcmDeferredQueueFull | XcmpQueueEvent_XcmpMessageSent

/**
 * Bad XCM format used.
 */
export interface XcmpQueueEvent_BadFormat {
    __kind: 'BadFormat'
    messageHash?: (Bytes | undefined)
}

/**
 * Bad XCM version used.
 */
export interface XcmpQueueEvent_BadVersion {
    __kind: 'BadVersion'
    messageHash?: (Bytes | undefined)
}

/**
 * Some XCM failed.
 */
export interface XcmpQueueEvent_Fail {
    __kind: 'Fail'
    messageHash?: (Bytes | undefined)
    error: V3Error
    weight: Weight
}

/**
 * An XCM exceeded the individual message weight budget.
 */
export interface XcmpQueueEvent_OverweightEnqueued {
    __kind: 'OverweightEnqueued'
    sender: Id
    sentAt: number
    index: bigint
    required: Weight
}

/**
 * An XCM from the overweight queue was executed with the given actual weight used.
 */
export interface XcmpQueueEvent_OverweightServiced {
    __kind: 'OverweightServiced'
    index: bigint
    used: Weight
}

/**
 * Some XCM was executed ok.
 */
export interface XcmpQueueEvent_Success {
    __kind: 'Success'
    messageHash?: (Bytes | undefined)
    weight: Weight
}

/**
 * Some XCM was deferred for later execution
 */
export interface XcmpQueueEvent_XcmDeferred {
    __kind: 'XcmDeferred'
    sender: Id
    sentAt: number
    deferredTo: number
    messageHash?: (Bytes | undefined)
}

export interface XcmpQueueEvent_XcmDeferredQueueFull {
    __kind: 'XcmDeferredQueueFull'
}

/**
 * An HRMP message was sent to a sibling parachain.
 */
export interface XcmpQueueEvent_XcmpMessageSent {
    __kind: 'XcmpMessageSent'
    messageHash?: (Bytes | undefined)
}

export type Id = number

export interface Weight {
    refTime: bigint
    proofSize: bigint
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type XYKEvent = XYKEvent_BuyExecuted | XYKEvent_LiquidityAdded | XYKEvent_LiquidityRemoved | XYKEvent_PoolCreated | XYKEvent_PoolDestroyed | XYKEvent_SellExecuted

/**
 * Asset purchase executed.
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

export type AccountId32 = Bytes

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type XTokensEvent = XTokensEvent_TransferredMultiAssets

/**
 * Transferred `MultiAsset` with fee.
 */
export interface XTokensEvent_TransferredMultiAssets {
    __kind: 'TransferredMultiAssets'
    sender: AccountId32
    assets: V3MultiAsset[]
    fee: V3MultiAsset
    dest: V3MultiLocation
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

export type V3NetworkId = V3NetworkId_BitcoinCash | V3NetworkId_BitcoinCore | V3NetworkId_ByFork | V3NetworkId_ByGenesis | V3NetworkId_Ethereum | V3NetworkId_Kusama | V3NetworkId_Polkadot | V3NetworkId_Rococo | V3NetworkId_Westend | V3NetworkId_Wococo

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

export interface V3NetworkId_Rococo {
    __kind: 'Rococo'
}

export interface V3NetworkId_Westend {
    __kind: 'Westend'
}

export interface V3NetworkId_Wococo {
    __kind: 'Wococo'
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

export type DispatchError = DispatchError_Arithmetic | DispatchError_BadOrigin | DispatchError_CannotLookup | DispatchError_ConsumerRemaining | DispatchError_Corruption | DispatchError_Exhausted | DispatchError_Module | DispatchError_NoProviders | DispatchError_Other | DispatchError_Token | DispatchError_TooManyConsumers | DispatchError_Transactional | DispatchError_Unavailable

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

export type TokenError = TokenError_BelowMinimum | TokenError_CannotCreate | TokenError_Frozen | TokenError_NoFunds | TokenError_UnknownAsset | TokenError_Unsupported | TokenError_WouldDie

export interface TokenError_BelowMinimum {
    __kind: 'BelowMinimum'
}

export interface TokenError_CannotCreate {
    __kind: 'CannotCreate'
}

export interface TokenError_Frozen {
    __kind: 'Frozen'
}

export interface TokenError_NoFunds {
    __kind: 'NoFunds'
}

export interface TokenError_UnknownAsset {
    __kind: 'UnknownAsset'
}

export interface TokenError_Unsupported {
    __kind: 'Unsupported'
}

export interface TokenError_WouldDie {
    __kind: 'WouldDie'
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type UnknownTokensEvent = UnknownTokensEvent_Deposited | UnknownTokensEvent_Withdrawn

/**
 * Deposit success.
 */
export interface UnknownTokensEvent_Deposited {
    __kind: 'Deposited'
    asset: V3MultiAsset
    who: V3MultiLocation
}

/**
 * Withdraw success.
 */
export interface UnknownTokensEvent_Withdrawn {
    __kind: 'Withdrawn'
    asset: V3MultiAsset
    who: V3MultiLocation
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
    data: BoundedVec
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
    data: BoundedVec
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

export type BoundedVec = Bytes

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type TreasuryEvent = TreasuryEvent_Awarded | TreasuryEvent_Burnt | TreasuryEvent_Deposit | TreasuryEvent_Proposed | TreasuryEvent_Rejected | TreasuryEvent_Rollover | TreasuryEvent_SpendApproved | TreasuryEvent_Spending | TreasuryEvent_UpdatedInactive

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
 * New proposal.
 */
export interface TreasuryEvent_Proposed {
    __kind: 'Proposed'
    proposalIndex: number
}

/**
 * A proposal was rejected; funds were slashed.
 */
export interface TreasuryEvent_Rejected {
    __kind: 'Rejected'
    proposalIndex: number
    slashed: bigint
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type TokensEvent = TokensEvent_BalanceSet | TokensEvent_Deposited | TokensEvent_DustLost | TokensEvent_Endowed | TokensEvent_LockRemoved | TokensEvent_LockSet | TokensEvent_Locked | TokensEvent_ReserveRepatriated | TokensEvent_Reserved | TokensEvent_Slashed | TokensEvent_TotalIssuanceSet | TokensEvent_Transfer | TokensEvent_Unlocked | TokensEvent_Unreserved | TokensEvent_Withdrawn

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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
export type SystemEvent = SystemEvent_CodeUpdated | SystemEvent_ExtrinsicFailed | SystemEvent_ExtrinsicSuccess | SystemEvent_KilledAccount | SystemEvent_NewAccount | SystemEvent_Remarked

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

export interface DispatchInfo {
    weight: Weight
    class: DispatchClass
    paysFee: Pays
}

export type Pays = Pays_No | Pays_Yes

export interface Pays_No {
    __kind: 'No'
}

export interface Pays_Yes {
    __kind: 'Yes'
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

export type FixedU128 = bigint

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type StableswapEvent = StableswapEvent_AmplificationChanging | StableswapEvent_BuyExecuted | StableswapEvent_FeeUpdated | StableswapEvent_LiquidityAdded | StableswapEvent_LiquidityRemoved | StableswapEvent_PoolCreated | StableswapEvent_SellExecuted | StableswapEvent_TradableStateUpdated

/**
 * AAmplification of a pool has been scheduled to change.
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
 * Pool parameters has been updated.
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
 * Sell trade executed. Trade fee paid in asset leaving the pool (already subtracted from amount_out).
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
 * Aseet's tradable state has been updated.
 */
export interface StableswapEvent_TradableStateUpdated {
    __kind: 'TradableStateUpdated'
    poolId: number
    assetId: number
    state: Type_101
}

export interface Type_101 {
    bits: number
}

export interface AssetAmount {
    assetId: number
    amount: bigint
}

export type Permill = number

export type NonZeroU16 = number

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
export type SchedulerEvent = SchedulerEvent_CallUnavailable | SchedulerEvent_Canceled | SchedulerEvent_Dispatched | SchedulerEvent_PeriodicFailed | SchedulerEvent_PermanentlyOverweight | SchedulerEvent_Scheduled

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
 * Scheduled some task.
 */
export interface SchedulerEvent_Scheduled {
    __kind: 'Scheduled'
    when: number
    index: number
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type RouterEvent = RouterEvent_RouteExecuted

/**
 * The route with trades has been successfully executed
 */
export interface RouterEvent_RouteExecuted {
    __kind: 'RouteExecuted'
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type PolkadotXcmEvent = PolkadotXcmEvent_AssetsClaimed | PolkadotXcmEvent_AssetsTrapped | PolkadotXcmEvent_Attempted | PolkadotXcmEvent_FeesPaid | PolkadotXcmEvent_InvalidQuerier | PolkadotXcmEvent_InvalidQuerierVersion | PolkadotXcmEvent_InvalidResponder | PolkadotXcmEvent_InvalidResponderVersion | PolkadotXcmEvent_Notified | PolkadotXcmEvent_NotifyDecodeFailed | PolkadotXcmEvent_NotifyDispatchError | PolkadotXcmEvent_NotifyOverweight | PolkadotXcmEvent_NotifyTargetMigrationFail | PolkadotXcmEvent_NotifyTargetSendFail | PolkadotXcmEvent_ResponseReady | PolkadotXcmEvent_ResponseTaken | PolkadotXcmEvent_Sent | PolkadotXcmEvent_SupportedVersionChanged | PolkadotXcmEvent_UnexpectedResponse | PolkadotXcmEvent_VersionChangeNotified | PolkadotXcmEvent_VersionNotifyRequested | PolkadotXcmEvent_VersionNotifyStarted | PolkadotXcmEvent_VersionNotifyUnrequested

/**
 * Some assets have been claimed from an asset trap
 * 
 * \[ hash, origin, assets \]
 */
export interface PolkadotXcmEvent_AssetsClaimed {
    __kind: 'AssetsClaimed'
    value: [H256, V3MultiLocation, VersionedMultiAssets]
}

/**
 * Some assets have been placed in an asset trap.
 * 
 * \[ hash, origin, assets \]
 */
export interface PolkadotXcmEvent_AssetsTrapped {
    __kind: 'AssetsTrapped'
    value: [H256, V3MultiLocation, VersionedMultiAssets]
}

/**
 * Execution of an XCM message was attempted.
 * 
 * \[ outcome \]
 */
export interface PolkadotXcmEvent_Attempted {
    __kind: 'Attempted'
    value: V3Outcome
}

/**
 * Fees were paid from a location for an operation (often for using `SendXcm`).
 * 
 * \[ paying location, fees \]
 */
export interface PolkadotXcmEvent_FeesPaid {
    __kind: 'FeesPaid'
    value: [V3MultiLocation, V3MultiAsset[]]
}

/**
 * Expected query response has been received but the querier location of the response does
 * not match the expected. The query remains registered for a later, valid, response to
 * be received and acted upon.
 * 
 * \[ origin location, id, expected querier, maybe actual querier \]
 */
export interface PolkadotXcmEvent_InvalidQuerier {
    __kind: 'InvalidQuerier'
    value: [V3MultiLocation, bigint, V3MultiLocation, (V3MultiLocation | undefined)]
}

/**
 * Expected query response has been received but the expected querier location placed in
 * storage by this runtime previously cannot be decoded. The query remains registered.
 * 
 * This is unexpected (since a location placed in storage in a previously executing
 * runtime should be readable prior to query timeout) and dangerous since the possibly
 * valid response will be dropped. Manual governance intervention is probably going to be
 * needed.
 * 
 * \[ origin location, id \]
 */
export interface PolkadotXcmEvent_InvalidQuerierVersion {
    __kind: 'InvalidQuerierVersion'
    value: [V3MultiLocation, bigint]
}

/**
 * Expected query response has been received but the origin location of the response does
 * not match that expected. The query remains registered for a later, valid, response to
 * be received and acted upon.
 * 
 * \[ origin location, id, expected location \]
 */
export interface PolkadotXcmEvent_InvalidResponder {
    __kind: 'InvalidResponder'
    value: [V3MultiLocation, bigint, (V3MultiLocation | undefined)]
}

/**
 * Expected query response has been received but the expected origin location placed in
 * storage by this runtime previously cannot be decoded. The query remains registered.
 * 
 * This is unexpected (since a location placed in storage in a previously executing
 * runtime should be readable prior to query timeout) and dangerous since the possibly
 * valid response will be dropped. Manual governance intervention is probably going to be
 * needed.
 * 
 * \[ origin location, id \]
 */
export interface PolkadotXcmEvent_InvalidResponderVersion {
    __kind: 'InvalidResponderVersion'
    value: [V3MultiLocation, bigint]
}

/**
 * Query response has been received and query is removed. The registered notification has
 * been dispatched and executed successfully.
 * 
 * \[ id, pallet index, call index \]
 */
export interface PolkadotXcmEvent_Notified {
    __kind: 'Notified'
    value: [bigint, number, number]
}

/**
 * Query response has been received and query is removed. The dispatch was unable to be
 * decoded into a `Call`; this might be due to dispatch function having a signature which
 * is not `(origin, QueryId, Response)`.
 * 
 * \[ id, pallet index, call index \]
 */
export interface PolkadotXcmEvent_NotifyDecodeFailed {
    __kind: 'NotifyDecodeFailed'
    value: [bigint, number, number]
}

/**
 * Query response has been received and query is removed. There was a general error with
 * dispatching the notification call.
 * 
 * \[ id, pallet index, call index \]
 */
export interface PolkadotXcmEvent_NotifyDispatchError {
    __kind: 'NotifyDispatchError'
    value: [bigint, number, number]
}

/**
 * Query response has been received and query is removed. The registered notification could
 * not be dispatched because the dispatch weight is greater than the maximum weight
 * originally budgeted by this runtime for the query result.
 * 
 * \[ id, pallet index, call index, actual weight, max budgeted weight \]
 */
export interface PolkadotXcmEvent_NotifyOverweight {
    __kind: 'NotifyOverweight'
    value: [bigint, number, number, Weight, Weight]
}

/**
 * A given location which had a version change subscription was dropped owing to an error
 * migrating the location to our new XCM format.
 * 
 * \[ location, query ID \]
 */
export interface PolkadotXcmEvent_NotifyTargetMigrationFail {
    __kind: 'NotifyTargetMigrationFail'
    value: [VersionedMultiLocation, bigint]
}

/**
 * A given location which had a version change subscription was dropped owing to an error
 * sending the notification to it.
 * 
 * \[ location, query ID, error \]
 */
export interface PolkadotXcmEvent_NotifyTargetSendFail {
    __kind: 'NotifyTargetSendFail'
    value: [V3MultiLocation, bigint, V3Error]
}

/**
 * Query response has been received and is ready for taking with `take_response`. There is
 * no registered notification call.
 * 
 * \[ id, response \]
 */
export interface PolkadotXcmEvent_ResponseReady {
    __kind: 'ResponseReady'
    value: [bigint, V3Response]
}

/**
 * Received query response has been read and removed.
 * 
 * \[ id \]
 */
export interface PolkadotXcmEvent_ResponseTaken {
    __kind: 'ResponseTaken'
    value: bigint
}

/**
 * A XCM message was sent.
 * 
 * \[ origin, destination, message \]
 */
export interface PolkadotXcmEvent_Sent {
    __kind: 'Sent'
    value: [V3MultiLocation, V3MultiLocation, V3Instruction[]]
}

/**
 * The supported version of a location has been changed. This might be through an
 * automatic notification or a manual intervention.
 * 
 * \[ location, XCM version \]
 */
export interface PolkadotXcmEvent_SupportedVersionChanged {
    __kind: 'SupportedVersionChanged'
    value: [V3MultiLocation, number]
}

/**
 * Query response received which does not match a registered query. This may be because a
 * matching query was never registered, it may be because it is a duplicate response, or
 * because the query timed out.
 * 
 * \[ origin location, id \]
 */
export interface PolkadotXcmEvent_UnexpectedResponse {
    __kind: 'UnexpectedResponse'
    value: [V3MultiLocation, bigint]
}

/**
 * An XCM version change notification message has been attempted to be sent.
 * 
 * The cost of sending it (borne by the chain) is included.
 * 
 * \[ destination, result, cost \]
 */
export interface PolkadotXcmEvent_VersionChangeNotified {
    __kind: 'VersionChangeNotified'
    value: [V3MultiLocation, number, V3MultiAsset[]]
}

/**
 * We have requested that a remote chain sends us XCM version change notifications.
 * 
 * \[ destination location, cost \]
 */
export interface PolkadotXcmEvent_VersionNotifyRequested {
    __kind: 'VersionNotifyRequested'
    value: [V3MultiLocation, V3MultiAsset[]]
}

/**
 * A remote has requested XCM version change notification from us and we have honored it.
 * A version information message is sent to them and its cost is included.
 * 
 * \[ destination location, cost \]
 */
export interface PolkadotXcmEvent_VersionNotifyStarted {
    __kind: 'VersionNotifyStarted'
    value: [V3MultiLocation, V3MultiAsset[]]
}

/**
 * We have requested that a remote chain stops sending us XCM version change notifications.
 * 
 * \[ destination location, cost \]
 */
export interface PolkadotXcmEvent_VersionNotifyUnrequested {
    __kind: 'VersionNotifyUnrequested'
    value: [V3MultiLocation, V3MultiAsset[]]
}

export type V3Instruction = V3Instruction_AliasOrigin | V3Instruction_BurnAsset | V3Instruction_BuyExecution | V3Instruction_ClaimAsset | V3Instruction_ClearError | V3Instruction_ClearOrigin | V3Instruction_ClearTopic | V3Instruction_ClearTransactStatus | V3Instruction_DepositAsset | V3Instruction_DepositReserveAsset | V3Instruction_DescendOrigin | V3Instruction_ExchangeAsset | V3Instruction_ExpectAsset | V3Instruction_ExpectError | V3Instruction_ExpectOrigin | V3Instruction_ExpectPallet | V3Instruction_ExpectTransactStatus | V3Instruction_ExportMessage | V3Instruction_HrmpChannelAccepted | V3Instruction_HrmpChannelClosing | V3Instruction_HrmpNewChannelOpenRequest | V3Instruction_InitiateReserveWithdraw | V3Instruction_InitiateTeleport | V3Instruction_LockAsset | V3Instruction_NoteUnlockable | V3Instruction_QueryPallet | V3Instruction_QueryResponse | V3Instruction_ReceiveTeleportedAsset | V3Instruction_RefundSurplus | V3Instruction_ReportError | V3Instruction_ReportHolding | V3Instruction_ReportTransactStatus | V3Instruction_RequestUnlock | V3Instruction_ReserveAssetDeposited | V3Instruction_SetAppendix | V3Instruction_SetErrorHandler | V3Instruction_SetFeesMode | V3Instruction_SetTopic | V3Instruction_SubscribeVersion | V3Instruction_Transact | V3Instruction_TransferAsset | V3Instruction_TransferReserveAsset | V3Instruction_Trap | V3Instruction_UniversalOrigin | V3Instruction_UnlockAsset | V3Instruction_UnpaidExecution | V3Instruction_UnsubscribeVersion | V3Instruction_WithdrawAsset

export interface V3Instruction_AliasOrigin {
    __kind: 'AliasOrigin'
    value: V3MultiLocation
}

export interface V3Instruction_BurnAsset {
    __kind: 'BurnAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V3MultiAsset
    weightLimit: V3WeightLimit
}

export interface V3Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V3MultiAsset[]
    ticket: V3MultiLocation
}

export interface V3Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V3Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V3Instruction_ClearTopic {
    __kind: 'ClearTopic'
}

export interface V3Instruction_ClearTransactStatus {
    __kind: 'ClearTransactStatus'
}

export interface V3Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V3MultiAssetFilter
    beneficiary: V3MultiLocation
}

export interface V3Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V3Junctions
}

export interface V3Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V3MultiAssetFilter
    want: V3MultiAsset[]
    maximal: boolean
}

export interface V3Instruction_ExpectAsset {
    __kind: 'ExpectAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_ExpectError {
    __kind: 'ExpectError'
    value?: ([number, V3Error] | undefined)
}

export interface V3Instruction_ExpectOrigin {
    __kind: 'ExpectOrigin'
    value?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ExpectPallet {
    __kind: 'ExpectPallet'
    index: number
    name: Bytes
    moduleName: Bytes
    crateMajor: number
    minCrateMinor: number
}

export interface V3Instruction_ExpectTransactStatus {
    __kind: 'ExpectTransactStatus'
    value: V3MaybeErrorCode
}

export interface V3Instruction_ExportMessage {
    __kind: 'ExportMessage'
    network: V3NetworkId
    destination: V3Junctions
    xcm: V3Instruction[]
}

export interface V3Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V3Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V3Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V3Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V3MultiAssetFilter
    reserve: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V3MultiAssetFilter
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_LockAsset {
    __kind: 'LockAsset'
    asset: V3MultiAsset
    unlocker: V3MultiLocation
}

export interface V3Instruction_NoteUnlockable {
    __kind: 'NoteUnlockable'
    asset: V3MultiAsset
    owner: V3MultiLocation
}

export interface V3Instruction_QueryPallet {
    __kind: 'QueryPallet'
    moduleName: Bytes
    responseInfo: V3QueryResponseInfo
}

export interface V3Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V3Response
    maxWeight: Weight
    querier?: (V3MultiLocation | undefined)
}

export interface V3Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V3MultiAsset[]
}

export interface V3Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V3Instruction_ReportError {
    __kind: 'ReportError'
    value: V3QueryResponseInfo
}

export interface V3Instruction_ReportHolding {
    __kind: 'ReportHolding'
    responseInfo: V3QueryResponseInfo
    assets: V3MultiAssetFilter
}

export interface V3Instruction_ReportTransactStatus {
    __kind: 'ReportTransactStatus'
    value: V3QueryResponseInfo
}

export interface V3Instruction_RequestUnlock {
    __kind: 'RequestUnlock'
    asset: V3MultiAsset
    locker: V3MultiLocation
}

export interface V3Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V3MultiAsset[]
}

export interface V3Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V3Instruction[]
}

export interface V3Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V3Instruction[]
}

export interface V3Instruction_SetFeesMode {
    __kind: 'SetFeesMode'
    jitWithdraw: boolean
}

export interface V3Instruction_SetTopic {
    __kind: 'SetTopic'
    value: Bytes
}

export interface V3Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: Weight
}

export interface V3Instruction_Transact {
    __kind: 'Transact'
    originKind: V2OriginKind
    requireWeightAtMost: Weight
    call: DoubleEncoded
}

export interface V3Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V3MultiAsset[]
    beneficiary: V3MultiLocation
}

export interface V3Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V3MultiAsset[]
    dest: V3MultiLocation
    xcm: V3Instruction[]
}

export interface V3Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V3Instruction_UniversalOrigin {
    __kind: 'UniversalOrigin'
    value: V3Junction
}

export interface V3Instruction_UnlockAsset {
    __kind: 'UnlockAsset'
    asset: V3MultiAsset
    target: V3MultiLocation
}

export interface V3Instruction_UnpaidExecution {
    __kind: 'UnpaidExecution'
    weightLimit: V3WeightLimit
    checkOrigin?: (V3MultiLocation | undefined)
}

export interface V3Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V3Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V3MultiAsset[]
}

export interface DoubleEncoded {
    encoded: Bytes
}

export type V2OriginKind = V2OriginKind_Native | V2OriginKind_SovereignAccount | V2OriginKind_Superuser | V2OriginKind_Xcm

export interface V2OriginKind_Native {
    __kind: 'Native'
}

export interface V2OriginKind_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface V2OriginKind_Superuser {
    __kind: 'Superuser'
}

export interface V2OriginKind_Xcm {
    __kind: 'Xcm'
}

export interface V3QueryResponseInfo {
    destination: V3MultiLocation
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

export type V3MultiAssetFilter = V3MultiAssetFilter_Definite | V3MultiAssetFilter_Wild

export interface V3MultiAssetFilter_Definite {
    __kind: 'Definite'
    value: V3MultiAsset[]
}

export interface V3MultiAssetFilter_Wild {
    __kind: 'Wild'
    value: V3WildMultiAsset
}

export type V3WildMultiAsset = V3WildMultiAsset_All | V3WildMultiAsset_AllCounted | V3WildMultiAsset_AllOf | V3WildMultiAsset_AllOfCounted

export interface V3WildMultiAsset_All {
    __kind: 'All'
}

export interface V3WildMultiAsset_AllCounted {
    __kind: 'AllCounted'
    value: number
}

export interface V3WildMultiAsset_AllOf {
    __kind: 'AllOf'
    id: V3AssetId
    fun: V3WildFungibility
}

export interface V3WildMultiAsset_AllOfCounted {
    __kind: 'AllOfCounted'
    id: V3AssetId
    fun: V3WildFungibility
    count: number
}

export type V3WildFungibility = V3WildFungibility_Fungible | V3WildFungibility_NonFungible

export interface V3WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V3WildFungibility_NonFungible {
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

export type V3Response = V3Response_Assets | V3Response_DispatchResult | V3Response_ExecutionResult | V3Response_Null | V3Response_PalletsInfo | V3Response_Version

export interface V3Response_Assets {
    __kind: 'Assets'
    value: V3MultiAsset[]
}

export interface V3Response_DispatchResult {
    __kind: 'DispatchResult'
    value: V3MaybeErrorCode
}

export interface V3Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V3Error] | undefined)
}

export interface V3Response_Null {
    __kind: 'Null'
}

export interface V3Response_PalletsInfo {
    __kind: 'PalletsInfo'
    value: V3PalletInfo[]
}

export interface V3Response_Version {
    __kind: 'Version'
    value: number
}

export interface V3PalletInfo {
    index: number
    name: Bytes
    moduleName: Bytes
    major: number
    minor: number
    patch: number
}

export type VersionedMultiLocation = VersionedMultiLocation_V2 | VersionedMultiLocation_V3

export interface VersionedMultiLocation_V2 {
    __kind: 'V2'
    value: V2MultiLocation
}

export interface VersionedMultiLocation_V3 {
    __kind: 'V3'
    value: V3MultiLocation
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

export type V3Outcome = V3Outcome_Complete | V3Outcome_Error | V3Outcome_Incomplete

export interface V3Outcome_Complete {
    __kind: 'Complete'
    value: Weight
}

export interface V3Outcome_Error {
    __kind: 'Error'
    value: V3Error
}

export interface V3Outcome_Incomplete {
    __kind: 'Incomplete'
    value: [Weight, V3Error]
}

export type VersionedMultiAssets = VersionedMultiAssets_V2 | VersionedMultiAssets_V3

export interface VersionedMultiAssets_V2 {
    __kind: 'V2'
    value: V2MultiAsset[]
}

export interface VersionedMultiAssets_V3 {
    __kind: 'V3'
    value: V3MultiAsset[]
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type ParachainSystemEvent = ParachainSystemEvent_DownwardMessagesProcessed | ParachainSystemEvent_DownwardMessagesReceived | ParachainSystemEvent_UpgradeAuthorized | ParachainSystemEvent_UpwardMessageSent | ParachainSystemEvent_ValidationFunctionApplied | ParachainSystemEvent_ValidationFunctionDiscarded | ParachainSystemEvent_ValidationFunctionStored

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
 * An upgrade has been authorized.
 */
export interface ParachainSystemEvent_UpgradeAuthorized {
    __kind: 'UpgradeAuthorized'
    codeHash: H256
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type OrmlXcmEvent = OrmlXcmEvent_Sent

/**
 * XCM message sent. \[to, message\]
 */
export interface OrmlXcmEvent_Sent {
    __kind: 'Sent'
    to: V3MultiLocation
    message: V3Instruction[]
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type OmnipoolLiquidityMiningEvent = OmnipoolLiquidityMiningEvent_DepositDestroyed | OmnipoolLiquidityMiningEvent_GlobalFarmCreated | OmnipoolLiquidityMiningEvent_GlobalFarmTerminated | OmnipoolLiquidityMiningEvent_RewardClaimed | OmnipoolLiquidityMiningEvent_SharesDeposited | OmnipoolLiquidityMiningEvent_SharesRedeposited | OmnipoolLiquidityMiningEvent_SharesWithdrawn | OmnipoolLiquidityMiningEvent_YieldFarmCreated | OmnipoolLiquidityMiningEvent_YieldFarmResumed | OmnipoolLiquidityMiningEvent_YieldFarmStopped | OmnipoolLiquidityMiningEvent_YieldFarmTerminated | OmnipoolLiquidityMiningEvent_YieldFarmUpdated

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

export interface LoyaltyCurve {
    initialRewardPercentage: FixedU128
    scaleCoef: number
}

export type Perquintill = bigint

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type OmnipoolEvent = OmnipoolEvent_AssetRefunded | OmnipoolEvent_AssetWeightCapUpdated | OmnipoolEvent_BuyExecuted | OmnipoolEvent_LiquidityAdded | OmnipoolEvent_LiquidityRemoved | OmnipoolEvent_PositionCreated | OmnipoolEvent_PositionDestroyed | OmnipoolEvent_PositionUpdated | OmnipoolEvent_ProtocolLiquidityRemoved | OmnipoolEvent_SellExecuted | OmnipoolEvent_TVLCapUpdated | OmnipoolEvent_TokenAdded | OmnipoolEvent_TokenRemoved | OmnipoolEvent_TradableStateUpdated

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
 */
export interface OmnipoolEvent_BuyExecuted {
    __kind: 'BuyExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
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
 * Liquidity of an asset was removed to Omnipool.
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
 * LP Position was created and NFT instance minted.
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
 * Liquidity of an asset was removed to Omnipool.
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
 */
export interface OmnipoolEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
    assetFeeAmount: bigint
    protocolFeeAmount: bigint
}

/**
 * TVL cap has been updated.
 */
export interface OmnipoolEvent_TVLCapUpdated {
    __kind: 'TVLCapUpdated'
    cap: bigint
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
 * Aseet's tradable state has been updated.
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 */
export interface OTCEvent_Filled {
    __kind: 'Filled'
    orderId: number
    who: AccountId32
    amountIn: bigint
    amountOut: bigint
}

/**
 * An Order has been partially filled
 */
export interface OTCEvent_PartiallyFilled {
    __kind: 'PartiallyFilled'
    orderId: number
    who: AccountId32
    amountIn: bigint
    amountOut: bigint
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type LBPEvent = LBPEvent_BuyExecuted | LBPEvent_LiquidityAdded | LBPEvent_LiquidityRemoved | LBPEvent_PoolCreated | LBPEvent_PoolUpdated | LBPEvent_SellExecuted

/**
 * Purchase executed.
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type IdentityEvent = IdentityEvent_IdentityCleared | IdentityEvent_IdentityKilled | IdentityEvent_IdentitySet | IdentityEvent_JudgementGiven | IdentityEvent_JudgementRequested | IdentityEvent_JudgementUnrequested | IdentityEvent_RegistrarAdded | IdentityEvent_SubIdentityAdded | IdentityEvent_SubIdentityRemoved | IdentityEvent_SubIdentityRevoked

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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type EmaOracleEvent = never

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type DynamicFeesEvent = never

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type DmpQueueEvent = DmpQueueEvent_ExecutedDownward | DmpQueueEvent_InvalidFormat | DmpQueueEvent_MaxMessagesExhausted | DmpQueueEvent_OverweightEnqueued | DmpQueueEvent_OverweightServiced | DmpQueueEvent_UnsupportedVersion | DmpQueueEvent_WeightExhausted

/**
 * Downward message executed with the given outcome.
 */
export interface DmpQueueEvent_ExecutedDownward {
    __kind: 'ExecutedDownward'
    messageId: Bytes
    outcome: V3Outcome
}

/**
 * Downward message is invalid XCM.
 */
export interface DmpQueueEvent_InvalidFormat {
    __kind: 'InvalidFormat'
    messageId: Bytes
}

/**
 * The maximum number of downward messages was.
 */
export interface DmpQueueEvent_MaxMessagesExhausted {
    __kind: 'MaxMessagesExhausted'
    messageId: Bytes
}

/**
 * Downward message is overweight and was placed in the overweight queue.
 */
export interface DmpQueueEvent_OverweightEnqueued {
    __kind: 'OverweightEnqueued'
    messageId: Bytes
    overweightIndex: bigint
    requiredWeight: Weight
}

/**
 * Downward message from the overweight queue was executed.
 */
export interface DmpQueueEvent_OverweightServiced {
    __kind: 'OverweightServiced'
    overweightIndex: bigint
    weightUsed: Weight
}

/**
 * Downward message is unsupported version of XCM.
 */
export interface DmpQueueEvent_UnsupportedVersion {
    __kind: 'UnsupportedVersion'
    messageId: Bytes
}

/**
 * The weight limit for handling downward messages was reached.
 */
export interface DmpQueueEvent_WeightExhausted {
    __kind: 'WeightExhausted'
    messageId: Bytes
    remainingWeight: Weight
    requiredWeight: Weight
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type DemocracyEvent = DemocracyEvent_Blacklisted | DemocracyEvent_Cancelled | DemocracyEvent_Delegated | DemocracyEvent_ExternalTabled | DemocracyEvent_NotPassed | DemocracyEvent_Passed | DemocracyEvent_ProposalCanceled | DemocracyEvent_Proposed | DemocracyEvent_Seconded | DemocracyEvent_Started | DemocracyEvent_Tabled | DemocracyEvent_Undelegated | DemocracyEvent_Vetoed | DemocracyEvent_Voted

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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type CumulusXcmEvent = CumulusXcmEvent_ExecutedDownward | CumulusXcmEvent_InvalidFormat | CumulusXcmEvent_UnsupportedVersion

/**
 * Downward message executed with the given outcome.
 * \[ id, outcome \]
 */
export interface CumulusXcmEvent_ExecutedDownward {
    __kind: 'ExecutedDownward'
    value: [Bytes, V3Outcome]
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type CollatorSelectionEvent = CollatorSelectionEvent_CandidateAdded | CollatorSelectionEvent_CandidateRemoved | CollatorSelectionEvent_NewCandidacyBond | CollatorSelectionEvent_NewDesiredCandidates | CollatorSelectionEvent_NewInvulnerables

export interface CollatorSelectionEvent_CandidateAdded {
    __kind: 'CandidateAdded'
    accountId: AccountId32
    deposit: bigint
}

export interface CollatorSelectionEvent_CandidateRemoved {
    __kind: 'CandidateRemoved'
    accountId: AccountId32
}

export interface CollatorSelectionEvent_NewCandidacyBond {
    __kind: 'NewCandidacyBond'
    bondAmount: bigint
}

export interface CollatorSelectionEvent_NewDesiredCandidates {
    __kind: 'NewDesiredCandidates'
    desiredCandidates: number
}

export interface CollatorSelectionEvent_NewInvulnerables {
    __kind: 'NewInvulnerables'
    invulnerables: AccountId32[]
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type ClaimsEvent = ClaimsEvent_Claim

export interface ClaimsEvent_Claim {
    __kind: 'Claim'
    value: [AccountId32, EthereumAddress, bigint]
}

export type EthereumAddress = Bytes

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type BalancesEvent = BalancesEvent_BalanceSet | BalancesEvent_Deposit | BalancesEvent_DustLost | BalancesEvent_Endowed | BalancesEvent_ReserveRepatriated | BalancesEvent_Reserved | BalancesEvent_Slashed | BalancesEvent_Transfer | BalancesEvent_Unreserved | BalancesEvent_Withdraw

/**
 * A balance was set by root.
 */
export interface BalancesEvent_BalanceSet {
    __kind: 'BalanceSet'
    who: AccountId32
    free: bigint
    reserved: bigint
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
 * Some amount was removed from the account (e.g. for misbehavior).
 */
export interface BalancesEvent_Slashed {
    __kind: 'Slashed'
    who: AccountId32
    amount: bigint
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
 * Some balance was unreserved (moved from reserved to free).
 */
export interface BalancesEvent_Unreserved {
    __kind: 'Unreserved'
    who: AccountId32
    amount: bigint
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type AssetRegistryEvent = AssetRegistryEvent_LocationSet | AssetRegistryEvent_MetadataSet | AssetRegistryEvent_Registered | AssetRegistryEvent_Updated

/**
 * Native location set for an asset.
 */
export interface AssetRegistryEvent_LocationSet {
    __kind: 'LocationSet'
    assetId: number
    location: AssetLocation
}

/**
 * Metadata set for an asset.
 */
export interface AssetRegistryEvent_MetadataSet {
    __kind: 'MetadataSet'
    assetId: number
    symbol: Bytes
    decimals: number
}

/**
 * Asset was registered.
 */
export interface AssetRegistryEvent_Registered {
    __kind: 'Registered'
    assetId: number
    assetName: Bytes
    assetType: AssetType
}

/**
 * Asset was updated.
 */
export interface AssetRegistryEvent_Updated {
    __kind: 'Updated'
    assetId: number
    assetName: Bytes
    assetType: AssetType
    existentialDeposit: bigint
    xcmRateLimit?: (bigint | undefined)
}

export type AssetType = AssetType_Bond | AssetType_PoolShare | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
}

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
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
        CircuitBreaker: CircuitBreakerEvent,
        Claims: ClaimsEvent,
        CollatorRewards: CollatorRewardsEvent,
        CollatorSelection: CollatorSelectionEvent,
        Council: CouncilEvent,
        CumulusXcm: CumulusXcmEvent,
        Currencies: CurrenciesEvent,
        DCA: DCAEvent,
        Democracy: DemocracyEvent,
        DmpQueue: DmpQueueEvent,
        Duster: DusterEvent,
        DynamicFees: DynamicFeesEvent,
        Elections: ElectionsEvent,
        EmaOracle: EmaOracleEvent,
        Identity: IdentityEvent,
        LBP: LBPEvent,
        MultiTransactionPayment: MultiTransactionPaymentEvent,
        Multisig: MultisigEvent,
        OTC: OTCEvent,
        Omnipool: OmnipoolEvent,
        OmnipoolLiquidityMining: OmnipoolLiquidityMiningEvent,
        OmnipoolWarehouseLM: OmnipoolWarehouseLMEvent,
        OrmlXcm: OrmlXcmEvent,
        ParachainSystem: ParachainSystemEvent,
        PolkadotXcm: PolkadotXcmEvent,
        Preimage: PreimageEvent,
        Proxy: ProxyEvent,
        RelayChainInfo: RelayChainInfoEvent,
        Router: RouterEvent,
        Scheduler: SchedulerEvent,
        Session: SessionEvent,
        Stableswap: StableswapEvent,
        Staking: StakingEvent,
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
        XTokens: XTokensEvent,
        XYK: XYKEvent,
        XcmpQueue: XcmpQueueEvent,
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const XcmpQueueEvent: sts.Type<XcmpQueueEvent> = sts.closedEnum(() => {
    return  {
        BadFormat: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
        }),
        BadVersion: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
        }),
        Fail: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
            error: V3Error,
            weight: Weight,
        }),
        OverweightEnqueued: sts.enumStruct({
            sender: Id,
            sentAt: sts.number(),
            index: sts.bigint(),
            required: Weight,
        }),
        OverweightServiced: sts.enumStruct({
            index: sts.bigint(),
            used: Weight,
        }),
        Success: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
            weight: Weight,
        }),
        XcmDeferred: sts.enumStruct({
            sender: Id,
            sentAt: sts.number(),
            deferredTo: sts.number(),
            messageHash: sts.option(() => sts.bytes()),
        }),
        XcmDeferredQueueFull: sts.unit(),
        XcmpMessageSent: sts.enumStruct({
            messageHash: sts.option(() => sts.bytes()),
        }),
    }
})

export const Id = sts.number()

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
        proofSize: sts.bigint(),
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

export const AccountId32 = sts.bytes()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const XTokensEvent: sts.Type<XTokensEvent> = sts.closedEnum(() => {
    return  {
        TransferredMultiAssets: sts.enumStruct({
            sender: AccountId32,
            assets: sts.array(() => V3MultiAsset),
            fee: V3MultiAsset,
            dest: V3MultiLocation,
        }),
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
        Rococo: sts.unit(),
        Westend: sts.unit(),
        Wococo: sts.unit(),
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
        CannotCreate: sts.unit(),
        Frozen: sts.unit(),
        NoFunds: sts.unit(),
        UnknownAsset: sts.unit(),
        Unsupported: sts.unit(),
        WouldDie: sts.unit(),
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const UnknownTokensEvent: sts.Type<UnknownTokensEvent> = sts.closedEnum(() => {
    return  {
        Deposited: sts.enumStruct({
            asset: V3MultiAsset,
            who: V3MultiLocation,
        }),
        Withdrawn: sts.enumStruct({
            asset: V3MultiAsset,
            who: V3MultiLocation,
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
            data: BoundedVec,
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
            data: BoundedVec,
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

export const BoundedVec = sts.bytes()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const TreasuryEvent: sts.Type<TreasuryEvent> = sts.closedEnum(() => {
    return  {
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
        Proposed: sts.enumStruct({
            proposalIndex: sts.number(),
        }),
        Rejected: sts.enumStruct({
            proposalIndex: sts.number(),
            slashed: sts.bigint(),
        }),
        Rollover: sts.enumStruct({
            rolloverBalance: sts.bigint(),
        }),
        SpendApproved: sts.enumStruct({
            proposalIndex: sts.number(),
            amount: sts.bigint(),
            beneficiary: AccountId32,
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
    }
})

export const DispatchInfo: sts.Type<DispatchInfo> = sts.struct(() => {
    return  {
        weight: Weight,
        class: DispatchClass,
        paysFee: Pays,
    }
})

export const Pays: sts.Type<Pays> = sts.closedEnum(() => {
    return  {
        No: sts.unit(),
        Yes: sts.unit(),
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

export const FixedU128 = sts.bigint()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
            state: Type_101,
        }),
    }
})

export const Type_101: sts.Type<Type_101> = sts.struct(() => {
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

export const Permill = sts.number()

export const NonZeroU16 = sts.number()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
        Scheduled: sts.enumStruct({
            when: sts.number(),
            index: sts.number(),
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const RouterEvent: sts.Type<RouterEvent> = sts.closedEnum(() => {
    return  {
        RouteExecuted: sts.enumStruct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const PolkadotXcmEvent: sts.Type<PolkadotXcmEvent> = sts.closedEnum(() => {
    return  {
        AssetsClaimed: sts.tuple(() => [H256, V3MultiLocation, VersionedMultiAssets]),
        AssetsTrapped: sts.tuple(() => [H256, V3MultiLocation, VersionedMultiAssets]),
        Attempted: V3Outcome,
        FeesPaid: sts.tuple(() => [V3MultiLocation, sts.array(() => V3MultiAsset)]),
        InvalidQuerier: sts.tuple(() => [V3MultiLocation, sts.bigint(), V3MultiLocation, sts.option(() => V3MultiLocation)]),
        InvalidQuerierVersion: sts.tuple(() => [V3MultiLocation, sts.bigint()]),
        InvalidResponder: sts.tuple(() => [V3MultiLocation, sts.bigint(), sts.option(() => V3MultiLocation)]),
        InvalidResponderVersion: sts.tuple(() => [V3MultiLocation, sts.bigint()]),
        Notified: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyDecodeFailed: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyDispatchError: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyOverweight: sts.tuple(() => [sts.bigint(), sts.number(), sts.number(), Weight, Weight]),
        NotifyTargetMigrationFail: sts.tuple(() => [VersionedMultiLocation, sts.bigint()]),
        NotifyTargetSendFail: sts.tuple(() => [V3MultiLocation, sts.bigint(), V3Error]),
        ResponseReady: sts.tuple(() => [sts.bigint(), V3Response]),
        ResponseTaken: sts.bigint(),
        Sent: sts.tuple(() => [V3MultiLocation, V3MultiLocation, sts.array(() => V3Instruction)]),
        SupportedVersionChanged: sts.tuple(() => [V3MultiLocation, sts.number()]),
        UnexpectedResponse: sts.tuple(() => [V3MultiLocation, sts.bigint()]),
        VersionChangeNotified: sts.tuple(() => [V3MultiLocation, sts.number(), sts.array(() => V3MultiAsset)]),
        VersionNotifyRequested: sts.tuple(() => [V3MultiLocation, sts.array(() => V3MultiAsset)]),
        VersionNotifyStarted: sts.tuple(() => [V3MultiLocation, sts.array(() => V3MultiAsset)]),
        VersionNotifyUnrequested: sts.tuple(() => [V3MultiLocation, sts.array(() => V3MultiAsset)]),
    }
})

export const V3Instruction: sts.Type<V3Instruction> = sts.closedEnum(() => {
    return  {
        AliasOrigin: V3MultiLocation,
        BurnAsset: sts.array(() => V3MultiAsset),
        BuyExecution: sts.enumStruct({
            fees: V3MultiAsset,
            weightLimit: V3WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            ticket: V3MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        ClearTopic: sts.unit(),
        ClearTransactStatus: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            beneficiary: V3MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        DescendOrigin: V3Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V3MultiAssetFilter,
            want: sts.array(() => V3MultiAsset),
            maximal: sts.boolean(),
        }),
        ExpectAsset: sts.array(() => V3MultiAsset),
        ExpectError: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        ExpectOrigin: sts.option(() => V3MultiLocation),
        ExpectPallet: sts.enumStruct({
            index: sts.number(),
            name: sts.bytes(),
            moduleName: sts.bytes(),
            crateMajor: sts.number(),
            minCrateMinor: sts.number(),
        }),
        ExpectTransactStatus: V3MaybeErrorCode,
        ExportMessage: sts.enumStruct({
            network: V3NetworkId,
            destination: V3Junctions,
            xcm: sts.array(() => V3Instruction),
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
            assets: V3MultiAssetFilter,
            reserve: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V3MultiAssetFilter,
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        LockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            unlocker: V3MultiLocation,
        }),
        NoteUnlockable: sts.enumStruct({
            asset: V3MultiAsset,
            owner: V3MultiLocation,
        }),
        QueryPallet: sts.enumStruct({
            moduleName: sts.bytes(),
            responseInfo: V3QueryResponseInfo,
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V3Response,
            maxWeight: Weight,
            querier: sts.option(() => V3MultiLocation),
        }),
        ReceiveTeleportedAsset: sts.array(() => V3MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: V3QueryResponseInfo,
        ReportHolding: sts.enumStruct({
            responseInfo: V3QueryResponseInfo,
            assets: V3MultiAssetFilter,
        }),
        ReportTransactStatus: V3QueryResponseInfo,
        RequestUnlock: sts.enumStruct({
            asset: V3MultiAsset,
            locker: V3MultiLocation,
        }),
        ReserveAssetDeposited: sts.array(() => V3MultiAsset),
        SetAppendix: sts.array(() => V3Instruction),
        SetErrorHandler: sts.array(() => V3Instruction),
        SetFeesMode: sts.enumStruct({
            jitWithdraw: sts.boolean(),
        }),
        SetTopic: sts.bytes(),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: Weight,
        }),
        Transact: sts.enumStruct({
            originKind: V2OriginKind,
            requireWeightAtMost: Weight,
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            beneficiary: V3MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V3MultiAsset),
            dest: V3MultiLocation,
            xcm: sts.array(() => V3Instruction),
        }),
        Trap: sts.bigint(),
        UniversalOrigin: V3Junction,
        UnlockAsset: sts.enumStruct({
            asset: V3MultiAsset,
            target: V3MultiLocation,
        }),
        UnpaidExecution: sts.enumStruct({
            weightLimit: V3WeightLimit,
            checkOrigin: sts.option(() => V3MultiLocation),
        }),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V3MultiAsset),
    }
})

export const DoubleEncoded: sts.Type<DoubleEncoded> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export const V2OriginKind: sts.Type<V2OriginKind> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export const V3QueryResponseInfo: sts.Type<V3QueryResponseInfo> = sts.struct(() => {
    return  {
        destination: V3MultiLocation,
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

export const V3MultiAssetFilter: sts.Type<V3MultiAssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V3MultiAsset),
        Wild: V3WildMultiAsset,
    }
})

export const V3WildMultiAsset: sts.Type<V3WildMultiAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllCounted: sts.number(),
        AllOf: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
        }),
        AllOfCounted: sts.enumStruct({
            id: V3AssetId,
            fun: V3WildFungibility,
            count: sts.number(),
        }),
    }
})

export const V3WildFungibility: sts.Type<V3WildFungibility> = sts.closedEnum(() => {
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

export const V3Response: sts.Type<V3Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V3MultiAsset),
        DispatchResult: V3MaybeErrorCode,
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V3Error])),
        Null: sts.unit(),
        PalletsInfo: sts.array(() => V3PalletInfo),
        Version: sts.number(),
    }
})

export const V3PalletInfo: sts.Type<V3PalletInfo> = sts.struct(() => {
    return  {
        index: sts.number(),
        name: sts.bytes(),
        moduleName: sts.bytes(),
        major: sts.number(),
        minor: sts.number(),
        patch: sts.number(),
    }
})

export const VersionedMultiLocation: sts.Type<VersionedMultiLocation> = sts.closedEnum(() => {
    return  {
        V2: V2MultiLocation,
        V3: V3MultiLocation,
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

export const V3Outcome: sts.Type<V3Outcome> = sts.closedEnum(() => {
    return  {
        Complete: Weight,
        Error: V3Error,
        Incomplete: sts.tuple(() => [Weight, V3Error]),
    }
})

export const VersionedMultiAssets: sts.Type<VersionedMultiAssets> = sts.closedEnum(() => {
    return  {
        V2: sts.array(() => V2MultiAsset),
        V3: sts.array(() => V3MultiAsset),
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
        UpgradeAuthorized: sts.enumStruct({
            codeHash: H256,
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const OrmlXcmEvent: sts.Type<OrmlXcmEvent> = sts.closedEnum(() => {
    return  {
        Sent: sts.enumStruct({
            to: V3MultiLocation,
            message: sts.array(() => V3Instruction),
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

export const LoyaltyCurve: sts.Type<LoyaltyCurve> = sts.struct(() => {
    return  {
        initialRewardPercentage: FixedU128,
        scaleCoef: sts.number(),
    }
})

export const Perquintill = sts.bigint()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        }),
        TVLCapUpdated: sts.enumStruct({
            cap: sts.bigint(),
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
        }),
        PartiallyFilled: sts.enumStruct({
            orderId: sts.number(),
            who: AccountId32,
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const IdentityEvent: sts.Type<IdentityEvent> = sts.closedEnum(() => {
    return  {
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
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const EmaOracleEvent: sts.Type<EmaOracleEvent> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const DynamicFeesEvent: sts.Type<DynamicFeesEvent> = sts.closedEnum(() => {
    return  {
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const DmpQueueEvent: sts.Type<DmpQueueEvent> = sts.closedEnum(() => {
    return  {
        ExecutedDownward: sts.enumStruct({
            messageId: sts.bytes(),
            outcome: V3Outcome,
        }),
        InvalidFormat: sts.enumStruct({
            messageId: sts.bytes(),
        }),
        MaxMessagesExhausted: sts.enumStruct({
            messageId: sts.bytes(),
        }),
        OverweightEnqueued: sts.enumStruct({
            messageId: sts.bytes(),
            overweightIndex: sts.bigint(),
            requiredWeight: Weight,
        }),
        OverweightServiced: sts.enumStruct({
            overweightIndex: sts.bigint(),
            weightUsed: Weight,
        }),
        UnsupportedVersion: sts.enumStruct({
            messageId: sts.bytes(),
        }),
        WeightExhausted: sts.enumStruct({
            messageId: sts.bytes(),
            remainingWeight: Weight,
            requiredWeight: Weight,
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const CumulusXcmEvent: sts.Type<CumulusXcmEvent> = sts.closedEnum(() => {
    return  {
        ExecutedDownward: sts.tuple(() => [sts.bytes(), V3Outcome]),
        InvalidFormat: sts.bytes(),
        UnsupportedVersion: sts.bytes(),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const CollatorSelectionEvent: sts.Type<CollatorSelectionEvent> = sts.closedEnum(() => {
    return  {
        CandidateAdded: sts.enumStruct({
            accountId: AccountId32,
            deposit: sts.bigint(),
        }),
        CandidateRemoved: sts.enumStruct({
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const ClaimsEvent: sts.Type<ClaimsEvent> = sts.closedEnum(() => {
    return  {
        Claim: sts.tuple(() => [AccountId32, EthereumAddress, sts.bigint()]),
    }
})

export const EthereumAddress = sts.bytes()

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
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
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const BalancesEvent: sts.Type<BalancesEvent> = sts.closedEnum(() => {
    return  {
        BalanceSet: sts.enumStruct({
            who: AccountId32,
            free: sts.bigint(),
            reserved: sts.bigint(),
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
        Slashed: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Transfer: sts.enumStruct({
            from: AccountId32,
            to: AccountId32,
            amount: sts.bigint(),
        }),
        Unreserved: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
        Withdraw: sts.enumStruct({
            who: AccountId32,
            amount: sts.bigint(),
        }),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const AssetRegistryEvent: sts.Type<AssetRegistryEvent> = sts.closedEnum(() => {
    return  {
        LocationSet: sts.enumStruct({
            assetId: sts.number(),
            location: AssetLocation,
        }),
        MetadataSet: sts.enumStruct({
            assetId: sts.number(),
            symbol: sts.bytes(),
            decimals: sts.number(),
        }),
        Registered: sts.enumStruct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: AssetType,
        }),
        Updated: sts.enumStruct({
            assetId: sts.number(),
            assetName: sts.bytes(),
            assetType: AssetType,
            existentialDeposit: sts.bigint(),
            xcmRateLimit: sts.option(() => sts.bigint()),
        }),
    }
})

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
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
