import assert from "assert"
import * as marshal from "./marshal"
import {EmaOraclePeriod} from "./_emaOraclePeriod"
import {EmaOracleEntryPrice} from "./_emaOracleEntryPrice"
import {EmaOracleEntryVolume} from "./_emaOracleEntryVolume"
import {EmaOracleEntryLiquidity} from "./_emaOracleEntryLiquidity"

export class EmaOracleEntry {
  private _source!: string
  private _assetIds!: (number)[]
  private _period!: EmaOraclePeriod
  private _price!: EmaOracleEntryPrice
  private _volume!: EmaOracleEntryVolume
  private _liquidity!: EmaOracleEntryLiquidity
  private _updatedAt!: number

  constructor(props?: Partial<Omit<EmaOracleEntry, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._source = marshal.string.fromJSON(json.source)
      this._assetIds = marshal.fromList(json.assetIds, val => marshal.int.fromJSON(val))
      this._period = marshal.enumFromJson(json.period, EmaOraclePeriod)
      this._price = new EmaOracleEntryPrice(undefined, marshal.nonNull(json.price))
      this._volume = new EmaOracleEntryVolume(undefined, marshal.nonNull(json.volume))
      this._liquidity = new EmaOracleEntryLiquidity(undefined, marshal.nonNull(json.liquidity))
      this._updatedAt = marshal.int.fromJSON(json.updatedAt)
    }
  }

  get source(): string {
    assert(this._source != null, 'uninitialized access')
    return this._source
  }

  set source(value: string) {
    this._source = value
  }

  get assetIds(): (number)[] {
    assert(this._assetIds != null, 'uninitialized access')
    return this._assetIds
  }

  set assetIds(value: (number)[]) {
    this._assetIds = value
  }

  get period(): EmaOraclePeriod {
    assert(this._period != null, 'uninitialized access')
    return this._period
  }

  set period(value: EmaOraclePeriod) {
    this._period = value
  }

  get price(): EmaOracleEntryPrice {
    assert(this._price != null, 'uninitialized access')
    return this._price
  }

  set price(value: EmaOracleEntryPrice) {
    this._price = value
  }

  get volume(): EmaOracleEntryVolume {
    assert(this._volume != null, 'uninitialized access')
    return this._volume
  }

  set volume(value: EmaOracleEntryVolume) {
    this._volume = value
  }

  get liquidity(): EmaOracleEntryLiquidity {
    assert(this._liquidity != null, 'uninitialized access')
    return this._liquidity
  }

  set liquidity(value: EmaOracleEntryLiquidity) {
    this._liquidity = value
  }

  get updatedAt(): number {
    assert(this._updatedAt != null, 'uninitialized access')
    return this._updatedAt
  }

  set updatedAt(value: number) {
    this._updatedAt = value
  }

  toJSON(): object {
    return {
      source: this.source,
      assetIds: this.assetIds,
      period: this.period,
      price: this.price.toJSON(),
      volume: this.volume.toJSON(),
      liquidity: this.liquidity.toJSON(),
      updatedAt: this.updatedAt,
    }
  }
}
