import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const log =  {
    name: 'EVM.Log',
    /**
     * Ethereum events from contracts.
     */
    v287: new EventType(
        'EVM.Log',
        sts.struct({
            log: v287.Log,
        })
    ),
}

export const created =  {
    name: 'EVM.Created',
    /**
     * A contract has been created at given address.
     */
    v287: new EventType(
        'EVM.Created',
        sts.struct({
            address: v287.H160,
        })
    ),
}

export const createdFailed =  {
    name: 'EVM.CreatedFailed',
    /**
     * A contract was attempted to be created, but the execution failed.
     */
    v287: new EventType(
        'EVM.CreatedFailed',
        sts.struct({
            address: v287.H160,
        })
    ),
}

export const executed =  {
    name: 'EVM.Executed',
    /**
     * A contract has been executed successfully with states applied.
     */
    v287: new EventType(
        'EVM.Executed',
        sts.struct({
            address: v287.H160,
        })
    ),
}

export const executedFailed =  {
    name: 'EVM.ExecutedFailed',
    /**
     * A contract has been executed with errors. States are reverted with only gas fees applied.
     */
    v287: new EventType(
        'EVM.ExecutedFailed',
        sts.struct({
            address: v287.H160,
        })
    ),
}
