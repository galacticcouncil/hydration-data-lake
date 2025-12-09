import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v148 from '../v148'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v138: new ConstantType(
        'OmnipoolLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Identifier of oracle data soruce
     */
    v148: new ConstantType(
        'OmnipoolLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v148: new ConstantType(
        'OmnipoolLiquidityMining.OraclePeriod',
        v148.OraclePeriod
    ),
}
