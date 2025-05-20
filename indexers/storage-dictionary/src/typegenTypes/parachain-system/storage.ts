import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'
import * as v115 from '../v115'
import * as v160 from '../v160'
import * as v205 from '../v205'
import * as v244 from '../v244'

export const pendingValidationCode =  {
    /**
     *  In case of a scheduled upgrade, this storage field contains the validation code to be applied.
     * 
     *  As soon as the relay chain gives us the go-ahead signal, we will overwrite the [`:code`][well_known_keys::CODE]
     *  which will result the next block process with the new validation code. This concludes the upgrade process.
     * 
     *  [well_known_keys::CODE]: sp_core::storage::well_known_keys::CODE
     */
    v100: new StorageType('ParachainSystem.PendingValidationCode', 'Default', [], sts.bytes()) as PendingValidationCodeV100,
}

/**
 *  In case of a scheduled upgrade, this storage field contains the validation code to be applied.
 * 
 *  As soon as the relay chain gives us the go-ahead signal, we will overwrite the [`:code`][well_known_keys::CODE]
 *  which will result the next block process with the new validation code. This concludes the upgrade process.
 * 
 *  [well_known_keys::CODE]: sp_core::storage::well_known_keys::CODE
 */
export interface PendingValidationCodeV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block): Promise<(Bytes | undefined)>
}

export const newValidationCode =  {
    /**
     *  Validation code that is set by the parachain and is to be communicated to collator and
     *  consequently the relay-chain.
     * 
     *  This will be cleared in `on_initialize` of each new block if no other pallet already set
     *  the value.
     */
    v100: new StorageType('ParachainSystem.NewValidationCode', 'Optional', [], sts.bytes()) as NewValidationCodeV100,
}

/**
 *  Validation code that is set by the parachain and is to be communicated to collator and
 *  consequently the relay-chain.
 * 
 *  This will be cleared in `on_initialize` of each new block if no other pallet already set
 *  the value.
 */
export interface NewValidationCodeV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(Bytes | undefined)>
}

export const validationData =  {
    /**
     *  The [`PersistedValidationData`] set for this block.
     *  This value is expected to be set only once per block and it's never stored
     *  in the trie.
     */
    v100: new StorageType('ParachainSystem.ValidationData', 'Optional', [], v100.V1PersistedValidationData) as ValidationDataV100,
}

/**
 *  The [`PersistedValidationData`] set for this block.
 *  This value is expected to be set only once per block and it's never stored
 *  in the trie.
 */
export interface ValidationDataV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.V1PersistedValidationData | undefined)>
}

export const didSetValidationCode =  {
    /**
     *  Were the validation data set to notify the relay chain?
     */
    v100: new StorageType('ParachainSystem.DidSetValidationCode', 'Default', [], sts.boolean()) as DidSetValidationCodeV100,
}

/**
 *  Were the validation data set to notify the relay chain?
 */
export interface DidSetValidationCodeV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): boolean
    get(block: Block): Promise<(boolean | undefined)>
}

export const upgradeRestrictionSignal =  {
    /**
     *  An option which indicates if the relay-chain restricts signalling a validation code upgrade.
     *  In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
     *  candidate will be invalid.
     * 
     *  This storage item is a mirror of the corresponding value for the current parachain from the
     *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
     *  set after the inherent.
     */
    v100: new StorageType('ParachainSystem.UpgradeRestrictionSignal', 'Default', [], sts.option(() => v100.V1UpgradeRestriction)) as UpgradeRestrictionSignalV100,
}

/**
 *  An option which indicates if the relay-chain restricts signalling a validation code upgrade.
 *  In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
 *  candidate will be invalid.
 * 
 *  This storage item is a mirror of the corresponding value for the current parachain from the
 *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
 *  set after the inherent.
 */
export interface UpgradeRestrictionSignalV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): (v100.V1UpgradeRestriction | undefined)
    get(block: Block): Promise<((v100.V1UpgradeRestriction | undefined) | undefined)>
}

