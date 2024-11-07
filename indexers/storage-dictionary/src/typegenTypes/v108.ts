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

export const AccountId32 = sts.bytes()
