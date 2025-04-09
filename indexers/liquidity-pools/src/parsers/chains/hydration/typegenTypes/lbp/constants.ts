import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const minTradingLimit =  {
    /**
     *  Minimum trading limit, sole purpose of this is to keep the math working
     */
    v176: new ConstantType(
        'LBP.MinTradingLimit',
        sts.bigint()
    ),
}

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity, sole purpose of this is to keep the math working
     */
    v176: new ConstantType(
        'LBP.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const maxInRatio =  {
    /**
     *  Max fraction of pool to sell in single transaction
     */
    v176: new ConstantType(
        'LBP.MaxInRatio',
        sts.bigint()
    ),
}

export const maxOutRatio =  {
    /**
     *  Max fraction of pool to buy in single transaction
     */
    v176: new ConstantType(
        'LBP.MaxOutRatio',
        sts.bigint()
    ),
}

export const repayFee =  {
    v176: new ConstantType(
        'LBP.repay_fee',
        sts.tuple(() => [sts.number(), sts.number()])
    ),
}
