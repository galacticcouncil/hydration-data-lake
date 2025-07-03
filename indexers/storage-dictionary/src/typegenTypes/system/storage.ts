import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v100 from '../v100'
import * as v104 from '../v104'
import * as v108 from '../v108'
import * as v115 from '../v115'
import * as v125 from '../v125'
import * as v138 from '../v138'
import * as v148 from '../v148'
import * as v160 from '../v160'
import * as v170 from '../v170'
import * as v176 from '../v176'
import * as v183 from '../v183'
import * as v185 from '../v185'
import * as v193 from '../v193'
import * as v201 from '../v201'
import * as v205 from '../v205'
import * as v207 from '../v207'
import * as v222 from '../v222'
import * as v227 from '../v227'
import * as v234 from '../v234'
import * as v244 from '../v244'
import * as v253 from '../v253'
import * as v257 from '../v257'
import * as v264 from '../v264'
import * as v272 from '../v272'
import * as v276 from '../v276'
import * as v282 from '../v282'
import * as v295 from '../v295'
import * as v305 from '../v305'
import * as v313 from '../v313'
import * as v323 from '../v323'

export const account =  {
    /**
     *  The full account information for a particular account ID.
     */
    v100: new StorageType('System.Account', 'Default', [v100.AccountId32], v100.AccountInfo) as AccountV100,
    /**
     *  The full account information for a particular account ID.
     */
    v205: new StorageType('System.Account', 'Default', [v205.AccountId32], v205.AccountInfo) as AccountV205,
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.AccountInfo
    get(block: Block, key: v100.AccountId32): Promise<(v100.AccountInfo | undefined)>
    getMany(block: Block, keys: v100.AccountId32[]): Promise<(v100.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v100.AccountId32[]>
    getKeys(block: Block, key: v100.AccountId32): Promise<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v100.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<v100.AccountId32[]>
    getPairs(block: Block): Promise<[k: v100.AccountId32, v: (v100.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v100.AccountId32): Promise<[k: v100.AccountId32, v: (v100.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v100.AccountId32, v: (v100.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v100.AccountId32): AsyncIterable<[k: v100.AccountId32, v: (v100.AccountInfo | undefined)][]>
}

/**
 *  The full account information for a particular account ID.
 */
export interface AccountV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.AccountInfo
    get(block: Block, key: v205.AccountId32): Promise<(v205.AccountInfo | undefined)>
    getMany(block: Block, keys: v205.AccountId32[]): Promise<(v205.AccountInfo | undefined)[]>
    getKeys(block: Block): Promise<v205.AccountId32[]>
    getKeys(block: Block, key: v205.AccountId32): Promise<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v205.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<v205.AccountId32[]>
    getPairs(block: Block): Promise<[k: v205.AccountId32, v: (v205.AccountInfo | undefined)][]>
    getPairs(block: Block, key: v205.AccountId32): Promise<[k: v205.AccountId32, v: (v205.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v205.AccountId32, v: (v205.AccountInfo | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v205.AccountId32): AsyncIterable<[k: v205.AccountId32, v: (v205.AccountInfo | undefined)][]>
}

export const extrinsicCount =  {
    /**
     *  Total extrinsics count for the current block.
     */
    v100: new StorageType('System.ExtrinsicCount', 'Optional', [], sts.number()) as ExtrinsicCountV100,
}

/**
 *  Total extrinsics count for the current block.
 */
export interface ExtrinsicCountV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(number | undefined)>
}

export const blockWeight =  {
    /**
     *  The current weight for the block.
     */
    v100: new StorageType('System.BlockWeight', 'Default', [], v100.PerDispatchClass) as BlockWeightV100,
    /**
     *  The current weight for the block.
     */
    v115: new StorageType('System.BlockWeight', 'Default', [], v115.PerDispatchClass) as BlockWeightV115,
    /**
     *  The current weight for the block.
     */
    v160: new StorageType('System.BlockWeight', 'Default', [], v160.PerDispatchClass) as BlockWeightV160,
}

/**
 *  The current weight for the block.
 */
export interface BlockWeightV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.PerDispatchClass
    get(block: Block): Promise<(v100.PerDispatchClass | undefined)>
}

/**
 *  The current weight for the block.
 */
export interface BlockWeightV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v115.PerDispatchClass
    get(block: Block): Promise<(v115.PerDispatchClass | undefined)>
}

/**
 *  The current weight for the block.
 */
export interface BlockWeightV160  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v160.PerDispatchClass
    get(block: Block): Promise<(v160.PerDispatchClass | undefined)>
}

export const allExtrinsicsLen =  {
    /**
     *  Total length (in bytes) for all extrinsics put together, for the current block.
     */
    v100: new StorageType('System.AllExtrinsicsLen', 'Optional', [], sts.number()) as AllExtrinsicsLenV100,
}

/**
 *  Total length (in bytes) for all extrinsics put together, for the current block.
 */
export interface AllExtrinsicsLenV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(number | undefined)>
}

