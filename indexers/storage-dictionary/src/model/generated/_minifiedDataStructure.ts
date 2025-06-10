import assert from "assert"
import * as marshal from "./marshal"
import {DataStructureTypeName} from "./_dataStructureTypeName"

export class MinifiedDataStructure {
  private _t!: DataStructureTypeName
  private _d!: (string)[]

  constructor(props?: Partial<Omit<MinifiedDataStructure, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._t = marshal.enumFromJson(json.t, DataStructureTypeName)
      this._d = marshal.fromList(json.d, val => marshal.string.fromJSON(val))
    }
  }

  get t(): DataStructureTypeName {
    assert(this._t != null, 'uninitialized access')
    return this._t
  }

  set t(value: DataStructureTypeName) {
    this._t = value
  }

  get d(): (string)[] {
    assert(this._d != null, 'uninitialized access')
    return this._d
  }

  set d(value: (string)[]) {
    this._d = value
  }

  toJSON(): object {
    return {
      t: this.t,
      d: this.d,
    }
  }
}
