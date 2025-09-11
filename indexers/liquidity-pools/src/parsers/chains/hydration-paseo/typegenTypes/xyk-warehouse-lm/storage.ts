import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v287: new StorageType('XYKWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV287,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v287: new StorageType('XYKWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV287,
}

export interface DepositSequencerV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v287: new StorageType('XYKWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v287.Type_716) as GlobalFarmV287,
}

export interface GlobalFarmV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v287.Type_716 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v287.Type_716 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v287.Type_716 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v287.Type_716 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v287.Type_716 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v287.Type_716 | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v287: new StorageType('XYKWarehouseLM.YieldFarm', 'Optional', [v287.AccountId32, sts.number(), sts.number()], v287.Type_718) as YieldFarmV287,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v287.AccountId32, key2: number, key3: number): Promise<(v287.Type_718 | undefined)>
    getMany(block: Block, keys: [v287.AccountId32, number, number][]): Promise<(v287.Type_718 | undefined)[]>
    getKeys(block: Block): Promise<[v287.AccountId32, number, number][]>
    getKeys(block: Block, key1: v287.AccountId32): Promise<[v287.AccountId32, number, number][]>
    getKeys(block: Block, key1: v287.AccountId32, key2: number): Promise<[v287.AccountId32, number, number][]>
    getKeys(block: Block, key1: v287.AccountId32, key2: number, key3: number): Promise<[v287.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v287.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[v287.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[v287.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number, key3: number): AsyncIterable<[v287.AccountId32, number, number][]>
    getPairs(block: Block): Promise<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32): Promise<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32, key2: number): Promise<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32, key2: number, key3: number): Promise<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number, key3: number): AsyncIterable<[k: [v287.AccountId32, number, number], v: (v287.Type_718 | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v287: new StorageType('XYKWarehouseLM.Deposit', 'Optional', [sts.bigint()], v287.Type_719) as DepositV287,
}

/**
 *  Deposit details.
 */
export interface DepositV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v287.Type_719 | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v287.Type_719 | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v287.Type_719 | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v287.Type_719 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v287.Type_719 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v287.Type_719 | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v287: new StorageType('XYKWarehouseLM.ActiveYieldFarm', 'Optional', [v287.AccountId32, sts.number()], sts.number()) as ActiveYieldFarmV287,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v287.AccountId32, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [v287.AccountId32, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[v287.AccountId32, number][]>
    getKeys(block: Block, key1: v287.AccountId32): Promise<[v287.AccountId32, number][]>
    getKeys(block: Block, key1: v287.AccountId32, key2: number): Promise<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[v287.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v287.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32): Promise<[k: [v287.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32, key2: number): Promise<[k: [v287.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v287.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[k: [v287.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[k: [v287.AccountId32, number], v: (number | undefined)][]>
}
