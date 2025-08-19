import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v324 from '../v324'

export const accountExtension =  {
    /**
     *  Maps an EVM address to the last 12 bytes of a substrate account.
     */
    v324: new StorageType('EVMAccounts.AccountExtension', 'Optional', [v324.H160], sts.bytes()) as AccountExtensionV324,
}

/**
 *  Maps an EVM address to the last 12 bytes of a substrate account.
 */
export interface AccountExtensionV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v324.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v324.H160[]>
    getKeys(block: Block, key: v324.H160): Promise<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<v324.H160[]>
    getPairs(block: Block): Promise<[k: v324.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v324.H160): Promise<[k: v324.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<[k: v324.H160, v: (Bytes | undefined)][]>
}

export const contractDeployer =  {
    /**
     *  Whitelisted addresses that are allowed to deploy smart contracts.
     */
    v324: new StorageType('EVMAccounts.ContractDeployer', 'Optional', [v324.H160], sts.unit()) as ContractDeployerV324,
}

/**
 *  Whitelisted addresses that are allowed to deploy smart contracts.
 */
export interface ContractDeployerV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v324.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v324.H160[]>
    getKeys(block: Block, key: v324.H160): Promise<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<v324.H160[]>
    getPairs(block: Block): Promise<[k: v324.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v324.H160): Promise<[k: v324.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<[k: v324.H160, v: (null | undefined)][]>
}

export const approvedContract =  {
    /**
     *  Whitelisted contracts that are allowed to manage balances and tokens.
     */
    v324: new StorageType('EVMAccounts.ApprovedContract', 'Optional', [v324.H160], sts.unit()) as ApprovedContractV324,
}

/**
 *  Whitelisted contracts that are allowed to manage balances and tokens.
 */
export interface ApprovedContractV324  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v324.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v324.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v324.H160[]>
    getKeys(block: Block, key: v324.H160): Promise<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v324.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<v324.H160[]>
    getPairs(block: Block): Promise<[k: v324.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v324.H160): Promise<[k: v324.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v324.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v324.H160): AsyncIterable<[k: v324.H160, v: (null | undefined)][]>
}
