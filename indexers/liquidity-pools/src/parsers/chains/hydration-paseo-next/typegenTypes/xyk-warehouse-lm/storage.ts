import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v324: new StorageType('XYKWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV324,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v324: new StorageType('XYKWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV324,
}

export interface DepositSequencerV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v324: new StorageType('XYKWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v324.Type_735) as GlobalFarmV324,
}

export interface GlobalFarmV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.Type_735 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.Type_735 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.Type_735 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.Type_735 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.Type_735 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.Type_735 | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v324: new StorageType('XYKWarehouseLM.YieldFarm', 'Optional', [v324.AccountId32, sts.number(), sts.number()], v324.Type_737) as YieldFarmV324,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v324.AccountId32, key2: number, key3: number): Promise<(v324.Type_737 | undefined)>
    getMany(block: Block, keys: [v324.AccountId32, number, number][]): Promise<(v324.Type_737 | undefined)[]>
    getKeys(block: Block): Promise<[v324.AccountId32, number, number][]>
    getKeys(block: Block, key1: v324.AccountId32): Promise<[v324.AccountId32, number, number][]>
    getKeys(block: Block, key1: v324.AccountId32, key2: number): Promise<[v324.AccountId32, number, number][]>
    getKeys(block: Block, key1: v324.AccountId32, key2: number, key3: number): Promise<[v324.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v324.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[v324.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[v324.AccountId32, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number, key3: number): AsyncIterable<[v324.AccountId32, number, number][]>
    getPairs(block: Block): Promise<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32): Promise<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32, key2: number): Promise<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32, key2: number, key3: number): Promise<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number, key3: number): AsyncIterable<[k: [v324.AccountId32, number, number], v: (v324.Type_737 | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v324: new StorageType('XYKWarehouseLM.Deposit', 'Optional', [sts.bigint()], v324.Type_738) as DepositV324,
}

/**
 *  Deposit details.
 */
export interface DepositV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v324.Type_738 | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v324.Type_738 | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v324.Type_738 | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v324.Type_738 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v324.Type_738 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v324.Type_738 | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v324: new StorageType('XYKWarehouseLM.ActiveYieldFarm', 'Optional', [v324.AccountId32, sts.number()], sts.number()) as ActiveYieldFarmV324,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v324.AccountId32, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [v324.AccountId32, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32, key2: number): Promise<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[v324.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v324.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32): Promise<[k: [v324.AccountId32, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32, key2: number): Promise<[k: [v324.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v324.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[k: [v324.AccountId32, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[k: [v324.AccountId32, number], v: (number | undefined)][]>
}
