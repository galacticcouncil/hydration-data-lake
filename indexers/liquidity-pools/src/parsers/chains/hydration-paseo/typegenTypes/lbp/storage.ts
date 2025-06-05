import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const poolData =  {
    /**
     *  Details of a pool.
     */
    v287: new StorageType('LBP.PoolData', 'Optional', [v287.AccountId32], v287.Pool) as PoolDataV287,
}

/**
 *  Details of a pool.
 */
export interface PoolDataV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.AccountId32): Promise<(v287.Pool | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(v287.Pool | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (v287.Pool | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (v287.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (v287.Pool | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (v287.Pool | undefined)][]>
}
