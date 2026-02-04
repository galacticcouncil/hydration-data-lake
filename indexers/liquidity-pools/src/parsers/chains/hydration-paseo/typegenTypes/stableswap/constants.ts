import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v347: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v347: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v347: new ConstantType(
        'Stableswap.AmplificationRange',
        v347.RangeInclusive
    ),
}
