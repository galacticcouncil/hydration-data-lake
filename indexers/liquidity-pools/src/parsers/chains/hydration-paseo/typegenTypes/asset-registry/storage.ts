import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'
import * as v264 from '../v264'

export const assets =  {
    /**
     *  Details of an asset.
     */
    v257: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v257.AssetDetails) as AssetsV257,
    /**
     *  Details of an asset.
     */
    v264: new StorageType('AssetRegistry.Assets', 'Optional', [sts.number()], v264.AssetDetails) as AssetsV264,
}

/**
 *  Details of an asset.
 */
export interface AssetsV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v257.AssetDetails | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v257.AssetDetails | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v257.AssetDetails | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v257.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v257.AssetDetails | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v257.AssetDetails | undefined)][]>
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
