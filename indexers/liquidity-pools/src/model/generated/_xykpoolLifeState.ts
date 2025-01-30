import assert from "assert"
import * as marshal from "./marshal"
import {XykpoolCreatedData} from "./_xykpoolCreatedData"
import {XykpoolDestroyedData} from "./_xykpoolDestroyedData"

export class XykpoolLifeState {
  private _created!: XykpoolCreatedData
  private _destroyed!: XykpoolDestroyedData | undefined | null

  constructor(props?: Partial<Omit<XykpoolLifeState, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._created = new XykpoolCreatedData(undefined, marshal.nonNull(json.created))
      this._destroyed = json.destroyed == null ? undefined : new XykpoolDestroyedData(undefined, json.destroyed)
    }
  }

  get created(): XykpoolCreatedData {
    assert(this._created != null, 'uninitialized access')
    return this._created
  }

  set created(value: XykpoolCreatedData) {
    this._created = value
  }

  get destroyed(): XykpoolDestroyedData | undefined | null {
    return this._destroyed
  }

  set destroyed(value: XykpoolDestroyedData | undefined | null) {
    this._destroyed = value
  }

  toJSON(): object {
    return {
      created: this.created.toJSON(),
      destroyed: this.destroyed == null ? undefined : this.destroyed.toJSON(),
    }
  }
}
