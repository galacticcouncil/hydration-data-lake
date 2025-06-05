import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v308 from '../v308'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v287: new StorageType('Broadcast.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV287,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v287: new StorageType('Broadcast.ExecutionContext', 'Default', [], sts.array(() => v287.ExecutionType)) as ExecutionContextV287,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.ExecutionType[]
    get(block: Block): Promise<(v287.ExecutionType[] | undefined)>
}

export const swapper =  {
    /**
     * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
     */
    v308: new StorageType('Broadcast.Swapper', 'Optional', [], v308.AccountId32) as SwapperV308,
}

/**
 * If filled, we overwrite the original swapper. Mainly used in router to not to use temporary trade account
 */
export interface SwapperV308  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v308.AccountId32 | undefined)>
}
