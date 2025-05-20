import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v138 from '../v138'

export const farmSequencer =  {
    /**
     *  Id sequencer for `GlobalFarm` and `YieldFarm`.
     */
    v138: new StorageType('OmnipoolWarehouseLM.FarmSequencer', 'Default', [], sts.number()) as FarmSequencerV138,
}

/**
 *  Id sequencer for `GlobalFarm` and `YieldFarm`.
 */
export interface FarmSequencerV138  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const depositSequencer =  {
    v138: new StorageType('OmnipoolWarehouseLM.DepositSequencer', 'Default', [], sts.bigint()) as DepositSequencerV138,
}

export interface DepositSequencerV138  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const globalFarm =  {
    v138: new StorageType('OmnipoolWarehouseLM.GlobalFarm', 'Optional', [sts.number()], v138.GlobalFarmData) as GlobalFarmV138,
}

export interface GlobalFarmV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v138.GlobalFarmData | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v138.GlobalFarmData | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v138.GlobalFarmData | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v138.GlobalFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v138.GlobalFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v138.GlobalFarmData | undefined)][]>
}

export const yieldFarm =  {
    /**
     *  Yield farm details.
     */
    v138: new StorageType('OmnipoolWarehouseLM.YieldFarm', 'Optional', [sts.number(), sts.number(), sts.number()], v138.YieldFarmData) as YieldFarmV138,
}

/**
 *  Yield farm details.
 */
export interface YieldFarmV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: number, key2: number, key3: number): Promise<(v138.YieldFarmData | undefined)>
    getMany(block: Block, keys: [number, number, number][]): Promise<(v138.YieldFarmData | undefined)[]>
    getKeys(block: Block): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number, key2: number): Promise<[number, number, number][]>
    getKeys(block: Block, key1: number, key2: number, key3: number): Promise<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[number, number, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: number, key3: number): AsyncIterable<[number, number, number][]>
    getPairs(block: Block): Promise<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number, key2: number): Promise<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairs(block: Block, key1: number, key2: number, key3: number): Promise<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number): AsyncIterable<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: number, key3: number): AsyncIterable<[k: [number, number, number], v: (v138.YieldFarmData | undefined)][]>
}

export const deposit =  {
    /**
     *  Deposit details.
     */
    v138: new StorageType('OmnipoolWarehouseLM.Deposit', 'Optional', [sts.bigint()], v138.DepositData) as DepositV138,
}

/**
 *  Deposit details.
 */
export interface DepositV138  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: bigint): Promise<(v138.DepositData | undefined)>
    getMany(block: Block, keys: bigint[]): Promise<(v138.DepositData | undefined)[]>
    getKeys(block: Block): Promise<bigint[]>
    getKeys(block: Block, key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<bigint[]>
    getPairs(block: Block): Promise<[k: bigint, v: (v138.DepositData | undefined)][]>
    getPairs(block: Block, key: bigint): Promise<[k: bigint, v: (v138.DepositData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: bigint, v: (v138.DepositData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: bigint): AsyncIterable<[k: bigint, v: (v138.DepositData | undefined)][]>
}

export const activeYieldFarm =  {
    /**
     *  Active(farms able to receive LP shares deposits) yield farms.
     */
    v138: new StorageType('OmnipoolWarehouseLM.ActiveYieldFarm', 'Optional', [sts.number(), sts.number()], sts.number()) as ActiveYieldFarmV138,
}

/**
 *  Active(farms able to receive LP shares deposits) yield farms.
 */
export interface ActiveYieldFarmV138  {
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
