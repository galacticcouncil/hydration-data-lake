import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v115 from '../v115'

export const created =  {
    name: 'Uniques.Created',
    /**
     * A `collection` was created.
     */
    v115: new EventType(
        'Uniques.Created',
        sts.struct({
            collection: sts.bigint(),
            creator: v115.AccountId32,
            owner: v115.AccountId32,
        })
    ),
}

export const forceCreated =  {
    name: 'Uniques.ForceCreated',
    /**
     * A `collection` was force-created.
     */
    v115: new EventType(
        'Uniques.ForceCreated',
        sts.struct({
            collection: sts.bigint(),
            owner: v115.AccountId32,
        })
    ),
}

export const destroyed =  {
    name: 'Uniques.Destroyed',
    /**
     * A `collection` was destroyed.
     */
    v115: new EventType(
        'Uniques.Destroyed',
        sts.struct({
            collection: sts.bigint(),
        })
    ),
}

export const issued =  {
    name: 'Uniques.Issued',
    /**
     * An `item` was issued.
     */
    v115: new EventType(
        'Uniques.Issued',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: v115.AccountId32,
        })
    ),
}

export const transferred =  {
    name: 'Uniques.Transferred',
    /**
     * An `item` was transferred.
     */
    v115: new EventType(
        'Uniques.Transferred',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            from: v115.AccountId32,
            to: v115.AccountId32,
        })
    ),
}

export const burned =  {
    name: 'Uniques.Burned',
    /**
     * An `item` was destroyed.
     */
    v115: new EventType(
        'Uniques.Burned',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: v115.AccountId32,
        })
    ),
}

export const frozen =  {
    name: 'Uniques.Frozen',
    /**
     * Some `item` was frozen.
     */
    v115: new EventType(
        'Uniques.Frozen',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
        })
    ),
}

export const thawed =  {
    name: 'Uniques.Thawed',
    /**
     * Some `item` was thawed.
     */
    v115: new EventType(
        'Uniques.Thawed',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
        })
    ),
}

export const collectionFrozen =  {
    name: 'Uniques.CollectionFrozen',
    /**
     * Some `collection` was frozen.
     */
    v115: new EventType(
        'Uniques.CollectionFrozen',
        sts.struct({
            collection: sts.bigint(),
        })
    ),
}

export const collectionThawed =  {
    name: 'Uniques.CollectionThawed',
    /**
     * Some `collection` was thawed.
     */
    v115: new EventType(
        'Uniques.CollectionThawed',
        sts.struct({
            collection: sts.bigint(),
        })
    ),
}

export const ownerChanged =  {
    name: 'Uniques.OwnerChanged',
    /**
     * The owner changed.
     */
    v115: new EventType(
        'Uniques.OwnerChanged',
        sts.struct({
            collection: sts.bigint(),
            newOwner: v115.AccountId32,
        })
    ),
}

export const teamChanged =  {
    name: 'Uniques.TeamChanged',
    /**
     * The management team changed.
     */
    v115: new EventType(
        'Uniques.TeamChanged',
        sts.struct({
            collection: sts.bigint(),
            issuer: v115.AccountId32,
            admin: v115.AccountId32,
            freezer: v115.AccountId32,
        })
    ),
}

export const approvedTransfer =  {
    name: 'Uniques.ApprovedTransfer',
    /**
     * An `item` of a `collection` has been approved by the `owner` for transfer by
     * a `delegate`.
     */
    v115: new EventType(
        'Uniques.ApprovedTransfer',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: v115.AccountId32,
            delegate: v115.AccountId32,
        })
    ),
}

export const approvalCancelled =  {
    name: 'Uniques.ApprovalCancelled',
    /**
     * An approval for a `delegate` account to transfer the `item` of an item
     * `collection` was cancelled by its `owner`.
     */
    v115: new EventType(
        'Uniques.ApprovalCancelled',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            owner: v115.AccountId32,
            delegate: v115.AccountId32,
        })
    ),
}

