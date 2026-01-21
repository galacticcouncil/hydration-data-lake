import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v276 from '../v276'
import * as v313 from '../v313'
import * as v378 from '../v378'

export const liquidated =  {
    name: 'Liquidation.Liquidated',
    /**
     * Money market position has been liquidated
     */
    v276: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            liquidator: v276.AccountId32,
            evmAddress: v276.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
    /**
     * Money market position has been liquidated
     */
    v313: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v313.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            debtToCover: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
    /**
     * Money market position has been liquidated
     */
    v378: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v378.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            profit: sts.bigint(),
        })
    ),
}
