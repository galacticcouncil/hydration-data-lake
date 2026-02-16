import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v222 from '../v222'
import * as v264 from '../v264'
import * as v378 from '../v378'

export const accountExtension =  {
    /**
     *  Maps an EVM address to the last 12 bytes of a substrate account.
     */
    v222: new StorageType('EVMAccounts.AccountExtension', 'Optional', [v222.H160], sts.bytes()) as AccountExtensionV222,
}

/**
 *  Maps an EVM address to the last 12 bytes of a substrate account.
 */
export interface AccountExtensionV222  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v222.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v222.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v222.H160[]>
    getKeys(block: Block, key: v222.H160): Promise<v222.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v222.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v222.H160): AsyncIterable<v222.H160[]>
    getPairs(block: Block): Promise<[k: v222.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v222.H160): Promise<[k: v222.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v222.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v222.H160): AsyncIterable<[k: v222.H160, v: (Bytes | undefined)][]>
}

export const contractDeployer =  {
    /**
     *  Whitelisted addresses that are allowed to deploy smart contracts.
     */
    v222: new StorageType('EVMAccounts.ContractDeployer', 'Optional', [v222.H160], sts.unit()) as ContractDeployerV222,
}

/**
 *  Whitelisted addresses that are allowed to deploy smart contracts.
 */
export interface ContractDeployerV222  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v222.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v222.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v222.H160[]>
    getKeys(block: Block, key: v222.H160): Promise<v222.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v222.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v222.H160): AsyncIterable<v222.H160[]>
    getPairs(block: Block): Promise<[k: v222.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v222.H160): Promise<[k: v222.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v222.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v222.H160): AsyncIterable<[k: v222.H160, v: (null | undefined)][]>
}

export const approvedContract =  {
    /**
     *  Whitelisted contracts that are allowed to manage balances and tokens.
     */
    v264: new StorageType('EVMAccounts.ApprovedContract', 'Optional', [v264.H160], sts.unit()) as ApprovedContractV264,
}

/**
 *  Whitelisted contracts that are allowed to manage balances and tokens.
 */
export interface ApprovedContractV264  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v264.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v264.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v264.H160[]>
    getKeys(block: Block, key: v264.H160): Promise<v264.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v264.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v264.H160): AsyncIterable<v264.H160[]>
    getPairs(block: Block): Promise<[k: v264.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v264.H160): Promise<[k: v264.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v264.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v264.H160): AsyncIterable<[k: v264.H160, v: (null | undefined)][]>
}

export const markedEvmAccounts =  {
    /**
     *  Tracks accounts that have been marked as EVM accounts.
     *  An account is marked as EVM account right before we charge the evm fee
     *  This is used to avoid resetting frame system nonce of accounts.
     *  When we mark account as EVM account, we increase its sufficients counter by one.
     *  We never decrease this sufficients, so side effect is that account can never be reaped
     */
    v378: new StorageType('EVMAccounts.MarkedEvmAccounts', 'Optional', [v378.AccountId32], sts.unit()) as MarkedEvmAccountsV378,
}

/**
 *  Tracks accounts that have been marked as EVM accounts.
 *  An account is marked as EVM account right before we charge the evm fee
 *  This is used to avoid resetting frame system nonce of accounts.
 *  When we mark account as EVM account, we increase its sufficients counter by one.
 *  We never decrease this sufficients, so side effect is that account can never be reaped
 */
export interface MarkedEvmAccountsV378  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v378.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v378.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v378.AccountId32[]>
    getKeys(block: Block, key: v378.AccountId32): Promise<v378.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v378.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v378.AccountId32): AsyncIterable<v378.AccountId32[]>
    getPairs(block: Block): Promise<[k: v378.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v378.AccountId32): Promise<[k: v378.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v378.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v378.AccountId32): AsyncIterable<[k: v378.AccountId32, v: (null | undefined)][]>
}

export const allowances =  {
    /**
     *  ERC20-style allowances storage for the MultiCurrency precompile:
     *  (asset_id, owner, spender) -> allowance
     */
    v378: new StorageType('EVMAccounts.Allowances', 'Default', [sts.number(), v378.H160, v378.H160], sts.bigint()) as AllowancesV378,
}

/**
 *  ERC20-style allowances storage for the MultiCurrency precompile:
 *  (asset_id, owner, spender) -> allowance
 */
export interface AllowancesV378  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block, key1: number, key2: v378.H160, key3: v378.H160): Promise<(bigint | undefined)>
    getMany(block: Block, keys: [number, v378.H160, v378.H160][]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<[number, v378.H160, v378.H160][]>
    getKeys(block: Block, key1: number): Promise<[number, v378.H160, v378.H160][]>
    getKeys(block: Block, key1: number, key2: v378.H160): Promise<[number, v378.H160, v378.H160][]>
    getKeys(block: Block, key1: number, key2: v378.H160, key3: v378.H160): Promise<[number, v378.H160, v378.H160][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, v378.H160, v378.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, v378.H160, v378.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: v378.H160): AsyncIterable<[number, v378.H160, v378.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: v378.H160, key3: v378.H160): AsyncIterable<[number, v378.H160, v378.H160][]>
    getPairs(block: Block): Promise<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number, key2: v378.H160): Promise<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number, key2: v378.H160, key3: v378.H160): Promise<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: v378.H160): AsyncIterable<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: v378.H160, key3: v378.H160): AsyncIterable<[k: [number, v378.H160, v378.H160], v: (bigint | undefined)][]>
}
