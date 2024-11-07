import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v257 from '../v257'

export const accounts =  {
    /**
     *  The balance of a token type under an account.
     * 
     *  NOTE: If the total is ever zero, decrease account ref account.
     * 
     *  NOTE: This is only used in the case that this module is used to store
     *  balances.
     */
    v257: new StorageType('Tokens.Accounts', 'Default', [v257.AccountId32, sts.number()], v257.Type_621) as AccountsV257,
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface AccountsV257  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v257.Type_621
    get(block: Block, key1: v257.AccountId32, key2: number): Promise<(v257.Type_621 | undefined)>
    getMany(block: Block, keys: [v257.AccountId32, number][]): Promise<(v257.Type_621 | undefined)[]>
    getKeys(block: Block): Promise<[v257.AccountId32, number][]>
    getKeys(block: Block, key1: v257.AccountId32): Promise<[v257.AccountId32, number][]>
    getKeys(block: Block, key1: v257.AccountId32, key2: number): Promise<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v257.AccountId32): AsyncIterable<[v257.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v257.AccountId32, key2: number): AsyncIterable<[v257.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
    getPairs(block: Block, key1: v257.AccountId32): Promise<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
    getPairs(block: Block, key1: v257.AccountId32, key2: number): Promise<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v257.AccountId32): AsyncIterable<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v257.AccountId32, key2: number): AsyncIterable<[k: [v257.AccountId32, number], v: (v257.Type_621 | undefined)][]>
}
