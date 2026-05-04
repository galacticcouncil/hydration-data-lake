import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const shareToken =  {
    /**
     *  Asset id storage for shared pool tokens
     */
    v405: new StorageType('XYK.ShareToken', 'Default', [v405.AccountId32], sts.number()) as ShareTokenV405,
}

/**
 *  Asset id storage for shared pool tokens
 */
export interface ShareTokenV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: v405.AccountId32): Promise<(number | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (number | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (number | undefined)][]>
}

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v405: new StorageType('XYK.PoolAssets', 'Optional', [v405.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV405,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v405.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: ([number, number] | undefined)][]>
}
