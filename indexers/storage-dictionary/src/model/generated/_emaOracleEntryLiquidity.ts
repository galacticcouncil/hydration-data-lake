import assert from "assert"
import * as marshal from "./marshal"

export class EmaOracleEntryLiquidity {
  private _a!: string
  private _b!: string

  constructor(props?: Partial<Omit<EmaOracleEntryLiquidity, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._a = marshal.string.fromJSON(json.a)
      this._b = marshal.string.fromJSON(json.b)
    }
  }

  get a(): string {
    assert(this._a != null, 'uninitialized access')
    return this._a
  }

  set a(value: string) {
    this._a = value
  }

  get b(): string {
    assert(this._b != null, 'uninitialized access')
    return this._b
  }

  set b(value: string) {
    this._b = value
  }

  toJSON(): object {
    return {
      a: this.a,
      b: this.b,
    }
  }
}
