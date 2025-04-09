import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const nativeAssetId =  {
    /**
     *  Native Asset Id
     */
    v276: new ConstantType(
        'XYK.NativeAssetId',
        sts.number()
    ),
}

export const getExchangeFee =  {
    /**
     *  Trading fee rate
     */
    v276: new ConstantType(
        'XYK.GetExchangeFee',
        sts.tuple(() => [sts.number(), sts.number()])
    ),
}

export const minTradingLimit =  {
    /**
     *  Minimum trading limit
     */
    v276: new ConstantType(
        'XYK.MinTradingLimit',
        sts.bigint()
    ),
}

export const minPoolLiquidity =  {
    /**
     *  Minimum pool liquidity
     */
    v276: new ConstantType(
        'XYK.MinPoolLiquidity',
        sts.bigint()
    ),
}

export const maxInRatio =  {
    /**
     *  Max fraction of pool to sell in single transaction
     */
    v276: new ConstantType(
        'XYK.MaxInRatio',
        sts.bigint()
    ),
}

export const maxOutRatio =  {
    /**
     *  Max fraction of pool to buy in single transaction
     */
    v276: new ConstantType(
        'XYK.MaxOutRatio',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Oracle source identifier for this pallet.
     */
    v276: new ConstantType(
        'XYK.OracleSource',
        sts.bytes()
    ),
}
