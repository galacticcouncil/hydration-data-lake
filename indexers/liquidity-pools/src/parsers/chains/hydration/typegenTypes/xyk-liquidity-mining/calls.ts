import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v227 from '../v227'
import * as v272 from '../v272'

export const createGlobalFarm =  {
    name: 'XYKLiquidityMining.create_global_farm',
    /**
     * See [`Pallet::create_global_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.create_global_farm',
        sts.struct({
            totalRewards: sts.bigint(),
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            incentivizedAsset: sts.number(),
            rewardCurrency: sts.number(),
            owner: v227.AccountId32,
            yieldPerPeriod: v227.Perquintill,
            minDeposit: sts.bigint(),
            priceAdjustment: v227.FixedU128,
        })
    ),
}

export const updateGlobalFarm =  {
    name: 'XYKLiquidityMining.update_global_farm',
    /**
     * See [`Pallet::update_global_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.update_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
            priceAdjustment: v227.FixedU128,
        })
    ),
}

export const terminateGlobalFarm =  {
    name: 'XYKLiquidityMining.terminate_global_farm',
    /**
     * See [`Pallet::terminate_global_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.terminate_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}

export const createYieldFarm =  {
    name: 'XYKLiquidityMining.create_yield_farm',
    /**
     * See [`Pallet::create_yield_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.create_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v227.AssetPair,
            multiplier: v227.FixedU128,
            loyaltyCurve: sts.option(() => v227.LoyaltyCurve),
        })
    ),
}

export const updateYieldFarm =  {
    name: 'XYKLiquidityMining.update_yield_farm',
    /**
     * See [`Pallet::update_yield_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.update_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v227.AssetPair,
            multiplier: v227.FixedU128,
        })
    ),
}

export const stopYieldFarm =  {
    name: 'XYKLiquidityMining.stop_yield_farm',
    /**
     * See [`Pallet::stop_yield_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.stop_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v227.AssetPair,
        })
    ),
}

export const resumeYieldFarm =  {
    name: 'XYKLiquidityMining.resume_yield_farm',
    /**
     * See [`Pallet::resume_yield_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.resume_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v227.AssetPair,
            multiplier: v227.FixedU128,
        })
    ),
}

export const terminateYieldFarm =  {
    name: 'XYKLiquidityMining.terminate_yield_farm',
    /**
     * See [`Pallet::terminate_yield_farm`].
     */
    v227: new CallType(
        'XYKLiquidityMining.terminate_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v227.AssetPair,
        })
    ),
}

export const depositShares =  {
    name: 'XYKLiquidityMining.deposit_shares',
    /**
     * See [`Pallet::deposit_shares`].
     */
    v227: new CallType(
        'XYKLiquidityMining.deposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v227.AssetPair,
            sharesAmount: sts.bigint(),
        })
    ),
}

export const redepositShares =  {
    name: 'XYKLiquidityMining.redeposit_shares',
    /**
     * See [`Pallet::redeposit_shares`].
     */
    v227: new CallType(
        'XYKLiquidityMining.redeposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v227.AssetPair,
            depositId: sts.bigint(),
        })
    ),
}

export const claimRewards =  {
    name: 'XYKLiquidityMining.claim_rewards',
    /**
     * See [`Pallet::claim_rewards`].
     */
    v227: new CallType(
        'XYKLiquidityMining.claim_rewards',
        sts.struct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
        })
    ),
}

export const withdrawShares =  {
    name: 'XYKLiquidityMining.withdraw_shares',
    /**
     * See [`Pallet::withdraw_shares`].
     */
    v227: new CallType(
        'XYKLiquidityMining.withdraw_shares',
        sts.struct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
            assetPair: v227.AssetPair,
        })
    ),
}

export const joinFarms =  {
    name: 'XYKLiquidityMining.join_farms',
    /**
     * Join multiple farms with a given share amount
     * 
     * The share is deposited to the first farm of the specified fams,
     * and then redeposit the shares to the remaining farms
     * 
     * Parameters:
     * - `origin`: account depositing LP shares. This account has to have at least
     * - `farm_entries`: list of global farm id and yield farm id pairs to join
     * - `asset_pair`: asset pair identifying LP shares user wants to deposit.
     * - `shares_amount`: amount of LP shares user wants to deposit.
     * 
     * Emits `SharesDeposited` event for the first farm entry
     * Emits `SharesRedeposited` event for each farm entry after the first one
     */
    v272: new CallType(
        'XYKLiquidityMining.join_farms',
        sts.struct({
            farmEntries: sts.array(() => sts.tuple(() => [sts.number(), sts.number()])),
            assetPair: v272.AssetPair,
            sharesAmount: sts.bigint(),
        })
    ),
}

export const addLiquidityAndJoinFarms =  {
    name: 'XYKLiquidityMining.add_liquidity_and_join_farms',
    /**
     * Add liquidity to XYK pool and join multiple farms with a given share amount
     * 
     * The share is deposited to the first farm of the specified entries,
     * and then redeposit the shares to the remaining farms
     * 
     * Parameters:
     * - `origin`: account depositing LP shares. This account has to have at least
     * - `asset_a`: asset id of the first asset in the pair
     * - `asset_b`: asset id of the second asset in the pair
     * - `amount_a`: amount of the first asset to deposit
     * - `amount_b_max_limit`: maximum amount of the second asset to deposit
     * - `farm_entries`: list of global farm id and yield farm id pairs to join
     * 
     * Emits `SharesDeposited` event for the first farm entry
     * Emits `SharesRedeposited` event for each farm entry after the first one
     */
    v272: new CallType(
        'XYKLiquidityMining.add_liquidity_and_join_farms',
        sts.struct({
            assetA: sts.number(),
            assetB: sts.number(),
            amountA: sts.bigint(),
            amountBMaxLimit: sts.bigint(),
            farmEntries: sts.array(() => sts.tuple(() => [sts.number(), sts.number()])),
        })
    ),
}

export const exitFarms =  {
    name: 'XYKLiquidityMining.exit_farms',
    /**
     * Exit from all specified yield farms
     * 
     * This function will attempt to withdraw shares and claim rewards (if available) from all
     * specified yield farms for a given deposit.
     * 
     * Parameters:
     * - `origin`: account owner of deposit(nft).
     * - `deposit_id`: nft id representing deposit in the yield farm.
     * - `asset_pair`: asset pair identifying yield farm(s) in global farm(s).
     * - `farm_entries`: id(s) of yield farm(s) to exit from.
     * 
     * Emits:
     * * `RewardClaimed` for each successful claim
     * * `SharesWithdrawn` for each successful withdrawal
     * * `DepositDestroyed` if the deposit is fully withdrawn
     * 
     */
    v272: new CallType(
        'XYKLiquidityMining.exit_farms',
        sts.struct({
            depositId: sts.bigint(),
            assetPair: v272.AssetPair,
            farmEntries: sts.array(() => sts.number()),
        })
    ),
}