export const relevantMessagingState =  {
    /**
     *  The snapshot of some state related to messaging relevant to the current parachain as per
     *  the relay parent.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v100: new StorageType('ParachainSystem.RelevantMessagingState', 'Optional', [], v100.MessagingStateSnapshot) as RelevantMessagingStateV100,
    /**
     *  The snapshot of some state related to messaging relevant to the current parachain as per
     *  the relay parent.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v205: new StorageType('ParachainSystem.RelevantMessagingState', 'Optional', [], v205.MessagingStateSnapshot) as RelevantMessagingStateV205,
}

/**
 *  The snapshot of some state related to messaging relevant to the current parachain as per
 *  the relay parent.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface RelevantMessagingStateV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.MessagingStateSnapshot | undefined)>
}

/**
 *  The snapshot of some state related to messaging relevant to the current parachain as per
 *  the relay parent.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface RelevantMessagingStateV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v205.MessagingStateSnapshot | undefined)>
}

export const hostConfiguration =  {
    /**
     *  The parachain host configuration that was obtained from the relay parent.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v100: new StorageType('ParachainSystem.HostConfiguration', 'Optional', [], v100.V1AbridgedHostConfiguration) as HostConfigurationV100,
    /**
     *  The parachain host configuration that was obtained from the relay parent.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v104: new StorageType('ParachainSystem.HostConfiguration', 'Optional', [], v104.V1AbridgedHostConfiguration) as HostConfigurationV104,
    /**
     *  The parachain host configuration that was obtained from the relay parent.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v205: new StorageType('ParachainSystem.HostConfiguration', 'Optional', [], v205.V5AbridgedHostConfiguration) as HostConfigurationV205,
}

/**
 *  The parachain host configuration that was obtained from the relay parent.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface HostConfigurationV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.V1AbridgedHostConfiguration | undefined)>
}

/**
 *  The parachain host configuration that was obtained from the relay parent.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface HostConfigurationV104  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v104.V1AbridgedHostConfiguration | undefined)>
}

/**
 *  The parachain host configuration that was obtained from the relay parent.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface HostConfigurationV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v205.V5AbridgedHostConfiguration | undefined)>
}

export const lastDmqMqcHead =  {
    /**
     *  The last downward message queue chain head we have observed.
     * 
     *  This value is loaded before and saved after processing inbound downward messages carried
     *  by the system inherent.
     */
    v100: new StorageType('ParachainSystem.LastDmqMqcHead', 'Default', [], v100.MessageQueueChain) as LastDmqMqcHeadV100,
}

/**
 *  The last downward message queue chain head we have observed.
 * 
 *  This value is loaded before and saved after processing inbound downward messages carried
 *  by the system inherent.
 */
export interface LastDmqMqcHeadV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.MessageQueueChain
    get(block: Block): Promise<(v100.MessageQueueChain | undefined)>
}

export const lastHrmpMqcHeads =  {
    /**
     *  The message queue chain heads we have observed per each channel incoming channel.
     * 
     *  This value is loaded before and saved after processing inbound downward messages carried
     *  by the system inherent.
     */
    v100: new StorageType('ParachainSystem.LastHrmpMqcHeads', 'Default', [], sts.array(() => sts.tuple(() => [v100.Id, v100.MessageQueueChain]))) as LastHrmpMqcHeadsV100,
}

/**
 *  The message queue chain heads we have observed per each channel incoming channel.
 * 
 *  This value is loaded before and saved after processing inbound downward messages carried
 *  by the system inherent.
 */
export interface LastHrmpMqcHeadsV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [v100.Id, v100.MessageQueueChain][]
    get(block: Block): Promise<([v100.Id, v100.MessageQueueChain][] | undefined)>
}

export const processedDownwardMessages =  {
    /**
     *  Number of downward messages processed in a block.
     * 
     *  This will be cleared in `on_initialize` of each new block.
     */
    v100: new StorageType('ParachainSystem.ProcessedDownwardMessages', 'Default', [], sts.number()) as ProcessedDownwardMessagesV100,
}

/**
 *  Number of downward messages processed in a block.
 * 
 *  This will be cleared in `on_initialize` of each new block.
 */
export interface ProcessedDownwardMessagesV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const hrmpWatermark =  {
    /**
     *  HRMP watermark that was set in a block.
     * 
     *  This will be cleared in `on_initialize` of each new block.
     */
    v100: new StorageType('ParachainSystem.HrmpWatermark', 'Default', [], sts.number()) as HrmpWatermarkV100,
}

/**
 *  HRMP watermark that was set in a block.
 * 
 *  This will be cleared in `on_initialize` of each new block.
 */
export interface HrmpWatermarkV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const hrmpOutboundMessages =  {
    /**
     *  HRMP messages that were sent in a block.
     * 
     *  This will be cleared in `on_initialize` of each new block.
     */
    v100: new StorageType('ParachainSystem.HrmpOutboundMessages', 'Default', [], sts.array(() => v100.OutboundHrmpMessage)) as HrmpOutboundMessagesV100,
}

/**
 *  HRMP messages that were sent in a block.
 * 
 *  This will be cleared in `on_initialize` of each new block.
 */
export interface HrmpOutboundMessagesV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.OutboundHrmpMessage[]
    get(block: Block): Promise<(v100.OutboundHrmpMessage[] | undefined)>
}

export const upwardMessages =  {
    /**
     *  Upward messages that were sent in a block.
     * 
     *  This will be cleared in `on_initialize` of each new block.
     */
    v100: new StorageType('ParachainSystem.UpwardMessages', 'Default', [], sts.array(() => sts.bytes())) as UpwardMessagesV100,
}

