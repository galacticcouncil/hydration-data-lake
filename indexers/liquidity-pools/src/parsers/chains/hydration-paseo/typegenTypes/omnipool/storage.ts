import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v257: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v257.AssetState) as AssetsV257,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v257.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v257.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v257.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v257.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v257.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v257.AssetState | undefined)][]>
}
