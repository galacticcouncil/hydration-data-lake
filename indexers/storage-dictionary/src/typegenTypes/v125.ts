import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface EventRecord {
    phase: Phase
    event: Event
    topics: H256[]
}

export type H256 = Bytes

export type Event = Event_AssetRegistry | Event_Balances | Event_Claims | Event_CollatorRewards | Event_CollatorSelection | Event_Council | Event_CumulusXcm | Event_Currencies | Event_Democracy | Event_DmpQueue | Event_Elections | Event_Identity | Event_MultiTransactionPayment | Event_Multisig | Event_Omnipool | Event_OrmlXcm | Event_ParachainSystem | Event_PolkadotXcm | Event_Preimage | Event_Proxy | Event_RelayChainInfo | Event_Scheduler | Event_Session | Event_System | Event_TechnicalCommittee | Event_Tips | Event_Tokens | Event_TransactionPause | Event_TransactionPayment | Event_Treasury | Event_Uniques | Event_UnknownTokens | Event_Utility | Event_Vesting | Event_XTokens | Event_XcmpQueue

export interface Event_AssetRegistry {
    __kind: 'AssetRegistry'
    value: AssetRegistryEvent
}

export interface Event_Balances {
    __kind: 'Balances'
    value: BalancesEvent
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

export interface Event_Democracy {
    __kind: 'Democracy'
    value: DemocracyEvent
}

export interface Event_DmpQueue {
    __kind: 'DmpQueue'
    value: DmpQueueEvent
}

export interface Event_Elections {
    __kind: 'Elections'
    value: ElectionsEvent
}

export interface Event_Identity {
    __kind: 'Identity'
    value: IdentityEvent
}

export interface Event_MultiTransactionPayment {
    __kind: 'MultiTransactionPayment'
    value: MultiTransactionPaymentEvent
}

export interface Event_Multisig {
    __kind: 'Multisig'
    value: MultisigEvent
}

export interface Event_Omnipool {
    __kind: 'Omnipool'
    value: OmnipoolEvent
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

export interface Event_Scheduler {
    __kind: 'Scheduler'
    value: SchedulerEvent
}

export interface Event_Session {
    __kind: 'Session'
    value: SessionEvent
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

export interface Event_XcmpQueue {
    __kind: 'XcmpQueue'
    value: XcmpQueueEvent
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type XcmpQueueEvent = XcmpQueueEvent_BadFormat | XcmpQueueEvent_BadVersion | XcmpQueueEvent_Fail | XcmpQueueEvent_OverweightEnqueued | XcmpQueueEvent_OverweightServiced | XcmpQueueEvent_Success | XcmpQueueEvent_UpwardMessageSent | XcmpQueueEvent_XcmpMessageSent

/**
 * Bad XCM format used.
 */
export interface XcmpQueueEvent_BadFormat {
    __kind: 'BadFormat'
    messageHash?: (H256 | undefined)
}

/**
 * Bad XCM version used.
 */
export interface XcmpQueueEvent_BadVersion {
    __kind: 'BadVersion'
    messageHash?: (H256 | undefined)
}

/**
 * Some XCM failed.
 */
export interface XcmpQueueEvent_Fail {
    __kind: 'Fail'
    messageHash?: (H256 | undefined)
    error: V2Error
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
    messageHash?: (H256 | undefined)
    weight: Weight
}

/**
 * An upward message was sent to the relay chain.
 */
export interface XcmpQueueEvent_UpwardMessageSent {
    __kind: 'UpwardMessageSent'
    messageHash?: (H256 | undefined)
}

/**
 * An HRMP message was sent to a sibling parachain.
 */
export interface XcmpQueueEvent_XcmpMessageSent {
    __kind: 'XcmpMessageSent'
    messageHash?: (H256 | undefined)
}

export type Id = number

export interface Weight {
    refTime: bigint
}

export type V2Error = V2Error_AssetNotFound | V2Error_BadOrigin | V2Error_Barrier | V2Error_DestinationUnsupported | V2Error_ExceedsMaxMessageSize | V2Error_FailedToDecode | V2Error_FailedToTransactAsset | V2Error_InvalidLocation | V2Error_LocationCannotHold | V2Error_MaxWeightInvalid | V2Error_MultiLocationFull | V2Error_MultiLocationNotInvertible | V2Error_NotHoldingFees | V2Error_NotWithdrawable | V2Error_Overflow | V2Error_TooExpensive | V2Error_Transport | V2Error_Trap | V2Error_UnhandledXcmVersion | V2Error_Unimplemented | V2Error_UnknownClaim | V2Error_Unroutable | V2Error_UntrustedReserveLocation | V2Error_UntrustedTeleportLocation | V2Error_WeightLimitReached | V2Error_WeightNotComputable

export interface V2Error_AssetNotFound {
    __kind: 'AssetNotFound'
}

export interface V2Error_BadOrigin {
    __kind: 'BadOrigin'
}

export interface V2Error_Barrier {
    __kind: 'Barrier'
}

export interface V2Error_DestinationUnsupported {
    __kind: 'DestinationUnsupported'
}

export interface V2Error_ExceedsMaxMessageSize {
    __kind: 'ExceedsMaxMessageSize'
}

export interface V2Error_FailedToDecode {
    __kind: 'FailedToDecode'
}

export interface V2Error_FailedToTransactAsset {
    __kind: 'FailedToTransactAsset'
}

export interface V2Error_InvalidLocation {
    __kind: 'InvalidLocation'
}

export interface V2Error_LocationCannotHold {
    __kind: 'LocationCannotHold'
}

export interface V2Error_MaxWeightInvalid {
    __kind: 'MaxWeightInvalid'
}

export interface V2Error_MultiLocationFull {
    __kind: 'MultiLocationFull'
}

export interface V2Error_MultiLocationNotInvertible {
    __kind: 'MultiLocationNotInvertible'
}

export interface V2Error_NotHoldingFees {
    __kind: 'NotHoldingFees'
}

export interface V2Error_NotWithdrawable {
    __kind: 'NotWithdrawable'
}

export interface V2Error_Overflow {
    __kind: 'Overflow'
}

export interface V2Error_TooExpensive {
    __kind: 'TooExpensive'
}

export interface V2Error_Transport {
    __kind: 'Transport'
}

export interface V2Error_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V2Error_UnhandledXcmVersion {
    __kind: 'UnhandledXcmVersion'
}

export interface V2Error_Unimplemented {
    __kind: 'Unimplemented'
}

export interface V2Error_UnknownClaim {
    __kind: 'UnknownClaim'
}

export interface V2Error_Unroutable {
    __kind: 'Unroutable'
}

export interface V2Error_UntrustedReserveLocation {
    __kind: 'UntrustedReserveLocation'
}

export interface V2Error_UntrustedTeleportLocation {
    __kind: 'UntrustedTeleportLocation'
}

export interface V2Error_WeightLimitReached {
    __kind: 'WeightLimitReached'
    value: bigint
}

export interface V2Error_WeightNotComputable {
    __kind: 'WeightNotComputable'
}

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
    assets: V1MultiAsset[]
    fee: V1MultiAsset
    dest: V1MultiLocation
}

export interface V1MultiLocation {
    parents: number
    interior: V1Junctions
}

export type V1Junctions = V1Junctions_Here | V1Junctions_X1 | V1Junctions_X2 | V1Junctions_X3 | V1Junctions_X4 | V1Junctions_X5 | V1Junctions_X6 | V1Junctions_X7 | V1Junctions_X8

export interface V1Junctions_Here {
    __kind: 'Here'
}

export interface V1Junctions_X1 {
    __kind: 'X1'
    value: V1Junction
}

export interface V1Junctions_X2 {
    __kind: 'X2'
    value: [V1Junction, V1Junction]
}

export interface V1Junctions_X3 {
    __kind: 'X3'
    value: [V1Junction, V1Junction, V1Junction]
}

export interface V1Junctions_X4 {
    __kind: 'X4'
    value: [V1Junction, V1Junction, V1Junction, V1Junction]
}

export interface V1Junctions_X5 {
    __kind: 'X5'
    value: [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]
}

export interface V1Junctions_X6 {
    __kind: 'X6'
    value: [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]
}

export interface V1Junctions_X7 {
    __kind: 'X7'
    value: [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]
}

export interface V1Junctions_X8 {
    __kind: 'X8'
    value: [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]
}

export type V1Junction = V1Junction_AccountId32 | V1Junction_AccountIndex64 | V1Junction_AccountKey20 | V1Junction_GeneralIndex | V1Junction_GeneralKey | V1Junction_OnlyChild | V1Junction_PalletInstance | V1Junction_Parachain | V1Junction_Plurality

export interface V1Junction_AccountId32 {
    __kind: 'AccountId32'
    network: V0NetworkId
    id: Bytes
}

export interface V1Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: V0NetworkId
    index: bigint
}

export interface V1Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network: V0NetworkId
    key: Bytes
}

export interface V1Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V1Junction_GeneralKey {
    __kind: 'GeneralKey'
    value: WeakBoundedVec
}

export interface V1Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V1Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V1Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V1Junction_Plurality {
    __kind: 'Plurality'
    id: V0BodyId
    part: V0BodyPart
}

export type V0BodyPart = V0BodyPart_AtLeastProportion | V0BodyPart_Fraction | V0BodyPart_Members | V0BodyPart_MoreThanProportion | V0BodyPart_Voice

export interface V0BodyPart_AtLeastProportion {
    __kind: 'AtLeastProportion'
    nom: number
    denom: number
}

export interface V0BodyPart_Fraction {
    __kind: 'Fraction'
    nom: number
    denom: number
}

export interface V0BodyPart_Members {
    __kind: 'Members'
    count: number
}

export interface V0BodyPart_MoreThanProportion {
    __kind: 'MoreThanProportion'
    nom: number
    denom: number
}

export interface V0BodyPart_Voice {
    __kind: 'Voice'
}

export type V0BodyId = V0BodyId_Executive | V0BodyId_Index | V0BodyId_Judicial | V0BodyId_Legislative | V0BodyId_Named | V0BodyId_Technical | V0BodyId_Unit

export interface V0BodyId_Executive {
    __kind: 'Executive'
}

export interface V0BodyId_Index {
    __kind: 'Index'
    value: number
}

export interface V0BodyId_Judicial {
    __kind: 'Judicial'
}

export interface V0BodyId_Legislative {
    __kind: 'Legislative'
}

export interface V0BodyId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V0BodyId_Technical {
    __kind: 'Technical'
}

export interface V0BodyId_Unit {
    __kind: 'Unit'
}

export type WeakBoundedVec = Bytes

export type V0NetworkId = V0NetworkId_Any | V0NetworkId_Kusama | V0NetworkId_Named | V0NetworkId_Polkadot

export interface V0NetworkId_Any {
    __kind: 'Any'
}

export interface V0NetworkId_Kusama {
    __kind: 'Kusama'
}

export interface V0NetworkId_Named {
    __kind: 'Named'
    value: WeakBoundedVec
}

export interface V0NetworkId_Polkadot {
    __kind: 'Polkadot'
}

export interface V1MultiAsset {
    id: V1AssetId
    fun: V1Fungibility
}

export type V1Fungibility = V1Fungibility_Fungible | V1Fungibility_NonFungible

export interface V1Fungibility_Fungible {
    __kind: 'Fungible'
    value: bigint
}

export interface V1Fungibility_NonFungible {
    __kind: 'NonFungible'
    value: V1AssetInstance
}

export type V1AssetInstance = V1AssetInstance_Array16 | V1AssetInstance_Array32 | V1AssetInstance_Array4 | V1AssetInstance_Array8 | V1AssetInstance_Blob | V1AssetInstance_Index | V1AssetInstance_Undefined

export interface V1AssetInstance_Array16 {
    __kind: 'Array16'
    value: Bytes
}

export interface V1AssetInstance_Array32 {
    __kind: 'Array32'
    value: Bytes
}

export interface V1AssetInstance_Array4 {
    __kind: 'Array4'
    value: Bytes
}

export interface V1AssetInstance_Array8 {
    __kind: 'Array8'
    value: Bytes
}

export interface V1AssetInstance_Blob {
    __kind: 'Blob'
    value: Bytes
}

export interface V1AssetInstance_Index {
    __kind: 'Index'
    value: bigint
}

export interface V1AssetInstance_Undefined {
    __kind: 'Undefined'
}

export type V1AssetId = V1AssetId_Abstract | V1AssetId_Concrete

export interface V1AssetId_Abstract {
    __kind: 'Abstract'
    value: Bytes
}

export interface V1AssetId_Concrete {
    __kind: 'Concrete'
    value: V1MultiLocation
}

export type AccountId32 = Bytes

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

export type DispatchError = DispatchError_Arithmetic | DispatchError_BadOrigin | DispatchError_CannotLookup | DispatchError_ConsumerRemaining | DispatchError_Module | DispatchError_NoProviders | DispatchError_Other | DispatchError_Token | DispatchError_TooManyConsumers | DispatchError_Transactional

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
    asset: V1MultiAsset
    who: V1MultiLocation
}

