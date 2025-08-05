import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const pools =  {
    /**
     *  Existing pools
     */
    v324: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v324.PoolInfo) as PoolsV324,
}

/**
 *  Existing pools
 */
export interface PoolsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.PoolInfo | undefined)][]>
}

export const poolPegs =  {
    /**
     *  Pool peg info.
     */
    v324: new StorageType('Stableswap.PoolPegs', 'Optional', [sts.number()], v324.PoolPegInfo) as PoolPegsV324,
}

/**
 *  Pool peg info.
 */
export interface PoolPegsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.PoolPegInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.PoolPegInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.PoolPegInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.PoolPegInfo | undefined)][]>
}

export const assetTradability =  {
    /**
     *  Tradability state of pool assets.
     */
    v324: new StorageType('Stableswap.AssetTradability', 'Default', [sts.number(), sts.number()], v324.Type_242) as AssetTradabilityV324,
}

/**
 *  Tradability state of pool assets.
 */
export interface AssetTradabilityV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.Type_242
    get(block: Block, key1: number, key2: number): Promise<(v324.Type_242 | undefined)>
    getMany(block: Block, keys: [number, number][]): Promise<(v324.Type_242 | undefined)[]>
    getKeys(block: Block): Promise<[number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number][]>
    getPairs(block: Block): Promise<[k: [number, number], v: (v324.Type_242 | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number], v: (v324.Type_242 | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number], v: (v324.Type_242 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number], v: (v324.Type_242 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number], v: (v324.Type_242 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number], v: (v324.Type_242 | undefined)][]>
}

export const poolSnapshots =  {
    /**
     *  Temporary pool state storage. Used to save a state of pool in a single block.
     */
    v324: new StorageType('Stableswap.PoolSnapshots', 'Optional', [sts.number()], v324.PoolSnapshot) as PoolSnapshotsV324,
}

/**
 *  Temporary pool state storage. Used to save a state of pool in a single block.
 */
export interface PoolSnapshotsV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.PoolSnapshot | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.PoolSnapshot | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.PoolSnapshot | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.PoolSnapshot | undefined)][]>
}
