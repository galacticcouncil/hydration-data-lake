import assert from "assert"
import * as marshal from "./marshal"

export class OmnipoolAssetRemovedData {
  private _removedAmount!: string | undefined | null
  private _hubWithdrawn!: string | undefined | null
  private _eventId!: string | undefined | null
  private _paraBlockHeight!: number

  constructor(props?: Partial<Omit<OmnipoolAssetRemovedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._removedAmount = json.removedAmount == null ? undefined : marshal.string.fromJSON(json.removedAmount)
      this._hubWithdrawn = json.hubWithdrawn == null ? undefined : marshal.string.fromJSON(json.hubWithdrawn)
      this._eventId = json.eventId == null ? undefined : marshal.string.fromJSON(json.eventId)
      this._paraBlockHeight = marshal.int.fromJSON(json.paraBlockHeight)
    }
  }

  get removedAmount(): string | undefined | null {
    return this._removedAmount
  }

  set removedAmount(value: string | undefined | null) {
    this._removedAmount = value
  }

  get hubWithdrawn(): string | undefined | null {
    return this._hubWithdrawn
  }

  set hubWithdrawn(value: string | undefined | null) {
    this._hubWithdrawn = value
  }

  get eventId(): string | undefined | null {
    return this._eventId
  }

  set eventId(value: string | undefined | null) {
    this._eventId = value
  }

  get paraBlockHeight(): number {
    assert(this._paraBlockHeight != null, 'uninitialized access')
    return this._paraBlockHeight
  }

  set paraBlockHeight(value: number) {
    this._paraBlockHeight = value
  }

  toJSON(): object {
    return {
      removedAmount: this.removedAmount,
      hubWithdrawn: this.hubWithdrawn,
      eventId: this.eventId,
      paraBlockHeight: this.paraBlockHeight,
    }
  }
}
