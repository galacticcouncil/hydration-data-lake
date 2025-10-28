import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v355 from '../v355'

export const accountBlacklist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v347: new StorageType('Duster.AccountBlacklist', 'Optional', [v347.AccountId32], sts.unit()) as AccountBlacklistV347,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountBlacklistV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v347.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v347.AccountId32[]>
    getKeys(block: Block, key: v347.AccountId32): Promise<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<v347.AccountId32[]>
    getPairs(block: Block): Promise<[k: v347.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v347.AccountId32): Promise<[k: v347.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.AccountId32): AsyncIterable<[k: v347.AccountId32, v: (null | undefined)][]>
}

export const rewardAccount =  {
    /**
     *  Account to take reward from.
     */
    v347: new StorageType('Duster.RewardAccount', 'Optional', [], v347.AccountId32) as RewardAccountV347,
}

/**
 *  Account to take reward from.
 */
export interface RewardAccountV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v347.AccountId32 | undefined)>
}

export const dustAccount =  {
    /**
     *  Account to send dust to.
     */
    v347: new StorageType('Duster.DustAccount', 'Optional', [], v347.AccountId32) as DustAccountV347,
}

/**
 *  Account to send dust to.
 */
export interface DustAccountV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v347.AccountId32 | undefined)>
}

export const accountWhitelist =  {
    /**
     *  Accounts excluded from dusting.
     */
    v355: new StorageType('Duster.AccountWhitelist', 'Optional', [v355.AccountId32], sts.unit()) as AccountWhitelistV355,
}

/**
 *  Accounts excluded from dusting.
 */
export interface AccountWhitelistV355  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v355.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v355.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v355.AccountId32[]>
    getKeys(block: Block, key: v355.AccountId32): Promise<v355.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v355.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v355.AccountId32): AsyncIterable<v355.AccountId32[]>
    getPairs(block: Block): Promise<[k: v355.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v355.AccountId32): Promise<[k: v355.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v355.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v355.AccountId32): AsyncIterable<[k: v355.AccountId32, v: (null | undefined)][]>
}
