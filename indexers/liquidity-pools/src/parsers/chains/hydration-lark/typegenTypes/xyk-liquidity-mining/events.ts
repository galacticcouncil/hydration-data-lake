import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const globalFarmCreated =  {
    name: 'XYKLiquidityMining.GlobalFarmCreated',
    /**
     * New global farm was created.
     */
    v405: new EventType(
        'XYKLiquidityMining.GlobalFarmCreated',
        sts.struct({
            id: sts.number(),
            owner: v405.AccountId32,
            totalRewards: sts.bigint(),
            rewardCurrency: sts.number(),
            yieldPerPeriod: v405.Perquintill,
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            incentivizedAsset: sts.number(),
            maxRewardPerPeriod: sts.bigint(),
            minDeposit: sts.bigint(),
            priceAdjustment: v405.FixedU128,
        })
    ),
}

export const globalFarmUpdated =  {
    name: 'XYKLiquidityMining.GlobalFarmUpdated',
    /**
     * Global farm's `price_adjustment` was updated.
     */
    v405: new EventType(
        'XYKLiquidityMining.GlobalFarmUpdated',
        sts.struct({
            id: sts.number(),
            priceAdjustment: v405.FixedU128,
        })
    ),
}

export const yieldFarmCreated =  {
    name: 'XYKLiquidityMining.YieldFarmCreated',
    /**
     * New yield farm was added into the farm.
     */
    v405: new EventType(
        'XYKLiquidityMining.YieldFarmCreated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            multiplier: v405.FixedU128,
            assetPair: v405.Type_306,
            loyaltyCurve: sts.option(() => v405.LoyaltyCurve),
        })
    ),
}

export const globalFarmTerminated =  {
    name: 'XYKLiquidityMining.GlobalFarmTerminated',
    /**
     * Global farm was terminated.
     */
    v405: new EventType(
        'XYKLiquidityMining.GlobalFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            who: v405.AccountId32,
            rewardCurrency: sts.number(),
            undistributedRewards: sts.bigint(),
        })
    ),
}

export const sharesDeposited =  {
    name: 'XYKLiquidityMining.SharesDeposited',
    /**
     * New LP tokens was deposited.
     */
    v405: new EventType(
        'XYKLiquidityMining.SharesDeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            amount: sts.bigint(),
            lpToken: sts.number(),
            depositId: sts.bigint(),
        })
    ),
}

export const sharesRedeposited =  {
    name: 'XYKLiquidityMining.SharesRedeposited',
    /**
     * LP token was redeposited for a new yield farm entry
     */
    v405: new EventType(
        'XYKLiquidityMining.SharesRedeposited',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            amount: sts.bigint(),
            lpToken: sts.number(),
            depositId: sts.bigint(),
        })
    ),
}

export const rewardClaimed =  {
    name: 'XYKLiquidityMining.RewardClaimed',
    /**
     * Rewards was claimed.
     */
    v405: new EventType(
        'XYKLiquidityMining.RewardClaimed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            claimed: sts.bigint(),
            rewardCurrency: sts.number(),
            depositId: sts.bigint(),
        })
    ),
}

export const sharesWithdrawn =  {
    name: 'XYKLiquidityMining.SharesWithdrawn',
    /**
     * LP tokens was withdrawn.
     */
    v405: new EventType(
        'XYKLiquidityMining.SharesWithdrawn',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            lpToken: sts.number(),
            amount: sts.bigint(),
            depositId: sts.bigint(),
        })
    ),
}

export const yieldFarmStopped =  {
    name: 'XYKLiquidityMining.YieldFarmStopped',
    /**
     * Yield farm for asset pair was stopped.
     */
    v405: new EventType(
        'XYKLiquidityMining.YieldFarmStopped',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            assetPair: v405.Type_306,
        })
    ),
}

export const yieldFarmResumed =  {
    name: 'XYKLiquidityMining.YieldFarmResumed',
    /**
     * Yield farm for asset pair was resumed.
     */
    v405: new EventType(
        'XYKLiquidityMining.YieldFarmResumed',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            assetPair: v405.Type_306,
            multiplier: v405.FixedU128,
        })
    ),
}

export const yieldFarmTerminated =  {
    name: 'XYKLiquidityMining.YieldFarmTerminated',
    /**
     * Yield farm was terminated from global farm.
     */
    v405: new EventType(
        'XYKLiquidityMining.YieldFarmTerminated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            assetPair: v405.Type_306,
        })
    ),
}

export const yieldFarmUpdated =  {
    name: 'XYKLiquidityMining.YieldFarmUpdated',
    /**
     * Yield farm multiplier was updated.
     */
    v405: new EventType(
        'XYKLiquidityMining.YieldFarmUpdated',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            who: v405.AccountId32,
            assetPair: v405.Type_306,
            multiplier: v405.FixedU128,
        })
    ),
}

export const depositDestroyed =  {
    name: 'XYKLiquidityMining.DepositDestroyed',
    /**
     * NFT representing deposit has been destroyed
     */
    v405: new EventType(
        'XYKLiquidityMining.DepositDestroyed',
        sts.struct({
            who: v405.AccountId32,
            depositId: sts.bigint(),
        })
    ),
}
