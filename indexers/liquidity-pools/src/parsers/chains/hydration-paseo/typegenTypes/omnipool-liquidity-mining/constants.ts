import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v347: new ConstantType(
        'OmnipoolLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Identifier of oracle data soruce
     */
    v347: new ConstantType(
        'OmnipoolLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v347: new ConstantType(
        'OmnipoolLiquidityMining.OraclePeriod',
        v347.OraclePeriod
    ),
}
