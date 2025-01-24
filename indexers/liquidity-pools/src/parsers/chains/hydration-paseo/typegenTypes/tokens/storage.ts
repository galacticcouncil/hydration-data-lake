import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const totalIssuance =  {
    /**
     *  The total issuance of a token type.
     */
    v276: new StorageType('Tokens.TotalIssuance', 'Default', [sts.number()], sts.bigint()) as TotalIssuanceV276,
}

/**
 *  The total issuance of a token type.
 */
export interface TotalIssuanceV276  {
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
    v276: new StorageType('Tokens.Accounts', 'Default', [v276.AccountId32, sts.number()], v276.Type_673) as AccountsV276,
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface AccountsV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.Type_673
    get(block: Block, key1: v276.AccountId32, key2: number): Promise<(v276.Type_673 | undefined)>
    getMany(block: Block, keys: [v276.AccountId32, number][]): Promise<(v276.Type_673 | undefined)[]>
    getKeys(block: Block): Promise<[v276.AccountId32, number][]>
    getKeys(block: Block, key1: v276.AccountId32): Promise<[v276.AccountId32, number][]>
    getKeys(block: Block, key1: v276.AccountId32, key2: number): Promise<[v276.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[v276.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v276.AccountId32): AsyncIterable<[v276.AccountId32, number][]>
    getKeysPaged(pageSize: number, block: Block, key1: v276.AccountId32, key2: number): AsyncIterable<[v276.AccountId32, number][]>
    getPairs(block: Block): Promise<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
    getPairs(block: Block, key1: v276.AccountId32): Promise<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
    getPairs(block: Block, key1: v276.AccountId32, key2: number): Promise<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v276.AccountId32): AsyncIterable<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: v276.AccountId32, key2: number): AsyncIterable<[k: [v276.AccountId32, number], v: (v276.Type_673 | undefined)][]>
}
