import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId32 = Bytes

export interface Pool {
    owner: AccountId32
    start?: (number | undefined)
    end?: (number | undefined)
    assets: [number, number]
    initialWeight: number
    finalWeight: number
    weightCurve: WeightCurveType
    fee: [number, number]
    feeCollector: AccountId32
    repayTarget: bigint
}

export type WeightCurveType = WeightCurveType_Linear

export interface WeightCurveType_Linear {
    __kind: 'Linear'
}

export interface AssetDetails {
    name: Bytes
    assetType: AssetType
    existentialDeposit: bigint
    xcmRateLimit?: (bigint | undefined)
}

export type AssetType = AssetType_Bond | AssetType_PoolShare | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
}

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
}

export interface AssetType_StableSwap {
    __kind: 'StableSwap'
}

export interface AssetType_Token {
    __kind: 'Token'
}

export interface AssetType_XYK {
    __kind: 'XYK'
}

export const AssetDetails: sts.Type<AssetDetails> = sts.struct(() => {
    return  {
        name: sts.bytes(),
        assetType: AssetType,
        existentialDeposit: sts.bigint(),
        xcmRateLimit: sts.option(() => sts.bigint()),
    }
})

export const WeightCurveType: sts.Type<WeightCurveType> = sts.closedEnum(() => {
    return  {
        Linear: sts.unit(),
    }
})

export const Pool: sts.Type<Pool> = sts.struct(() => {
    return  {
        owner: AccountId32,
        start: sts.option(() => sts.number()),
        end: sts.option(() => sts.number()),
        assets: sts.tuple(() => [sts.number(), sts.number()]),
        initialWeight: sts.number(),
        finalWeight: sts.number(),
        weightCurve: WeightCurveType,
        fee: sts.tuple(() => [sts.number(), sts.number()]),
        feeCollector: AccountId32,
        repayTarget: sts.bigint(),
    }
})

export const AccountId32 = sts.bytes()

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        StableSwap: sts.unit(),
        Token: sts.unit(),
        XYK: sts.unit(),
    }
})
