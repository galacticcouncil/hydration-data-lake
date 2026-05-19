import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v405: new StorageType('LBP.PoolData', 'Optional', [v405.AccountId32], v405.Pool) as PoolDataV405,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v405.AccountId32): Promise<(v405.Pool | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.Pool | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.Pool | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.Pool | undefined)][]>
}
