import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v183 from '../v183'

export const pools =  {
    /**
     *  Existing pools
     */
    v183: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v183.PoolInfo) as PoolsV183,
}

/**
 *  Existing pools
 */
export interface PoolsV183  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v183.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v183.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v183.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v183.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v183.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v183.PoolInfo | undefined)][]>
}
