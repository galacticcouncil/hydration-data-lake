import assert from "assert"
import * as marshal from "./marshal"
import {LbppoolCreatedData} from "./_lbppoolCreatedData"
import {LbppoolDestroyedData} from "./_lbppoolDestroyedData"

export class LbppoolLifeState {
  private _created!: LbppoolCreatedData
  private _destroyed!: LbppoolDestroyedData | undefined | null

  constructor(props?: Partial<Omit<LbppoolLifeState, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._created = new LbppoolCreatedData(undefined, marshal.nonNull(json.created))
      this._destroyed = json.destroyed == null ? undefined : new LbppoolDestroyedData(undefined, json.destroyed)
    }
  }

  get created(): LbppoolCreatedData {
    assert(this._created != null, 'uninitialized access')
    return this._created
  }

  set created(value: LbppoolCreatedData) {
    this._created = value
  }

  get destroyed(): LbppoolDestroyedData | undefined | null {
    return this._destroyed
  }

  set destroyed(value: LbppoolDestroyedData | undefined | null) {
    this._destroyed = value
  }

  toJSON(): object {
    return {
      created: this.created.toJSON(),
      destroyed: this.destroyed == null ? undefined : this.destroyed.toJSON(),
    }
  }
}
