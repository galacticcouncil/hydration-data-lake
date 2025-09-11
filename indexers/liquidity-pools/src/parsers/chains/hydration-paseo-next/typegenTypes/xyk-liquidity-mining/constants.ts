import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v335 from '../v335'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v324: new ConstantType(
        'XYKLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Oracle source identifier for this pallet.
     */
    v335: new ConstantType(
        'XYKLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's liquidity aggregation period.
     */
    v335: new ConstantType(
        'XYKLiquidityMining.OraclePeriod',
        v335.OraclePeriod
    ),
}
