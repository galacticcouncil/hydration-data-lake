import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v276: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v276.AssetDetails) as AssetsV276,
}

/**
 *  Details of an asset.
 */
export interface AssetsV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.AssetDetails | undefined)][]>
}

export const assetLocations =  {
    /**
     *  Native location of an asset.
     */
    v276: new StorageType('AssetRegistry.AssetLocations', 'Optional', [sts.number()], v276.AssetLocation) as AssetLocationsV276,
}

/**
 *  Native location of an asset.
 */
export interface AssetLocationsV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.AssetLocation | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.AssetLocation | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.AssetLocation | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.AssetLocation | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.AssetLocation | undefined)][]>
}
