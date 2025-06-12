import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v176 from '../v176'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v176: new StorageType('LBP.PoolData', 'Optional', [v176.AccountId32], v176.Pool) as PoolDataV176,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV176  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v176.AccountId32): Promise<(v176.Pool | undefined)>
    getMany(block: Block, keys: v176.AccountId32[]): Promise<(v176.Pool | undefined)[]>
    getKeys(block: Block): Promise<v176.AccountId32[]>
    getKeys(block: Block, key: v176.AccountId32): Promise<v176.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v176.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v176.AccountId32): AsyncIterable<v176.AccountId32[]>
    getPairs(block: Block): Promise<[k: v176.AccountId32, v: (v176.Pool | undefined)][]>
    getPairs(block: Block, key: v176.AccountId32): Promise<[k: v176.AccountId32, v: (v176.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v176.AccountId32, v: (v176.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v176.AccountId32): AsyncIterable<[k: v176.AccountId32, v: (v176.Pool | undefined)][]>
}
