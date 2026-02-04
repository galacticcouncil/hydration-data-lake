import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const class_ =  {
    /**
     *  Details of a collection.
     */
    v347: new StorageType('Uniques.Class', 'Optional', [sts.bigint()], v347.CollectionDetails) as ClassV347,
}

/**
 *  Details of a collection.
 */
export interface ClassV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v347.CollectionDetails | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v347.CollectionDetails | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v347.CollectionDetails | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v347.CollectionDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v347.CollectionDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v347.CollectionDetails | undefined)][]>
}

export const ownershipAcceptance =  {
    /**
     *  The collection, if any, of which an account is willing to take ownership.
     */
    v347: new StorageType('Uniques.OwnershipAcceptance', 'Optional', [v347.AccountId32], sts.bigint()) as OwnershipAcceptanceV347,
}

/**
 *  The collection, if any, of which an account is willing to take ownership.
 */
export interface OwnershipAcceptanceV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.AccountId32): Promise<(bigint | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (bigint | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (bigint | undefined)][]>
}

export const account =  {
    /**
     *  The items held by any given account; set out this way so that items owned by a single
     *  account can be enumerated.
     */
    v347: new StorageType('Uniques.Account', 'Optional', [v347.AccountId32, sts.bigint(), sts.bigint()], sts.unit()) as AccountV347,
}

/**
 *  The items held by any given account; set out this way so that items owned by a single
 *  account can be enumerated.
 */
export interface AccountV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v347.AccountId32, key2: bigint, key3: bigint): Promise<(null | undefined)>
    getMany(block: Block, keys: [v347.AccountId32, bigint, bigint][]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<[v347.AccountId32, bigint, bigint][]>
    getKeys(block: Block, key1: v347.AccountId32): Promise<[v347.AccountId32, bigint, bigint][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: bigint): Promise<[v347.AccountId32, bigint, bigint][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: bigint, key3: bigint): Promise<[v347.AccountId32, bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.AccountId32, bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[v347.AccountId32, bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint): AsyncIterable<[v347.AccountId32, bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint, key3: bigint): AsyncIterable<[v347.AccountId32, bigint, bigint][]>
    getPairs(block: Block): Promise<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32): Promise<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: bigint): Promise<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: bigint, key3: bigint): Promise<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint): AsyncIterable<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint, key3: bigint): AsyncIterable<[k: [v347.AccountId32, bigint, bigint], v: (null | undefined)][]>
}

export const classAccount =  {
    /**
     *  The collections owned by any given account; set out this way so that collections owned by
     *  a single account can be enumerated.
     */
    v347: new StorageType('Uniques.ClassAccount', 'Optional', [v347.AccountId32, sts.bigint()], sts.unit()) as ClassAccountV347,
}

/**
 *  The collections owned by any given account; set out this way so that collections owned by
 *  a single account can be enumerated.
 */
export interface ClassAccountV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v347.AccountId32, key2: bigint): Promise<(null | undefined)>
    getMany(block: Block, keys: [v347.AccountId32, bigint][]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<[v347.AccountId32, bigint][]>
    getKeys(block: Block, key1: v347.AccountId32): Promise<[v347.AccountId32, bigint][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: bigint): Promise<[v347.AccountId32, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.AccountId32, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[v347.AccountId32, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint): AsyncIterable<[v347.AccountId32, bigint][]>
    getPairs(block: Block): Promise<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32): Promise<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: bigint): Promise<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: bigint): AsyncIterable<[k: [v347.AccountId32, bigint], v: (null | undefined)][]>
}

export const asset =  {
    /**
     *  The items in existence and their ownership details.
     */
    v347: new StorageType('Uniques.Asset', 'Optional', [sts.bigint(), sts.bigint()], v347.ItemDetails) as AssetV347,
}

/**
 *  The items in existence and their ownership details.
 */
export interface AssetV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: bigint, key2: bigint): Promise<(v347.ItemDetails | undefined)>
    getMany(block: Block, keys: [bigint, bigint][]): Promise<(v347.ItemDetails | undefined)[]>
    getKeys(block: Block): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint, key2: bigint): Promise<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[bigint, bigint][]>
    getPairs(block: Block): Promise<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
    getPairs(block: Block, key1: bigint): Promise<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
    getPairs(block: Block, key1: bigint, key2: bigint): Promise<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemDetails | undefined)][]>
}

export const classMetadataOf =  {
    /**
     *  Metadata of a collection.
     */
    v347: new StorageType('Uniques.ClassMetadataOf', 'Optional', [sts.bigint()], v347.CollectionMetadata) as ClassMetadataOfV347,
}

/**
 *  Metadata of a collection.
 */
