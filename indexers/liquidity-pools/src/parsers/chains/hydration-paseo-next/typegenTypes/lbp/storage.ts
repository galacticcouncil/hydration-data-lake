import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v324: new StorageType('LBP.PoolData', 'Optional', [v324.AccountId32], v324.Pool) as PoolDataV324,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.AccountId32): Promise<(v324.Pool | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.Pool | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.Pool | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.Pool | undefined)][]>
}
