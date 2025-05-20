import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v138 from '../v138'
import * as v241 from '../v241'

export const palletId =  {
    /**
     *  Pallet id.
     */
    v138: new ConstantType(
        'OmnipoolWarehouseLM.PalletId',
        v138.PalletId
    ),
}

export const minTotalFarmRewards =  {
    /**
     *  Minimum total rewards to distribute from global farm during liquidity mining.
     */
    v138: new ConstantType(
        'OmnipoolWarehouseLM.MinTotalFarmRewards',
        sts.bigint()
    ),
}

export const minPlannedYieldingPeriods =  {
    /**
     *  Minimum number of periods to run liquidity mining program.
     */
    v138: new ConstantType(
        'OmnipoolWarehouseLM.MinPlannedYieldingPeriods',
        sts.number()
    ),
}

export const maxFarmEntriesPerDeposit =  {
    /**
     *  Maximum number of yield farms same LP shares can be re/deposited into. This value always
     *  MUST BE >= 1.         
     */
    v138: new ConstantType(
        'OmnipoolWarehouseLM.MaxFarmEntriesPerDeposit',
        sts.number()
    ),
}

export const maxYieldFarmsPerGlobalFarm =  {
    /**
     *  Max number of yield farms can exist in global farm. This includes all farms in the
     *  storage(active, stopped, deleted).
     */
    v138: new ConstantType(
        'OmnipoolWarehouseLM.MaxYieldFarmsPerGlobalFarm',
        sts.number()
    ),
}

export const treasuryAccountId =  {
    /**
     *  Treasury account to receive claimed rewards lower than ED
     */
    v241: new ConstantType(
        'OmnipoolWarehouseLM.TreasuryAccountId',
        v241.AccountId32
    ),
}
