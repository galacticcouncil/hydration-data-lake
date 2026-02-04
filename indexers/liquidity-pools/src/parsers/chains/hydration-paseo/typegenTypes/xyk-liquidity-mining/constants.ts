import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v347: new ConstantType(
        'XYKLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Oracle source identifier for this pallet.
     */
    v347: new ConstantType(
        'XYKLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's liquidity aggregation period.
     */
    v347: new ConstantType(
        'XYKLiquidityMining.OraclePeriod',
        v347.OraclePeriod
    ),
}
