import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const borrowingContract =  {
    /**
     *  Borrowing market contract address
     */
    v324: new StorageType('Liquidation.BorrowingContract', 'Default', [], v324.H160) as BorrowingContractV324,
}

/**
 *  Borrowing market contract address
 */
export interface BorrowingContractV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.H160
    get(block: Block): Promise<(v324.H160 | undefined)>
}
