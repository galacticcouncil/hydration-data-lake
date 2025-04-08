import assert from "assert"
import * as marshal from "./marshal"

export class AssetSpotPriceHistoricalData {
  private _quoteAssetId!: string
  private _quoteAssetDecimals!: number | undefined | null
  private _price!: string

  constructor(props?: Partial<Omit<AssetSpotPriceHistoricalData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._quoteAssetId = marshal.string.fromJSON(json.quoteAssetId)
      this._quoteAssetDecimals = json.quoteAssetDecimals == null ? undefined : marshal.int.fromJSON(json.quoteAssetDecimals)
      this._price = marshal.string.fromJSON(json.price)
    }
  }

  get quoteAssetId(): string {
    assert(this._quoteAssetId != null, 'uninitialized access')
    return this._quoteAssetId
  }

  set quoteAssetId(value: string) {
    this._quoteAssetId = value
  }

  get quoteAssetDecimals(): number | undefined | null {
    return this._quoteAssetDecimals
  }

  set quoteAssetDecimals(value: number | undefined | null) {
    this._quoteAssetDecimals = value
  }

  get price(): string {
    assert(this._price != null, 'uninitialized access')
    return this._price
  }

  set price(value: string) {
    this._price = value
  }

  toJSON(): object {
    return {
      quoteAssetId: this.quoteAssetId,
      quoteAssetDecimals: this.quoteAssetDecimals,
      price: this.price,
    }
  }
}
