import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v355 from '../v355'

export const collateralAdded =  {
    name: 'HSM.CollateralAdded',
    /**
     * A new collateral asset was added
     * 
     * Parameters:
     * - `asset_id`: The ID of the asset added as collateral
     * - `pool_id`: The StableSwap pool ID where this asset belongs
     * - `purchase_fee`: Fee applied when buying Hollar with this asset
     * - `max_buy_price_coefficient`: Maximum buy price coefficient for HSM to buy back Hollar
     * - `buy_back_fee`: Fee applied when buying back Hollar
     * - `buyback_rate`: Parameter that controls how quickly HSM can buy Hollar with this asset
     */
    v347: new EventType(
        'HSM.CollateralAdded',
        sts.struct({
            assetId: sts.number(),
            poolId: sts.number(),
            purchaseFee: v347.Permill,
            maxBuyPriceCoefficient: v347.FixedU128,
            buyBackFee: v347.Permill,
            buybackRate: v347.Perbill,
        })
    ),
}

export const collateralRemoved =  {
    name: 'HSM.CollateralRemoved',
    /**
     * A collateral asset was removed
     * 
     * Parameters:
     * - `asset_id`: The ID of the asset removed from collaterals
     */
    v347: new EventType(
        'HSM.CollateralRemoved',
        sts.struct({
            assetId: sts.number(),
        })
    ),
}

export const collateralUpdated =  {
    name: 'HSM.CollateralUpdated',
    /**
     * A collateral asset was updated
     * 
     * Parameters:
     * - `asset_id`: The ID of the updated collateral asset
     * - `purchase_fee`: New purchase fee if updated (None if not changed)
     * - `max_buy_price_coefficient`: New max buy price coefficient if updated (None if not changed)
     * - `buy_back_fee`: New buy back fee if updated (None if not changed)
     * - `buyback_rate`: New buyback rate if updated (None if not changed)
     */
    v347: new EventType(
        'HSM.CollateralUpdated',
        sts.struct({
            assetId: sts.number(),
            purchaseFee: sts.option(() => v347.Permill),
            maxBuyPriceCoefficient: sts.option(() => v347.FixedU128),
            buyBackFee: sts.option(() => v347.Permill),
            buybackRate: sts.option(() => v347.Perbill),
        })
    ),
    /**
     * A collateral asset was updated
     * 
     * Parameters:
     * - `asset_id`: The ID of the updated collateral asset
     * - `purchase_fee`: New purchase fee if updated (None if not changed)
     * - `max_buy_price_coefficient`: New max buy price coefficient if updated (None if not changed)
     * - `buy_back_fee`: New buy back fee if updated (None if not changed)
     * - `buyback_rate`: New buyback rate if updated (None if not changed)
     * - `max_in_holding`: New max collateral holding if updated (None if not changed)
     */
    v355: new EventType(
        'HSM.CollateralUpdated',
        sts.struct({
            assetId: sts.number(),
            purchaseFee: sts.option(() => v355.Permill),
            maxBuyPriceCoefficient: sts.option(() => v355.FixedU128),
            buyBackFee: sts.option(() => v355.Permill),
            buybackRate: sts.option(() => v355.Perbill),
            maxInHolding: sts.enumOption(() => sts.option(() => sts.bigint())),
        })
    ),
}

export const arbitrageExecuted =  {
    name: 'HSM.ArbitrageExecuted',
    /**
     * Arbitrage executed successfully
     * 
     * Parameters:
     * - `asset_id`: The collateral asset used in the arbitrage
     * - `hollar_amount`: Amount of Hollar that was included in the arbitrage operation
     */
    v347: new EventType(
        'HSM.ArbitrageExecuted',
        sts.struct({
            arbitrage: sts.number(),
            assetId: sts.number(),
            hollarAmount: sts.bigint(),
            profit: sts.bigint(),
        })
    ),
}

export const flashMinterSet =  {
    name: 'HSM.FlashMinterSet',
    /**
     * Flash minter address set
     * 
     * Parameters:
     * - `flash_minter`: The EVM address of the flash minter contract
     */
    v347: new EventType(
        'HSM.FlashMinterSet',
        sts.struct({
            flashMinter: v347.H160,
        })
    ),
}
