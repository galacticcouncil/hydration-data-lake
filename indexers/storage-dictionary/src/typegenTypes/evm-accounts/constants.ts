import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const feeMultiplier =  {
    /**
     *  Fee multiplier for the binding of addresses.
     */
    v222: new ConstantType(
        'EVMAccounts.FeeMultiplier',
        sts.number()
    ),
}
