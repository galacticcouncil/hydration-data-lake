import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v276: new StorageType('LBP.PoolData', 'Optional', [v276.AccountId32], v276.Pool) as PoolDataV276,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.AccountId32): Promise<(v276.Pool | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(v276.Pool | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (v276.Pool | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (v276.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (v276.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (v276.Pool | undefined)][]>
}
