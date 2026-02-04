import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v347: new StorageType('System.Account', 'Default', [v347.AccountId32], v347.AccountInfo) as AccountV347,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV347  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v347.AccountInfo
    get(block: Block, key: v347.AccountId32): Promise<(v347.AccountInfo | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(v347.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (v347.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (v347.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (v347.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (v347.AccountInfo | undefined)][]>
}
