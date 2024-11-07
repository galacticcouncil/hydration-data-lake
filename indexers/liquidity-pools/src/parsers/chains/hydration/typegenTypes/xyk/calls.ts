import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const createPool =  {
    name: 'XYK.create_pool',
    /**
     * Create new pool for given asset pair.
     * 
     * Registers new pool for given asset pair (`asset a` and `asset b`) in asset registry.
     * Asset registry creates new id or returns previously created one if such pool existed before.
     * 
     * Pool is created with initial liquidity provided by `origin`.
     * Shares are issued with specified initial price and represents proportion of asset in the pool.
     * 
     * Emits `PoolCreated` event when successful.
     */
    v183: new CallType(
        'XYK.create_pool',
        sts.struct({
            assetA: sts.number(),
            amountA: sts.bigint(),
            assetB: sts.number(),
            amountB: sts.bigint(),
        })
    ),
}
