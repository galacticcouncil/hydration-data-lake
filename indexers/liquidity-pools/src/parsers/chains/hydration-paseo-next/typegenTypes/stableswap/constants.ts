import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v324: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v324: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v324: new ConstantType(
        'Stableswap.AmplificationRange',
        v324.RangeInclusive
    ),
}
