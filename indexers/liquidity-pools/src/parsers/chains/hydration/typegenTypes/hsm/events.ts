import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v323 from '../v323'
import * as v359 from '../v359'

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
    v323: new EventType(
        'HSM.CollateralAdded',
        sts.struct({
            assetId: sts.number(),
            poolId: sts.number(),
            purchaseFee: v323.Permill,
            maxBuyPriceCoefficient: v323.FixedU128,
            buyBackFee: v323.Permill,
            buybackRate: v323.Perbill,
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
     * - `amount`: The amount of the asset that was returned (should be zero)
     */
    v323: new EventType(
        'HSM.CollateralRemoved',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
        })
    ),
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
    v323: new EventType(
        'HSM.CollateralUpdated',
        sts.struct({
            assetId: sts.number(),
            purchaseFee: sts.option(() => v323.Permill),
            maxBuyPriceCoefficient: sts.option(() => v323.FixedU128),
            buyBackFee: sts.option(() => v323.Permill),
            buybackRate: sts.option(() => v323.Perbill),
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
    v359: new EventType(
        'HSM.CollateralUpdated',
        sts.struct({
            assetId: sts.number(),
            purchaseFee: sts.option(() => v359.Permill),
            maxBuyPriceCoefficient: sts.option(() => v359.FixedU128),
            buyBackFee: sts.option(() => v359.Permill),
            buybackRate: sts.option(() => v359.Perbill),
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
    v323: new EventType(
        'HSM.ArbitrageExecuted',
        sts.struct({
            assetId: sts.number(),
            hollarAmount: sts.bigint(),
        })
    ),
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
    v323: new EventType(
        'HSM.FlashMinterSet',
        sts.struct({
            flashMinter: v323.H160,
        })
    ),
}
