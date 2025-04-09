import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v115 from '../v115'
import * as v148 from '../v148'
import * as v287 from '../v287'

export const hdxAssetId =  {
    /**
     *  Native Asset ID
     */
    v115: new ConstantType(
        'Omnipool.HdxAssetId',
        sts.number()
    ),
}

export const hubAssetId =  {
    /**
     *  Hub Asset ID
     */
    v115: new ConstantType(
        'Omnipool.HubAssetId',
        sts.number()
    ),
}

export const stableCoinAssetId =  {
    /**
     *  Preferred stable Asset ID
     */
    v115: new ConstantType(
        'Omnipool.StableCoinAssetId',
        sts.number()
    ),
}

export const protocolFee =  {
    /**
     *  Protocol fee
     */
    v115: new ConstantType(
        'Omnipool.ProtocolFee',
        v115.Permill
    ),
}

export const assetFee =  {
    /**
     *  Asset fee
     */
    v115: new ConstantType(
        'Omnipool.AssetFee',
        v115.Permill
    ),
}

export const tvlCap =  {
    /**
     *  TVL cap
     */
    v115: new ConstantType(
        'Omnipool.TVLCap',
        sts.bigint()
    ),
}

export const minimumTradingLimit =  {
    /**
     *  Minimum trading limit
     */
    v115: new ConstantType(
        'Omnipool.MinimumTradingLimit',
        sts.bigint()
    ),
}

export const minimumPoolLiquidity =  {
    /**
     *  Minimum pool liquidity which can be added
     */
    v115: new ConstantType(
        'Omnipool.MinimumPoolLiquidity',
        sts.bigint()
    ),
}

export const maxInRatio =  {
    /**
     *  Max fraction of asset reserve to sell in single transaction
     */
    v115: new ConstantType(
        'Omnipool.MaxInRatio',
        sts.bigint()
    ),
}

export const maxOutRatio =  {
    /**
     *  Max fraction of asset reserve to buy in single transaction
     */
    v115: new ConstantType(
        'Omnipool.MaxOutRatio',
        sts.bigint()
    ),
}

export const nftCollectionId =  {
    /**
     *  Non fungible class id
     */
    v123: new ConstantType(
        'Omnipool.NFTCollectionId',
        sts.bigint()
    ),
}

export const minWithdrawalFee =  {
    /**
     *  Minimum withdrawal fee
     */
    v148: new ConstantType(
        'Omnipool.MinWithdrawalFee',
        v148.Permill
    ),
}

export const burnProtocolFee =  {
    v287: new ConstantType(
        'Omnipool.BurnProtocolFee',
        v287.Permill
    ),
}
