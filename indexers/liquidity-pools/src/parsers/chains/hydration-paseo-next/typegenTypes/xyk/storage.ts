import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const shareToken =  {
    /**
     *  Asset id storage for shared pool tokens
     */
    v324: new StorageType('XYK.ShareToken', 'Default', [v324.AccountId32], sts.number()) as ShareTokenV324,
}

/**
 *  Asset id storage for shared pool tokens
 */
export interface ShareTokenV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: v324.AccountId32): Promise<(number | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (number | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (number | undefined)][]>
}

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v324: new StorageType('XYK.PoolAssets', 'Optional', [v324.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV324,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: ([number, number] | undefined)][]>
}
