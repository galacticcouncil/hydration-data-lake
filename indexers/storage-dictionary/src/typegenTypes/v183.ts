import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId32 = Bytes

export const AccountId32 = sts.bytes()

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

export const Permill = sts.number()

export const NonZeroU16 = sts.number()
