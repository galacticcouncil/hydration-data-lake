import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v276 from '../v276'

export const accumulator =  {
    /**
     *  Accumulator for oracle data in current block that will be recorded at the end of the block.
     */
    v276: new StorageType('EmaOracle.Accumulator', 'Default', [], sts.array(() => sts.tuple(() => [sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]), v276.OracleEntry]))) as AccumulatorV276,
}

/**
 *  Accumulator for oracle data in current block that will be recorded at the end of the block.
 */
export interface AccumulatorV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [[Bytes, [number, number]], v276.OracleEntry][]
    get(block: Block): Promise<([[Bytes, [number, number]], v276.OracleEntry][] | undefined)>
}

export const oracles =  {
    /**
     *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
     * 
     *  Stores the data entry as well as the block number when the oracle was first initialized.
     */
    v276: new StorageType('EmaOracle.Oracles', 'Optional', [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()]), v276.OraclePeriod], sts.tuple(() => [v276.OracleEntry, sts.number()])) as OraclesV276,
}

/**
 *  Oracle storage keyed by data source, involved asset ids and the period length of the oracle.
 * 
 *  Stores the data entry as well as the block number when the oracle was first initialized.
 */
export interface OraclesV276  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key1: Bytes, key2: [number, number], key3: v276.OraclePeriod): Promise<([v276.OracleEntry, number] | undefined)>
    getMany(block: Block, keys: [Bytes, [number, number], v276.OraclePeriod][]): Promise<([v276.OracleEntry, number] | undefined)[]>
    getKeys(block: Block): Promise<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes): Promise<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number]): Promise<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeys(block: Block, key1: Bytes, key2: [number, number], key3: v276.OraclePeriod): Promise<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[Bytes, [number, number], v276.OraclePeriod][]>
    getKeysPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v276.OraclePeriod): AsyncIterable<[Bytes, [number, number], v276.OraclePeriod][]>
    getPairs(block: Block): Promise<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes): Promise<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number]): Promise<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairs(block: Block, key1: Bytes, key2: [number, number], key3: v276.OraclePeriod): Promise<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes): AsyncIterable<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number]): AsyncIterable<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key1: Bytes, key2: [number, number], key3: v276.OraclePeriod): AsyncIterable<[k: [Bytes, [number, number], v276.OraclePeriod], v: ([v276.OracleEntry, number] | undefined)][]>
}

export const whitelistedAssets =  {
    /**
     *  Assets that are whitelisted and tracked by the pallet.
     */
    v276: new StorageType('EmaOracle.WhitelistedAssets', 'Default', [], sts.array(() => sts.tuple(() => [sts.bytes(), sts.tuple(() => [sts.number(), sts.number()])]))) as WhitelistedAssetsV276,
}

/**
 *  Assets that are whitelisted and tracked by the pallet.
 */
export interface WhitelistedAssetsV276  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [Bytes, [number, number]][]
    get(block: Block): Promise<([Bytes, [number, number]][] | undefined)>
}
