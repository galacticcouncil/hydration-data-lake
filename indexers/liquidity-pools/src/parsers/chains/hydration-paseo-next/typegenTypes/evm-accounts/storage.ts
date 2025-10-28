import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v347 from '../v347'

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
