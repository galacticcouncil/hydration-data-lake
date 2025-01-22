import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const createGlobalFarm =  {
    name: 'OmnipoolLiquidityMining.create_global_farm',
    /**
     * See [`Pallet::create_global_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.create_global_farm',
        sts.struct({
            totalRewards: sts.bigint(),
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            rewardCurrency: sts.number(),
            owner: v257.AccountId32,
            yieldPerPeriod: v257.Perquintill,
            minDeposit: sts.bigint(),
            lrnaPriceAdjustment: v257.FixedU128,
        })
    ),
}

export const terminateGlobalFarm =  {
    name: 'OmnipoolLiquidityMining.terminate_global_farm',
    /**
     * See [`Pallet::terminate_global_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.terminate_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}

export const createYieldFarm =  {
    name: 'OmnipoolLiquidityMining.create_yield_farm',
    /**
     * See [`Pallet::create_yield_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.create_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: v257.FixedU128,
            loyaltyCurve: sts.option(() => v257.LoyaltyCurve),
        })
    ),
}

export const updateYieldFarm =  {
    name: 'OmnipoolLiquidityMining.update_yield_farm',
    /**
     * See [`Pallet::update_yield_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.update_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: v257.FixedU128,
        })
    ),
}

export const stopYieldFarm =  {
    name: 'OmnipoolLiquidityMining.stop_yield_farm',
    /**
     * See [`Pallet::stop_yield_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.stop_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetId: sts.number(),
        })
    ),
}

export const resumeYieldFarm =  {
    name: 'OmnipoolLiquidityMining.resume_yield_farm',
    /**
     * See [`Pallet::resume_yield_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.resume_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: v257.FixedU128,
        })
    ),
}

export const terminateYieldFarm =  {
    name: 'OmnipoolLiquidityMining.terminate_yield_farm',
    /**
     * See [`Pallet::terminate_yield_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.terminate_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
        })
    ),
}

export const depositShares =  {
    name: 'OmnipoolLiquidityMining.deposit_shares',
    /**
     * See [`Pallet::deposit_shares`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.deposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            positionId: sts.bigint(),
        })
    ),
}

export const redepositShares =  {
    name: 'OmnipoolLiquidityMining.redeposit_shares',
    /**
     * See [`Pallet::redeposit_shares`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.redeposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
        })
    ),
}

export const claimRewards =  {
    name: 'OmnipoolLiquidityMining.claim_rewards',
    /**
     * See [`Pallet::claim_rewards`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.claim_rewards',
        sts.struct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        })
    ),
}

export const withdrawShares =  {
    name: 'OmnipoolLiquidityMining.withdraw_shares',
    /**
     * See [`Pallet::withdraw_shares`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.withdraw_shares',
        sts.struct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        })
    ),
}

export const updateGlobalFarm =  {
    name: 'OmnipoolLiquidityMining.update_global_farm',
    /**
     * See [`Pallet::update_global_farm`].
     */
    v257: new CallType(
        'OmnipoolLiquidityMining.update_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
            plannedYieldingPeriods: sts.number(),
            yieldPerPeriod: v257.Perquintill,
            minDeposit: sts.bigint(),
        })
    ),
}