/**
 * Withdraw success.
 */
export interface UnknownTokensEvent_Withdrawn {
    __kind: 'Withdrawn'
    asset: V1MultiAsset
    who: V1MultiLocation
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
export type TreasuryEvent = TreasuryEvent_Awarded | TreasuryEvent_Burnt | TreasuryEvent_Deposit | TreasuryEvent_Proposed | TreasuryEvent_Rejected | TreasuryEvent_Rollover | TreasuryEvent_SpendApproved | TreasuryEvent_Spending

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
export type TokensEvent = TokensEvent_BalanceSet | TokensEvent_Deposited | TokensEvent_DustLost | TokensEvent_Endowed | TokensEvent_LockRemoved | TokensEvent_LockSet | TokensEvent_ReserveRepatriated | TokensEvent_Reserved | TokensEvent_Slashed | TokensEvent_TotalIssuanceSet | TokensEvent_Transfer | TokensEvent_Unreserved | TokensEvent_Withdrawn

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
export type SchedulerEvent = SchedulerEvent_CallLookupFailed | SchedulerEvent_Canceled | SchedulerEvent_Dispatched | SchedulerEvent_Scheduled

/**
 * The call for the provided hash was not found so the task has been aborted.
 */
export interface SchedulerEvent_CallLookupFailed {
    __kind: 'CallLookupFailed'
    task: [number, number]
    id?: (Bytes | undefined)
    error: LookupError
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
 * Scheduled some task.
 */
export interface SchedulerEvent_Scheduled {
    __kind: 'Scheduled'
    when: number
    index: number
}

export type LookupError = LookupError_BadFormat | LookupError_Unknown

export interface LookupError_BadFormat {
    __kind: 'BadFormat'
}

export interface LookupError_Unknown {
    __kind: 'Unknown'
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
export type ProxyEvent = ProxyEvent_Announced | ProxyEvent_AnonymousCreated | ProxyEvent_ProxyAdded | ProxyEvent_ProxyExecuted | ProxyEvent_ProxyRemoved

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
 * Anonymous account has been created by new proxy with given
 * disambiguation index and proxy type.
 */
export interface ProxyEvent_AnonymousCreated {
    __kind: 'AnonymousCreated'
    anonymous: AccountId32
    who: AccountId32
    proxyType: ProxyType
    disambiguationIndex: number
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

export type ProxyType = ProxyType_Any | ProxyType_CancelProxy | ProxyType_Governance | ProxyType_Transfer

export interface ProxyType_Any {
    __kind: 'Any'
}

export interface ProxyType_CancelProxy {
    __kind: 'CancelProxy'
}

export interface ProxyType_Governance {
    __kind: 'Governance'
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
export type PolkadotXcmEvent = PolkadotXcmEvent_AssetsTrapped | PolkadotXcmEvent_Attempted | PolkadotXcmEvent_InvalidResponder | PolkadotXcmEvent_InvalidResponderVersion | PolkadotXcmEvent_Notified | PolkadotXcmEvent_NotifyDecodeFailed | PolkadotXcmEvent_NotifyDispatchError | PolkadotXcmEvent_NotifyOverweight | PolkadotXcmEvent_NotifyTargetMigrationFail | PolkadotXcmEvent_NotifyTargetSendFail | PolkadotXcmEvent_ResponseReady | PolkadotXcmEvent_ResponseTaken | PolkadotXcmEvent_Sent | PolkadotXcmEvent_SupportedVersionChanged | PolkadotXcmEvent_UnexpectedResponse | PolkadotXcmEvent_VersionChangeNotified

/**
 * Some assets have been placed in an asset trap.
 * 
 * \[ hash, origin, assets \]
 */
export interface PolkadotXcmEvent_AssetsTrapped {
    __kind: 'AssetsTrapped'
    value: [H256, V1MultiLocation, VersionedMultiAssets]
}

/**
 * Execution of an XCM message was attempted.
 * 
 * \[ outcome \]
 */
export interface PolkadotXcmEvent_Attempted {
    __kind: 'Attempted'
    value: V2Outcome
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
    value: [V1MultiLocation, bigint, (V1MultiLocation | undefined)]
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
    value: [V1MultiLocation, bigint]
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
    value: [V1MultiLocation, bigint, V2Error]
}

/**
 * Query response has been received and is ready for taking with `take_response`. There is
 * no registered notification call.
 * 
 * \[ id, response \]
 */
export interface PolkadotXcmEvent_ResponseReady {
    __kind: 'ResponseReady'
    value: [bigint, V2Response]
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
    value: [V1MultiLocation, V1MultiLocation, V2Instruction[]]
}

/**
 * The supported version of a location has been changed. This might be through an
 * automatic notification or a manual intervention.
 * 
 * \[ location, XCM version \]
 */
export interface PolkadotXcmEvent_SupportedVersionChanged {
    __kind: 'SupportedVersionChanged'
    value: [V1MultiLocation, number]
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
    value: [V1MultiLocation, bigint]
}

/**
 * An XCM version change notification message has been attempted to be sent.
 * 
 * \[ destination, result \]
 */
export interface PolkadotXcmEvent_VersionChangeNotified {
    __kind: 'VersionChangeNotified'
    value: [V1MultiLocation, number]
}

export type V2Instruction = V2Instruction_BuyExecution | V2Instruction_ClaimAsset | V2Instruction_ClearError | V2Instruction_ClearOrigin | V2Instruction_DepositAsset | V2Instruction_DepositReserveAsset | V2Instruction_DescendOrigin | V2Instruction_ExchangeAsset | V2Instruction_HrmpChannelAccepted | V2Instruction_HrmpChannelClosing | V2Instruction_HrmpNewChannelOpenRequest | V2Instruction_InitiateReserveWithdraw | V2Instruction_InitiateTeleport | V2Instruction_QueryHolding | V2Instruction_QueryResponse | V2Instruction_ReceiveTeleportedAsset | V2Instruction_RefundSurplus | V2Instruction_ReportError | V2Instruction_ReserveAssetDeposited | V2Instruction_SetAppendix | V2Instruction_SetErrorHandler | V2Instruction_SubscribeVersion | V2Instruction_Transact | V2Instruction_TransferAsset | V2Instruction_TransferReserveAsset | V2Instruction_Trap | V2Instruction_UnsubscribeVersion | V2Instruction_WithdrawAsset

export interface V2Instruction_BuyExecution {
    __kind: 'BuyExecution'
    fees: V1MultiAsset
    weightLimit: V2WeightLimit
}

export interface V2Instruction_ClaimAsset {
    __kind: 'ClaimAsset'
    assets: V1MultiAsset[]
    ticket: V1MultiLocation
}

export interface V2Instruction_ClearError {
    __kind: 'ClearError'
}

export interface V2Instruction_ClearOrigin {
    __kind: 'ClearOrigin'
}

export interface V2Instruction_DepositAsset {
    __kind: 'DepositAsset'
    assets: V1MultiAssetFilter
    maxAssets: number
    beneficiary: V1MultiLocation
}

export interface V2Instruction_DepositReserveAsset {
    __kind: 'DepositReserveAsset'
    assets: V1MultiAssetFilter
    maxAssets: number
    dest: V1MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_DescendOrigin {
    __kind: 'DescendOrigin'
    value: V1Junctions
}

export interface V2Instruction_ExchangeAsset {
    __kind: 'ExchangeAsset'
    give: V1MultiAssetFilter
    receive: V1MultiAsset[]
}

export interface V2Instruction_HrmpChannelAccepted {
    __kind: 'HrmpChannelAccepted'
    recipient: number
}

export interface V2Instruction_HrmpChannelClosing {
    __kind: 'HrmpChannelClosing'
    initiator: number
    sender: number
    recipient: number
}

export interface V2Instruction_HrmpNewChannelOpenRequest {
    __kind: 'HrmpNewChannelOpenRequest'
    sender: number
    maxMessageSize: number
    maxCapacity: number
}

export interface V2Instruction_InitiateReserveWithdraw {
    __kind: 'InitiateReserveWithdraw'
    assets: V1MultiAssetFilter
    reserve: V1MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_InitiateTeleport {
    __kind: 'InitiateTeleport'
    assets: V1MultiAssetFilter
    dest: V1MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_QueryHolding {
    __kind: 'QueryHolding'
    queryId: bigint
    dest: V1MultiLocation
    assets: V1MultiAssetFilter
    maxResponseWeight: bigint
}

export interface V2Instruction_QueryResponse {
    __kind: 'QueryResponse'
    queryId: bigint
    response: V2Response
    maxWeight: bigint
}

export interface V2Instruction_ReceiveTeleportedAsset {
    __kind: 'ReceiveTeleportedAsset'
    value: V1MultiAsset[]
}

export interface V2Instruction_RefundSurplus {
    __kind: 'RefundSurplus'
}

export interface V2Instruction_ReportError {
    __kind: 'ReportError'
    queryId: bigint
    dest: V1MultiLocation
    maxResponseWeight: bigint
}

export interface V2Instruction_ReserveAssetDeposited {
    __kind: 'ReserveAssetDeposited'
    value: V1MultiAsset[]
}

export interface V2Instruction_SetAppendix {
    __kind: 'SetAppendix'
    value: V2Instruction[]
}

export interface V2Instruction_SetErrorHandler {
    __kind: 'SetErrorHandler'
    value: V2Instruction[]
}

export interface V2Instruction_SubscribeVersion {
    __kind: 'SubscribeVersion'
    queryId: bigint
    maxResponseWeight: bigint
}

export interface V2Instruction_Transact {
    __kind: 'Transact'
    originType: V0OriginKind
    requireWeightAtMost: bigint
    call: DoubleEncoded
}

export interface V2Instruction_TransferAsset {
    __kind: 'TransferAsset'
    assets: V1MultiAsset[]
    beneficiary: V1MultiLocation
}

export interface V2Instruction_TransferReserveAsset {
    __kind: 'TransferReserveAsset'
    assets: V1MultiAsset[]
    dest: V1MultiLocation
    xcm: V2Instruction[]
}

export interface V2Instruction_Trap {
    __kind: 'Trap'
    value: bigint
}

export interface V2Instruction_UnsubscribeVersion {
    __kind: 'UnsubscribeVersion'
}

export interface V2Instruction_WithdrawAsset {
    __kind: 'WithdrawAsset'
    value: V1MultiAsset[]
}

export interface DoubleEncoded {
    encoded: Bytes
}

export type V0OriginKind = V0OriginKind_Native | V0OriginKind_SovereignAccount | V0OriginKind_Superuser | V0OriginKind_Xcm

export interface V0OriginKind_Native {
    __kind: 'Native'
}

export interface V0OriginKind_SovereignAccount {
    __kind: 'SovereignAccount'
}

export interface V0OriginKind_Superuser {
    __kind: 'Superuser'
}

export interface V0OriginKind_Xcm {
    __kind: 'Xcm'
}

export type V1MultiAssetFilter = V1MultiAssetFilter_Definite | V1MultiAssetFilter_Wild

export interface V1MultiAssetFilter_Definite {
    __kind: 'Definite'
    value: V1MultiAsset[]
}

export interface V1MultiAssetFilter_Wild {
    __kind: 'Wild'
    value: V1WildMultiAsset
}

export type V1WildMultiAsset = V1WildMultiAsset_All | V1WildMultiAsset_AllOf

export interface V1WildMultiAsset_All {
    __kind: 'All'
}

export interface V1WildMultiAsset_AllOf {
    __kind: 'AllOf'
    id: V1AssetId
    fun: V1WildFungibility
}

export type V1WildFungibility = V1WildFungibility_Fungible | V1WildFungibility_NonFungible

export interface V1WildFungibility_Fungible {
    __kind: 'Fungible'
}

export interface V1WildFungibility_NonFungible {
    __kind: 'NonFungible'
}

export type V2WeightLimit = V2WeightLimit_Limited | V2WeightLimit_Unlimited

export interface V2WeightLimit_Limited {
    __kind: 'Limited'
    value: bigint
}

export interface V2WeightLimit_Unlimited {
    __kind: 'Unlimited'
}

export type V2Response = V2Response_Assets | V2Response_ExecutionResult | V2Response_Null | V2Response_Version

export interface V2Response_Assets {
    __kind: 'Assets'
    value: V1MultiAsset[]
}

export interface V2Response_ExecutionResult {
    __kind: 'ExecutionResult'
    value?: ([number, V2Error] | undefined)
}

export interface V2Response_Null {
    __kind: 'Null'
}

export interface V2Response_Version {
    __kind: 'Version'
    value: number
}

export type VersionedMultiLocation = VersionedMultiLocation_V0 | VersionedMultiLocation_V1

export interface VersionedMultiLocation_V0 {
    __kind: 'V0'
    value: V0MultiLocation
}

export interface VersionedMultiLocation_V1 {
    __kind: 'V1'
    value: V1MultiLocation
}

export type V0MultiLocation = V0MultiLocation_Null | V0MultiLocation_X1 | V0MultiLocation_X2 | V0MultiLocation_X3 | V0MultiLocation_X4 | V0MultiLocation_X5 | V0MultiLocation_X6 | V0MultiLocation_X7 | V0MultiLocation_X8

export interface V0MultiLocation_Null {
    __kind: 'Null'
}

export interface V0MultiLocation_X1 {
    __kind: 'X1'
    value: V0Junction
}

export interface V0MultiLocation_X2 {
    __kind: 'X2'
    value: [V0Junction, V0Junction]
}

export interface V0MultiLocation_X3 {
    __kind: 'X3'
    value: [V0Junction, V0Junction, V0Junction]
}

export interface V0MultiLocation_X4 {
    __kind: 'X4'
    value: [V0Junction, V0Junction, V0Junction, V0Junction]
}

export interface V0MultiLocation_X5 {
    __kind: 'X5'
    value: [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]
}

export interface V0MultiLocation_X6 {
    __kind: 'X6'
    value: [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]
}

export interface V0MultiLocation_X7 {
    __kind: 'X7'
    value: [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]
}

export interface V0MultiLocation_X8 {
    __kind: 'X8'
    value: [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]
}

export type V0Junction = V0Junction_AccountId32 | V0Junction_AccountIndex64 | V0Junction_AccountKey20 | V0Junction_GeneralIndex | V0Junction_GeneralKey | V0Junction_OnlyChild | V0Junction_PalletInstance | V0Junction_Parachain | V0Junction_Parent | V0Junction_Plurality

export interface V0Junction_AccountId32 {
    __kind: 'AccountId32'
    network: V0NetworkId
    id: Bytes
}

export interface V0Junction_AccountIndex64 {
    __kind: 'AccountIndex64'
    network: V0NetworkId
    index: bigint
}

export interface V0Junction_AccountKey20 {
    __kind: 'AccountKey20'
    network: V0NetworkId
    key: Bytes
}

export interface V0Junction_GeneralIndex {
    __kind: 'GeneralIndex'
    value: bigint
}

export interface V0Junction_GeneralKey {
    __kind: 'GeneralKey'
    value: WeakBoundedVec
}

export interface V0Junction_OnlyChild {
    __kind: 'OnlyChild'
}

export interface V0Junction_PalletInstance {
    __kind: 'PalletInstance'
    value: number
}

export interface V0Junction_Parachain {
    __kind: 'Parachain'
    value: number
}

export interface V0Junction_Parent {
    __kind: 'Parent'
}

export interface V0Junction_Plurality {
    __kind: 'Plurality'
    id: V0BodyId
    part: V0BodyPart
}

export type V2Outcome = V2Outcome_Complete | V2Outcome_Error | V2Outcome_Incomplete

export interface V2Outcome_Complete {
    __kind: 'Complete'
    value: bigint
}

export interface V2Outcome_Error {
    __kind: 'Error'
    value: V2Error
}

export interface V2Outcome_Incomplete {
    __kind: 'Incomplete'
    value: [bigint, V2Error]
}

export type VersionedMultiAssets = VersionedMultiAssets_V0 | VersionedMultiAssets_V1

export interface VersionedMultiAssets_V0 {
    __kind: 'V0'
    value: V0MultiAsset[]
}

export interface VersionedMultiAssets_V1 {
    __kind: 'V1'
    value: V1MultiAsset[]
}

export type V0MultiAsset = V0MultiAsset_AbstractFungible | V0MultiAsset_AbstractNonFungible | V0MultiAsset_All | V0MultiAsset_AllAbstractFungible | V0MultiAsset_AllAbstractNonFungible | V0MultiAsset_AllConcreteFungible | V0MultiAsset_AllConcreteNonFungible | V0MultiAsset_AllFungible | V0MultiAsset_AllNonFungible | V0MultiAsset_ConcreteFungible | V0MultiAsset_ConcreteNonFungible | V0MultiAsset_None

export interface V0MultiAsset_AbstractFungible {
    __kind: 'AbstractFungible'
    id: Bytes
    amount: bigint
}

export interface V0MultiAsset_AbstractNonFungible {
    __kind: 'AbstractNonFungible'
    class: Bytes
    instance: V1AssetInstance
}

export interface V0MultiAsset_All {
    __kind: 'All'
}

export interface V0MultiAsset_AllAbstractFungible {
    __kind: 'AllAbstractFungible'
    id: Bytes
}

export interface V0MultiAsset_AllAbstractNonFungible {
    __kind: 'AllAbstractNonFungible'
    class: Bytes
}

export interface V0MultiAsset_AllConcreteFungible {
    __kind: 'AllConcreteFungible'
    id: V0MultiLocation
}

export interface V0MultiAsset_AllConcreteNonFungible {
    __kind: 'AllConcreteNonFungible'
    class: V0MultiLocation
}

export interface V0MultiAsset_AllFungible {
    __kind: 'AllFungible'
}

export interface V0MultiAsset_AllNonFungible {
    __kind: 'AllNonFungible'
}

export interface V0MultiAsset_ConcreteFungible {
    __kind: 'ConcreteFungible'
    id: V0MultiLocation
    amount: bigint
}

export interface V0MultiAsset_ConcreteNonFungible {
    __kind: 'ConcreteNonFungible'
    class: V0MultiLocation
    instance: V1AssetInstance
}

export interface V0MultiAsset_None {
    __kind: 'None'
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type ParachainSystemEvent = ParachainSystemEvent_DownwardMessagesProcessed | ParachainSystemEvent_DownwardMessagesReceived | ParachainSystemEvent_UpgradeAuthorized | ParachainSystemEvent_ValidationFunctionApplied | ParachainSystemEvent_ValidationFunctionDiscarded | ParachainSystemEvent_ValidationFunctionStored

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
    to: V1MultiLocation
    message: V2Instruction[]
}

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export type OmnipoolEvent = OmnipoolEvent_AssetRefunded | OmnipoolEvent_AssetWeightCapUpdated | OmnipoolEvent_BuyExecuted | OmnipoolEvent_LiquidityAdded | OmnipoolEvent_LiquidityRemoved | OmnipoolEvent_PositionCreated | OmnipoolEvent_PositionDestroyed | OmnipoolEvent_PositionUpdated | OmnipoolEvent_SellExecuted | OmnipoolEvent_TVLCapUpdated | OmnipoolEvent_TokenAdded | OmnipoolEvent_TradableStateUpdated

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
 * Sell trade executed.
 */
export interface OmnipoolEvent_SellExecuted {
    __kind: 'SellExecuted'
    who: AccountId32
    assetIn: number
    assetOut: number
    amountIn: bigint
    amountOut: bigint
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

export type FixedU128 = bigint

export type Permill = number

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
export type DmpQueueEvent = DmpQueueEvent_ExecutedDownward | DmpQueueEvent_InvalidFormat | DmpQueueEvent_OverweightEnqueued | DmpQueueEvent_OverweightServiced | DmpQueueEvent_UnsupportedVersion | DmpQueueEvent_WeightExhausted

/**
 * Downward message executed with the given outcome.
 */
export interface DmpQueueEvent_ExecutedDownward {
    __kind: 'ExecutedDownward'
    messageId: Bytes
    outcome: V2Outcome
}

/**
 * Downward message is invalid XCM.
 */
export interface DmpQueueEvent_InvalidFormat {
    __kind: 'InvalidFormat'
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
export type DemocracyEvent = DemocracyEvent_Blacklisted | DemocracyEvent_Cancelled | DemocracyEvent_Delegated | DemocracyEvent_Executed | DemocracyEvent_ExternalTabled | DemocracyEvent_NotPassed | DemocracyEvent_Passed | DemocracyEvent_PreimageInvalid | DemocracyEvent_PreimageMissing | DemocracyEvent_PreimageNoted | DemocracyEvent_PreimageReaped | DemocracyEvent_PreimageUsed | DemocracyEvent_ProposalCanceled | DemocracyEvent_Proposed | DemocracyEvent_Seconded | DemocracyEvent_Started | DemocracyEvent_Tabled | DemocracyEvent_Undelegated | DemocracyEvent_Vetoed | DemocracyEvent_Voted

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
 * A proposal has been enacted.
 */
export interface DemocracyEvent_Executed {
    __kind: 'Executed'
    refIndex: number
    result: Result<null, DispatchError>
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
 * A proposal could not be executed because its preimage was invalid.
 */
export interface DemocracyEvent_PreimageInvalid {
    __kind: 'PreimageInvalid'
    proposalHash: H256
    refIndex: number
}

/**
 * A proposal could not be executed because its preimage was missing.
 */
export interface DemocracyEvent_PreimageMissing {
    __kind: 'PreimageMissing'
    proposalHash: H256
    refIndex: number
}

/**
 * A proposal's preimage was noted, and the deposit taken.
 */
export interface DemocracyEvent_PreimageNoted {
    __kind: 'PreimageNoted'
    proposalHash: H256
    who: AccountId32
    deposit: bigint
}

/**
 * A registered preimage was removed and the deposit collected by the reaper.
 */
export interface DemocracyEvent_PreimageReaped {
    __kind: 'PreimageReaped'
    proposalHash: H256
    provider: AccountId32
    deposit: bigint
    reaper: AccountId32
}

/**
 * A proposal preimage was removed and used (the deposit was returned).
 */
export interface DemocracyEvent_PreimageUsed {
    __kind: 'PreimageUsed'
    proposalHash: H256
    provider: AccountId32
    deposit: bigint
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
    depositors: AccountId32[]
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
    vote: Vote
    balance: bigint
}

export type Vote = number

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
    value: [Bytes, V2Outcome]
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
}

export type AssetType = AssetType_PoolShare | AssetType_Token

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
}

export interface AssetType_Token {
    __kind: 'Token'
}

export interface AssetLocation {
    parents: number
    interior: V1Junctions
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
        Claims: ClaimsEvent,
        CollatorRewards: CollatorRewardsEvent,
        CollatorSelection: CollatorSelectionEvent,
        Council: CouncilEvent,
        CumulusXcm: CumulusXcmEvent,
        Currencies: CurrenciesEvent,
        Democracy: DemocracyEvent,
        DmpQueue: DmpQueueEvent,
        Elections: ElectionsEvent,
        Identity: IdentityEvent,
        MultiTransactionPayment: MultiTransactionPaymentEvent,
        Multisig: MultisigEvent,
        Omnipool: OmnipoolEvent,
        OrmlXcm: OrmlXcmEvent,
        ParachainSystem: ParachainSystemEvent,
        PolkadotXcm: PolkadotXcmEvent,
        Preimage: PreimageEvent,
        Proxy: ProxyEvent,
        RelayChainInfo: RelayChainInfoEvent,
        Scheduler: SchedulerEvent,
        Session: SessionEvent,
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
            messageHash: sts.option(() => H256),
        }),
        BadVersion: sts.enumStruct({
            messageHash: sts.option(() => H256),
        }),
        Fail: sts.enumStruct({
            messageHash: sts.option(() => H256),
            error: V2Error,
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
            messageHash: sts.option(() => H256),
            weight: Weight,
        }),
        UpwardMessageSent: sts.enumStruct({
            messageHash: sts.option(() => H256),
        }),
        XcmpMessageSent: sts.enumStruct({
            messageHash: sts.option(() => H256),
        }),
    }
})

export const Id = sts.number()

export const Weight: sts.Type<Weight> = sts.struct(() => {
    return  {
        refTime: sts.bigint(),
    }
})

export const V2Error: sts.Type<V2Error> = sts.closedEnum(() => {
    return  {
        AssetNotFound: sts.unit(),
        BadOrigin: sts.unit(),
        Barrier: sts.unit(),
        DestinationUnsupported: sts.unit(),
        ExceedsMaxMessageSize: sts.unit(),
        FailedToDecode: sts.unit(),
        FailedToTransactAsset: sts.unit(),
        InvalidLocation: sts.unit(),
        LocationCannotHold: sts.unit(),
        MaxWeightInvalid: sts.unit(),
        MultiLocationFull: sts.unit(),
        MultiLocationNotInvertible: sts.unit(),
        NotHoldingFees: sts.unit(),
        NotWithdrawable: sts.unit(),
        Overflow: sts.unit(),
        TooExpensive: sts.unit(),
        Transport: sts.unit(),
        Trap: sts.bigint(),
        UnhandledXcmVersion: sts.unit(),
        Unimplemented: sts.unit(),
        UnknownClaim: sts.unit(),
        Unroutable: sts.unit(),
        UntrustedReserveLocation: sts.unit(),
        UntrustedTeleportLocation: sts.unit(),
        WeightLimitReached: sts.bigint(),
        WeightNotComputable: sts.unit(),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/main-docs/build/events-errors/) emitted
			by this pallet.
			
 */
export const XTokensEvent: sts.Type<XTokensEvent> = sts.closedEnum(() => {
    return  {
        TransferredMultiAssets: sts.enumStruct({
            sender: AccountId32,
            assets: sts.array(() => V1MultiAsset),
            fee: V1MultiAsset,
            dest: V1MultiLocation,
        }),
    }
})

export const V1MultiLocation: sts.Type<V1MultiLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V1Junctions,
    }
})

export const V1Junctions: sts.Type<V1Junctions> = sts.closedEnum(() => {
    return  {
        Here: sts.unit(),
        X1: V1Junction,
        X2: sts.tuple(() => [V1Junction, V1Junction]),
        X3: sts.tuple(() => [V1Junction, V1Junction, V1Junction]),
        X4: sts.tuple(() => [V1Junction, V1Junction, V1Junction, V1Junction]),
        X5: sts.tuple(() => [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]),
        X6: sts.tuple(() => [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]),
        X7: sts.tuple(() => [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]),
        X8: sts.tuple(() => [V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction, V1Junction]),
    }
})

export const V1Junction: sts.Type<V1Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: V0NetworkId,
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: V0NetworkId,
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: V0NetworkId,
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: WeakBoundedVec,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Plurality: sts.enumStruct({
            id: V0BodyId,
            part: V0BodyPart,
        }),
    }
})

export const V0BodyPart: sts.Type<V0BodyPart> = sts.closedEnum(() => {
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

export const V0BodyId: sts.Type<V0BodyId> = sts.closedEnum(() => {
    return  {
        Executive: sts.unit(),
        Index: sts.number(),
        Judicial: sts.unit(),
        Legislative: sts.unit(),
        Named: WeakBoundedVec,
        Technical: sts.unit(),
        Unit: sts.unit(),
    }
})

export const WeakBoundedVec = sts.bytes()

export const V0NetworkId: sts.Type<V0NetworkId> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        Kusama: sts.unit(),
        Named: WeakBoundedVec,
        Polkadot: sts.unit(),
    }
})

