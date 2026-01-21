import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const liquidated =  {
    name: 'Liquidation.Liquidated',
    /**
     * Money market position has been liquidated
     */
    v324: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v324.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
}
