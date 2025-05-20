import {sts, Result, Option, Bytes, BitSequence} from './support'

export const RuntimeVersion: sts.Type<RuntimeVersion> = sts.struct(() => {
    return  {
        specName: sts.string(),
        implName: sts.string(),
        authoringVersion: sts.number(),
        specVersion: sts.number(),
        implVersion: sts.number(),
        apis: sts.array(() => sts.tuple(() => [sts.bytes(), sts.number()])),
        transactionVersion: sts.number(),
    }
})

export interface RuntimeVersion {
    specName: string
    implName: string
    authoringVersion: number
    specVersion: number
    implVersion: number
    apis: [Bytes, number][]
    transactionVersion: number
}

export const RuntimeDbWeight: sts.Type<RuntimeDbWeight> = sts.struct(() => {
    return  {
        read: sts.bigint(),
        write: sts.bigint(),
    }
})

export interface RuntimeDbWeight {
    read: bigint
    write: bigint
}

export const BlockLength: sts.Type<BlockLength> = sts.struct(() => {
    return  {
        max: Type_57,
    }
})

export const Type_57: sts.Type<Type_57> = sts.struct(() => {
    return  {
        normal: sts.number(),
        operational: sts.number(),
        mandatory: sts.number(),
    }
})

export interface Type_57 {
    normal: number
    operational: number
    mandatory: number
}

export interface BlockLength {
    max: Type_57
}

export const BlockWeights: sts.Type<BlockWeights> = sts.struct(() => {
    return  {
        baseBlock: sts.bigint(),
        maxBlock: sts.bigint(),
        perClass: Type_53,
    }
})

export const Type_53: sts.Type<Type_53> = sts.struct(() => {
    return  {
        normal: WeightsPerClass,
        operational: WeightsPerClass,
        mandatory: WeightsPerClass,
    }
})

export const WeightsPerClass: sts.Type<WeightsPerClass> = sts.struct(() => {
    return  {
        baseExtrinsic: sts.bigint(),
        maxExtrinsic: sts.option(() => sts.bigint()),
        maxTotal: sts.option(() => sts.bigint()),
        reserved: sts.option(() => sts.bigint()),
    }
})

export interface WeightsPerClass {
    baseExtrinsic: bigint
    maxExtrinsic?: (bigint | undefined)
    maxTotal?: (bigint | undefined)
    reserved?: (bigint | undefined)
}

export interface Type_53 {
    normal: WeightsPerClass
    operational: WeightsPerClass
    mandatory: WeightsPerClass
}

export interface BlockWeights {
    baseBlock: bigint
    maxBlock: bigint
    perClass: Type_53
}

export interface OutboundHrmpMessage {
    recipient: Id
    data: Bytes
}

export const OutboundHrmpMessage: sts.Type<OutboundHrmpMessage> = sts.struct(() => {
    return  {
        recipient: Id,
        data: sts.bytes(),
    }
})

export type Id = number

export const Id = sts.number()

export type MessageQueueChain = Bytes

export const MessageQueueChain = sts.bytes()

export interface V1AbridgedHostConfiguration {
    maxCodeSize: number
    maxHeadDataSize: number
    maxUpwardQueueCount: number
    maxUpwardQueueSize: number
    maxUpwardMessageSize: number
    maxUpwardMessageNumPerCandidate: number
    hrmpMaxMessageNumPerCandidate: number
    validationUpgradeFrequency: number
    validationUpgradeDelay: number
}

export const V1AbridgedHostConfiguration: sts.Type<V1AbridgedHostConfiguration> = sts.struct(() => {
    return  {
        maxCodeSize: sts.number(),
        maxHeadDataSize: sts.number(),
        maxUpwardQueueCount: sts.number(),
        maxUpwardQueueSize: sts.number(),
        maxUpwardMessageSize: sts.number(),
        maxUpwardMessageNumPerCandidate: sts.number(),
        hrmpMaxMessageNumPerCandidate: sts.number(),
        validationUpgradeFrequency: sts.number(),
        validationUpgradeDelay: sts.number(),
    }
})

