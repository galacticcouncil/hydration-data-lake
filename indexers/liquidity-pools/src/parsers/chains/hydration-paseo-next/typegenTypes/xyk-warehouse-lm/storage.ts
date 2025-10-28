import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v347: new StorageType('XYKWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV347,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v347: new StorageType('XYKWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV347,
}

export interface DepositSequencerV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v347: new StorageType('XYKWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v347.Type_719) as GlobalFarmV347,
}

export interface GlobalFarmV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.Type_719 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.Type_719 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.Type_719 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.Type_719 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.Type_719 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.Type_719 | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v347: new StorageType('XYKWarehouseLM.YieldFarm', 'Optional', [v347.AccountId32, sts.number(), sts.number()], v347.Type_721) as YieldFarmV347,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v347.AccountId32, key2: number, key3: number): Promise<(v347.Type_721 | undefined)>
    getMany(block: Block, keys: [v347.AccountId32, number, number][]): Promise<(v347.Type_721 | undefined)[]>
    getKeys(block: Block): Promise<[v347.AccountId32, number, number][]>
    getKeys(block: Block, key1: v347.AccountId32): Promise<[v347.AccountId32, number, number][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: number): Promise<[v347.AccountId32, number, number][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: number, key3: number): Promise<[v347.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[v347.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[v347.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number, key3: number): AsyncIterable<[v347.AccountId32, number, number][]>
    getPairs(block: Block): Promise<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32): Promise<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: number): Promise<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: number, key3: number): Promise<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number, key3: number): AsyncIterable<[k: [v347.AccountId32, number, number], v: (v347.Type_721 | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v347: new StorageType('XYKWarehouseLM.Deposit', 'Optional', [sts.bigint()], v347.Type_722) as DepositV347,
}

/**
 *  Deposit details.
 */
export interface DepositV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v347.Type_722 | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v347.Type_722 | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v347.Type_722 | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v347.Type_722 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v347.Type_722 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v347.Type_722 | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v347: new StorageType('XYKWarehouseLM.ActiveYieldFarm', 'Optional', [v347.AccountId32, sts.number()], sts.number()) as ActiveYieldFarmV347,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v347.AccountId32, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [v347.AccountId32, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[v347.AccountId32, number][]>
    getKeys(block: Block, key1: v347.AccountId32): Promise<[v347.AccountId32, number][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: number): Promise<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[v347.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v347.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32): Promise<[k: [v347.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: number): Promise<[k: [v347.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[k: [v347.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[k: [v347.AccountId32, number], v: (number | undefined)][]>
}
