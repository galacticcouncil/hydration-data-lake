import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v362 from '../v362'

export const liquidated =  {
    name: 'Liquidation.Liquidated',
    /**
     * Money market position has been liquidated
     */
    v347: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v347.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
    /**
     * Money market position has been liquidated
     */
    v362: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v362.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            profit: sts.bigint(),
        })
    ),
}