export const V1MultiAsset: sts.Type<V1MultiAsset> = sts.struct(() => {
    return  {
        id: V1AssetId,
        fun: V1Fungibility,
    }
})

export const V1Fungibility: sts.Type<V1Fungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.bigint(),
        NonFungible: V1AssetInstance,
    }
})

export const V1AssetInstance: sts.Type<V1AssetInstance> = sts.closedEnum(() => {
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

export const V1AssetId: sts.Type<V1AssetId> = sts.closedEnum(() => {
    return  {
        Abstract: sts.bytes(),
        Concrete: V1MultiLocation,
    }
})

export const AccountId32 = sts.bytes()

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
        Module: ModuleError,
        NoProviders: sts.unit(),
        Other: sts.unit(),
        Token: TokenError,
        TooManyConsumers: sts.unit(),
        Transactional: TransactionalError,
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
            asset: V1MultiAsset,
            who: V1MultiLocation,
        }),
        Withdrawn: sts.enumStruct({
            asset: V1MultiAsset,
            who: V1MultiLocation,
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
        CallLookupFailed: sts.enumStruct({
            task: sts.tuple(() => [sts.number(), sts.number()]),
            id: sts.option(() => sts.bytes()),
            error: LookupError,
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
        Scheduled: sts.enumStruct({
            when: sts.number(),
            index: sts.number(),
        }),
    }
})

export const LookupError: sts.Type<LookupError> = sts.closedEnum(() => {
    return  {
        BadFormat: sts.unit(),
        Unknown: sts.unit(),
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
        AnonymousCreated: sts.enumStruct({
            anonymous: AccountId32,
            who: AccountId32,
            proxyType: ProxyType,
            disambiguationIndex: sts.number(),
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
    }
})

export const ProxyType: sts.Type<ProxyType> = sts.closedEnum(() => {
    return  {
        Any: sts.unit(),
        CancelProxy: sts.unit(),
        Governance: sts.unit(),
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
        AssetsTrapped: sts.tuple(() => [H256, V1MultiLocation, VersionedMultiAssets]),
        Attempted: V2Outcome,
        InvalidResponder: sts.tuple(() => [V1MultiLocation, sts.bigint(), sts.option(() => V1MultiLocation)]),
        InvalidResponderVersion: sts.tuple(() => [V1MultiLocation, sts.bigint()]),
        Notified: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyDecodeFailed: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyDispatchError: sts.tuple(() => [sts.bigint(), sts.number(), sts.number()]),
        NotifyOverweight: sts.tuple(() => [sts.bigint(), sts.number(), sts.number(), Weight, Weight]),
        NotifyTargetMigrationFail: sts.tuple(() => [VersionedMultiLocation, sts.bigint()]),
        NotifyTargetSendFail: sts.tuple(() => [V1MultiLocation, sts.bigint(), V2Error]),
        ResponseReady: sts.tuple(() => [sts.bigint(), V2Response]),
        ResponseTaken: sts.bigint(),
        Sent: sts.tuple(() => [V1MultiLocation, V1MultiLocation, sts.array(() => V2Instruction)]),
        SupportedVersionChanged: sts.tuple(() => [V1MultiLocation, sts.number()]),
        UnexpectedResponse: sts.tuple(() => [V1MultiLocation, sts.bigint()]),
        VersionChangeNotified: sts.tuple(() => [V1MultiLocation, sts.number()]),
    }
})

export const V2Instruction: sts.Type<V2Instruction> = sts.closedEnum(() => {
    return  {
        BuyExecution: sts.enumStruct({
            fees: V1MultiAsset,
            weightLimit: V2WeightLimit,
        }),
        ClaimAsset: sts.enumStruct({
            assets: sts.array(() => V1MultiAsset),
            ticket: V1MultiLocation,
        }),
        ClearError: sts.unit(),
        ClearOrigin: sts.unit(),
        DepositAsset: sts.enumStruct({
            assets: V1MultiAssetFilter,
            maxAssets: sts.number(),
            beneficiary: V1MultiLocation,
        }),
        DepositReserveAsset: sts.enumStruct({
            assets: V1MultiAssetFilter,
            maxAssets: sts.number(),
            dest: V1MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        DescendOrigin: V1Junctions,
        ExchangeAsset: sts.enumStruct({
            give: V1MultiAssetFilter,
            receive: sts.array(() => V1MultiAsset),
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
            assets: V1MultiAssetFilter,
            reserve: V1MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        InitiateTeleport: sts.enumStruct({
            assets: V1MultiAssetFilter,
            dest: V1MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        QueryHolding: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V1MultiLocation,
            assets: V1MultiAssetFilter,
            maxResponseWeight: sts.bigint(),
        }),
        QueryResponse: sts.enumStruct({
            queryId: sts.bigint(),
            response: V2Response,
            maxWeight: sts.bigint(),
        }),
        ReceiveTeleportedAsset: sts.array(() => V1MultiAsset),
        RefundSurplus: sts.unit(),
        ReportError: sts.enumStruct({
            queryId: sts.bigint(),
            dest: V1MultiLocation,
            maxResponseWeight: sts.bigint(),
        }),
        ReserveAssetDeposited: sts.array(() => V1MultiAsset),
        SetAppendix: sts.array(() => V2Instruction),
        SetErrorHandler: sts.array(() => V2Instruction),
        SubscribeVersion: sts.enumStruct({
            queryId: sts.bigint(),
            maxResponseWeight: sts.bigint(),
        }),
        Transact: sts.enumStruct({
            originType: V0OriginKind,
            requireWeightAtMost: sts.bigint(),
            call: DoubleEncoded,
        }),
        TransferAsset: sts.enumStruct({
            assets: sts.array(() => V1MultiAsset),
            beneficiary: V1MultiLocation,
        }),
        TransferReserveAsset: sts.enumStruct({
            assets: sts.array(() => V1MultiAsset),
            dest: V1MultiLocation,
            xcm: sts.array(() => V2Instruction),
        }),
        Trap: sts.bigint(),
        UnsubscribeVersion: sts.unit(),
        WithdrawAsset: sts.array(() => V1MultiAsset),
    }
})

export const DoubleEncoded: sts.Type<DoubleEncoded> = sts.struct(() => {
    return  {
        encoded: sts.bytes(),
    }
})

export const V0OriginKind: sts.Type<V0OriginKind> = sts.closedEnum(() => {
    return  {
        Native: sts.unit(),
        SovereignAccount: sts.unit(),
        Superuser: sts.unit(),
        Xcm: sts.unit(),
    }
})

export const V1MultiAssetFilter: sts.Type<V1MultiAssetFilter> = sts.closedEnum(() => {
    return  {
        Definite: sts.array(() => V1MultiAsset),
        Wild: V1WildMultiAsset,
    }
})

export const V1WildMultiAsset: sts.Type<V1WildMultiAsset> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        AllOf: sts.enumStruct({
            id: V1AssetId,
            fun: V1WildFungibility,
        }),
    }
})

export const V1WildFungibility: sts.Type<V1WildFungibility> = sts.closedEnum(() => {
    return  {
        Fungible: sts.unit(),
        NonFungible: sts.unit(),
    }
})

export const V2WeightLimit: sts.Type<V2WeightLimit> = sts.closedEnum(() => {
    return  {
        Limited: sts.bigint(),
        Unlimited: sts.unit(),
    }
})

export const V2Response: sts.Type<V2Response> = sts.closedEnum(() => {
    return  {
        Assets: sts.array(() => V1MultiAsset),
        ExecutionResult: sts.option(() => sts.tuple(() => [sts.number(), V2Error])),
        Null: sts.unit(),
        Version: sts.number(),
    }
})

export const VersionedMultiLocation: sts.Type<VersionedMultiLocation> = sts.closedEnum(() => {
    return  {
        V0: V0MultiLocation,
        V1: V1MultiLocation,
    }
})

export const V0MultiLocation: sts.Type<V0MultiLocation> = sts.closedEnum(() => {
    return  {
        Null: sts.unit(),
        X1: V0Junction,
        X2: sts.tuple(() => [V0Junction, V0Junction]),
        X3: sts.tuple(() => [V0Junction, V0Junction, V0Junction]),
        X4: sts.tuple(() => [V0Junction, V0Junction, V0Junction, V0Junction]),
        X5: sts.tuple(() => [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]),
        X6: sts.tuple(() => [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]),
        X7: sts.tuple(() => [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]),
        X8: sts.tuple(() => [V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction, V0Junction]),
    }
})

export const V0Junction: sts.Type<V0Junction> = sts.closedEnum(() => {
    return  {
        AccountId32: sts.enumStruct({
            network: V0NetworkId,
            id: sts.bytes(),
        }),
        AccountIndex64: sts.enumStruct({
            network: V0NetworkId,
            index: sts.bigint(),
        }),
        AccountKey20: sts.enumStruct({
            network: V0NetworkId,
            key: sts.bytes(),
        }),
        GeneralIndex: sts.bigint(),
        GeneralKey: WeakBoundedVec,
        OnlyChild: sts.unit(),
        PalletInstance: sts.number(),
        Parachain: sts.number(),
        Parent: sts.unit(),
        Plurality: sts.enumStruct({
            id: V0BodyId,
            part: V0BodyPart,
        }),
    }
})

export const V2Outcome: sts.Type<V2Outcome> = sts.closedEnum(() => {
    return  {
        Complete: sts.bigint(),
        Error: V2Error,
        Incomplete: sts.tuple(() => [sts.bigint(), V2Error]),
    }
})

export const VersionedMultiAssets: sts.Type<VersionedMultiAssets> = sts.closedEnum(() => {
    return  {
        V0: sts.array(() => V0MultiAsset),
        V1: sts.array(() => V1MultiAsset),
    }
})

export const V0MultiAsset: sts.Type<V0MultiAsset> = sts.closedEnum(() => {
    return  {
        AbstractFungible: sts.enumStruct({
            id: sts.bytes(),
            amount: sts.bigint(),
        }),
        AbstractNonFungible: sts.enumStruct({
            class: sts.bytes(),
            instance: V1AssetInstance,
        }),
        All: sts.unit(),
        AllAbstractFungible: sts.enumStruct({
            id: sts.bytes(),
        }),
        AllAbstractNonFungible: sts.enumStruct({
            class: sts.bytes(),
        }),
        AllConcreteFungible: sts.enumStruct({
            id: V0MultiLocation,
        }),
        AllConcreteNonFungible: sts.enumStruct({
            class: V0MultiLocation,
        }),
        AllFungible: sts.unit(),
        AllNonFungible: sts.unit(),
        ConcreteFungible: sts.enumStruct({
            id: V0MultiLocation,
            amount: sts.bigint(),
        }),
        ConcreteNonFungible: sts.enumStruct({
            class: V0MultiLocation,
            instance: V1AssetInstance,
        }),
        None: sts.unit(),
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
            to: V1MultiLocation,
            message: sts.array(() => V2Instruction),
        }),
    }
})

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
        SellExecuted: sts.enumStruct({
            who: AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        }),
        TVLCapUpdated: sts.enumStruct({
            cap: sts.bigint(),
        }),
        TokenAdded: sts.enumStruct({
            assetId: sts.number(),
            initialAmount: sts.bigint(),
            initialPrice: FixedU128,
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

export const FixedU128 = sts.bigint()

export const Permill = sts.number()

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
export const DmpQueueEvent: sts.Type<DmpQueueEvent> = sts.closedEnum(() => {
    return  {
        ExecutedDownward: sts.enumStruct({
            messageId: sts.bytes(),
            outcome: V2Outcome,
        }),
        InvalidFormat: sts.enumStruct({
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
        Executed: sts.enumStruct({
            refIndex: sts.number(),
            result: sts.result(() => sts.unit(), () => DispatchError),
        }),
        ExternalTabled: sts.unit(),
        NotPassed: sts.enumStruct({
            refIndex: sts.number(),
        }),
        Passed: sts.enumStruct({
            refIndex: sts.number(),
        }),
        PreimageInvalid: sts.enumStruct({
            proposalHash: H256,
            refIndex: sts.number(),
        }),
        PreimageMissing: sts.enumStruct({
            proposalHash: H256,
            refIndex: sts.number(),
        }),
        PreimageNoted: sts.enumStruct({
            proposalHash: H256,
            who: AccountId32,
            deposit: sts.bigint(),
        }),
        PreimageReaped: sts.enumStruct({
            proposalHash: H256,
            provider: AccountId32,
            deposit: sts.bigint(),
            reaper: AccountId32,
        }),
        PreimageUsed: sts.enumStruct({
            proposalHash: H256,
            provider: AccountId32,
            deposit: sts.bigint(),
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
            depositors: sts.array(() => AccountId32),
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
            vote: Vote,
            balance: sts.bigint(),
        }),
    }
})

export const Vote = sts.number()

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
        ExecutedDownward: sts.tuple(() => [sts.bytes(), V2Outcome]),
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
        }),
    }
})

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        Token: sts.unit(),
    }
})

export const AssetLocation: sts.Type<AssetLocation> = sts.struct(() => {
    return  {
        parents: sts.number(),
        interior: V1Junctions,
    }
})

export const Phase: sts.Type<Phase> = sts.closedEnum(() => {
    return  {
        ApplyExtrinsic: sts.number(),
        Finalization: sts.unit(),
        Initialization: sts.unit(),
    }
})
