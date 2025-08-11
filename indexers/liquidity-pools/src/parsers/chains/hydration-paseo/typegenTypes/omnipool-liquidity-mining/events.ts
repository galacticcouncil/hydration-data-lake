import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const globalFarmCreated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmCreated',
    /**
     * New global farm was created.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmCreated',
        sts.struct({
            id: sts.number(),
            owner: v287.AccountId32,
            totalRewards: sts.bigint(),
            rewardCurrency: sts.number(),
            yieldPerPeriod: v287.Perquintill,
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            maxRewardPerPeriod: sts.bigint(),
            minDeposit: sts.bigint(),
            lrnaPriceAdjustment: v287.FixedU128,
        })
    ),
}

export const globalFarmUpdated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmUpdated',
    /**
     * Global farm was updated
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmUpdated',
        sts.struct({
            id: sts.number(),
            plannedYieldingPeriods: sts.number(),
            yieldPerPeriod: v287.Perquintill,
            minDeposit: sts.bigint(),
        })
    ),
}

export const globalFarmTerminated =  {
    name: 'OmnipoolLiquidityMining.GlobalFarmTerminated',
    /**
     * Global farm was terminated.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.GlobalFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            who: v287.AccountId32,
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
    v287: new EventType(
        'OmnipoolLiquidityMining.YieldFarmCreated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            multiplier: v287.FixedU128,
            loyaltyCurve: sts.option(() => v287.LoyaltyCurve),
        })
    ),
}

export const yieldFarmUpdated =  {
    name: 'OmnipoolLiquidityMining.YieldFarmUpdated',
    /**
     * Yield farm multiplier was updated.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.YieldFarmUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v287.AccountId32,
            multiplier: v287.FixedU128,
        })
    ),
}

export const yieldFarmStopped =  {
    name: 'OmnipoolLiquidityMining.YieldFarmStopped',
    /**
     * Yield farm for `asset_id` was stopped.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.YieldFarmStopped',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v287.AccountId32,
        })
    ),
}

export const yieldFarmResumed =  {
    name: 'OmnipoolLiquidityMining.YieldFarmResumed',
    /**
     * Yield farm for `asset_id` was resumed.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.YieldFarmResumed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v287.AccountId32,
            multiplier: v287.FixedU128,
        })
    ),
}

export const yieldFarmTerminated =  {
    name: 'OmnipoolLiquidityMining.YieldFarmTerminated',
    /**
     * Yield farm was terminated from the global farm.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.YieldFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetId: sts.number(),
            who: v287.AccountId32,
        })
    ),
}

export const sharesDeposited =  {
    name: 'OmnipoolLiquidityMining.SharesDeposited',
    /**
     * New LP shares(LP position) were deposited.
     */
    v287: new EventType(
        'OmnipoolLiquidityMining.SharesDeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: v287.AccountId32,
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
    v287: new EventType(
        'OmnipoolLiquidityMining.SharesRedeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            depositId: sts.bigint(),
            assetId: sts.number(),
            who: v287.AccountId32,
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
    v287: new EventType(
        'OmnipoolLiquidityMining.RewardClaimed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v287.AccountId32,
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
    v287: new EventType(
        'OmnipoolLiquidityMining.SharesWithdrawn',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v287.AccountId32,
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
    v287: new EventType(
        'OmnipoolLiquidityMining.DepositDestroyed',
        sts.struct({
            who: v287.AccountId32,
            depositId: sts.bigint(),
        })
    ),
}
