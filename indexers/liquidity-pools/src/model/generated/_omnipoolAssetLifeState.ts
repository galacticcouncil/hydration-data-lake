import assert from "assert"
import * as marshal from "./marshal"
import {OmnipoolAssetAddedData} from "./_omnipoolAssetAddedData"
import {OmnipoolAssetRemovedData} from "./_omnipoolAssetRemovedData"

export class OmnipoolAssetLifeState {
  private _added!: OmnipoolAssetAddedData
  private _removed!: OmnipoolAssetRemovedData | undefined | null

  constructor(props?: Partial<Omit<OmnipoolAssetLifeState, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._added = new OmnipoolAssetAddedData(undefined, marshal.nonNull(json.added))
      this._removed = json.removed == null ? undefined : new OmnipoolAssetRemovedData(undefined, json.removed)
    }
  }

  get added(): OmnipoolAssetAddedData {
    assert(this._added != null, 'uninitialized access')
    return this._added
  }

  set added(value: OmnipoolAssetAddedData) {
    this._added = value
  }

  get removed(): OmnipoolAssetRemovedData | undefined | null {
    return this._removed
  }

  set removed(value: OmnipoolAssetRemovedData | undefined | null) {
    this._removed = value
  }

  toJSON(): object {
    return {
      added: this.added.toJSON(),
      removed: this.removed == null ? undefined : this.removed.toJSON(),
    }
  }
}
