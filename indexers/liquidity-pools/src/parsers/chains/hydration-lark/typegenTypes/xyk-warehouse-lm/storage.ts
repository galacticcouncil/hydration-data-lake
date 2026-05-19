import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v405: new StorageType('XYKWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV405,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v405: new StorageType('XYKWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV405,
}

export interface DepositSequencerV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v405: new StorageType('XYKWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v405.Type_800) as GlobalFarmV405,
}

export interface GlobalFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.Type_800 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.Type_800 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.Type_800 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.Type_800 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.Type_800 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.Type_800 | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v405: new StorageType('XYKWarehouseLM.YieldFarm', 'Optional', [v405.AccountId32, sts.number(), sts.number()], v405.Type_802) as YieldFarmV405,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v405.AccountId32, key2: number, key3: number): Promise<(v405.Type_802 | undefined)>
    getMany(block: Block, keys: [v405.AccountId32, number, number][]): Promise<(v405.Type_802 | undefined)[]>
    getKeys(block: Block): Promise<[v405.AccountId32, number, number][]>
    getKeys(block: Block, key1: v405.AccountId32): Promise<[v405.AccountId32, number, number][]>
    getKeys(block: Block, key1: v405.AccountId32, key2: number): Promise<[v405.AccountId32, number, number][]>
    getKeys(block: Block, key1: v405.AccountId32, key2: number, key3: number): Promise<[v405.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v405.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[v405.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[v405.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number, key3: number): AsyncIterable<[v405.AccountId32, number, number][]>
    getPairs(block: Block): Promise<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32): Promise<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32, key2: number): Promise<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32, key2: number, key3: number): Promise<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number, key3: number): AsyncIterable<[k: [v405.AccountId32, number, number], v: (v405.Type_802 | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v405: new StorageType('XYKWarehouseLM.Deposit', 'Optional', [sts.bigint()], v405.Type_803) as DepositV405,
}

/**
 *  Deposit details.
 */
export interface DepositV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v405.Type_803 | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v405.Type_803 | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v405.Type_803 | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v405.Type_803 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v405.Type_803 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v405.Type_803 | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v405: new StorageType('XYKWarehouseLM.ActiveYieldFarm', 'Optional', [v405.AccountId32, sts.number()], sts.number()) as ActiveYieldFarmV405,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v405.AccountId32, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [v405.AccountId32, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[v405.AccountId32, number][]>
    getKeys(block: Block, key1: v405.AccountId32): Promise<[v405.AccountId32, number][]>
    getKeys(block: Block, key1: v405.AccountId32, key2: number): Promise<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[v405.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[v405.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v405.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32): Promise<[k: [v405.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v405.AccountId32, key2: number): Promise<[k: [v405.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v405.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32): AsyncIterable<[k: [v405.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v405.AccountId32, key2: number): AsyncIterable<[k: [v405.AccountId32, number], v: (number | undefined)][]>
}
