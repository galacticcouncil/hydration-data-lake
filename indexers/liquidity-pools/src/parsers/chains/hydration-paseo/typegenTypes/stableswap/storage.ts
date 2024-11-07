import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const pools =  {
    /**
     *  Existing pools
     */
    v257: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v257.PoolInfo) as PoolsV257,
}

/**
 *  Existing pools
 */
export interface PoolsV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v257.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v257.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v257.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v257.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v257.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v257.PoolInfo | undefined)][]>
}
