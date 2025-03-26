import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v138 from '../v138'
import * as v257 from '../v257'

export const globalFarmCreated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmCreated',
    /**
     * New global farm was created.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmCreated',
        sts.struct({
            id: sts.number(),
            owner: v138.AccountId32,
            totalRewards: sts.bigint(),
            rewardCurrency: sts.number(),
            yieldPerPeriod: v138.Perquintill,
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            maxRewardPerPeriod: sts.bigint(),
            minDeposit: sts.bigint(),
            lrnaPriceAdjustment: v138.FixedU128,
        })
    ),
}

export const globalFarmUpdated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmUpdated',
    /**
     * Global farm's `lrna_price_adjustment` was updated.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmUpdated',
        sts.struct({
            id: sts.number(),
            lrnaPriceAdjustment: v138.FixedU128,
        })
    ),
    /**
     * Global farm was updated
     */
    v257: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmUpdated',
        sts.struct({
            id: sts.number(),
            plannedYieldingPeriods: sts.number(),
            yieldPerPeriod: v257.Perquintill,
            minDeposit: sts.bigint(),
        })
    ),
}

export const globalFarmTerminated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmTerminated',
    /**
     * Global farm was terminated.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            who: v138.AccountId32,
            rewardCurrency: sts.number(),
            undistributedRewards: sts.bigint(),
        })
    ),
}

export const yieldFarmCreated =  {
    name: 'OmnipoolLiquidityMining.YieldFarmCreated',
    /**
     * New yield farm was added to the farm.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.YieldFarmCreated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: v138.FixedU128,
            loyaltyCurve: sts.option(() => v138.LoyaltyCurve),
        })
    ),
}

export const yieldFarmUpdated =  {
    name: 'OmnipoolLiquidityMining.YieldFarmUpdated',
    /**
     * Yield farm multiplier was updated.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.YieldFarmUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v138.AccountId32,
            multiplier: v138.FixedU128,
        })
    ),
}

export const yieldFarmStopped =  {
    name: 'OmnipoolLiquidityMining.YieldFarmStopped',
    /**
     * Yield farm for `asset_id` was stopped.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.YieldFarmStopped',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v138.AccountId32,
        })
    ),
}

export const yieldFarmResumed =  {
    name: 'OmnipoolLiquidityMining.YieldFarmResumed',
    /**
     * Yield farm for `asset_id` was resumed.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.YieldFarmResumed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v138.AccountId32,
            multiplier: v138.FixedU128,
        })
    ),
}

export const yieldFarmTerminated =  {
    name: 'OmnipoolLiquidityMining.YieldFarmTerminated',
    /**
     * Yield farm was terminated from the global farm.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.YieldFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v138.AccountId32,
        })
    ),
}

export const sharesDeposited =  {
    name: 'OmnipoolLiquidityMining.SharesDeposited',
    /**
     * New LP shares(LP position) were deposited.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.SharesDeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: v138.AccountId32,
            sharesAmount: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const sharesRedeposited =  {
    name: 'OmnipoolLiquidityMining.SharesRedeposited',
    /**
     * Already locked LP shares were redeposited to another yield farm.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.SharesRedeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: v138.AccountId32,
            sharesAmount: sts.bigint(),
            positionId: sts.bigint(),
        })
    ),
}

export const rewardClaimed =  {
    name: 'OmnipoolLiquidityMining.RewardClaimed',
    /**
     * Rewards were claimed.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.RewardClaimed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v138.AccountId32,
            claimed: sts.bigint(),
            rewardCurrency: sts.number(),
            depositId: sts.bigint(),
        })
    ),
}

export const sharesWithdrawn =  {
    name: 'OmnipoolLiquidityMining.SharesWithdrawn',
    /**
     * LP shares were withdrawn.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.SharesWithdrawn',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v138.AccountId32,
            amount: sts.bigint(),
            depositId: sts.bigint(),
        })
    ),
}

export const depositDestroyed =  {
    name: 'OmnipoolLiquidityMining.DepositDestroyed',
    /**
     * All LP shares were unlocked and NFT representing deposit was destroyed.
     */
    v138: new EventType(
        'OmnipoolLiquidityMining.DepositDestroyed',
        sts.struct({
            who: v138.AccountId32,
            depositId: sts.bigint(),
        })
    ),
}
