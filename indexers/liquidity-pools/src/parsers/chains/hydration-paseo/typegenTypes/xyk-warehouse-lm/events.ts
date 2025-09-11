import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const globalFarmAccRpzUpdated =  {
    name: 'XYKWarehouseLM.GlobalFarmAccRPZUpdated',
    /**
     * Global farm accumulated reward per share was updated.
     */
    v287: new EventType(
        'XYKWarehouseLM.GlobalFarmAccRPZUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            accumulatedRpz: v287.FixedU128,
            totalSharesZ: sts.bigint(),
        })
    ),
}

export const yieldFarmAccRpvsUpdated =  {
    name: 'XYKWarehouseLM.YieldFarmAccRPVSUpdated',
    /**
     * Yield farm accumulated reward per valued share was updated.
     */
    v287: new EventType(
        'XYKWarehouseLM.YieldFarmAccRPVSUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: v287.FixedU128,
            totalValuedShares: sts.bigint(),
        })
    ),
}

export const allRewardsDistributed =  {
    name: 'XYKWarehouseLM.AllRewardsDistributed',
    /**
     * Global farm has no more rewards to distribute in the moment.
     */
    v287: new EventType(
        'XYKWarehouseLM.AllRewardsDistributed',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}
