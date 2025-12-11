import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v324: new ConstantType(
        'OmnipoolLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}

export const oracleSource =  {
    /**
     *  Identifier of oracle data soruce
     */
    v324: new ConstantType(
        'OmnipoolLiquidityMining.OracleSource',
        sts.bytes()
    ),
}

export const oraclePeriod =  {
    /**
     *  Oracle's price aggregation period.
     */
    v324: new ConstantType(
        'OmnipoolLiquidityMining.OraclePeriod',
        v324.OraclePeriod
    ),
}
