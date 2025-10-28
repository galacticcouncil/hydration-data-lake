import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const scheduleIdSequencer =  {
    /**
     *  Id sequencer for schedules
     */
    v347: new StorageType('DCA.ScheduleIdSequencer', 'Default', [], sts.number()) as ScheduleIdSequencerV347,
}

/**
 *  Id sequencer for schedules
 */
export interface ScheduleIdSequencerV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const schedules =  {
    /**
     *  Storing schedule details
     */
    v347: new StorageType('DCA.Schedules', 'Optional', [sts.number()], v347.Schedule) as SchedulesV347,
}

/**
 *  Storing schedule details
 */
export interface SchedulesV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v347.Schedule | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v347.Schedule | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v347.Schedule | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v347.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v347.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v347.Schedule | undefined)][]>
}

export const scheduleOwnership =  {
    /**
     *  Storing schedule ownership
     */
    v347: new StorageType('DCA.ScheduleOwnership', 'Optional', [v347.AccountId32, sts.number()], sts.unit()) as ScheduleOwnershipV347,
}

/**
 *  Storing schedule ownership
 */
export interface ScheduleOwnershipV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v347.AccountId32, key2: number): Promise<(null | undefined)>
    getMany(block: Block, keys: [v347.AccountId32, number][]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<[v347.AccountId32, number][]>
    getKeys(block: Block, key1: v347.AccountId32): Promise<[v347.AccountId32, number][]>
    getKeys(block: Block, key1: v347.AccountId32, key2: number): Promise<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[v347.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[v347.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v347.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32): Promise<[k: [v347.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v347.AccountId32, key2: number): Promise<[k: [v347.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v347.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32): AsyncIterable<[k: [v347.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v347.AccountId32, key2: number): AsyncIterable<[k: [v347.AccountId32, number], v: (null | undefined)][]>
}

export const remainingAmounts =  {
    /**
     *  Keep tracking the remaining amounts to spend for DCA schedules
     */
    v347: new StorageType('DCA.RemainingAmounts', 'Optional', [sts.number()], sts.bigint()) as RemainingAmountsV347,
}

/**
 *  Keep tracking the remaining amounts to spend for DCA schedules
 */
export interface RemainingAmountsV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(bigint | undefined)>
    getMany(block: Block, keys: number[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (bigint | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (bigint | undefined)][]>
}

export const retriesOnError =  {
    /**
     *  Keep tracking the retry on error flag for DCA schedules
     */
    v347: new StorageType('DCA.RetriesOnError', 'Default', [sts.number()], sts.number()) as RetriesOnErrorV347,
}

/**
 *  Keep tracking the retry on error flag for DCA schedules
 */
export interface RetriesOnErrorV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block, key: number): Promise<(number | undefined)>
    getMany(block: Block, keys: number[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (number | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (number | undefined)][]>
}

export const scheduleExecutionBlock =  {
    /**
     *  Keep tracking the blocknumber when the schedule is planned to be executed
     */
    v347: new StorageType('DCA.ScheduleExecutionBlock', 'Optional', [sts.number()], sts.number()) as ScheduleExecutionBlockV347,
}

/**
 *  Keep tracking the blocknumber when the schedule is planned to be executed
 */
export interface ScheduleExecutionBlockV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(number | undefined)>
    getMany(block: Block, keys: number[]): Promise<(number | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (number | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (number | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (number | undefined)][]>
}

export const scheduleIdsPerBlock =  {
    /**
     *  Keep tracking of the schedule ids to be executed in the block
     */
    v347: new StorageType('DCA.ScheduleIdsPerBlock', 'Default', [sts.number()], sts.array(() => sts.number())) as ScheduleIdsPerBlockV347,
}

/**
 *  Keep tracking of the schedule ids to be executed in the block
 */
export interface ScheduleIdsPerBlockV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number[]
    get(block: Block, key: number): Promise<(number[] | undefined)>
    getMany(block: Block, keys: number[]): Promise<(number[] | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (number[] | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (number[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (number[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (number[] | undefined)][]>
}
