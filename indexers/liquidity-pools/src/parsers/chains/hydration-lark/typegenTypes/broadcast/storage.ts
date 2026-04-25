import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v405: new StorageType('Broadcast.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV405,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v405: new StorageType('Broadcast.ExecutionContext', 'Default', [], sts.array(() => v405.ExecutionType)) as ExecutionContextV405,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.ExecutionType[]
    get(block: Block): Promise<(v405.ExecutionType[] | undefined)>
}

export const swapper =  {
    /**
     * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
     */
    v405: new StorageType('Broadcast.Swapper', 'Optional', [], v405.AccountId32) as SwapperV405,
}

/**
 * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
 */
export interface SwapperV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v405.AccountId32 | undefined)>
}
