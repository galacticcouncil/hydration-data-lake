import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v324: new StorageType('System.Account', 'Default', [v324.AccountId32], v324.AccountInfo) as AccountV324,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV324  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v324.AccountInfo
    get(block: Block, key: v324.AccountId32): Promise<(v324.AccountInfo | undefined)>
    getMany(block: Block, keys: v324.AccountId32[]): Promise<(v324.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v324.AccountId32[]>
    getKeys(block: Block, key: v324.AccountId32): Promise<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<v324.AccountId32[]>
    getPairs(block: Block): Promise<[k: v324.AccountId32, v: (v324.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v324.AccountId32): Promise<[k: v324.AccountId32, v: (v324.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.AccountId32, v: (v324.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.AccountId32): AsyncIterable<[k: v324.AccountId32, v: (v324.AccountInfo | undefined)][]>
}
