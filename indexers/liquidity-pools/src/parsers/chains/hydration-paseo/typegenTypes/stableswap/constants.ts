import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v276: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v276: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v276: new ConstantType(
        'Stableswap.AmplificationRange',
        v276.RangeInclusive
    ),
}
