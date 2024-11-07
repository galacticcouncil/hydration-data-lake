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
