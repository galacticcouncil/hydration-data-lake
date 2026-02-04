import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'
import * as v374 from '../v374'
import * as v376 from '../v376'

export const accountExtension =  {
    /**
     *  Maps an EVM address to the last 12 bytes of a substrate account.
     */
    v347: new StorageType('EVMAccounts.AccountExtension', 'Optional', [v347.H160], sts.bytes()) as AccountExtensionV347,
}

/**
 *  Maps an EVM address to the last 12 bytes of a substrate account.
 */
export interface AccountExtensionV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (Bytes | undefined)][]>
}

export const contractDeployer =  {
    /**
     *  Whitelisted addresses that are allowed to deploy smart contracts.
     */
    v347: new StorageType('EVMAccounts.ContractDeployer', 'Optional', [v347.H160], sts.unit()) as ContractDeployerV347,
}

/**
 *  Whitelisted addresses that are allowed to deploy smart contracts.
 */
export interface ContractDeployerV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
}

export const approvedContract =  {
    /**
     *  Whitelisted contracts that are allowed to manage balances and tokens.
     */
    v347: new StorageType('EVMAccounts.ApprovedContract', 'Optional', [v347.H160], sts.unit()) as ApprovedContractV347,
}

/**
 *  Whitelisted contracts that are allowed to manage balances and tokens.
 */
export interface ApprovedContractV347  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v347.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v347.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v347.H160[]>
    getKeys(block: Block, key: v347.H160): Promise<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v347.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<v347.H160[]>
    getPairs(block: Block): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v347.H160): Promise<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v347.H160): AsyncIterable<[k: v347.H160, v: (null | undefined)][]>
}

export const markedEvmAccounts =  {
    /**
     *  Tracks accounts that have been marked as EVM accounts.
     *  An account is marked as EVM account right before we charge the evm fee
     *  This is used to avoid resetting frame system nonce of accounts.
     *  When we mark account as EVM account, we increase its sufficients counter by one.
     *  We never decrease this sufficients, so side effect is that account can never be reaped
     */
    v374: new StorageType('EVMAccounts.MarkedEvmAccounts', 'Optional', [v374.AccountId32], sts.unit()) as MarkedEvmAccountsV374,
}

/**
 *  Tracks accounts that have been marked as EVM accounts.
 *  An account is marked as EVM account right before we charge the evm fee
 *  This is used to avoid resetting frame system nonce of accounts.
 *  When we mark account as EVM account, we increase its sufficients counter by one.
 *  We never decrease this sufficients, so side effect is that account can never be reaped
 */
export interface MarkedEvmAccountsV374  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v374.AccountId32): Promise<(null | undefined)>
    getMany(block: Block, keys: v374.AccountId32[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v374.AccountId32[]>
    getKeys(block: Block, key: v374.AccountId32): Promise<v374.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v374.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v374.AccountId32): AsyncIterable<v374.AccountId32[]>
    getPairs(block: Block): Promise<[k: v374.AccountId32, v: (null | undefined)][]>
    getPairs(block: Block, key: v374.AccountId32): Promise<[k: v374.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v374.AccountId32, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v374.AccountId32): AsyncIterable<[k: v374.AccountId32, v: (null | undefined)][]>
}

export const allowances =  {
    /**
     *  ERC20-style allowances storage for the MultiCurrency precompile:
     *  (asset_id, owner, spender) -> allowance
     */
    v376: new StorageType('EVMAccounts.Allowances', 'Default', [sts.number(), v376.H160, v376.H160], sts.bigint()) as AllowancesV376,
}

/**
 *  ERC20-style allowances storage for the MultiCurrency precompile:
 *  (asset_id, owner, spender) -> allowance
 */
export interface AllowancesV376  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block, key1: number, key2: v376.H160, key3: v376.H160): Promise<(bigint | undefined)>
    getMany(block: Block, keys: [number, v376.H160, v376.H160][]): Promise<(bigint | undefined)[]>
    getKeys(block: Block): Promise<[number, v376.H160, v376.H160][]>
    getKeys(block: Block, key1: number): Promise<[number, v376.H160, v376.H160][]>
    getKeys(block: Block, key1: number, key2: v376.H160): Promise<[number, v376.H160, v376.H160][]>
    getKeys(block: Block, key1: number, key2: v376.H160, key3: v376.H160): Promise<[number, v376.H160, v376.H160][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[number, v376.H160, v376.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[number, v376.H160, v376.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: v376.H160): AsyncIterable<[number, v376.H160, v376.H160][]>
    getKeysPaged(pageSize: number, block: Block, key1: number, key2: v376.H160, key3: v376.H160): AsyncIterable<[number, v376.H160, v376.H160][]>
    getPairs(block: Block): Promise<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number): Promise<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number, key2: v376.H160): Promise<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairs(block: Block, key1: number, key2: v376.H160, key3: v376.H160): Promise<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number): AsyncIterable<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: v376.H160): AsyncIterable<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: number, key2: v376.H160, key3: v376.H160): AsyncIterable<[k: [number, v376.H160, v376.H160], v: (bigint | undefined)][]>
}
