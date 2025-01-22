import assert from "assert"
import * as marshal from "./marshal"
import {DispatchErrorValue} from "./_dispatchErrorValue"

export class DispatchError {
  private _kind!: string | undefined | null
  private _value!: DispatchErrorValue | undefined | null

  constructor(props?: Partial<Omit<DispatchError, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._kind = json.kind == null ? undefined : marshal.string.fromJSON(json.kind)
      this._value = json.value == null ? undefined : new DispatchErrorValue(undefined, json.value)
    }
  }

  get kind(): string | undefined | null {
    return this._kind
  }

  set kind(value: string | undefined | null) {
    this._kind = value
  }

  get value(): DispatchErrorValue | undefined | null {
    return this._value
  }

  set value(value: DispatchErrorValue | undefined | null) {
    this._value = value
  }

  toJSON(): object {
    return {
      kind: this.kind,
      value: this.value == null ? undefined : this.value.toJSON(),
    }
  }
}
