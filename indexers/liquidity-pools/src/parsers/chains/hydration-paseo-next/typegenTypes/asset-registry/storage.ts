import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v347: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v347.AssetDetails) as AssetsV347,
}

/**
 *  Details of an asset.
 */
export interface AssetsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.AssetDetails | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v347: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v347.AssetLocation) as AssetLocationsV347,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.AssetLocation | undefined)][]>
}
