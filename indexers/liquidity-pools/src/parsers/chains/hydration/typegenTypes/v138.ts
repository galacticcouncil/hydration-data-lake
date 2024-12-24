import {sts, Result, Option, Bytes, BitSequence} from './support'

export const LoyaltyCurve: sts.Type<LoyaltyCurve> = sts.struct(() => {
    return  {
        initialRewardPercentage: FixedU128,
        scaleCoef: sts.number(),
    }
})

export interface LoyaltyCurve {
    initialRewardPercentage: FixedU128
    scaleCoef: number
}

export type FixedU128 = bigint

export const FixedU128 = sts.bigint()

export const Perquintill = sts.bigint()

export const AccountId32 = sts.bytes()
