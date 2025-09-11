import {sts, Result, Option, Bytes, BitSequence} from './support'

export interface Position {
    assetId: number
    amount: bigint
    shares: bigint
    price: [bigint, bigint]
}

export const Position: sts.Type<Position> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
        shares: sts.bigint(),
        price: sts.tuple(() => [sts.bigint(), sts.bigint()]),
    }
})
