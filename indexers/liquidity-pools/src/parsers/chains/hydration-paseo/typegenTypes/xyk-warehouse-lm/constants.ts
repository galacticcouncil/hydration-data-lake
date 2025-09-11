import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const palletId =  {
    /**
     *  Pallet id.
     */
    v287: new ConstantType(
        'XYKWarehouseLM.PalletId',
        v287.PalletId
    ),
}

export const treasuryAccountId =  {
    /**
     *  Treasury account to receive claimed rewards lower than ED
     */
    v287: new ConstantType(
        'XYKWarehouseLM.TreasuryAccountId',
        v287.AccountId32
    ),
}

export const minTotalFarmRewards =  {
    /**
     *  Minimum total rewards to distribute from global farm during liquidity mining.
     */
    v287: new ConstantType(
        'XYKWarehouseLM.MinTotalFarmRewards',
        sts.bigint()
    ),
}

export const minPlannedYieldingPeriods =  {
    /**
     *  Minimum number of periods to run liquidity mining program.
     */
    v287: new ConstantType(
        'XYKWarehouseLM.MinPlannedYieldingPeriods',
        sts.number()
    ),
}

export const maxFarmEntriesPerDeposit =  {
    /**
     *  Maximum number of yield farms same LP shares can be re/deposited into. This value always
     *  MUST BE >= 1.         
     */
    v287: new ConstantType(
        'XYKWarehouseLM.MaxFarmEntriesPerDeposit',
        sts.number()
    ),
}

export const maxYieldFarmsPerGlobalFarm =  {
    /**
     *  Max number of yield farms can exist in global farm. This includes all farms in the
     *  storage(active, stopped, terminated).
     */
    v287: new ConstantType(
        'XYKWarehouseLM.MaxYieldFarmsPerGlobalFarm',
        sts.number()
    ),
}
