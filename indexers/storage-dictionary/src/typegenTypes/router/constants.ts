import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const maxNumberOfTrades =  {
    /**
     *  Max limit for the number of trades within a route
     */
    v160: new ConstantType(
        'Router.MaxNumberOfTrades',
        sts.number()
    ),
}

export const nativeAssetId =  {
    /**
     *  Native Asset Id
     */
    v193: new ConstantType(
        'Router.NativeAssetId',
        sts.number()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v257: new ConstantType(
        'Router.OraclePeriod',
        v257.OraclePeriod
    ),
}
