import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v347: new StorageType('Broadcast.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV347,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v347: new StorageType('Broadcast.ExecutionContext', 'Default', [], sts.array(() => v347.ExecutionType)) as ExecutionContextV347,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.ExecutionType[]
    get(block: Block): Promise<(v347.ExecutionType[] | undefined)>
}

export const swapper =  {
    /**
     * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
     */
    v347: new StorageType('Broadcast.Swapper', 'Optional', [], v347.AccountId32) as SwapperV347,
}

/**
 * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
 */
export interface SwapperV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v347.AccountId32 | undefined)>
}
