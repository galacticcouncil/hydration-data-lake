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

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        Token: sts.unit(),
    }
})
