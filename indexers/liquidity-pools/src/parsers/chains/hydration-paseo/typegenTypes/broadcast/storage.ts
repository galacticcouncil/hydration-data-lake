import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v282 from '../v282'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v282: new StorageType('Broadcast.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV282,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV282  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v282: new StorageType('Broadcast.ExecutionContext', 'Default', [], sts.array(() => v282.ExecutionType)) as ExecutionContextV282,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV282  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v282.ExecutionType[]
    get(block: Block): Promise<(v282.ExecutionType[] | undefined)>
}

export const overflowCount =  {
    /**
     *  To handle the overflow of increasing the execution context.
     *  After the stack is full, we start to increase the overflow count,
     *  so we how many times we can ignore the removal from the context.
     */
    v282: new StorageType('Broadcast.OverflowCount', 'Default', [], sts.number()) as OverflowCountV282,
}

/**
 *  To handle the overflow of increasing the execution context.
 *  After the stack is full, we start to increase the overflow count,
 *  so we how many times we can ignore the removal from the context.
 */
export interface OverflowCountV282  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}
