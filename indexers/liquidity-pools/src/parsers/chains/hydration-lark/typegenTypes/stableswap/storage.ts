import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const pools =  {
    /**
     *  Existing pools
     */
    v405: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v405.PoolInfo) as PoolsV405,
}

/**
 *  Existing pools
 */
export interface PoolsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.PoolInfo | undefined)][]>
}

export const poolPegs =  {
    /**
     *  Pool peg info.
     */
    v405: new StorageType('Stableswap.PoolPegs', 'Optional', [sts.number()], v405.PoolPegInfo) as PoolPegsV405,
}

/**
 *  Pool peg info.
 */
export interface PoolPegsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.PoolPegInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.PoolPegInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.PoolPegInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.PoolPegInfo | undefined)][]>
}

export const assetTradability =  {
    /**
     *  Tradability state of pool assets.
     */
    v405: new StorageType('Stableswap.AssetTradability', 'Default', [sts.number(), sts.number()], v405.Type_235) as AssetTradabilityV405,
}

/**
 *  Tradability state of pool assets.
 */
export interface AssetTradabilityV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.Type_235
    get(block: Block, key1: number, key2: number): Promise<(v405.Type_235 | undefined)>
    getMany(block: Block, keys: [number, number][]): Promise<(v405.Type_235 | undefined)[]>
    getKeys(block: Block): Promise<[number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number][]>
    getPairs(block: Block): Promise<[k: [number, number], v: (v405.Type_235 | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number], v: (v405.Type_235 | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number], v: (v405.Type_235 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number], v: (v405.Type_235 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number], v: (v405.Type_235 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number], v: (v405.Type_235 | undefined)][]>
}

export const poolSnapshots =  {
    /**
     *  Temporary pool state storage. Used to save a state of pool in a single block.
     */
    v405: new StorageType('Stableswap.PoolSnapshots', 'Optional', [sts.number()], v405.PoolSnapshot) as PoolSnapshotsV405,
}

/**
 *  Temporary pool state storage. Used to save a state of pool in a single block.
 */
export interface PoolSnapshotsV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.PoolSnapshot | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.PoolSnapshot | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.PoolSnapshot | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.PoolSnapshot | undefined)][]>
}

export const blockFee =  {
    /**
     *  Temporary pool's trade fee for current block.
     */
    v405: new StorageType('Stableswap.BlockFee', 'Optional', [sts.number()], v405.Permill) as BlockFeeV405,
}

/**
 *  Temporary pool's trade fee for current block.
 */
export interface BlockFeeV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.Permill | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.Permill | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.Permill | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.Permill | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.Permill | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.Permill | undefined)][]>
}
