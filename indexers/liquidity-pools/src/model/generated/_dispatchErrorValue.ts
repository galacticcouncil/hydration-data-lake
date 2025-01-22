import assert from "assert"
import * as marshal from "./marshal"

export class DispatchErrorValue {
  private _index!: number | undefined | null
  private _error!: string | undefined | null

  constructor(props?: Partial<Omit<DispatchErrorValue, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._index = json.index == null ? undefined : marshal.int.fromJSON(json.index)
      this._error = json.error == null ? undefined : marshal.string.fromJSON(json.error)
    }
  }

  get index(): number | undefined | null {
    return this._index
  }

  set index(value: number | undefined | null) {
    this._index = value
  }

  get error(): string | undefined | null {
    return this._error
  }

  set error(value: string | undefined | null) {
    this._error = value
  }

  toJSON(): object {
    return {
      index: this.index,
      error: this.error,
    }
  }
}
