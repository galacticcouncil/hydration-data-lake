import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const globalFarmAccRpzUpdated =  {
    name: 'OmnipoolWarehouseLM.GlobalFarmAccRPZUpdated',
    /**
     * Global farm accumulated reward per share was updated.
     */
    v405: new EventType(
        'OmnipoolWarehouseLM.GlobalFarmAccRPZUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            accumulatedRpz: v405.FixedU128,
            totalSharesZ: sts.bigint(),
        })
    ),
}

export const yieldFarmAccRpvsUpdated =  {
    name: 'OmnipoolWarehouseLM.YieldFarmAccRPVSUpdated',
    /**
     * Yield farm accumulated reward per valued share was updated.
     */
    v405: new EventType(
        'OmnipoolWarehouseLM.YieldFarmAccRPVSUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: v405.FixedU128,
            totalValuedShares: sts.bigint(),
        })
    ),
}

export const allRewardsDistributed =  {
    name: 'OmnipoolWarehouseLM.AllRewardsDistributed',
    /**
     * Global farm has no more rewards to distribute in the moment.
     */
    v405: new EventType(
        'OmnipoolWarehouseLM.AllRewardsDistributed',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}
