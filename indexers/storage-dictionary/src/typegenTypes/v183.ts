import {sts, Result, Option, Bytes, BitSequence} from './support'

export const RangeInclusive: sts.Type<RangeInclusive> = sts.struct(() => {
    return  {
        start: NonZeroU16,
        end: NonZeroU16,
    }
})

export const NonZeroU16 = sts.number()

export interface RangeInclusive {
    start: NonZeroU16
    end: NonZeroU16
}

export type NonZeroU16 = number

export type AccountId32 = Bytes

export const AccountId32 = sts.bytes()

export interface Type_101 {
    bits: number
}

export const Type_101: sts.Type<Type_101> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export interface PoolInfo {
    assets: number[]
    initialAmplification: NonZeroU16
    finalAmplification: NonZeroU16
    initialBlock: number
    finalBlock: number
    fee: Permill
}

export type Permill = number

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

export const Permill = sts.number()
