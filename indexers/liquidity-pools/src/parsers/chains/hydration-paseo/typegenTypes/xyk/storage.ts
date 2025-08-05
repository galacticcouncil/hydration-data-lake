import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const shareToken =  {
    /**
     *  Asset id storage for shared pool tokens
     */
    v287: new StorageType('XYK.ShareToken', 'Default', [v287.AccountId32], sts.number()) as ShareTokenV287,
}

/**
 *  Asset id storage for shared pool tokens
 */
export interface ShareTokenV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: v287.AccountId32): Promise<(number | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: (number | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: (number | undefined)][]>
}

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v287: new StorageType('XYK.PoolAssets', 'Optional', [v287.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV287,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v287.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v287.AccountId32[]>
    getKeys(block: Block, key: v287.AccountId32): Promise<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<v287.AccountId32[]>
    getPairs(block: Block): Promise<[k: v287.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v287.AccountId32): Promise<[k: v287.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.AccountId32): AsyncIterable<[k: v287.AccountId32, v: ([number, number] | undefined)][]>
}