/**
 *  Upward messages that were sent in a block.
 * 
 *  This will be cleared in `on_initialize` of each new block.
 */
export interface UpwardMessagesV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes[]
    get(block: Block): Promise<(Bytes[] | undefined)>
}

export const pendingUpwardMessages =  {
    /**
     *  Upward messages that are still pending and not yet send to the relay chain.
     */
    v100: new StorageType('ParachainSystem.PendingUpwardMessages', 'Default', [], sts.array(() => sts.bytes())) as PendingUpwardMessagesV100,
}

/**
 *  Upward messages that are still pending and not yet send to the relay chain.
 */
export interface PendingUpwardMessagesV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes[]
    get(block: Block): Promise<(Bytes[] | undefined)>
}

export const announcedHrmpMessagesPerCandidate =  {
    /**
     *  The number of HRMP messages we observed in `on_initialize` and thus used that number for
     *  announcing the weight of `on_initialize` and `on_finalize`.
     */
    v100: new StorageType('ParachainSystem.AnnouncedHrmpMessagesPerCandidate', 'Default', [], sts.number()) as AnnouncedHrmpMessagesPerCandidateV100,
}

/**
 *  The number of HRMP messages we observed in `on_initialize` and thus used that number for
 *  announcing the weight of `on_initialize` and `on_finalize`.
 */
export interface AnnouncedHrmpMessagesPerCandidateV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const reservedXcmpWeightOverride =  {
    /**
     *  The weight we reserve at the beginning of the block for processing XCMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v100: new StorageType('ParachainSystem.ReservedXcmpWeightOverride', 'Optional', [], sts.bigint()) as ReservedXcmpWeightOverrideV100,
    /**
     *  The weight we reserve at the beginning of the block for processing XCMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v115: new StorageType('ParachainSystem.ReservedXcmpWeightOverride', 'Optional', [], v115.Weight) as ReservedXcmpWeightOverrideV115,
    /**
     *  The weight we reserve at the beginning of the block for processing XCMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v160: new StorageType('ParachainSystem.ReservedXcmpWeightOverride', 'Optional', [], v160.Weight) as ReservedXcmpWeightOverrideV160,
}

/**
 *  The weight we reserve at the beginning of the block for processing XCMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedXcmpWeightOverrideV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(bigint | undefined)>
}

/**
 *  The weight we reserve at the beginning of the block for processing XCMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedXcmpWeightOverrideV115  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v115.Weight | undefined)>
}

/**
 *  The weight we reserve at the beginning of the block for processing XCMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedXcmpWeightOverrideV160  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v160.Weight | undefined)>
}

export const reservedDmpWeightOverride =  {
    /**
     *  The weight we reserve at the beginning of the block for processing DMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v100: new StorageType('ParachainSystem.ReservedDmpWeightOverride', 'Optional', [], sts.bigint()) as ReservedDmpWeightOverrideV100,
    /**
     *  The weight we reserve at the beginning of the block for processing DMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v115: new StorageType('ParachainSystem.ReservedDmpWeightOverride', 'Optional', [], v115.Weight) as ReservedDmpWeightOverrideV115,
    /**
     *  The weight we reserve at the beginning of the block for processing DMP messages. This
     *  overrides the amount set in the Config trait.
     */
    v160: new StorageType('ParachainSystem.ReservedDmpWeightOverride', 'Optional', [], v160.Weight) as ReservedDmpWeightOverrideV160,
}

/**
 *  The weight we reserve at the beginning of the block for processing DMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedDmpWeightOverrideV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(bigint | undefined)>
}

/**
 *  The weight we reserve at the beginning of the block for processing DMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedDmpWeightOverrideV115  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v115.Weight | undefined)>
}

/**
 *  The weight we reserve at the beginning of the block for processing DMP messages. This
 *  overrides the amount set in the Config trait.
 */
export interface ReservedDmpWeightOverrideV160  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v160.Weight | undefined)>
}

export const authorizedUpgrade =  {
    /**
     *  The next authorized upgrade, if there is one.
     */
    v100: new StorageType('ParachainSystem.AuthorizedUpgrade', 'Optional', [], v100.H256) as AuthorizedUpgradeV100,
    /**
     *  The next authorized upgrade, if there is one.
     */
    v205: new StorageType('ParachainSystem.AuthorizedUpgrade', 'Optional', [], v205.CodeUpgradeAuthorization) as AuthorizedUpgradeV205,
}

/**
 *  The next authorized upgrade, if there is one.
 */
export interface AuthorizedUpgradeV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.H256 | undefined)>
}

/**
 *  The next authorized upgrade, if there is one.
 */
export interface AuthorizedUpgradeV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v205.CodeUpgradeAuthorization | undefined)>
}

