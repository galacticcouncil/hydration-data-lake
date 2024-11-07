import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v257: new StorageType('LBP.PoolData', 'Optional', [v257.AccountId32], v257.Pool) as PoolDataV257,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v257.AccountId32): Promise<(v257.Pool | undefined)>
    getMany(block: Block, keys: v257.AccountId32[]): Promise<(v257.Pool | undefined)[]>
    getKeys(block: Block): Promise<v257.AccountId32[]>
    getKeys(block: Block, key: v257.AccountId32): Promise<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<v257.AccountId32[]>
    getPairs(block: Block): Promise<[k: v257.AccountId32, v: (v257.Pool | undefined)][]>
    getPairs(block: Block, key: v257.AccountId32): Promise<[k: v257.AccountId32, v: (v257.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v257.AccountId32, v: (v257.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<[k: v257.AccountId32, v: (v257.Pool | undefined)][]>
}
