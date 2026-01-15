import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v227 from '../v227'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v227: new StorageType('XYKWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV227,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV227  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v227: new StorageType('XYKWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV227,
}

export interface DepositSequencerV227  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v227: new StorageType('XYKWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v227.Type_582) as GlobalFarmV227,
}

export interface GlobalFarmV227  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v227.Type_582 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v227.Type_582 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v227.Type_582 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v227.Type_582 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v227.Type_582 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v227.Type_582 | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v227: new StorageType('XYKWarehouseLM.YieldFarm', 'Optional', [v227.AccountId32, sts.number(), sts.number()], v227.Type_584) as YieldFarmV227,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV227  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v227.AccountId32, key2: number, key3: number): Promise<(v227.Type_584 | undefined)>
    getMany(block: Block, keys: [v227.AccountId32, number, number][]): Promise<(v227.Type_584 | undefined)[]>
    getKeys(block: Block): Promise<[v227.AccountId32, number, number][]>
    getKeys(block: Block, key1: v227.AccountId32): Promise<[v227.AccountId32, number, number][]>
    getKeys(block: Block, key1: v227.AccountId32, key2: number): Promise<[v227.AccountId32, number, number][]>
    getKeys(block: Block, key1: v227.AccountId32, key2: number, key3: number): Promise<[v227.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v227.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v227.AccountId32): AsyncIterable<[v227.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number): AsyncIterable<[v227.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number, key3: number): AsyncIterable<[v227.AccountId32, number, number][]>
    getPairs(block: Block): Promise<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairs(block: Block, key1: v227.AccountId32): Promise<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairs(block: Block, key1: v227.AccountId32, key2: number): Promise<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairs(block: Block, key1: v227.AccountId32, key2: number, key3: number): Promise<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v227.AccountId32): AsyncIterable<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number): AsyncIterable<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number, key3: number): AsyncIterable<[k: [v227.AccountId32, number, number], v: (v227.Type_584 | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v227: new StorageType('XYKWarehouseLM.Deposit', 'Optional', [sts.bigint()], v227.Type_585) as DepositV227,
}

/**
 *  Deposit details.
 */
export interface DepositV227  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v227.Type_585 | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v227.Type_585 | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v227.Type_585 | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v227.Type_585 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v227.Type_585 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v227.Type_585 | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v227: new StorageType('XYKWarehouseLM.ActiveYieldFarm', 'Optional', [v227.AccountId32, sts.number()], sts.number()) as ActiveYieldFarmV227,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV227  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v227.AccountId32, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [v227.AccountId32, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[v227.AccountId32, number][]>
    getKeys(block: Block, key1: v227.AccountId32): Promise<[v227.AccountId32, number][]>
    getKeys(block: Block, key1: v227.AccountId32, key2: number): Promise<[v227.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v227.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v227.AccountId32): AsyncIterable<[v227.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number): AsyncIterable<[v227.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v227.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v227.AccountId32): Promise<[k: [v227.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v227.AccountId32, key2: number): Promise<[k: [v227.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v227.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v227.AccountId32): AsyncIterable<[k: [v227.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v227.AccountId32, key2: number): AsyncIterable<[k: [v227.AccountId32, number], v: (number | undefined)][]>
}
