import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v257: new StorageType('XYK.PoolAssets', 'Optional', [v257.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV257,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v257.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v257.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v257.AccountId32[]>
    getKeys(block: Block, key: v257.AccountId32): Promise<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<v257.AccountId32[]>
    getPairs(block: Block): Promise<[k: v257.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v257.AccountId32): Promise<[k: v257.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v257.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<[k: v257.AccountId32, v: ([number, number] | undefined)][]>
}
