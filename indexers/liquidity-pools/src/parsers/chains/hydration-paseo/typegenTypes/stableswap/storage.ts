import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const pools =  {
    /**
     *  Existing pools
     */
    v287: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v287.PoolInfo) as PoolsV287,
}

/**
 *  Existing pools
 */
export interface PoolsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.PoolInfo | undefined)][]>
}
