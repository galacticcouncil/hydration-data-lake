import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v222 from '../v222'
import * as v264 from '../v264'

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
