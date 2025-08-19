import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v324: new StorageType('Broadcast.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV324,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v324: new StorageType('Broadcast.ExecutionContext', 'Default', [], sts.array(() => v324.ExecutionType)) as ExecutionContextV324,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.ExecutionType[]
    get(block: Block): Promise<(v324.ExecutionType[] | undefined)>
}

export const swapper =  {
    /**
     * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
     */
    v324: new StorageType('Broadcast.Swapper', 'Optional', [], v324.AccountId32) as SwapperV324,
}

/**
 * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
 */
export interface SwapperV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v324.AccountId32 | undefined)>
}
