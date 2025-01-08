import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v278 from '../v278'

export const incrementalId =  {
    /**
     *  Next available incremental ID
     */
    v278: new StorageType('AmmSupport.IncrementalId', 'Default', [], sts.number()) as IncrementalIdV278,
}

/**
 *  Next available incremental ID
 */
export interface IncrementalIdV278  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const executionContext =  {
    /**
     *  Execution context to figure out where the trade is originated from
     */
    v278: new StorageType('AmmSupport.ExecutionContext', 'Default', [], sts.array(() => v278.ExecutionType)) as ExecutionContextV278,
}

/**
 *  Execution context to figure out where the trade is originated from
 */
export interface ExecutionContextV278  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v278.ExecutionType[]
    get(block: Block): Promise<(v278.ExecutionType[] | undefined)>
}
