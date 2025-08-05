import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const globalFarmAccRpzUpdated =  {
    name: 'OmnipoolWarehouseLM.GlobalFarmAccRPZUpdated',
    /**
     * Global farm accumulated reward per share was updated.
     */
    v324: new EventType(
        'OmnipoolWarehouseLM.GlobalFarmAccRPZUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            accumulatedRpz: v324.FixedU128,
            totalSharesZ: sts.bigint(),
        })
    ),
}

export const yieldFarmAccRpvsUpdated =  {
    name: 'OmnipoolWarehouseLM.YieldFarmAccRPVSUpdated',
    /**
     * Yield farm accumulated reward per valued share was updated.
     */
    v324: new EventType(
        'OmnipoolWarehouseLM.YieldFarmAccRPVSUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            accumulatedRpvs: v324.FixedU128,
            totalValuedShares: sts.bigint(),
        })
    ),
}

export const allRewardsDistributed =  {
    name: 'OmnipoolWarehouseLM.AllRewardsDistributed',
    /**
     * Global farm has no more rewards to distribute in the moment.
     */
    v324: new EventType(
        'OmnipoolWarehouseLM.AllRewardsDistributed',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}
