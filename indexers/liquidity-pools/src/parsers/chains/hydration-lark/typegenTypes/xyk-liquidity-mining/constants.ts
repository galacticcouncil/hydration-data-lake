import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v405: new ConstantType(
        'XYKLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Oracle source identifier for this pallet.
     */
    v405: new ConstantType(
        'XYKLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's liquidity aggregation period.
     */
    v405: new ConstantType(
        'XYKLiquidityMining.OraclePeriod',
        v405.OraclePeriod
    ),
}