export const blockHash =  {
    /**
     *  Map of block numbers to block hashes.
     */
    v100: new StorageType('System.BlockHash', 'Default', [sts.number()], v100.H256) as BlockHashV100,
}

/**
 *  Map of block numbers to block hashes.
 */
export interface BlockHashV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.H256
    get(block: Block, key: number): Promise<(v100.H256 | undefined)>
    getMany(block: Block, keys: number[]): Promise<(v100.H256 | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (v100.H256 | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (v100.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (v100.H256 | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (v100.H256 | undefined)][]>
}

export const extrinsicData =  {
    /**
     *  Extrinsics data for the current block (maps an extrinsic's index to its data).
     */
    v100: new StorageType('System.ExtrinsicData', 'Default', [sts.number()], sts.bytes()) as ExtrinsicDataV100,
}

/**
 *  Extrinsics data for the current block (maps an extrinsic's index to its data).
 */
export interface ExtrinsicDataV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): Bytes
    get(block: Block, key: number): Promise<(Bytes | undefined)>
    getMany(block: Block, keys: number[]): Promise<(Bytes | undefined)[]>
    getKeys(block: Block): Promise<number[]>
    getKeys(block: Block, key: number): Promise<number[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<number[]>
    getKeysPaged(pageSize: number, block: Block, key: number): AsyncIterable<number[]>
    getPairs(block: Block): Promise<[k: number, v: (Bytes | undefined)][]>
    getPairs(block: Block, key: number): Promise<[k: number, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: number, v: (Bytes | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: number): AsyncIterable<[k: number, v: (Bytes | undefined)][]>
}

export const number =  {
    /**
     *  The current block number being processed. Set by `execute_block`.
     */
    v100: new StorageType('System.Number', 'Default', [], sts.number()) as NumberV100,
}

/**
 *  The current block number being processed. Set by `execute_block`.
 */
export interface NumberV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const parentHash =  {
    /**
     *  Hash of the previous block.
     */
    v100: new StorageType('System.ParentHash', 'Default', [], v100.H256) as ParentHashV100,
}

/**
 *  Hash of the previous block.
 */
export interface ParentHashV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.H256
    get(block: Block): Promise<(v100.H256 | undefined)>
}

export const digest =  {
    /**
     *  Digest of the current block, also part of the block header.
     */
    v100: new StorageType('System.Digest', 'Default', [], v100.Digest) as DigestV100,
    /**
     *  Digest of the current block, also part of the block header.
     */
    v104: new StorageType('System.Digest', 'Default', [], v104.Digest) as DigestV104,
}

/**
 *  Digest of the current block, also part of the block header.
 */
export interface DigestV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.Digest
    get(block: Block): Promise<(v100.Digest | undefined)>
}

/**
 *  Digest of the current block, also part of the block header.
 */
export interface DigestV104  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v104.Digest
    get(block: Block): Promise<(v104.Digest | undefined)>
}

