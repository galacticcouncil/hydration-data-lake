import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v405: new StorageType('OmnipoolWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV405,
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
    v405: new StorageType('OmnipoolWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV405,
}

export interface DepositSequencerV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v405: new StorageType('OmnipoolWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v405.GlobalFarmData) as GlobalFarmV405,
}

export interface GlobalFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v405.GlobalFarmData | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v405.GlobalFarmData | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v405.GlobalFarmData | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v405.GlobalFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v405.GlobalFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v405.GlobalFarmData | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v405: new StorageType('OmnipoolWarehouseLM.YieldFarm', 'Optional', [sts.number(), sts.number(), sts.number()], v405.YieldFarmData) as YieldFarmV405,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: number, key2: number, key3: number): Promise<(v405.YieldFarmData | undefined)>
    getMany(block: Block, keys: [number, number, number][]): Promise<(v405.YieldFarmData | undefined)[]>
    getKeys(block: Block): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number, key2: number, key3: number): Promise<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number, key3: number): AsyncIterable<[number, number, number][]>
    getPairs(block: Block): Promise<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number, key2: number, key3: number): Promise<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number, key3: number): AsyncIterable<[k: [number, number, number], v: (v405.YieldFarmData | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v405: new StorageType('OmnipoolWarehouseLM.Deposit', 'Optional', [sts.bigint()], v405.DepositData) as DepositV405,
}

/**
 *  Deposit details.
 */
export interface DepositV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v405.DepositData | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v405.DepositData | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v405.DepositData | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v405.DepositData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v405.DepositData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v405.DepositData | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v405: new StorageType('OmnipoolWarehouseLM.ActiveYieldFarm', 'Optional', [sts.number(), sts.number()], sts.number()) as ActiveYieldFarmV405,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: number, key2: number): Promise<(number | undefined)>
    getMany(block: Block, keys: [number, number][]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<[number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number][]>
    getPairs(block: Block): Promise<[k: [number, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number], v: (number | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number], v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number], v: (number | undefined)][]>
}
