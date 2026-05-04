import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'
import * as v406 from '../v406'

export const borrowingContract =  {
    /**
     *  Borrowing market contract address
     */
    v405: new StorageType('Liquidation.BorrowingContract', 'Default', [], v405.H160) as BorrowingContractV405,
}

/**
 *  Borrowing market contract address
 */
export interface BorrowingContractV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.H160
    get(block: Block): Promise<(v405.H160 | undefined)>
}

export const gigaHdxPoolContract =  {
    /**
     *  GIGAHDX borrowing market contract address (second pool instance for stHDX/HOLLAR)
     */
    v406: new StorageType('Liquidation.GigaHdxPoolContract', 'Default', [], v406.H160) as GigaHdxPoolContractV406,
}

/**
 *  GIGAHDX borrowing market contract address (second pool instance for stHDX/HOLLAR)
 */
export interface GigaHdxPoolContractV406  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v406.H160
    get(block: Block): Promise<(v406.H160 | undefined)>
}
