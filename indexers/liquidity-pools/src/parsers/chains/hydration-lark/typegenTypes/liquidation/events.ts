import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'
import * as v406 from '../v406'

export const liquidated =  {
    name: 'Liquidation.Liquidated',
    /**
     * Money market position has been liquidated
     */
    v405: new EventType(
        'Liquidation.Liquidated',
        sts.struct({
            user: v405.H160,
            collateralAsset: sts.number(),
            debtAsset: sts.number(),
            profit: sts.bigint(),
        })
    ),
}

export const gigaHdxLiquidated =  {
    name: 'Liquidation.GigaHdxLiquidated',
    /**
     * GIGAHDX position has been liquidated by treasury
     */
    v406: new EventType(
        'Liquidation.GigaHdxLiquidated',
        sts.struct({
            user: v406.H160,
            debtRepaid: sts.bigint(),
            gigahdxSeized: sts.bigint(),
        })
    ),
}
