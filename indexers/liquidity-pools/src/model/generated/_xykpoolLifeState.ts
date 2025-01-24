import assert from "assert"
import * as marshal from "./marshal"
import {StableswapCreatedData} from "./_stableswapCreatedData"
import {StableswapDestroyedData} from "./_stableswapDestroyedData"

export class XykpoolLifeState {
  private _created!: StableswapCreatedData
  private _destroyed!: StableswapDestroyedData | undefined | null

  constructor(props?: Partial<Omit<XykpoolLifeState, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._created = new StableswapCreatedData(undefined, marshal.nonNull(json.created))
      this._destroyed = json.destroyed == null ? undefined : new StableswapDestroyedData(undefined, json.destroyed)
    }
  }

  get created(): StableswapCreatedData {
    assert(this._created != null, 'uninitialized access')
    return this._created
  }

  set created(value: StableswapCreatedData) {
    this._created = value
  }

  get destroyed(): StableswapDestroyedData | undefined | null {
    return this._destroyed
  }

  set destroyed(value: StableswapDestroyedData | undefined | null) {
    this._destroyed = value
  }

  toJSON(): object {
    return {
      created: this.created.toJSON(),
      destroyed: this.destroyed == null ? undefined : this.destroyed.toJSON(),
    }
  }
}