export interface MessagingStateSnapshot {
    dmqMqcHead: H256
    relayDispatchQueueSize: [number, number]
    ingressChannels: [Id, V1AbridgedHrmpChannel][]
    egressChannels: [Id, V1AbridgedHrmpChannel][]
}

export interface V1AbridgedHrmpChannel {
    maxCapacity: number
    maxTotalSize: number
    maxMessageSize: number
    msgCount: number
    totalSize: number
    mqcHead?: (H256 | undefined)
}

export const MessagingStateSnapshot: sts.Type<MessagingStateSnapshot> = sts.struct(() => {
    return  {
        dmqMqcHead: H256,
        relayDispatchQueueSize: sts.tuple(() => [sts.number(), sts.number()]),
        ingressChannels: sts.array(() => sts.tuple(() => [Id, V1AbridgedHrmpChannel])),
        egressChannels: sts.array(() => sts.tuple(() => [Id, V1AbridgedHrmpChannel])),
    }
})

export const V1AbridgedHrmpChannel: sts.Type<V1AbridgedHrmpChannel> = sts.struct(() => {
    return  {
        maxCapacity: sts.number(),
        maxTotalSize: sts.number(),
        maxMessageSize: sts.number(),
        msgCount: sts.number(),
        totalSize: sts.number(),
        mqcHead: sts.option(() => H256),
    }
})

export type V1UpgradeRestriction = V1UpgradeRestriction_Present

export interface V1UpgradeRestriction_Present {
    __kind: 'Present'
}

export const V1UpgradeRestriction: sts.Type<V1UpgradeRestriction> = sts.closedEnum(() => {
    return  {
        Present: sts.unit(),
    }
})

export interface V1PersistedValidationData {
    parentHead: HeadData
    relayParentNumber: number
    relayParentStorageRoot: H256
    maxPovSize: number
}

export type HeadData = Bytes

export const V1PersistedValidationData: sts.Type<V1PersistedValidationData> = sts.struct(() => {
    return  {
        parentHead: HeadData,
        relayParentNumber: sts.number(),
        relayParentStorageRoot: H256,
        maxPovSize: sts.number(),
    }
})

export const HeadData = sts.bytes()

export type Releases = Releases_V1_0_0 | Releases_V2_0_0

export interface Releases_V1_0_0 {
    __kind: 'V1_0_0'
}

export interface Releases_V2_0_0 {
    __kind: 'V2_0_0'
}

export const Releases: sts.Type<Releases> = sts.closedEnum(() => {
    return  {
        V1_0_0: sts.unit(),
        V2_0_0: sts.unit(),
    }
})

export interface ReserveData {
    id: Bytes
    amount: bigint
}

export const ReserveData: sts.Type<ReserveData> = sts.struct(() => {
    return  {
        id: sts.bytes(),
        amount: sts.bigint(),
    }
})

export interface BalanceLock {
    id: Bytes
    amount: bigint
    reasons: Reasons
}

export type Reasons = Reasons_All | Reasons_Fee | Reasons_Misc

export interface Reasons_All {
    __kind: 'All'
}

export interface Reasons_Fee {
    __kind: 'Fee'
}

export interface Reasons_Misc {
    __kind: 'Misc'
}

export const BalanceLock: sts.Type<BalanceLock> = sts.struct(() => {
    return  {
        id: sts.bytes(),
        amount: sts.bigint(),
        reasons: Reasons,
    }
})

export const Reasons: sts.Type<Reasons> = sts.closedEnum(() => {
    return  {
        All: sts.unit(),
        Fee: sts.unit(),
        Misc: sts.unit(),
    }
})

export interface AccountData {
    free: bigint
    reserved: bigint
    miscFrozen: bigint
    feeFrozen: bigint
}

export const AccountData: sts.Type<AccountData> = sts.struct(() => {
    return  {
        free: sts.bigint(),
        reserved: sts.bigint(),
        miscFrozen: sts.bigint(),
        feeFrozen: sts.bigint(),
    }
})

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

