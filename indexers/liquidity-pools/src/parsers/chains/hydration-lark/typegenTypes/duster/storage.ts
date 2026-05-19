import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v405 from '../v405'

export const accountWhitelist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v405: new StorageType('Duster.AccountWhitelist', 'Optional', [v405.AccountId32], sts.unit()) as AccountWhitelistV405,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountWhitelistV405  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v405.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v405.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v405.AccountId32[]>
    getKeys(block: Block, key: v405.AccountId32): Promise<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v405.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<v405.AccountId32[]>
    getPairs(block: Block): Promise<[k: v405.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v405.AccountId32): Promise<[k: v405.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v405.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v405.AccountId32): AsyncIterable<[k: v405.AccountId32, v: (null | undefined)][]>
}
