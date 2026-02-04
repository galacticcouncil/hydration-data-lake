import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v374 from '../v374'

export const pools =  {
    /**
     *  Existing pools
     */
    v347: new StorageType('Stableswap.Pools', 'Optional', [sts.number()], v347.PoolInfo) as PoolsV347,
}

/**
 *  Existing pools
 */
export interface PoolsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.PoolInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.PoolInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.PoolInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.PoolInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.PoolInfo | undefined)][]>
}

export const poolPegs =  {
    /**
     *  Pool peg info.
     */
    v347: new StorageType('Stableswap.PoolPegs', 'Optional', [sts.number()], v347.PoolPegInfo) as PoolPegsV347,
    /**
     *  Pool peg info.
     */
    v374: new StorageType('Stableswap.PoolPegs', 'Optional', [sts.number()], v374.PoolPegInfo) as PoolPegsV374,
}

/**
 *  Pool peg info.
 */
export interface PoolPegsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.PoolPegInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.PoolPegInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.PoolPegInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.PoolPegInfo | undefined)][]>
}

/**
 *  Pool peg info.
 */
export interface PoolPegsV374  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v374.PoolPegInfo | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v374.PoolPegInfo | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v374.PoolPegInfo | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v374.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v374.PoolPegInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v374.PoolPegInfo | undefined)][]>
}

export const assetTradability =  {
    /**
     *  Tradability state of pool assets.
     */
    v347: new StorageType('Stableswap.AssetTradability', 'Default', [sts.number(), sts.number()], v347.Type_234) as AssetTradabilityV347,
}

/**
 *  Tradability state of pool assets.
 */
export interface AssetTradabilityV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.Type_234
    get(block: Block, key1: number, key2: number): Promise<(v347.Type_234 | undefined)>
    getMany(block: Block, keys: [number, number][]): Promise<(v347.Type_234 | undefined)[]>
    getKeys(block: Block): Promise<[number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number][]>
    getPairs(block: Block): Promise<[k: [number, number], v: (v347.Type_234 | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number], v: (v347.Type_234 | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number], v: (v347.Type_234 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number], v: (v347.Type_234 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number], v: (v347.Type_234 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number], v: (v347.Type_234 | undefined)][]>
}

export const poolSnapshots =  {
    /**
     *  Temporary pool state storage. Used to save a state of pool in a single block.
     */
    v347: new StorageType('Stableswap.PoolSnapshots', 'Optional', [sts.number()], v347.PoolSnapshot) as PoolSnapshotsV347,
    /**
     *  Temporary pool state storage. Used to save a state of pool in a single block.
     */
    v374: new StorageType('Stableswap.PoolSnapshots', 'Optional', [sts.number()], v374.PoolSnapshot) as PoolSnapshotsV374,
}

/**
 *  Temporary pool state storage. Used to save a state of pool in a single block.
 */
export interface PoolSnapshotsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.PoolSnapshot | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.PoolSnapshot | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.PoolSnapshot | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.PoolSnapshot | undefined)][]>
}

/**
 *  Temporary pool state storage. Used to save a state of pool in a single block.
 */
export interface PoolSnapshotsV374  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v374.PoolSnapshot | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v374.PoolSnapshot | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v374.PoolSnapshot | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v374.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v374.PoolSnapshot | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v374.PoolSnapshot | undefined)][]>
}

export const blockFee =  {
    /**
     *  Temporary pool's trade fee for current block.
     */
    v374: new StorageType('Stableswap.BlockFee', 'Optional', [sts.number()], v374.Permill) as BlockFeeV374,
}

/**
 *  Temporary pool's trade fee for current block.
 */
export interface BlockFeeV374  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v374.Permill | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v374.Permill | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v374.Permill | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v374.Permill | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v374.Permill | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v374.Permill | undefined)][]>
}
