import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v299 from '../v299'

export const pools =  {
    /**
     *  Existing pools
     */
    v287: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v287.PoolInfo) as PoolsV287,
}

/**
 *  Existing pools
 */
export interface PoolsV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.PoolInfo | undefined)][]>
}

export const assetTradability =  {
    /**
     *  Tradability state of pool assets.
     */
    v287: new StorageType('Stableswap.AssetTradability', 'Default', [sts.number(), sts.number()], v287.Type_240) as AssetTradabilityV287,
}

/**
 *  Tradability state of pool assets.
 */
export interface AssetTradabilityV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.Type_240
    get(block: Block, key1: number, key2: number): Promise<(v287.Type_240 | undefined)>
    getMany(block: Block, keys: [number, number][]): Promise<(v287.Type_240 | undefined)[]>
    getKeys(block: Block): Promise<[number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number][]>
    getPairs(block: Block): Promise<[k: [number, number], v: (v287.Type_240 | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number], v: (v287.Type_240 | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number], v: (v287.Type_240 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number], v: (v287.Type_240 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number], v: (v287.Type_240 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number], v: (v287.Type_240 | undefined)][]>
}

export const poolPegs =  {
    /**
     *  Pool peg info.
     */
    v299: new StorageType('Stableswap.PoolPegs', 'Optional', [sts.number()], v299.PoolPegInfo) as PoolPegsV299,
}

/**
 *  Pool peg info.
 */
export interface PoolPegsV299  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v299.PoolPegInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v299.PoolPegInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v299.PoolPegInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v299.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v299.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v299.PoolPegInfo | undefined)][]>
}
