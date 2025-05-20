import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v108 from '../v108'
import * as v160 from '../v160'
import * as v176 from '../v176'
import * as v222 from '../v222'
import * as v244 from '../v244'
import * as v264 from '../v264'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v108: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v108.AssetDetails) as AssetsV108,
    /**
     *  Details of an asset.
     */
    v160: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v160.AssetDetails) as AssetsV160,
    /**
     *  Details of an asset.
     */
    v176: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v176.AssetDetails) as AssetsV176,
    /**
     *  Details of an asset.
     */
    v222: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v222.AssetDetails) as AssetsV222,
    /**
     *  Details of an asset.
     */
    v264: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v264.AssetDetails) as AssetsV264,
}

/**
 *  Details of an asset.
 */
export interface AssetsV108  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v108.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v108.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v108.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v108.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v108.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v108.AssetDetails | undefined)][]>
}

/**
 *  Details of an asset.
 */
export interface AssetsV160  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v160.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v160.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v160.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v160.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v160.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v160.AssetDetails | undefined)][]>
}

/**
 *  Details of an asset.
 */
export interface AssetsV176  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v176.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v176.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v176.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v176.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v176.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v176.AssetDetails | undefined)][]>
}

/**
 *  Details of an asset.
 */
export interface AssetsV222  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v222.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v222.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v222.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v222.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v222.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v222.AssetDetails | undefined)][]>
}

/**
 *  Details of an asset.
 */
export interface AssetsV264  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v264.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v264.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v264.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v264.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v264.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v264.AssetDetails | undefined)][]>
}

export const nextAssetId =  {
    /**
     *  Next available asset id. This is sequential id assigned for each new registered asset.
     */
    v108: new StorageType('AssetRegistry.NextAssetId', 'Default', [], sts.number()) as NextAssetIdV108,
}

/**
 *  Next available asset id. This is sequential id assigned for each new registered asset.
 */
export interface NextAssetIdV108  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const assetIds =  {
    /**
     *  Mapping between asset name and asset id.
     */
    v108: new StorageType('AssetRegistry.AssetIds', 'Optional', [v108.BoundedVec], sts.number()) as AssetIdsV108,
}

/**
 *  Mapping between asset name and asset id.
 */
export interface AssetIdsV108  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v108.BoundedVec): Promise<(number | undefined)>
    getMany(block: Block, keys: v108.BoundedVec[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v108.BoundedVec[]>
    getKeys(block: Block, key: v108.BoundedVec): Promise<v108.BoundedVec[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v108.BoundedVec[]>
    getKeysPaged(pageSize: number, block: Block, key: v108.BoundedVec): AsyncIterable<v108.BoundedVec[]>
    getPairs(block: Block): Promise<[k: v108.BoundedVec, v: (number | undefined)][]>
    getPairs(block: Block, key: v108.BoundedVec): Promise<[k: v108.BoundedVec, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v108.BoundedVec, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v108.BoundedVec): AsyncIterable<[k: v108.BoundedVec, v: (number | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v108: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v108.AssetLocation) as AssetLocationsV108,
    /**
     *  Native location of an asset.
     */
    v160: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v160.AssetLocation) as AssetLocationsV160,
    /**
     *  Native location of an asset.
     */
    v244: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v244.AssetLocation) as AssetLocationsV244,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV108  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v108.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v108.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v108.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v108.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v108.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v108.AssetLocation | undefined)][]>
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV160  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v160.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v160.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v160.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v160.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v160.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v160.AssetLocation | undefined)][]>
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV244  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v244.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v244.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v244.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v244.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v244.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v244.AssetLocation | undefined)][]>
}

export const locationAssets =  {
    /**
     *  Local asset for native location.
     */
    v108: new StorageType('AssetRegistry.LocationAssets', 'Optional', [v108.AssetLocation], sts.number()) as LocationAssetsV108,
    /**
     *  Local asset for native location.
     */
    v160: new StorageType('AssetRegistry.LocationAssets', 'Optional', [v160.AssetLocation], sts.number()) as LocationAssetsV160,
    /**
     *  Local asset for native location.
     */
    v244: new StorageType('AssetRegistry.LocationAssets', 'Optional', [v244.AssetLocation], sts.number()) as LocationAssetsV244,
}

