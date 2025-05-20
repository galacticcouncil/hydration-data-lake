import assert from "assert"
import * as marshal from "./marshal"

export class EmaOracleEntryVolume {
  private _aIn!: string
  private _aOut!: string
  private _bIn!: string
  private _bOut!: string

  constructor(props?: Partial<Omit<EmaOracleEntryVolume, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._aIn = marshal.string.fromJSON(json.aIn)
      this._aOut = marshal.string.fromJSON(json.aOut)
      this._bIn = marshal.string.fromJSON(json.bIn)
      this._bOut = marshal.string.fromJSON(json.bOut)
    }
  }

  get aIn(): string {
    assert(this._aIn != null, 'uninitialized access')
    return this._aIn
  }

  set aIn(value: string) {
    this._aIn = value
  }

  get aOut(): string {
    assert(this._aOut != null, 'uninitialized access')
    return this._aOut
  }

  set aOut(value: string) {
    this._aOut = value
  }

  get bIn(): string {
    assert(this._bIn != null, 'uninitialized access')
    return this._bIn
  }

  set bIn(value: string) {
    this._bIn = value
  }

  get bOut(): string {
    assert(this._bOut != null, 'uninitialized access')
    return this._bOut
  }

  set bOut(value: string) {
    this._bOut = value
  }

  toJSON(): object {
    return {
      aIn: this.aIn,
      aOut: this.aOut,
      bIn: this.bIn,
      bOut: this.bOut,
    }
  }
}
