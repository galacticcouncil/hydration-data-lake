import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

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
    v324: new EventType(
        'HSM.CollateralAdded',
        sts.struct({
            assetId: sts.number(),
            poolId: sts.number(),
            purchaseFee: v324.Permill,
            maxBuyPriceCoefficient: v324.FixedU128,
            buyBackFee: v324.Permill,
            buybackRate: v324.Perbill,
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
    v324: new EventType(
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
    v337: new EventType(
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
    v324: new EventType(
        'HSM.CollateralUpdated',
        sts.struct({
            assetId: sts.number(),
            purchaseFee: sts.option(() => v324.Permill),
            maxBuyPriceCoefficient: sts.option(() => v324.FixedU128),
            buyBackFee: sts.option(() => v324.Permill),
            buybackRate: sts.option(() => v324.Perbill),
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
    v324: new EventType(
        'HSM.ArbitrageExecuted',
        sts.struct({
            assetId: sts.number(),
            hollarAmount: sts.bigint(),
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
    v324: new EventType(
        'HSM.FlashMinterSet',
        sts.struct({
            flashMinter: v324.H160,
        })
    ),
}
