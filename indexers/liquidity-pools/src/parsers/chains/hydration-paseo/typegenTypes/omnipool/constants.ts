import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const hdxAssetId =  {
    /**
     *  Native Asset ID
     */
    v287: new ConstantType(
        'Omnipool.HdxAssetId',
        sts.number()
    ),
}

export const hubAssetId =  {
    /**
     *  Hub Asset ID
     */
    v287: new ConstantType(
        'Omnipool.HubAssetId',
        sts.number()
    ),
}

export const minWithdrawalFee =  {
    /**
     *  Minimum withdrawal fee
     */
    v287: new ConstantType(
        'Omnipool.MinWithdrawalFee',
        v287.Permill
    ),
}

export const minimumTradingLimit =  {
    /**
     *  Minimum trading limit
     */
    v287: new ConstantType(
        'Omnipool.MinimumTradingLimit',
        sts.bigint()
    ),
}

export const minimumPoolLiquidity =  {
    /**
     *  Minimum pool liquidity which can be added
     */
    v287: new ConstantType(
        'Omnipool.MinimumPoolLiquidity',
        sts.bigint()
    ),
}

export const maxInRatio =  {
    /**
     *  Max fraction of asset reserve to sell in single transaction
     */
    v287: new ConstantType(
        'Omnipool.MaxInRatio',
        sts.bigint()
    ),
}

export const maxOutRatio =  {
    /**
     *  Max fraction of asset reserve to buy in single transaction
     */
    v287: new ConstantType(
        'Omnipool.MaxOutRatio',
        sts.bigint()
    ),
}

export const nftCollectionId =  {
    /**
     *  Non fungible class id
     */
    v287: new ConstantType(
        'Omnipool.NFTCollectionId',
        sts.bigint()
    ),
}

export const burnProtocolFee =  {
    v287: new ConstantType(
        'Omnipool.BurnProtocolFee',
        v287.Permill
    ),
}