export const Phase: sts.Type<Phase> = sts.closedEnum(() => {
    return  {
        ApplyExtrinsic: sts.number(),
        Finalization: sts.unit(),
        Initialization: sts.unit(),
    }
})

export interface LastRuntimeUpgradeInfo {
    specVersion: number
    specName: string
}

export const LastRuntimeUpgradeInfo: sts.Type<LastRuntimeUpgradeInfo> = sts.struct(() => {
    return  {
        specVersion: sts.number(),
        specName: sts.string(),
    }
})

export interface EventRecord {
    phase: Phase
    event: Event
    topics: H256[]
}

export type Event = Event_Balances | Event_CollatorSelection | Event_ParachainSystem | Event_Session | Event_Sudo | Event_System | Event_Treasury | Event_Utility

export interface Event_Balances {
    __kind: 'Balances'
    value: BalancesEvent
}

export interface Event_CollatorSelection {
    __kind: 'CollatorSelection'
    value: CollatorSelectionEvent
}

export interface Event_ParachainSystem {
    __kind: 'ParachainSystem'
    value: ParachainSystemEvent
}

export interface Event_Session {
    __kind: 'Session'
    value: SessionEvent
}

export interface Event_Sudo {
    __kind: 'Sudo'
    value: SudoEvent
}

export interface Event_System {
    __kind: 'System'
    value: SystemEvent
}

export interface Event_Treasury {
    __kind: 'Treasury'
    value: TreasuryEvent
}

export interface Event_Utility {
    __kind: 'Utility'
    value: UtilityEvent
}

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type UtilityEvent = UtilityEvent_BatchCompleted | UtilityEvent_BatchInterrupted | UtilityEvent_ItemCompleted

/**
 * Batch of dispatches completed fully with no error.
 */
export interface UtilityEvent_BatchCompleted {
    __kind: 'BatchCompleted'
}

/**
 * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
 * well as the error. \[index, error\]
 */
export interface UtilityEvent_BatchInterrupted {
    __kind: 'BatchInterrupted'
    value: [number, DispatchError]
}

/**
 * A single item within a Batch of dispatches has completed with no error.
 */
export interface UtilityEvent_ItemCompleted {
    __kind: 'ItemCompleted'
}

export type DispatchError = DispatchError_Arithmetic | DispatchError_BadOrigin | DispatchError_CannotLookup | DispatchError_ConsumerRemaining | DispatchError_Module | DispatchError_NoProviders | DispatchError_Other | DispatchError_Token

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
    index: number
    error: number
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
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type TreasuryEvent = TreasuryEvent_Awarded | TreasuryEvent_Burnt | TreasuryEvent_Deposit | TreasuryEvent_Proposed | TreasuryEvent_Rejected | TreasuryEvent_Rollover | TreasuryEvent_Spending

/**
 * Some funds have been allocated. \[proposal_index, award, beneficiary\]
 */
export interface TreasuryEvent_Awarded {
    __kind: 'Awarded'
    value: [number, bigint, AccountId32]
}

/**
 * Some of our funds have been burnt. \[burn\]
 */
export interface TreasuryEvent_Burnt {
    __kind: 'Burnt'
    value: bigint
}

/**
 * Some funds have been deposited. \[deposit\]
 */
export interface TreasuryEvent_Deposit {
    __kind: 'Deposit'
    value: bigint
}

/**
 * New proposal. \[proposal_index\]
 */
export interface TreasuryEvent_Proposed {
    __kind: 'Proposed'
    value: number
}

/**
 * A proposal was rejected; funds were slashed. \[proposal_index, slashed\]
 */
export interface TreasuryEvent_Rejected {
    __kind: 'Rejected'
    value: [number, bigint]
}

/**
 * Spending has finished; this is the amount that rolls over until next spend.
 * \[budget_remaining\]
 */
export interface TreasuryEvent_Rollover {
    __kind: 'Rollover'
    value: bigint
}

