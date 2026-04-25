import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v405: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v405.AssetDetails) as AssetsV405,
}

/**
 *  Details of an asset.
 */
export interface AssetsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.AssetDetails | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v405: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v405.AssetLocation) as AssetLocationsV405,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.AssetLocation | undefined)][]>
}
