import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v405: new ConstantType(
        'OmnipoolLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Identifier of oracle data soruce
     */
    v405: new ConstantType(
        'OmnipoolLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v405: new ConstantType(
        'OmnipoolLiquidityMining.OraclePeriod',
        v405.OraclePeriod
    ),
}
