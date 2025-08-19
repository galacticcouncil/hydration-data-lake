import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const assets =  {
    /**
     *  State of an asset in the omnipool
     */
    v324: new StorageType('Omnipool.Assets', 'Optional', [sts.number()], v324.AssetState) as AssetsV324,
}

/**
 *  State of an asset in the omnipool
 */
export interface AssetsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.AssetState | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.AssetState | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.AssetState | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.AssetState | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.AssetState | undefined)][]>
}
