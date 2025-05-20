import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const batchedCallsLimit =  {
    /**
     *  The limit on the number of batched calls.
     */
    v100: new ConstantType(
        'Utility.batched_calls_limit',
        sts.number()
    ),
}
