import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v257: new StorageType('System.Account', 'Default', [v257.AccountId32], v257.AccountInfo) as AccountV257,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV257  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v257.AccountInfo
    get(block: Block, key: v257.AccountId32): Promise<(v257.AccountInfo | undefined)>
    getMany(block: Block, keys: v257.AccountId32[]): Promise<(v257.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v257.AccountId32[]>
    getKeys(block: Block, key: v257.AccountId32): Promise<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v257.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<v257.AccountId32[]>
    getPairs(block: Block): Promise<[k: v257.AccountId32, v: (v257.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v257.AccountId32): Promise<[k: v257.AccountId32, v: (v257.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v257.AccountId32, v: (v257.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v257.AccountId32): AsyncIterable<[k: v257.AccountId32, v: (v257.AccountInfo | undefined)][]>
}
