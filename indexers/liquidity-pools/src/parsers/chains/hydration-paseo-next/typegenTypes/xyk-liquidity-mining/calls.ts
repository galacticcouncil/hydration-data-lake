import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const createGlobalFarm =  {
    name: 'XYKLiquidityMining.create_global_farm',
    /**
     * Create new liquidity mining program with provided parameters.
     * 
     * `owner` account has to have at least `total_rewards` balance. This fund will be
     * transferred from `owner` to farm account.
     * In case of `reward_currency` is insufficient asset, farm's `owner` has to pay existential
     * deposit for global farm account and for liquidity mining `pot` account.
     * 
     * The dispatch origin for this call must be `T::CreateOrigin`.
     * !!!WARN: `T::CreateOrigin` has power over funds of `owner`'s account and it should be
     * configured to trusted origin e.g Sudo or Governance.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `total_rewards`: total rewards planned to distribute. This rewards will be
     * distributed between all yield farms in the global farm.
     * - `planned_yielding_periods`: planned number of periods to distribute `total_rewards`.
     * WARN: THIS IS NOT HARD DEADLINE. Not all rewards have to be distributed in
     * `planned_yielding_periods`. Rewards are distributed based on the situation in the yield
     * farms and can be distributed in a longer time frame but never in the shorter time frame.
     * - `blocks_per_period`:  number of blocks in a single period. Min. number of blocks per
     * period is 1.
     * - `incentivized_asset`: asset to be incentivized in XYK pools. All yield farms added into
     * liq. mining program have to have `incentivized_asset` in their pair.
     * - `reward_currency`: payoff currency of rewards.
     * - `owner`: liq. mining program owner.
     * - `yield_per_period`: percentage return on `reward_currency` of all farms p.a.
     * - `min_deposit`: minimum amount which can be deposited to the farm
     * - `price_adjustment`:
     * Emits `GlobalFarmCreated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.create_global_farm',
        sts.struct({
            totalRewards: sts.bigint(),
            plannedYieldingPeriods: sts.number(),
            blocksPerPeriod: sts.number(),
            incentivizedAsset: sts.number(),
            rewardCurrency: sts.number(),
            owner: v324.AccountId32,
            yieldPerPeriod: v324.Perquintill,
            minDeposit: sts.bigint(),
            priceAdjustment: v324.FixedU128,
        })
    ),
}

export const updateGlobalFarm =  {
    name: 'XYKLiquidityMining.update_global_farm',
    /**
     * Update global farm's prices adjustment.
     * 
     * Only farm's owner can perform this action.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: id of the global farm to update
     * - `price_adjustment`: new value for price adjustment
     * 
     * Emits `GlobalFarmUpdated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.update_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
            priceAdjustment: v324.FixedU128,
        })
    ),
}

export const terminateGlobalFarm =  {
    name: 'XYKLiquidityMining.terminate_global_farm',
    /**
     * Terminate existing liq. mining program.
     * 
     * Only farm owner can perform this action.
     * 
     * WARN: To successfully terminate a farm, farm have to be empty(all yield farms in he global farm must be terminated).
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: id of global farm to be terminated.
     * 
     * Emits `GlobalFarmTerminated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.terminate_global_farm',
        sts.struct({
            globalFarmId: sts.number(),
        })
    ),
}

export const createYieldFarm =  {
    name: 'XYKLiquidityMining.create_yield_farm',
    /**
     * Add yield farm for given `asset_pair` XYK pool.
     *  
     * Only farm owner can perform this action.
     * 
     * Only XYKs with `asset_pair` with `incentivized_asset` can be added into the farm. XYK
     * pool for `asset_pair` has to exist to successfully create yield farm.
     * Yield farm for same `asset_pair` can exist only once in the global farm.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `farm_id`: global farm id to which a yield farm will be added.
     * - `asset_pair`: asset pair identifying yield farm. Liq. mining will be allowed for this
     * `asset_pair` and one of the assets in the pair must be `incentivized_asset`.
     * - `multiplier`: yield farm multiplier.
     * - `loyalty_curve`: curve to calculate loyalty multiplier to distribute rewards to users
     * with time incentive. `None` means no loyalty multiplier.
     * 
     * Emits `YieldFarmCreated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.create_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v324.Type_287,
            multiplier: v324.FixedU128,
            loyaltyCurve: sts.option(() => v324.LoyaltyCurve),
        })
    ),
}

export const updateYieldFarm =  {
    name: 'XYKLiquidityMining.update_yield_farm',
    /**
     * Update yield farm multiplier.
     *  
     * Only farm owner can perform this action.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: global farm id in which yield farm will be updated.
     * - `asset_pair`: asset pair identifying yield farm in global farm.
     * - `multiplier`: new yield farm multiplier.
     * 
     * Emits `YieldFarmUpdated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.update_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v324.Type_287,
            multiplier: v324.FixedU128,
        })
    ),
}

export const stopYieldFarm =  {
    name: 'XYKLiquidityMining.stop_yield_farm',
    /**
     * Stop liq. miming for specific yield farm.
     * 
     * This function claims rewards from `GlobalFarm` last time and stops yield farm
     * incentivization from a `GlobalFarm`. Users will be able to only withdraw
     * shares(with claiming) after calling this function.
     * `deposit_shares()` and `claim_rewards()` are not allowed on canceled yield farm.
     *  
     * Only farm owner can perform this action.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: farm id in which yield farm will be canceled.
     * - `asset_pair`: asset pair identifying yield farm in the farm.
     * 
     * Emits `YieldFarmStopped` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.stop_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            assetPair: v324.Type_287,
        })
    ),
}

export const resumeYieldFarm =  {
    name: 'XYKLiquidityMining.resume_yield_farm',
    /**
     * Resume yield farm for stopped yield farm.
     * 
     * This function resume incentivization from `GlobalFarm` and restore full functionality
     * for yield farm. Users will be able to deposit, claim and withdraw again.
     * 
     * WARN: Yield farm is NOT rewarded for time it was stopped.
     * 
     * Only farm owner can perform this action.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: global farm id in which yield farm will be resumed.
     * - `yield_farm_id`: id of yield farm to be resumed.
     * - `asset_pair`: asset pair identifying yield farm in global farm.
     * - `multiplier`: yield farm multiplier in the farm.
     * 
     * Emits `YieldFarmResumed` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.resume_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v324.Type_287,
            multiplier: v324.FixedU128,
        })
    ),
}

export const terminateYieldFarm =  {
    name: 'XYKLiquidityMining.terminate_yield_farm',
    /**
     * Remove yield farm
     * 
     * This function marks a yield farm as ready to be removed from storage when it's empty. Users will
     * be able to only withdraw shares(without claiming rewards from yield farm). Unpaid rewards
     * will be transferred back to global farm and will be used to distribute to other yield farms.
     * 
     * Yield farm must be stopped before calling this function.
     * 
     * Only global farm's owner can perform this action. Yield farm stays in the storage until it's
     * empty(all farm entries are withdrawn). Last withdrawn from yield farm trigger removing from
     * the storage.
     * 
     * Parameters:
     * - `origin`: global farm's owner.
     * - `global_farm_id`: farm id from which yield farm should be terminated.
     * - `yield_farm_id`: id of yield farm to be terminated.
     * - `asset_pair`: asset pair identifying yield farm in the global farm.
     * 
     * Emits `YieldFarmTerminated` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.terminate_yield_farm',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v324.Type_287,
        })
    ),
}

export const depositShares =  {
    name: 'XYKLiquidityMining.deposit_shares',
    /**
     * Deposit LP shares to a liq. mining.
     * 
     * This function transfers LP shares from `origin` to pallet's account and mint nft for
     * `origin` account. Minted nft represents deposit in the liq. mining.
     * 
     * Parameters:
     * - `origin`: account depositing LP shares. This account has to have at least
     * `shares_amount` of LP shares.
     * - `global_farm_id`: id of global farm to which user wants to deposit LP shares.
     * - `yield_farm_id`: id of yield farm to deposit to.
     * - `asset_pair`: asset pair identifying LP shares user wants to deposit.
     * - `shares_amount`: amount of LP shares user wants to deposit.
     * 
     * Emits `SharesDeposited` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.deposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v324.Type_287,
            sharesAmount: sts.bigint(),
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
    v324: new CallType(
        'XYKLiquidityMining.join_farms',
        sts.struct({
            farmEntries: sts.array(() => sts.tuple(() => [sts.number(), sts.number()])),
            assetPair: v324.Type_287,
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
    v324: new CallType(
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

export const redepositShares =  {
    name: 'XYKLiquidityMining.redeposit_shares',
    /**
     * Redeposit already locked LP shares to another yield farm.
     * 
     * This function create yield farm entry for existing deposit. LP shares are not transferred
     * and amount of LP shares is based on existing deposit.
     * 
     * This function DOESN'T create new deposit.
     * 
     * Parameters:
     * - `origin`: account depositing LP shares. This account have to have at least
     * - `global_farm_id`: global farm identifier.
     * - `yield_farm_id`: yield farm identifier redepositing to.
     * - `asset_pair`: asset pair identifying LP shares user want to deposit.
     * - `deposit_id`: identifier of the deposit.
     * 
     * Emits `SharesRedeposited` event when successful.
     */
    v324: new CallType(
        'XYKLiquidityMining.redeposit_shares',
        sts.struct({
            globalFarmId: sts.number(),
            yieldFarmId: sts.number(),
            assetPair: v324.Type_287,
            depositId: sts.bigint(),
        })
    ),
}

