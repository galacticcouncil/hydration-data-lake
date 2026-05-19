import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const log =  {
    name: 'EVM.Log',
    /**
     * Ethereum events from contracts.
     */
    v405: new EventType(
        'EVM.Log',
        sts.struct({
            log: v405.Log,
        })
    ),
}

export const created =  {
    name: 'EVM.Created',
    /**
     * A contract has been created at given address.
     */
    v405: new EventType(
        'EVM.Created',
        sts.struct({
            address: v405.H160,
        })
    ),
}

export const createdFailed =  {
    name: 'EVM.CreatedFailed',
    /**
     * A contract was attempted to be created, but the execution failed.
     */
    v405: new EventType(
        'EVM.CreatedFailed',
        sts.struct({
            address: v405.H160,
        })
    ),
}

export const executed =  {
    name: 'EVM.Executed',
    /**
     * A contract has been executed successfully with states applied.
     */
    v405: new EventType(
        'EVM.Executed',
        sts.struct({
            address: v405.H160,
        })
    ),
}

export const executedFailed =  {
    name: 'EVM.ExecutedFailed',
    /**
     * A contract has been executed with errors. States are reverted with only gas fees applied.
     */
    v405: new EventType(
        'EVM.ExecutedFailed',
        sts.struct({
            address: v405.H160,
        })
    ),
}
