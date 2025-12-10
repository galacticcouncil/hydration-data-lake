import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v287: new ConstantType(
        'OmnipoolLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Identifier of oracle data soruce
     */
    v287: new ConstantType(
        'OmnipoolLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v287: new ConstantType(
        'OmnipoolLiquidityMining.OraclePeriod',
        v287.OraclePeriod
    ),
}
