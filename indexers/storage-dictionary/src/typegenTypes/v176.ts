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

export const WeightCurveType: sts.Type<WeightCurveType> = sts.closedEnum(() => {
    return  {
        Linear: sts.unit(),
    }
})

export const AccountId32 = sts.bytes()
