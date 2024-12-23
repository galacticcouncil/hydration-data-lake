import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface AssetDetails {
    name: Bytes
    assetType: AssetType
    existentialDeposit: bigint
    xcmRateLimit?: (bigint | undefined)
}

export type AssetType = AssetType_PoolShare | AssetType_Token

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
}

export interface AssetType_Token {
    __kind: 'Token'
}

export const AssetDetails: sts.Type<AssetDetails> = sts.struct(() => {
    return  {
        name: sts.bytes(),
        assetType: AssetType,
        existentialDeposit: sts.bigint(),
        xcmRateLimit: sts.option(() => sts.bigint()),
    }
})

export const Trade: sts.Type<Trade> = sts.struct(() => {
    return  {
        pool: PoolType,
        assetIn: sts.number(),
        assetOut: sts.number(),
    }
})

export const PoolType: sts.Type<PoolType> = sts.closedEnum(() => {
    return  {
        LBP: sts.unit(),
        Omnipool: sts.unit(),
        Stableswap: sts.number(),
        XYK: sts.unit(),
    }
})

export type PoolType = PoolType_LBP | PoolType_Omnipool | PoolType_Stableswap | PoolType_XYK

export interface PoolType_LBP {
    __kind: 'LBP'
}

export interface PoolType_Omnipool {
    __kind: 'Omnipool'
}

export interface PoolType_Stableswap {
    __kind: 'Stableswap'
    value: number
}

export interface PoolType_XYK {
    __kind: 'XYK'
}

export interface Trade {
    pool: PoolType
    assetIn: number
    assetOut: number
}

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        Token: sts.unit(),
    }
})
