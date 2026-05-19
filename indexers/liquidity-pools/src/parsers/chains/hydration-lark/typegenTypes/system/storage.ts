import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v405: new StorageType('System.Account', 'Default', [v405.AccountId32], v405.AccountInfo) as AccountV405,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV405  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v405.AccountInfo
    get(block: Block, key: v405.AccountId32): Promise<(v405.AccountInfo | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(v405.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (v405.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (v405.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (v405.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (v405.AccountInfo | undefined)][]>
}
