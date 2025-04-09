import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v183 from '../v183'

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v183: new ConstantType(
        'Stableswap.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading amount
     */
    v183: new ConstantType(
        'Stableswap.MinTradingLimit',
        sts.bigint()
    ),
}

export const amplificationRange =  {
    /**
     *  Amplification inclusive range. Pool's amp can be selected from the range only.
     */
    v183: new ConstantType(
        'Stableswap.AmplificationRange',
        v183.RangeInclusive
    ),
}
