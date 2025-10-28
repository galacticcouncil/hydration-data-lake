import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v347: new StorageType('LBP.PoolData', 'Optional', [v347.AccountId32], v347.Pool) as PoolDataV347,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.AccountId32): Promise<(v347.Pool | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.Pool | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.Pool | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.Pool | undefined)][]>
}
