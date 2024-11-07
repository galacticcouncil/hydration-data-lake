import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface AssetState {
    hubReserve: bigint
    shares: bigint
    protocolShares: bigint
    cap: bigint
    tradable: Tradability
}

export interface Tradability {
    bits: number
}

export const AssetState: sts.Type<AssetState> = sts.struct(() => {
    return  {
        hubReserve: sts.bigint(),
        shares: sts.bigint(),
        protocolShares: sts.bigint(),
        cap: sts.bigint(),
        tradable: Tradability,
    }
})

export const Tradability: sts.Type<Tradability> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export const AccountId32 = sts.bytes()

export const FixedU128 = sts.bigint()

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        PoolShare: sts.tuple(() => [sts.number(), sts.number()]),
        Token: sts.unit(),
    }
})

export type AssetType = AssetType_PoolShare | AssetType_Token

export interface AssetType_PoolShare {
    __kind: 'PoolShare'
    value: [number, number]
}

export interface AssetType_Token {
    __kind: 'Token'
}
