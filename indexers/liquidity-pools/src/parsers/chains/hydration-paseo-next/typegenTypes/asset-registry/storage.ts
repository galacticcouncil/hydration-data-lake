import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v324: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v324.AssetDetails) as AssetsV324,
}

/**
 *  Details of an asset.
 */
export interface AssetsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.AssetDetails | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v324: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v324.AssetLocation) as AssetLocationsV324,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.AssetLocation | undefined)][]>
}
