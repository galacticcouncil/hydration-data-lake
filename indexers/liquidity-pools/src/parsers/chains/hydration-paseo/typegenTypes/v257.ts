import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface Type_621 {
    free: bigint
    reserved: bigint
    frozen: bigint
}

export const Type_621: sts.Type<Type_621> = sts.struct(() => {
    return  {
        free: sts.bigint(),
        reserved: sts.bigint(),
        frozen: sts.bigint(),
    }
})

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

export interface PoolInfo {
    assets: number[]
    initialAmplification: NonZeroU16
    finalAmplification: NonZeroU16
    initialBlock: number
    finalBlock: number
    fee: Permill
}

export type Permill = number

export type NonZeroU16 = number

export const PoolInfo: sts.Type<PoolInfo> = sts.struct(() => {
    return  {
        assets: sts.array(() => sts.number()),
        initialAmplification: NonZeroU16,
        finalAmplification: NonZeroU16,
        initialBlock: sts.number(),
        finalBlock: sts.number(),
        fee: Permill,
    }
})

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

export interface AssetDetails {
    name?: (Bytes | undefined)
    assetType: AssetType
    existentialDeposit: bigint
    symbol?: (Bytes | undefined)
    decimals?: (number | undefined)
    xcmRateLimit?: (bigint | undefined)
    isSufficient: boolean
}

export type AssetType = AssetType_Bond | AssetType_External | AssetType_StableSwap | AssetType_Token | AssetType_XYK

export interface AssetType_Bond {
    __kind: 'Bond'
}

export interface AssetType_External {
    __kind: 'External'
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
        name: sts.option(() => sts.bytes()),
        assetType: AssetType,
        existentialDeposit: sts.bigint(),
        symbol: sts.option(() => sts.bytes()),
        decimals: sts.option(() => sts.number()),
        xcmRateLimit: sts.option(() => sts.bigint()),
        isSufficient: sts.boolean(),
    }
})

export type AccountId32 = Bytes

export interface AccountInfo {
    nonce: number
    consumers: number
    providers: number
    sufficients: number
    data: AccountData
}

export interface AccountData {
    free: bigint
    reserved: bigint
    frozen: bigint
    flags: ExtraFlags
}

export type ExtraFlags = bigint

export const AccountInfo: sts.Type<AccountInfo> = sts.struct(() => {
    return  {
        nonce: sts.number(),
        consumers: sts.number(),
        providers: sts.number(),
        sufficients: sts.number(),
        data: AccountData,
    }
})

export const AccountData: sts.Type<AccountData> = sts.struct(() => {
    return  {
        free: sts.bigint(),
        reserved: sts.bigint(),
        frozen: sts.bigint(),
        flags: ExtraFlags,
    }
})

export const ExtraFlags = sts.bigint()

export const ParachainInherentData: sts.Type<ParachainInherentData> = sts.struct(() => {
    return  {
        validationData: V6PersistedValidationData,
        relayChainState: StorageProof,
        downwardMessages: sts.array(() => InboundDownwardMessage),
        horizontalMessages: sts.array(() => sts.tuple(() => [Id, sts.array(() => InboundHrmpMessage)])),
    }
})

export const InboundHrmpMessage: sts.Type<InboundHrmpMessage> = sts.struct(() => {
    return  {
        sentAt: sts.number(),
        data: sts.bytes(),
    }
})

export interface InboundHrmpMessage {
    sentAt: number
    data: Bytes
}

export const Id = sts.number()

export const InboundDownwardMessage: sts.Type<InboundDownwardMessage> = sts.struct(() => {
    return  {
        sentAt: sts.number(),
        msg: sts.bytes(),
    }
})

export interface InboundDownwardMessage {
    sentAt: number
    msg: Bytes
}

export const StorageProof: sts.Type<StorageProof> = sts.struct(() => {
    return  {
        trieNodes: sts.array(() => sts.bytes()),
    }
})

export interface StorageProof {
    trieNodes: Bytes[]
}

export const V6PersistedValidationData: sts.Type<V6PersistedValidationData> = sts.struct(() => {
    return  {
        parentHead: HeadData,
        relayParentNumber: sts.number(),
        relayParentStorageRoot: H256,
        maxPovSize: sts.number(),
    }
})

export const H256 = sts.bytes()

export const HeadData = sts.bytes()

export interface V6PersistedValidationData {
    parentHead: HeadData
    relayParentNumber: number
    relayParentStorageRoot: H256
    maxPovSize: number
}

export type H256 = Bytes

export type HeadData = Bytes

export interface ParachainInherentData {
    validationData: V6PersistedValidationData
    relayChainState: StorageProof
    downwardMessages: InboundDownwardMessage[]
    horizontalMessages: [Id, InboundHrmpMessage[]][]
}

export type Id = number

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

export const AssetAmount: sts.Type<AssetAmount> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
    }
})

export interface AssetAmount {
    assetId: number
    amount: bigint
}

export const Permill = sts.number()

export const NonZeroU16 = sts.number()

export const FixedU128 = sts.bigint()

export const AssetType: sts.Type<AssetType> = sts.closedEnum(() => {
    return  {
        Bond: sts.unit(),
        External: sts.unit(),
        StableSwap: sts.unit(),
        Token: sts.unit(),
        XYK: sts.unit(),
    }
})

export const AccountId32 = sts.bytes()
