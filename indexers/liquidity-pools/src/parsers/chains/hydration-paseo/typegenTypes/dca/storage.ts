import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const scheduleIdSequencer =  {
    /**
     *  Id sequencer for schedules
     */
    v257: new StorageType('DCA.ScheduleIdSequencer', 'Default', [], sts.number()) as ScheduleIdSequencerV257,
}

/**
 *  Id sequencer for schedules
 */
export interface ScheduleIdSequencerV257  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const schedules =  {
    /**
     *  Storing schedule details
     */
    v257: new StorageType('DCA.Schedules', 'Optional', [sts.number()], v257.Schedule) as SchedulesV257,
}

/**
 *  Storing schedule details
 */
export interface SchedulesV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: number): Promise<(v257.Schedule | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v257.Schedule | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v257.Schedule | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v257.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v257.Schedule | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v257.Schedule | undefined)][]>
}

export const scheduleOwnership =  {
    /**
     *  Storing schedule ownership
     */
    v257: new StorageType('DCA.ScheduleOwnership', 'Optional', [v257.AccountId32, sts.number()], sts.unit()) as ScheduleOwnershipV257,
}

/**
 *  Storing schedule ownership
 */
export interface ScheduleOwnershipV257  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: v257.AccountId32, key2: number): Promise<(null | undefined)>
    getMany(block: Block, keys: [v257.AccountId32, number][]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<[v257.AccountId32, number][]>
    getKeys(block: Block, key1: v257.AccountId32): Promise<[v257.AccountId32, number][]>
    getKeys(block: Block, key1: v257.AccountId32, key2: number): Promise<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v257.AccountId32): AsyncIterable<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v257.AccountId32, key2: number): AsyncIterable<[v257.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v257.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v257.AccountId32): Promise<[k: [v257.AccountId32, number], v: (null | undefined)][]>
    getPairs(block: Block, key1: v257.AccountId32, key2: number): Promise<[k: [v257.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v257.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v257.AccountId32): AsyncIterable<[k: [v257.AccountId32, number], v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v257.AccountId32, key2: number): AsyncIterable<[k: [v257.AccountId32, number], v: (null | undefined)][]>
}

export const remainingAmounts =  {
    /**
     *  Keep tracking the remaining amounts to spend for DCA schedules
     */
    v257: new StorageType('DCA.RemainingAmounts', 'Optional', [sts.number()], sts.bigint()) as RemainingAmountsV257,
}

/**
 *  Keep tracking the remaining amounts to spend for DCA schedules
 */
export interface RemainingAmountsV257  {
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
    v257: new StorageType('DCA.RetriesOnError', 'Default', [sts.number()], sts.number()) as RetriesOnErrorV257,
}

/**
 *  Keep tracking the retry on error flag for DCA schedules
 */
export interface RetriesOnErrorV257  {
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

export const scheduleIdsPerBlock =  {
    /**
     *  Keep tracking of the schedule ids to be executed in the block
     */
    v257: new StorageType('DCA.ScheduleIdsPerBlock', 'Default', [sts.number()], sts.array(() => sts.number())) as ScheduleIdsPerBlockV257,
}

/**
 *  Keep tracking of the schedule ids to be executed in the block
 */
export interface ScheduleIdsPerBlockV257  {
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