export const claimRewards =  {
    name: 'XYKLiquidityMining.claim_rewards',
    /**
     * Claim rewards from liq. mining for deposit represented by `nft_id`.
     * 
     * This function calculate user rewards from liq. mining and transfer rewards to `origin`
     * account. Claiming in the same period is allowed only once.
     * 
     * Parameters:
     * - `origin`: account owner of deposit(nft).
     * - `deposit_id`: nft id representing deposit in the yield farm.
     * - `yield_farm_id`: yield farm identifier to claim rewards from.
     * 
     * Emits `RewardClaimed` event when successful.
     */
    v324: new CallType(
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
     * Withdraw LP shares from liq. mining with reward claiming if possible.
     * 
     * List of possible cases of transfers of LP shares and claimed rewards:
     * 
     * * yield farm is active(yield farm is not stopped) - claim and transfer rewards(if it
     * wasn't claimed in this period) and transfer LP shares.
     * * liq. mining is stopped - claim and transfer rewards(if it
     * wasn't claimed in this period) and transfer LP shares.
     * * yield farm was terminated - only LP shares will be transferred.
     * * farm was terminated - only LP shares will be transferred.
     * 
     * User's unclaimable rewards will be transferred back to global farm's account.
     * 
     * Parameters:
     * - `origin`: account owner of deposit(nft).
     * - `deposit_id`: nft id representing deposit in the yield farm.
     * - `yield_farm_id`: yield farm identifier to dithdraw shares from.
     * - `asset_pair`: asset pair identifying yield farm in global farm.
     * 
     * Emits:
     * * `RewardClaimed` if claim happen
     * * `SharesWithdrawn` event when successful
     */
    v324: new CallType(
        'XYKLiquidityMining.withdraw_shares',
        sts.struct({
            depositId: sts.bigint(),
            yieldFarmId: sts.number(),
            assetPair: v324.Type_287,
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
    v324: new CallType(
        'XYKLiquidityMining.exit_farms',
        sts.struct({
            depositId: sts.bigint(),
            assetPair: v324.Type_287,
            farmEntries: sts.array(() => sts.number()),
        })
    ),
}
