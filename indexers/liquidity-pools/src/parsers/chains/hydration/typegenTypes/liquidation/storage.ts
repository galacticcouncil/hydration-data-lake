import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const borrowingContract =  {
    /**
     *  Borrowing market contract address
     */
    v276: new StorageType('Liquidation.BorrowingContract', 'Default', [], v276.H160) as BorrowingContractV276,
}

/**
 *  Borrowing market contract address
 */
export interface BorrowingContractV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.H160
    get(block: Block): Promise<(v276.H160 | undefined)>
}
