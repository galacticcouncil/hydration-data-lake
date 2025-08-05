import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v287: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v287.AssetDetails) as AssetsV287,
}

/**
 *  Details of an asset.
 */
export interface AssetsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.AssetDetails | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v287: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v287.AssetLocation) as AssetLocationsV287,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.AssetLocation | undefined)][]>
}