export interface ClassMetadataOfV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v347.CollectionMetadata | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v347.CollectionMetadata | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v347.CollectionMetadata | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v347.CollectionMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v347.CollectionMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v347.CollectionMetadata | undefined)][]>
}

export const instanceMetadataOf =  {
    /**
     *  Metadata of an item.
     */
    v347: new StorageType('Uniques.InstanceMetadataOf', 'Optional', [sts.bigint(), sts.bigint()], v347.ItemMetadata) as InstanceMetadataOfV347,
}

/**
 *  Metadata of an item.
 */
export interface InstanceMetadataOfV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: bigint, key2: bigint): Promise<(v347.ItemMetadata | undefined)>
    getMany(block: Block, keys: [bigint, bigint][]): Promise<(v347.ItemMetadata | undefined)[]>
    getKeys(block: Block): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint, key2: bigint): Promise<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[bigint, bigint][]>
    getPairs(block: Block): Promise<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
    getPairs(block: Block, key1: bigint): Promise<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
    getPairs(block: Block, key1: bigint, key2: bigint): Promise<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[k: [bigint, bigint], v: (v347.ItemMetadata | undefined)][]>
}

export const attribute =  {
    /**
     *  Attributes of a collection.
     */
    v347: new StorageType('Uniques.Attribute', 'Optional', [sts.bigint(), sts.option(() => sts.bigint()), sts.bytes()], sts.tuple(() => [sts.bytes(), sts.bigint()])) as AttributeV347,
}

/**
 *  Attributes of a collection.
 */
export interface AttributeV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: bigint, key2: (bigint | undefined), key3: Bytes): Promise<([Bytes, bigint] | undefined)>
    getMany(block: Block, keys: [bigint, (bigint | undefined), Bytes][]): Promise<([Bytes, bigint] | undefined)[]>
    getKeys(block: Block): Promise<[bigint, (bigint | undefined), Bytes][]>
    getKeys(block: Block, key1: bigint): Promise<[bigint, (bigint | undefined), Bytes][]>
    getKeys(block: Block, key1: bigint, key2: (bigint | undefined)): Promise<[bigint, (bigint | undefined), Bytes][]>
    getKeys(block: Block, key1: bigint, key2: (bigint | undefined), key3: Bytes): Promise<[bigint, (bigint | undefined), Bytes][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[bigint, (bigint | undefined), Bytes][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[bigint, (bigint | undefined), Bytes][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint, key2: (bigint | undefined)): AsyncIterable<[bigint, (bigint | undefined), Bytes][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint, key2: (bigint | undefined), key3: Bytes): AsyncIterable<[bigint, (bigint | undefined), Bytes][]>
    getPairs(block: Block): Promise<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairs(block: Block, key1: bigint): Promise<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairs(block: Block, key1: bigint, key2: (bigint | undefined)): Promise<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairs(block: Block, key1: bigint, key2: (bigint | undefined), key3: Bytes): Promise<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint, key2: (bigint | undefined)): AsyncIterable<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint, key2: (bigint | undefined), key3: Bytes): AsyncIterable<[k: [bigint, (bigint | undefined), Bytes], v: ([Bytes, bigint] | undefined)][]>
}

export const itemPriceOf =  {
    /**
     *  Price of an asset instance.
     */
    v347: new StorageType('Uniques.ItemPriceOf', 'Optional', [sts.bigint(), sts.bigint()], sts.tuple(() => [sts.bigint(), sts.option(() => v347.AccountId32)])) as ItemPriceOfV347,
}

/**
 *  Price of an asset instance.
 */
export interface ItemPriceOfV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: bigint, key2: bigint): Promise<([bigint, (v347.AccountId32 | undefined)] | undefined)>
    getMany(block: Block, keys: [bigint, bigint][]): Promise<([bigint, (v347.AccountId32 | undefined)] | undefined)[]>
    getKeys(block: Block): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint): Promise<[bigint, bigint][]>
    getKeys(block: Block, key1: bigint, key2: bigint): Promise<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[bigint, bigint][]>
    getKeysPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[bigint, bigint][]>
    getPairs(block: Block): Promise<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
    getPairs(block: Block, key1: bigint): Promise<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
    getPairs(block: Block, key1: bigint, key2: bigint): Promise<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint): AsyncIterable<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: bigint, key2: bigint): AsyncIterable<[k: [bigint, bigint], v: ([bigint, (v347.AccountId32 | undefined)] | undefined)][]>
}

export const collectionMaxSupply =  {
    /**
     *  Keeps track of the number of items a collection might have.
     */
    v347: new StorageType('Uniques.CollectionMaxSupply', 'Optional', [sts.bigint()], sts.number()) as CollectionMaxSupplyV347,
}

/**
 *  Keeps track of the number of items a collection might have.
 */
export interface CollectionMaxSupplyV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(number | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (number | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (number | undefined)][]>
}
