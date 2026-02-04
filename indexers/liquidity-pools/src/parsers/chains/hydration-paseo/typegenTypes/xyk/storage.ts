import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const shareToken =  {
    /**
     *  Asset id storage for shared pool tokens
     */
    v347: new StorageType('XYK.ShareToken', 'Default', [v347.AccountId32], sts.number()) as ShareTokenV347,
}

/**
 *  Asset id storage for shared pool tokens
 */
export interface ShareTokenV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: v347.AccountId32): Promise<(number | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (number | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (number | undefined)][]>
}

export const poolAssets =  {
    /**
     *  Asset pair in a pool.
     */
    v347: new StorageType('XYK.PoolAssets', 'Optional', [v347.AccountId32], sts.tuple(() => [sts.number(), sts.number()])) as PoolAssetsV347,
}

/**
 *  Asset pair in a pool.
 */
export interface PoolAssetsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.AccountId32): Promise<([number, number] | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<([number, number] | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: ([number, number] | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: ([number, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: ([number, number] | undefined)][]>
}
