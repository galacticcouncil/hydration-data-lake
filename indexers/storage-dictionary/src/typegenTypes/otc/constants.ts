import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v253 from '../v253'

export const existentialDepositMultiplier =  {
    v138: new ConstantType(
        'OTC.ExistentialDepositMultiplier',
        sts.number()
    ),
}

export const fee =  {
    /**
     *  Fee deducted from amount_out.
     */
    v253: new ConstantType(
        'OTC.Fee',
        v253.Permill
    ),
}

export const feeReceiver =  {
    /**
     *  Fee receiver.
     */
    v253: new ConstantType(
        'OTC.FeeReceiver',
        v253.AccountId32
    ),
}
