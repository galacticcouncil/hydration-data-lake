import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v287: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v287: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v287: new ConstantType(
        'Stableswap.AmplificationRange',
        v287.RangeInclusive
    ),
}
