import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v183 from '../v183'

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v183: new StorageType('XYK.PoolAssets', 'Optional', [v183.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV183,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV183  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v183.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v183.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v183.AccountId32[]>
    getKeys(block: Block, key: v183.AccountId32): Promise<v183.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v183.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v183.AccountId32): AsyncIterable<v183.AccountId32[]>
    getPairs(block: Block): Promise<[k: v183.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v183.AccountId32): Promise<[k: v183.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v183.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v183.AccountId32): AsyncIterable<[k: v183.AccountId32, v: ([number, number] | undefined)][]>
}