/**
 * We have ended a spend period and will now allocate funds. \[budget_remaining\]
 */
export interface TreasuryEvent_Spending {
    __kind: 'Spending'
    value: bigint
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
 * An extrinsic failed. \[error, info\]
 */
export interface SystemEvent_ExtrinsicFailed {
    __kind: 'ExtrinsicFailed'
    value: [DispatchError, DispatchInfo]
}

/**
 * An extrinsic completed successfully. \[info\]
 */
export interface SystemEvent_ExtrinsicSuccess {
    __kind: 'ExtrinsicSuccess'
    value: DispatchInfo
}

/**
 * An \[account\] was reaped.
 */
export interface SystemEvent_KilledAccount {
    __kind: 'KilledAccount'
    value: AccountId32
}

/**
 * A new \[account\] was created.
 */
export interface SystemEvent_NewAccount {
    __kind: 'NewAccount'
    value: AccountId32
}

/**
 * On on-chain remark happened. \[origin, remark_hash\]
 */
export interface SystemEvent_Remarked {
    __kind: 'Remarked'
    value: [AccountId32, H256]
}

export interface DispatchInfo {
    weight: bigint
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
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type SudoEvent = SudoEvent_KeyChanged | SudoEvent_Sudid | SudoEvent_SudoAsDone

/**
 * The \[sudoer\] just switched identity; the old key is supplied.
 */
export interface SudoEvent_KeyChanged {
    __kind: 'KeyChanged'
    value: AccountId32
}

/**
 * A sudo just took place. \[result\]
 */
export interface SudoEvent_Sudid {
    __kind: 'Sudid'
    value: Result<null, DispatchError>
}

/**
 * A sudo just took place. \[result\]
 */
export interface SudoEvent_SudoAsDone {
    __kind: 'SudoAsDone'
    value: Result<null, DispatchError>
}

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type SessionEvent = SessionEvent_NewSession

/**
 * New session has happened. Note that the argument is the \[session_index\], not the
 * block number as the type might suggest.
 */
export interface SessionEvent_NewSession {
    __kind: 'NewSession'
    value: number
}

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type ParachainSystemEvent = ParachainSystemEvent_DownwardMessagesProcessed | ParachainSystemEvent_DownwardMessagesReceived | ParachainSystemEvent_UpgradeAuthorized | ParachainSystemEvent_ValidationFunctionApplied | ParachainSystemEvent_ValidationFunctionDiscarded | ParachainSystemEvent_ValidationFunctionStored

/**
 * Downward messages were processed using the given weight.
 * \[ weight_used, result_mqc_head \]
 */
export interface ParachainSystemEvent_DownwardMessagesProcessed {
    __kind: 'DownwardMessagesProcessed'
    value: [bigint, H256]
}

/**
 * Some downward messages have been received and will be processed.
 * \[ count \]
 */
export interface ParachainSystemEvent_DownwardMessagesReceived {
    __kind: 'DownwardMessagesReceived'
    value: number
}

/**
 * An upgrade has been authorized.
 */
export interface ParachainSystemEvent_UpgradeAuthorized {
    __kind: 'UpgradeAuthorized'
    value: H256
}

/**
 * The validation function was applied as of the contained relay chain block number.
 */
export interface ParachainSystemEvent_ValidationFunctionApplied {
    __kind: 'ValidationFunctionApplied'
    value: number
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
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type CollatorSelectionEvent = CollatorSelectionEvent_CandidateAdded | CollatorSelectionEvent_CandidateRemoved | CollatorSelectionEvent_NewCandidacyBond | CollatorSelectionEvent_NewDesiredCandidates | CollatorSelectionEvent_NewInvulnerables

export interface CollatorSelectionEvent_CandidateAdded {
    __kind: 'CandidateAdded'
    value: [AccountId32, bigint]
}

export interface CollatorSelectionEvent_CandidateRemoved {
    __kind: 'CandidateRemoved'
    value: AccountId32
}

export interface CollatorSelectionEvent_NewCandidacyBond {
    __kind: 'NewCandidacyBond'
    value: bigint
}

export interface CollatorSelectionEvent_NewDesiredCandidates {
    __kind: 'NewDesiredCandidates'
    value: number
}

export interface CollatorSelectionEvent_NewInvulnerables {
    __kind: 'NewInvulnerables'
    value: AccountId32[]
}

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export type BalancesEvent = BalancesEvent_BalanceSet | BalancesEvent_Deposit | BalancesEvent_DustLost | BalancesEvent_Endowed | BalancesEvent_ReserveRepatriated | BalancesEvent_Reserved | BalancesEvent_Slashed | BalancesEvent_Transfer | BalancesEvent_Unreserved | BalancesEvent_Withdraw

/**
 * A balance was set by root. \[who, free, reserved\]
 */
export interface BalancesEvent_BalanceSet {
    __kind: 'BalanceSet'
    value: [AccountId32, bigint, bigint]
}

/**
 * Some amount was deposited into the account (e.g. for transaction fees). \[who,
 * deposit\]
 */
export interface BalancesEvent_Deposit {
    __kind: 'Deposit'
    value: [AccountId32, bigint]
}

/**
 * An account was removed whose balance was non-zero but below ExistentialDeposit,
 * resulting in an outright loss. \[account, balance\]
 */
export interface BalancesEvent_DustLost {
    __kind: 'DustLost'
    value: [AccountId32, bigint]
}

/**
 * An account was created with some free balance. \[account, free_balance\]
 */
export interface BalancesEvent_Endowed {
    __kind: 'Endowed'
    value: [AccountId32, bigint]
}

/**
 * Some balance was moved from the reserve of the first account to the second account.
 * Final argument indicates the destination balance type.
 * \[from, to, balance, destination_status\]
 */
export interface BalancesEvent_ReserveRepatriated {
    __kind: 'ReserveRepatriated'
    value: [AccountId32, AccountId32, bigint, BalanceStatus]
}

/**
 * Some balance was reserved (moved from free to reserved). \[who, value\]
 */
export interface BalancesEvent_Reserved {
    __kind: 'Reserved'
    value: [AccountId32, bigint]
}

/**
 * Some amount was removed from the account (e.g. for misbehavior). \[who,
 * amount_slashed\]
 */
export interface BalancesEvent_Slashed {
    __kind: 'Slashed'
    value: [AccountId32, bigint]
}

/**
 * Transfer succeeded. \[from, to, value\]
 */
export interface BalancesEvent_Transfer {
    __kind: 'Transfer'
    value: [AccountId32, AccountId32, bigint]
}

/**
 * Some balance was unreserved (moved from reserved to free). \[who, value\]
 */
export interface BalancesEvent_Unreserved {
    __kind: 'Unreserved'
    value: [AccountId32, bigint]
}

/**
 * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
 */
export interface BalancesEvent_Withdraw {
    __kind: 'Withdraw'
    value: [AccountId32, bigint]
}

export type BalanceStatus = BalanceStatus_Free | BalanceStatus_Reserved

export interface BalanceStatus_Free {
    __kind: 'Free'
}

export interface BalanceStatus_Reserved {
    __kind: 'Reserved'
}

export const EventRecord: sts.Type<EventRecord> = sts.struct(() => {
    return  {
        phase: Phase,
        event: Event,
        topics: sts.array(() => H256),
    }
})

export const Event: sts.Type<Event> = sts.closedEnum(() => {
    return  {
        Balances: BalancesEvent,
        CollatorSelection: CollatorSelectionEvent,
        ParachainSystem: ParachainSystemEvent,
        Session: SessionEvent,
        Sudo: SudoEvent,
        System: SystemEvent,
        Treasury: TreasuryEvent,
        Utility: UtilityEvent,
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const UtilityEvent: sts.Type<UtilityEvent> = sts.closedEnum(() => {
    return  {
        BatchCompleted: sts.unit(),
        BatchInterrupted: sts.tuple(() => [sts.number(), DispatchError]),
        ItemCompleted: sts.unit(),
    }
})

export const DispatchError: sts.Type<DispatchError> = sts.closedEnum(() => {
    return  {
        Arithmetic: ArithmeticError,
        BadOrigin: sts.unit(),
        CannotLookup: sts.unit(),
        ConsumerRemaining: sts.unit(),
        Module: sts.enumStruct({
            index: sts.number(),
            error: sts.number(),
        }),
        NoProviders: sts.unit(),
        Other: sts.unit(),
        Token: TokenError,
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

export const ArithmeticError: sts.Type<ArithmeticError> = sts.closedEnum(() => {
    return  {
        DivisionByZero: sts.unit(),
        Overflow: sts.unit(),
        Underflow: sts.unit(),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const TreasuryEvent: sts.Type<TreasuryEvent> = sts.closedEnum(() => {
    return  {
        Awarded: sts.tuple(() => [sts.number(), sts.bigint(), AccountId32]),
        Burnt: sts.bigint(),
        Deposit: sts.bigint(),
        Proposed: sts.number(),
        Rejected: sts.tuple(() => [sts.number(), sts.bigint()]),
        Rollover: sts.bigint(),
        Spending: sts.bigint(),
    }
})

/**
 * Event for the System pallet.
 */
export const SystemEvent: sts.Type<SystemEvent> = sts.closedEnum(() => {
    return  {
        CodeUpdated: sts.unit(),
        ExtrinsicFailed: sts.tuple(() => [DispatchError, DispatchInfo]),
        ExtrinsicSuccess: DispatchInfo,
        KilledAccount: AccountId32,
        NewAccount: AccountId32,
        Remarked: sts.tuple(() => [AccountId32, H256]),
    }
})

export const DispatchInfo: sts.Type<DispatchInfo> = sts.struct(() => {
    return  {
        weight: sts.bigint(),
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
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const SudoEvent: sts.Type<SudoEvent> = sts.closedEnum(() => {
    return  {
        KeyChanged: AccountId32,
        Sudid: sts.result(() => sts.unit(), () => DispatchError),
        SudoAsDone: sts.result(() => sts.unit(), () => DispatchError),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const SessionEvent: sts.Type<SessionEvent> = sts.closedEnum(() => {
    return  {
        NewSession: sts.number(),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const ParachainSystemEvent: sts.Type<ParachainSystemEvent> = sts.closedEnum(() => {
    return  {
        DownwardMessagesProcessed: sts.tuple(() => [sts.bigint(), H256]),
        DownwardMessagesReceived: sts.number(),
        UpgradeAuthorized: H256,
        ValidationFunctionApplied: sts.number(),
        ValidationFunctionDiscarded: sts.unit(),
        ValidationFunctionStored: sts.unit(),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const CollatorSelectionEvent: sts.Type<CollatorSelectionEvent> = sts.closedEnum(() => {
    return  {
        CandidateAdded: sts.tuple(() => [AccountId32, sts.bigint()]),
        CandidateRemoved: AccountId32,
        NewCandidacyBond: sts.bigint(),
        NewDesiredCandidates: sts.number(),
        NewInvulnerables: sts.array(() => AccountId32),
    }
})

/**
 * 
			The [event](https://docs.substrate.io/v3/runtime/events-and-errors) emitted
			by this pallet.
			
 */
export const BalancesEvent: sts.Type<BalancesEvent> = sts.closedEnum(() => {
    return  {
        BalanceSet: sts.tuple(() => [AccountId32, sts.bigint(), sts.bigint()]),
        Deposit: sts.tuple(() => [AccountId32, sts.bigint()]),
        DustLost: sts.tuple(() => [AccountId32, sts.bigint()]),
        Endowed: sts.tuple(() => [AccountId32, sts.bigint()]),
        ReserveRepatriated: sts.tuple(() => [AccountId32, AccountId32, sts.bigint(), BalanceStatus]),
        Reserved: sts.tuple(() => [AccountId32, sts.bigint()]),
        Slashed: sts.tuple(() => [AccountId32, sts.bigint()]),
        Transfer: sts.tuple(() => [AccountId32, AccountId32, sts.bigint()]),
        Unreserved: sts.tuple(() => [AccountId32, sts.bigint()]),
        Withdraw: sts.tuple(() => [AccountId32, sts.bigint()]),
    }
})

export const BalanceStatus: sts.Type<BalanceStatus> = sts.closedEnum(() => {
    return  {
        Free: sts.unit(),
        Reserved: sts.unit(),
    }
})

export interface Digest {
    logs: DigestItem[]
}

export type DigestItem = DigestItem_ChangesTrieRoot | DigestItem_ChangesTrieSignal | DigestItem_Consensus | DigestItem_Other | DigestItem_PreRuntime | DigestItem_RuntimeEnvironmentUpdated | DigestItem_Seal

export interface DigestItem_ChangesTrieRoot {
    __kind: 'ChangesTrieRoot'
    value: H256
}

export interface DigestItem_ChangesTrieSignal {
    __kind: 'ChangesTrieSignal'
    value: ChangesTrieSignal
}

export interface DigestItem_Consensus {
    __kind: 'Consensus'
    value: [Bytes, Bytes]
}

export interface DigestItem_Other {
    __kind: 'Other'
    value: Bytes
}

export interface DigestItem_PreRuntime {
    __kind: 'PreRuntime'
    value: [Bytes, Bytes]
}

export interface DigestItem_RuntimeEnvironmentUpdated {
    __kind: 'RuntimeEnvironmentUpdated'
}

export interface DigestItem_Seal {
    __kind: 'Seal'
    value: [Bytes, Bytes]
}

export type ChangesTrieSignal = ChangesTrieSignal_NewConfiguration

export interface ChangesTrieSignal_NewConfiguration {
    __kind: 'NewConfiguration'
    value?: (ChangesTrieConfiguration | undefined)
}

export interface ChangesTrieConfiguration {
    digestInterval: number
    digestLevels: number
}

export const Digest: sts.Type<Digest> = sts.struct(() => {
    return  {
        logs: sts.array(() => DigestItem),
    }
})

export const DigestItem: sts.Type<DigestItem> = sts.closedEnum(() => {
    return  {
        ChangesTrieRoot: H256,
        ChangesTrieSignal: ChangesTrieSignal,
        Consensus: sts.tuple(() => [sts.bytes(), sts.bytes()]),
        Other: sts.bytes(),
        PreRuntime: sts.tuple(() => [sts.bytes(), sts.bytes()]),
        RuntimeEnvironmentUpdated: sts.unit(),
        Seal: sts.tuple(() => [sts.bytes(), sts.bytes()]),
    }
})

export const ChangesTrieSignal: sts.Type<ChangesTrieSignal> = sts.closedEnum(() => {
    return  {
        NewConfiguration: sts.option(() => ChangesTrieConfiguration),
    }
})

export const ChangesTrieConfiguration: sts.Type<ChangesTrieConfiguration> = sts.struct(() => {
    return  {
        digestInterval: sts.number(),
        digestLevels: sts.number(),
    }
})

export type H256 = Bytes

export const H256 = sts.bytes()

export interface PerDispatchClass {
    normal: bigint
    operational: bigint
    mandatory: bigint
}

export const PerDispatchClass: sts.Type<PerDispatchClass> = sts.struct(() => {
    return  {
        normal: sts.bigint(),
        operational: sts.bigint(),
        mandatory: sts.bigint(),
    }
})

export type AccountId32 = Bytes

export interface AccountInfo {
    nonce: number
    consumers: number
    providers: number
    sufficients: number
    data: AccountData
}

export const AccountInfo: sts.Type<AccountInfo> = sts.struct(() => {
    return  {
        nonce: sts.number(),
        consumers: sts.number(),
        providers: sts.number(),
        sufficients: sts.number(),
        data: AccountData,
    }
})

export const AccountId32 = sts.bytes()
