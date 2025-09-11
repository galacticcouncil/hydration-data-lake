import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const nftCollectionId =  {
    /**
     *  NFT collection id for liquidity mining's deposit nfts.
     */
    v287: new ConstantType(
        'XYKLiquidityMining.NFTCollectionId',
        sts.bigint()
    ),
}