export const events =  {
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
     *  from within the runtime.
     */
    v100: new StorageType('System.Events', 'Default', [], sts.array(() => v100.EventRecord)) as EventsV100,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
     *  from within the runtime.
     */
    v104: new StorageType('System.Events', 'Default', [], sts.array(() => v104.EventRecord)) as EventsV104,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
     *  from within the runtime.
     */
    v108: new StorageType('System.Events', 'Default', [], sts.array(() => v108.EventRecord)) as EventsV108,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v115: new StorageType('System.Events', 'Default', [], sts.array(() => v115.EventRecord)) as EventsV115,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v125: new StorageType('System.Events', 'Default', [], sts.array(() => v125.EventRecord)) as EventsV125,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v138: new StorageType('System.Events', 'Default', [], sts.array(() => v138.EventRecord)) as EventsV138,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v148: new StorageType('System.Events', 'Default', [], sts.array(() => v148.EventRecord)) as EventsV148,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v160: new StorageType('System.Events', 'Default', [], sts.array(() => v160.EventRecord)) as EventsV160,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v170: new StorageType('System.Events', 'Default', [], sts.array(() => v170.EventRecord)) as EventsV170,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v176: new StorageType('System.Events', 'Default', [], sts.array(() => v176.EventRecord)) as EventsV176,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v183: new StorageType('System.Events', 'Default', [], sts.array(() => v183.EventRecord)) as EventsV183,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v185: new StorageType('System.Events', 'Default', [], sts.array(() => v185.EventRecord)) as EventsV185,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v193: new StorageType('System.Events', 'Default', [], sts.array(() => v193.EventRecord)) as EventsV193,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v201: new StorageType('System.Events', 'Default', [], sts.array(() => v201.EventRecord)) as EventsV201,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v205: new StorageType('System.Events', 'Default', [], sts.array(() => v205.EventRecord)) as EventsV205,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v207: new StorageType('System.Events', 'Default', [], sts.array(() => v207.EventRecord)) as EventsV207,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v222: new StorageType('System.Events', 'Default', [], sts.array(() => v222.EventRecord)) as EventsV222,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v227: new StorageType('System.Events', 'Default', [], sts.array(() => v227.EventRecord)) as EventsV227,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v234: new StorageType('System.Events', 'Default', [], sts.array(() => v234.EventRecord)) as EventsV234,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v244: new StorageType('System.Events', 'Default', [], sts.array(() => v244.EventRecord)) as EventsV244,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v253: new StorageType('System.Events', 'Default', [], sts.array(() => v253.EventRecord)) as EventsV253,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v257: new StorageType('System.Events', 'Default', [], sts.array(() => v257.EventRecord)) as EventsV257,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v264: new StorageType('System.Events', 'Default', [], sts.array(() => v264.EventRecord)) as EventsV264,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v272: new StorageType('System.Events', 'Default', [], sts.array(() => v272.EventRecord)) as EventsV272,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v276: new StorageType('System.Events', 'Default', [], sts.array(() => v276.EventRecord)) as EventsV276,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v282: new StorageType('System.Events', 'Default', [], sts.array(() => v282.EventRecord)) as EventsV282,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v295: new StorageType('System.Events', 'Default', [], sts.array(() => v295.EventRecord)) as EventsV295,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v305: new StorageType('System.Events', 'Default', [], sts.array(() => v305.EventRecord)) as EventsV305,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v313: new StorageType('System.Events', 'Default', [], sts.array(() => v313.EventRecord)) as EventsV313,
    /**
     *  Events deposited for the current block.
     * 
     *  NOTE: The item is unbound and should therefore never be read on chain.
     *  It could otherwise inflate the PoV size of a block.
     * 
     *  Events have a large in-memory size. Box the events to not go out-of-memory
     *  just in case someone still reads them from within the runtime.
     */
    v323: new StorageType('System.Events', 'Default', [], sts.array(() => v323.EventRecord)) as EventsV323,
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
 *  from within the runtime.
 */
export interface EventsV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v100.EventRecord[]
    get(block: Block): Promise<(v100.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
 *  from within the runtime.
 */
export interface EventsV104  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v104.EventRecord[]
    get(block: Block): Promise<(v104.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: This storage item is explicitly unbounded since it is never intended to be read
 *  from within the runtime.
 */
export interface EventsV108  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v108.EventRecord[]
    get(block: Block): Promise<(v108.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV115  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v115.EventRecord[]
    get(block: Block): Promise<(v115.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV125  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v125.EventRecord[]
    get(block: Block): Promise<(v125.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV138  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v138.EventRecord[]
    get(block: Block): Promise<(v138.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV148  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v148.EventRecord[]
    get(block: Block): Promise<(v148.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV160  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v160.EventRecord[]
    get(block: Block): Promise<(v160.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV170  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v170.EventRecord[]
    get(block: Block): Promise<(v170.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV176  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v176.EventRecord[]
    get(block: Block): Promise<(v176.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV183  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v183.EventRecord[]
    get(block: Block): Promise<(v183.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV185  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v185.EventRecord[]
    get(block: Block): Promise<(v185.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV193  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v193.EventRecord[]
    get(block: Block): Promise<(v193.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV201  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v201.EventRecord[]
    get(block: Block): Promise<(v201.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV205  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v205.EventRecord[]
    get(block: Block): Promise<(v205.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV207  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v207.EventRecord[]
    get(block: Block): Promise<(v207.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV222  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v222.EventRecord[]
    get(block: Block): Promise<(v222.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV227  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v227.EventRecord[]
    get(block: Block): Promise<(v227.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV234  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v234.EventRecord[]
    get(block: Block): Promise<(v234.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV244  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v244.EventRecord[]
    get(block: Block): Promise<(v244.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV253  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v253.EventRecord[]
    get(block: Block): Promise<(v253.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV257  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v257.EventRecord[]
    get(block: Block): Promise<(v257.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV264  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v264.EventRecord[]
    get(block: Block): Promise<(v264.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV272  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v272.EventRecord[]
    get(block: Block): Promise<(v272.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v276.EventRecord[]
    get(block: Block): Promise<(v276.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV282  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v282.EventRecord[]
    get(block: Block): Promise<(v282.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV295  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v295.EventRecord[]
    get(block: Block): Promise<(v295.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV305  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v305.EventRecord[]
    get(block: Block): Promise<(v305.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV313  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v313.EventRecord[]
    get(block: Block): Promise<(v313.EventRecord[] | undefined)>
}

/**
 *  Events deposited for the current block.
 * 
 *  NOTE: The item is unbound and should therefore never be read on chain.
 *  It could otherwise inflate the PoV size of a block.
 * 
 *  Events have a large in-memory size. Box the events to not go out-of-memory
 *  just in case someone still reads them from within the runtime.
 */
export interface EventsV323  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v323.EventRecord[]
    get(block: Block): Promise<(v323.EventRecord[] | undefined)>
}

export const eventCount =  {
    /**
     *  The number of events in the `Events<T>` list.
     */
    v100: new StorageType('System.EventCount', 'Default', [], sts.number()) as EventCountV100,
}

/**
 *  The number of events in the `Events<T>` list.
 */
export interface EventCountV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): number
    get(block: Block): Promise<(number | undefined)>
}

export const eventTopics =  {
    /**
     *  Mapping between a topic (represented by T::Hash) and a vector of indexes
     *  of events in the `<Events<T>>` list.
     * 
     *  All topic vectors have deterministic storage locations depending on the topic. This
     *  allows light-clients to leverage the changes trie storage tracking mechanism and
     *  in case of changes fetch the list of events of interest.
     * 
     *  The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
     *  the `EventIndex` then in case if the topic has the same contents on the next block
     *  no notification will be triggered thus the event might be lost.
     */
    v100: new StorageType('System.EventTopics', 'Default', [v100.H256], sts.array(() => sts.tuple(() => [sts.number(), sts.number()]))) as EventTopicsV100,
}

/**
 *  Mapping between a topic (represented by T::Hash) and a vector of indexes
 *  of events in the `<Events<T>>` list.
 * 
 *  All topic vectors have deterministic storage locations depending on the topic. This
 *  allows light-clients to leverage the changes trie storage tracking mechanism and
 *  in case of changes fetch the list of events of interest.
 * 
 *  The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
 *  the `EventIndex` then in case if the topic has the same contents on the next block
 *  no notification will be triggered thus the event might be lost.
 */
export interface EventTopicsV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [number, number][]
    get(block: Block, key: v100.H256): Promise<([number, number][] | undefined)>
    getMany(block: Block, keys: v100.H256[]): Promise<([number, number][] | undefined)[]>
    getKeys(block: Block): Promise<v100.H256[]>
    getKeys(block: Block, key: v100.H256): Promise<v100.H256[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v100.H256[]>
    getKeysPaged(pageSize: number, block: Block, key: v100.H256): AsyncIterable<v100.H256[]>
    getPairs(block: Block): Promise<[k: v100.H256, v: ([number, number][] | undefined)][]>
    getPairs(block: Block, key: v100.H256): Promise<[k: v100.H256, v: ([number, number][] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v100.H256, v: ([number, number][] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v100.H256): AsyncIterable<[k: v100.H256, v: ([number, number][] | undefined)][]>
}

export const lastRuntimeUpgrade =  {
    /**
     *  Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
     */
    v100: new StorageType('System.LastRuntimeUpgrade', 'Optional', [], v100.LastRuntimeUpgradeInfo) as LastRuntimeUpgradeV100,
}

/**
 *  Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
 */
export interface LastRuntimeUpgradeV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.LastRuntimeUpgradeInfo | undefined)>
}

export const upgradedToU32RefCount =  {
    /**
     *  True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
     */
    v100: new StorageType('System.UpgradedToU32RefCount', 'Default', [], sts.boolean()) as UpgradedToU32RefCountV100,
}

/**
 *  True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
 */
export interface UpgradedToU32RefCountV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): boolean
    get(block: Block): Promise<(boolean | undefined)>
}

export const upgradedToTripleRefCount =  {
    /**
     *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
     *  (default) if not.
     */
    v100: new StorageType('System.UpgradedToTripleRefCount', 'Default', [], sts.boolean()) as UpgradedToTripleRefCountV100,
}

/**
 *  True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
 *  (default) if not.
 */
export interface UpgradedToTripleRefCountV100  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): boolean
    get(block: Block): Promise<(boolean | undefined)>
}

export const executionPhase =  {
    /**
     *  The execution phase of the block.
     */
    v100: new StorageType('System.ExecutionPhase', 'Optional', [], v100.Phase) as ExecutionPhaseV100,
}

/**
 *  The execution phase of the block.
 */
export interface ExecutionPhaseV100  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v100.Phase | undefined)>
}

export const authorizedUpgrade =  {
    /**
     *  `Some` if a code upgrade has been authorized.
     */
    v244: new StorageType('System.AuthorizedUpgrade', 'Optional', [], v244.CodeUpgradeAuthorization) as AuthorizedUpgradeV244,
}

/**
 *  `Some` if a code upgrade has been authorized.
 */
export interface AuthorizedUpgradeV244  {
    is(block: RuntimeCtx): boolean
    get(block: Block): Promise<(v244.CodeUpgradeAuthorization | undefined)>
}

export const inherentsApplied =  {
    /**
     *  Whether all inherents have been applied.
     */
    v264: new StorageType('System.InherentsApplied', 'Default', [], sts.boolean()) as InherentsAppliedV264,
}

/**
 *  Whether all inherents have been applied.
 */
export interface InherentsAppliedV264  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): boolean
    get(block: Block): Promise<(boolean | undefined)>
}
