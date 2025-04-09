import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const maxLocks =  {
    v108: new ConstantType(
        'Tokens.MaxLocks',
        sts.number()
    ),
}

export const maxReserves =  {
    /**
     *  The maximum number of named reserves that can exist on an account.
     */
    v115: new ConstantType(
        'Tokens.MaxReserves',
        sts.number()
    ),
}
