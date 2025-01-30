import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const pools =  {
    /**
     *  Existing pools
     */
    v276: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v276.PoolInfo) as PoolsV276,
}

/**
 *  Existing pools
 */
export interface PoolsV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v276.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v276.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v276.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v276.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v276.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v276.PoolInfo | undefined)][]>
}