/**
 *  Local asset for native location.
 */
export interface LocationAssetsV108  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v108.AssetLocation): Promise<(number | undefined)>
    getMany(block: Block, keys: v108.AssetLocation[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v108.AssetLocation[]>
    getKeys(block: Block, key: v108.AssetLocation): Promise<v108.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v108.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block, key: v108.AssetLocation): AsyncIterable<v108.AssetLocation[]>
    getPairs(block: Block): Promise<[k: v108.AssetLocation, v: (number | undefined)][]>
    getPairs(block: Block, key: v108.AssetLocation): Promise<[k: v108.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v108.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v108.AssetLocation): AsyncIterable<[k: v108.AssetLocation, v: (number | undefined)][]>
}

/**
 *  Local asset for native location.
 */
export interface LocationAssetsV160  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v160.AssetLocation): Promise<(number | undefined)>
    getMany(block: Block, keys: v160.AssetLocation[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v160.AssetLocation[]>
    getKeys(block: Block, key: v160.AssetLocation): Promise<v160.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v160.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block, key: v160.AssetLocation): AsyncIterable<v160.AssetLocation[]>
    getPairs(block: Block): Promise<[k: v160.AssetLocation, v: (number | undefined)][]>
    getPairs(block: Block, key: v160.AssetLocation): Promise<[k: v160.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v160.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v160.AssetLocation): AsyncIterable<[k: v160.AssetLocation, v: (number | undefined)][]>
}

/**
 *  Local asset for native location.
 */
export interface LocationAssetsV244  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v244.AssetLocation): Promise<(number | undefined)>
    getMany(block: Block, keys: v244.AssetLocation[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v244.AssetLocation[]>
    getKeys(block: Block, key: v244.AssetLocation): Promise<v244.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v244.AssetLocation[]>
    getKeysPaged(pageSize: number, block: Block, key: v244.AssetLocation): AsyncIterable<v244.AssetLocation[]>
    getPairs(block: Block): Promise<[k: v244.AssetLocation, v: (number | undefined)][]>
    getPairs(block: Block, key: v244.AssetLocation): Promise<[k: v244.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v244.AssetLocation, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v244.AssetLocation): AsyncIterable<[k: v244.AssetLocation, v: (number | undefined)][]>
}

export const assetMetadataMap =  {
    /**
     *  Metadata of an asset.
     */
    v108: new StorageType('AssetRegistry.AssetMetadataMap', 'Optional', [sts.number()], v108.AssetMetadata) as AssetMetadataMapV108,
}

/**
 *  Metadata of an asset.
 */
export interface AssetMetadataMapV108  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v108.AssetMetadata | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v108.AssetMetadata | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v108.AssetMetadata | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v108.AssetMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v108.AssetMetadata | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v108.AssetMetadata | undefined)][]>
}

export const bannedAssets =  {
    /**
     *  Non-native assets which transfer is banned.
     */
    v222: new StorageType('AssetRegistry.BannedAssets', 'Optional', [sts.number()], sts.unit()) as BannedAssetsV222,
}

/**
 *  Non-native assets which transfer is banned.
 */
export interface BannedAssetsV222  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(null | undefined)>
    getMany(block: Block, keys: number[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (null | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (null | undefined)][]>
}

export const existentialDepositCounter =  {
    /**
     *  Number of accounts that paid existential deposits for insufficient assets.
     *  This storage is used by `SufficiencyCheck`.
     */
    v222: new StorageType('AssetRegistry.ExistentialDepositCounter', 'Default', [], sts.bigint()) as ExistentialDepositCounterV222,
}

/**
 *  Number of accounts that paid existential deposits for insufficient assets.
 *  This storage is used by `SufficiencyCheck`.
 */
export interface ExistentialDepositCounterV222  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}