export const customValidationHeadData =  {
    /**
     *  A custom head data that should be returned as result of `validate_block`.
     * 
     *  See [`Pallet::set_custom_validation_head_data`] for more information.
     */
    v104: new StorageType('ParachainSystem.CustomValidationHeadData', 'Optional', [], sts.bytes()) as CustomValidationHeadDataV104,
}

/**
 *  A custom head data that should be returned as result of `validate_block`.
 * 
 *  See [`Pallet::set_custom_validation_head_data`] for more information.
 */
export interface CustomValidationHeadDataV104  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(Bytes | undefined)>
}

export const lastRelayChainBlockNumber =  {
    /**
     *  The relay chain block number associated with the last parachain block.
     */
    v115: new StorageType('ParachainSystem.LastRelayChainBlockNumber', 'Default', [], sts.number()) as LastRelayChainBlockNumberV115,
}

/**
 *  The relay chain block number associated with the last parachain block.
 */
export interface LastRelayChainBlockNumberV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const relayStateProof =  {
    /**
     *  The state proof for the last relay parent block.
     * 
     *  This field is meant to be updated each block with the validation data inherent. Therefore,
     *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
     * 
     *  This data is also absent from the genesis.
     */
    v115: new StorageType('ParachainSystem.RelayStateProof', 'Optional', [], v115.StorageProof) as RelayStateProofV115,
}

/**
 *  The state proof for the last relay parent block.
 * 
 *  This field is meant to be updated each block with the validation data inherent. Therefore,
 *  before processing of the inherent, e.g. in `on_initialize` this data may be stale.
 * 
 *  This data is also absent from the genesis.
 */
export interface RelayStateProofV115  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v115.StorageProof | undefined)>
}

export const unincludedSegment =  {
    /**
     *  Latest included block descendants the runtime accepted. In other words, these are
     *  ancestors of the currently executing block which have not been included in the observed
     *  relay-chain state.
     * 
     *  The segment length is limited by the capacity returned from the [`ConsensusHook`] configured
     *  in the pallet.
     */
    v205: new StorageType('ParachainSystem.UnincludedSegment', 'Default', [], sts.array(() => v205.Ancestor)) as UnincludedSegmentV205,
}

/**
 *  Latest included block descendants the runtime accepted. In other words, these are
 *  ancestors of the currently executing block which have not been included in the observed
 *  relay-chain state.
 * 
 *  The segment length is limited by the capacity returned from the [`ConsensusHook`] configured
 *  in the pallet.
 */
export interface UnincludedSegmentV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.Ancestor[]
    get(block: Block): Promise<(v205.Ancestor[] | undefined)>
}

export const aggregatedUnincludedSegment =  {
    /**
     *  Storage field that keeps track of bandwidth used by the unincluded segment along with the
     *  latest the latest HRMP watermark. Used for limiting the acceptance of new blocks with
     *  respect to relay chain constraints.
     */
    v205: new StorageType('ParachainSystem.AggregatedUnincludedSegment', 'Optional', [], v205.SegmentTracker) as AggregatedUnincludedSegmentV205,
}

/**
 *  Storage field that keeps track of bandwidth used by the unincluded segment along with the
 *  latest the latest HRMP watermark. Used for limiting the acceptance of new blocks with
 *  respect to relay chain constraints.
 */
export interface AggregatedUnincludedSegmentV205  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v205.SegmentTracker | undefined)>
}

export const upgradeGoAhead =  {
    /**
     *  Optional upgrade go-ahead signal from the relay-chain.
     * 
     *  This storage item is a mirror of the corresponding value for the current parachain from the
     *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
     *  set after the inherent.
     */
    v205: new StorageType('ParachainSystem.UpgradeGoAhead', 'Default', [], sts.option(() => v205.V5UpgradeGoAhead)) as UpgradeGoAheadV205,
}

/**
 *  Optional upgrade go-ahead signal from the relay-chain.
 * 
 *  This storage item is a mirror of the corresponding value for the current parachain from the
 *  relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
 *  set after the inherent.
 */
export interface UpgradeGoAheadV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): (v205.V5UpgradeGoAhead | undefined)
    get(block: Block): Promise<((v205.V5UpgradeGoAhead | undefined) | undefined)>
}

export const upwardDeliveryFeeFactor =  {
    /**
     *  The factor to multiply the base delivery fee by for UMP.
     */
    v244: new StorageType('ParachainSystem.UpwardDeliveryFeeFactor', 'Default', [], v244.FixedU128) as UpwardDeliveryFeeFactorV244,
}

/**
 *  The factor to multiply the base delivery fee by for UMP.
 */
export interface UpwardDeliveryFeeFactorV244  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v244.FixedU128
    get(block: Block): Promise<(v244.FixedU128 | undefined)>
}
