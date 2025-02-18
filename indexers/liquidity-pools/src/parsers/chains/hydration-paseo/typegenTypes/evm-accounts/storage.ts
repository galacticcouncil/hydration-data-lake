import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const accountExtension =  {
    /**
     *  Maps an EVM address to the last 12 bytes of a substrate account.
     */
    v276: new StorageType('EVMAccounts.AccountExtension', 'Optional', [v276.H160], sts.bytes()) as AccountExtensionV276,
}

/**
 *  Maps an EVM address to the last 12 bytes of a substrate account.
 */
export interface AccountExtensionV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.H160): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (Bytes | undefined)][]>
}

export const contractDeployer =  {
    /**
     *  Whitelisted addresses that are allowed to deploy smart contracts.
     */
    v276: new StorageType('EVMAccounts.ContractDeployer', 'Optional', [v276.H160], sts.unit()) as ContractDeployerV276,
}

/**
 *  Whitelisted addresses that are allowed to deploy smart contracts.
 */
export interface ContractDeployerV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
}

export const approvedContract =  {
    /**
     *  Whitelisted contracts that are allowed to manage balances and tokens.
     */
    v276: new StorageType('EVMAccounts.ApprovedContract', 'Optional', [v276.H160], sts.unit()) as ApprovedContractV276,
}

/**
 *  Whitelisted contracts that are allowed to manage balances and tokens.
 */
export interface ApprovedContractV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v276.H160): Promise<(null | undefined)>
    getMany(block: Block, keys: v276.H160[]): Promise<(null | undefined)[]>
    getKeys(block: Block): Promise<v276.H160[]>
    getKeys(block: Block, key: v276.H160): Promise<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v276.H160[]>
    getKeysPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<v276.H160[]>
    getPairs(block: Block): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairs(block: Block, key: v276.H160): Promise<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v276.H160): AsyncIterable<[k: v276.H160, v: (null | undefined)][]>
}
