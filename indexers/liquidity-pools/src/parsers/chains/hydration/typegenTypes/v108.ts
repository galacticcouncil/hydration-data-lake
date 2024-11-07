import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId32 = Bytes

export interface Type_368 {
    free: bigint
    reserved: bigint
    frozen: bigint
}

export const Type_368: sts.Type<Type_368> = sts.struct(() => {
    return  {
        free: sts.bigint(),
        reserved: sts.bigint(),
        frozen: sts.bigint(),
    }
})

export interface AssetDetails {
    name: BoundedVec
    assetType: AssetType
    existentialDeposit: bigint
    locked: boolean
}

export type AssetType = AssetType_PoolShare | AssetType_Token

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
}

export interface AssetType_Token {
    __kind: 'Token'
}

export type BoundedVec = Bytes

export const AssetDetails: sts.Type<AssetDetails> = sts.struct(() => {
    return  {
        name: BoundedVec,
        assetType: AssetType,
        existentialDeposit: sts.bigint(),
        locked: sts.boolean(),
    }
})

export const AccountId32 = sts.bytes()

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        Token: sts.unit(),
    }
})

export const BoundedVec = sts.bytes()
