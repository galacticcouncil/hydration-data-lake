import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v227 from '../v227'

export const globalFarmAccRpzUpdated =  {
    name: 'XYKWarehouseLM.GlobalFarmAccRPZUpdated',
    /**
     * Global farm accumulated reward per share was updated.
     */
    v227: new EventType(
        'XYKWarehouseLM.GlobalFarmAccRPZUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            accumulatedRpz: v227.FixedU128,
            totalSharesZ: sts.bigint(),
        })
    ),
}

export const yieldFarmAccRpvsUpdated =  {
    name: 'XYKWarehouseLM.YieldFarmAccRPVSUpdated',
    /**
     * Yield farm accumulated reward per valued share was updated.
     */
    v227: new EventType(
        'XYKWarehouseLM.YieldFarmAccRPVSUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: v227.FixedU128,
            totalValuedShares: sts.bigint(),
        })
    ),
}

export const allRewardsDistributed =  {
    name: 'XYKWarehouseLM.AllRewardsDistributed',
    /**
     * Global farm has no more rewards to distribute in the moment.
     */
    v227: new EventType(
        'XYKWarehouseLM.AllRewardsDistributed',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}
