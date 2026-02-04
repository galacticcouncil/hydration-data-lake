import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const hdxAssetId =  {
    /**
     *  Native Asset ID
     */
    v347: new ConstantType(
        'Omnipool.HdxAssetId',
        sts.number()
    ),
}

export const hubAssetId =  {
    /**
     *  Hub Asset ID
     */
    v347: new ConstantType(
        'Omnipool.HubAssetId',
        sts.number()
    ),
}

export const minWithdrawalFee =  {
    /**
     *  Minimum withdrawal fee
     */
    v347: new ConstantType(
        'Omnipool.MinWithdrawalFee',
        v347.Permill
    ),
}

export const minimumTradingLimit =  {
    /**
     *  Minimum trading limit
     */
    v347: new ConstantType(
        'Omnipool.MinimumTradingLimit',
        sts.bigint()
    ),
}

export const minimumPoolLiquidity =  {
    /**
     *  Minimum pool liquidity which can be added
     */
    v347: new ConstantType(
        'Omnipool.MinimumPoolLiquidity',
        sts.bigint()
    ),
}

export const maxInRatio =  {
    /**
     *  Max fraction of asset reserve to sell in single transaction
     */
    v347: new ConstantType(
        'Omnipool.MaxInRatio',
        sts.bigint()
    ),
}

export const maxOutRatio =  {
    /**
     *  Max fraction of asset reserve to buy in single transaction
     */
    v347: new ConstantType(
        'Omnipool.MaxOutRatio',
        sts.bigint()
    ),
}

export const nftCollectionId =  {
    /**
     *  Non fungible class id
     */
    v347: new ConstantType(
        'Omnipool.NFTCollectionId',
        sts.bigint()
    ),
}

export const burnProtocolFee =  {
    v347: new ConstantType(
        'Omnipool.BurnProtocolFee',
        v347.Permill
    ),
}
