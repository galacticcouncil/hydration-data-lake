import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'
import * as v314 from '../v314'

export const liquidated =  {
    name: 'Liquidation.Liquidated',
    /**
     * Money market position has been liquidated
     */
    v287: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            liquidator: v287.AccountId32,
            evmAddress: v287.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
    /**
     * Money market position has been liquidated
     */
    v314: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v314.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
}
