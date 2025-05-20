import assert from "assert"
import * as marshal from "./marshal"

export class EmaOracleEntryPrice {
  private _n!: string
  private _d!: string

  constructor(props?: Partial<Omit<EmaOracleEntryPrice, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._n = marshal.string.fromJSON(json.n)
      this._d = marshal.string.fromJSON(json.d)
    }
  }

  get n(): string {
    assert(this._n != null, 'uninitialized access')
    return this._n
  }

  set n(value: string) {
    this._n = value
  }

  get d(): string {
    assert(this._d != null, 'uninitialized access')
    return this._d
  }

  set d(value: string) {
    this._d = value
  }

  toJSON(): object {
    return {
      n: this.n,
      d: this.d,
    }
  }
}
