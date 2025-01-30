import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const shareToken =  {
    /**
     *  Asset id storage for shared pool tokens
     */
    v276: new StorageType('XYK.ShareToken', 'Default', [v276.AccountId32], sts.number()) as ShareTokenV276,
}

/**
 *  Asset id storage for shared pool tokens
 */
export interface ShareTokenV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: v276.AccountId32): Promise<(number | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: (number | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: (number | undefined)][]>
}

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v276: new StorageType('XYK.PoolAssets', 'Optional', [v276.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV276,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v276.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v276.AccountId32[]>
    getKeys(block: Block, key: v276.AccountId32): Promise<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<v276.AccountId32[]>
    getPairs(block: Block): Promise<[k: v276.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v276.AccountId32): Promise<[k: v276.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.AccountId32): AsyncIterable<[k: v276.AccountId32, v: ([number, number] | undefined)][]>
}
