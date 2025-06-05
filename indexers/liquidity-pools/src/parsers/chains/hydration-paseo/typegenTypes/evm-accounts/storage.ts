import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v287 from '../v287'

export const accountExtension =  {
    /**
     *  Maps an EVM address to the last 12 bytes of a substrate account.
     */
    v287: new StorageType('EVMAccounts.AccountExtension', 'Optional', [v287.H160], sts.bytes()) as AccountExtensionV287,
}

/**
 *  Maps an EVM address to the last 12 bytes of a substrate account.
 */
export interface AccountExtensionV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (Bytes | undefined)][]>
}

export const contractDeployer =  {
    /**
     *  Whitelisted addresses that are allowed to deploy smart contracts.
     */
    v287: new StorageType('EVMAccounts.ContractDeployer', 'Optional', [v287.H160], sts.unit()) as ContractDeployerV287,
}

/**
 *  Whitelisted addresses that are allowed to deploy smart contracts.
 */
export interface ContractDeployerV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
}

export const approvedContract =  {
    /**
     *  Whitelisted contracts that are allowed to manage balances and tokens.
     */
    v287: new StorageType('EVMAccounts.ApprovedContract', 'Optional', [v287.H160], sts.unit()) as ApprovedContractV287,
}

/**
 *  Whitelisted contracts that are allowed to manage balances and tokens.
 */
export interface ApprovedContractV287  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v287.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v287.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v287.H160[]>
    getKeys(block: Block, key: v287.H160): Promise<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v287.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<v287.H160[]>
    getPairs(block: Block): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v287.H160): Promise<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v287.H160): AsyncIterable<[k: v287.H160, v: (null | undefined)][]>
}
