import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const scheduleIdSequencer =  {
    /**
     *  Id sequencer for schedules
     */
    v324: new StorageType('DCA.ScheduleIdSequencer', 'Default', [], sts.number()) as ScheduleIdSequencerV324,
}

/**
 *  Id sequencer for schedules
 */
export interface ScheduleIdSequencerV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const schedules =  {
    /**
     *  Storing schedule details
     */
    v324: new StorageType('DCA.Schedules', 'Optional', [sts.number()], v324.Schedule) as SchedulesV324,
}

/**
 *  Storing schedule details
 */
export interface SchedulesV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v324.Schedule | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v324.Schedule | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v324.Schedule | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v324.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v324.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v324.Schedule | undefined)][]>
}

export const scheduleOwnership =  {
    /**
     *  Storing schedule ownership
     */
    v324: new StorageType('DCA.ScheduleOwnership', 'Optional', [v324.AccountId32, sts.number()], sts.unit()) as ScheduleOwnershipV324,
}

/**
 *  Storing schedule ownership
 */
export interface ScheduleOwnershipV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v324.AccountId32, key2: number): Promise<(null | undefined)>
    getMany(block: Block, keys: [v324.AccountId32, number][]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32): Promise<[v324.AccountId32, number][]>
    getKeys(block: Block, key1: v324.AccountId32, key2: number): Promise<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[v324.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[v324.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v324.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32): Promise<[k: [v324.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v324.AccountId32, key2: number): Promise<[k: [v324.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v324.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32): AsyncIterable<[k: [v324.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v324.AccountId32, key2: number): AsyncIterable<[k: [v324.AccountId32, number], v: (null | undefined)][]>
}

export const remainingAmounts =  {
    /**
     *  Keep tracking the remaining amounts to spend for DCA schedules
     */
    v324: new StorageType('DCA.RemainingAmounts', 'Optional', [sts.number()], sts.bigint()) as RemainingAmountsV324,
}

/**
 *  Keep tracking the remaining amounts to spend for DCA schedules
 */
export interface RemainingAmountsV324  {
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
    v324: new StorageType('DCA.RetriesOnError', 'Default', [sts.number()], sts.number()) as RetriesOnErrorV324,
}

/**
 *  Keep tracking the retry on error flag for DCA schedules
 */
export interface RetriesOnErrorV324  {
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
    v324: new StorageType('DCA.ScheduleExecutionBlock', 'Optional', [sts.number()], sts.number()) as ScheduleExecutionBlockV324,
}

/**
 *  Keep tracking the blocknumber when the schedule is planned to be executed
 */
export interface ScheduleExecutionBlockV324  {
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
    v324: new StorageType('DCA.ScheduleIdsPerBlock', 'Default', [sts.number()], sts.array(() => sts.number())) as ScheduleIdsPerBlockV324,
}

/**
 *  Keep tracking of the schedule ids to be executed in the block
 */
export interface ScheduleIdsPerBlockV324  {
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