export const itemStatusChanged =  {
    name: 'Uniques.ItemStatusChanged',
    /**
     * A `collection` has had its attributes changed by the `Force` origin.
     */
    v115: new EventType(
        'Uniques.ItemStatusChanged',
        sts.struct({
            collection: sts.bigint(),
        })
    ),
}

export const collectionMetadataSet =  {
    name: 'Uniques.CollectionMetadataSet',
    /**
     * New metadata has been set for a `collection`.
     */
    v115: new EventType(
        'Uniques.CollectionMetadataSet',
        sts.struct({
            collection: sts.bigint(),
            data: v115.BoundedVec,
            isFrozen: sts.boolean(),
        })
    ),
}

export const collectionMetadataCleared =  {
    name: 'Uniques.CollectionMetadataCleared',
    /**
     * Metadata has been cleared for a `collection`.
     */
    v115: new EventType(
        'Uniques.CollectionMetadataCleared',
        sts.struct({
            collection: sts.bigint(),
        })
    ),
}

export const metadataSet =  {
    name: 'Uniques.MetadataSet',
    /**
     * New metadata has been set for an item.
     */
    v115: new EventType(
        'Uniques.MetadataSet',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            data: v115.BoundedVec,
            isFrozen: sts.boolean(),
        })
    ),
}

export const metadataCleared =  {
    name: 'Uniques.MetadataCleared',
    /**
     * Metadata has been cleared for an item.
     */
    v115: new EventType(
        'Uniques.MetadataCleared',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
        })
    ),
}

export const redeposited =  {
    name: 'Uniques.Redeposited',
    /**
     * Metadata has been cleared for an item.
     */
    v115: new EventType(
        'Uniques.Redeposited',
        sts.struct({
            collection: sts.bigint(),
            successfulItems: sts.array(() => sts.bigint()),
        })
    ),
}

export const attributeSet =  {
    name: 'Uniques.AttributeSet',
    /**
     * New attribute metadata has been set for a `collection` or `item`.
     */
    v115: new EventType(
        'Uniques.AttributeSet',
        sts.struct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
            value: sts.bytes(),
        })
    ),
}

export const attributeCleared =  {
    name: 'Uniques.AttributeCleared',
    /**
     * Attribute metadata has been cleared for a `collection` or `item`.
     */
    v115: new EventType(
        'Uniques.AttributeCleared',
        sts.struct({
            collection: sts.bigint(),
            maybeItem: sts.option(() => sts.bigint()),
            key: sts.bytes(),
        })
    ),
}

export const ownershipAcceptanceChanged =  {
    name: 'Uniques.OwnershipAcceptanceChanged',
    /**
     * Ownership acceptance has changed for an account.
     */
    v115: new EventType(
        'Uniques.OwnershipAcceptanceChanged',
        sts.struct({
            who: v115.AccountId32,
            maybeCollection: sts.option(() => sts.bigint()),
        })
    ),
}

export const collectionMaxSupplySet =  {
    name: 'Uniques.CollectionMaxSupplySet',
    /**
     * Max supply has been set for a collection.
     */
    v115: new EventType(
        'Uniques.CollectionMaxSupplySet',
        sts.struct({
            collection: sts.bigint(),
            maxSupply: sts.number(),
        })
    ),
}

export const itemPriceSet =  {
    name: 'Uniques.ItemPriceSet',
    /**
     * The price was set for the instance.
     */
    v115: new EventType(
        'Uniques.ItemPriceSet',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            price: sts.bigint(),
            whitelistedBuyer: sts.option(() => v115.AccountId32),
        })
    ),
}

export const itemPriceRemoved =  {
    name: 'Uniques.ItemPriceRemoved',
    /**
     * The price for the instance was removed.
     */
    v115: new EventType(
        'Uniques.ItemPriceRemoved',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
        })
    ),
}

export const itemBought =  {
    name: 'Uniques.ItemBought',
    /**
     * An item was bought.
     */
    v115: new EventType(
        'Uniques.ItemBought',
        sts.struct({
            collection: sts.bigint(),
            item: sts.bigint(),
            price: sts.bigint(),
            seller: v115.AccountId32,
            buyer: v115.AccountId32,
        })
    ),
}
