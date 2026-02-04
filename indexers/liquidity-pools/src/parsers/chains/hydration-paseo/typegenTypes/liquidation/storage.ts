import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const borrowingContract =  {
    /**
     *  Borrowing market contract address
     */
    v347: new StorageType('Liquidation.BorrowingContract', 'Default', [], v347.H160) as BorrowingContractV347,
}

/**
 *  Borrowing market contract address
 */
export interface BorrowingContractV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.H160
    get(block: Block): Promise<(v347.H160 | undefined)>
}
