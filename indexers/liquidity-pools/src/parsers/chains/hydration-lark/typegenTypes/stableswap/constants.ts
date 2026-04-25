import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v405: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v405: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v405: new ConstantType(
        'Stableswap.AmplificationRange',
        v405.RangeInclusive
    ),
}
