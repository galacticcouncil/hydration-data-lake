import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const borrowingContract =  {
    /**
     *  Borrowing market contract address
     */
    v287: new StorageType('Liquidation.BorrowingContract', 'Default', [], v287.H160) as BorrowingContractV287,
}

/**
 *  Borrowing market contract address
 */
export interface BorrowingContractV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.H160
    get(block: Block): Promise<(v287.H160 | undefined)>
}
