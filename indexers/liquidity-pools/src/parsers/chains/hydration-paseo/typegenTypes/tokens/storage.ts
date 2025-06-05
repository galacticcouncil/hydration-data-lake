import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const totalIssuance =  {
    /**
     *  The total issuance of a token type.
     */
    v287: new StorageType('Tokens.TotalIssuance', 'Default', [sts.number()], sts.bigint()) as TotalIssuanceV287,
}

/**
 *  The total issuance of a token type.
 */
export interface TotalIssuanceV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block, key: number): Promise<(bigint | undefined)>
    getMany(block: Block, keys: number[]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (bigint | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (bigint | undefined)][]>
}

export const accounts =  {
    /**
     *  The balance of a token type under an account.
     * 
     *  NOTE: If the total is ever zero, decrease account ref account.
     * 
     *  NOTE: This is only used in the case that this module is used to store
     *  balances.
     */
    v287: new StorageType('Tokens.Accounts', 'Default', [v287.AccountId32, sts.number()], v287.Type_686) as AccountsV287,
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface AccountsV287  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v287.Type_686
    get(block: Block, key1: v287.AccountId32, key2: number): Promise<(v287.Type_686 | undefined)>
    getMany(block: Block, keys: [v287.AccountId32, number][]): Promise<(v287.Type_686 | undefined)[]>
    getKeys(block: Block): Promise<[v287.AccountId32, number][]>
    getKeys(block: Block, key1: v287.AccountId32): Promise<[v287.AccountId32, number][]>
    getKeys(block: Block, key1: v287.AccountId32, key2: number): Promise<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[v287.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[v287.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32): Promise<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
    getPairs(block: Block, key1: v287.AccountId32, key2: number): Promise<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32): AsyncIterable<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v287.AccountId32, key2: number): AsyncIterable<[k: [v287.AccountId32, number], v: (v287.Type_686 | undefined)][]>
}
