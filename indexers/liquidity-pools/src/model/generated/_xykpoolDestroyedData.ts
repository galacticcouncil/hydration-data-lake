import assert from "assert"
import * as marshal from "./marshal"

export class XykpoolDestroyedData {
  private _eventId!: string | undefined | null
  private _paraBlockHeight!: number
  private _relayBlockHeight!: number

  constructor(props?: Partial<Omit<XykpoolDestroyedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._eventId = json.eventId == null ? undefined : marshal.string.fromJSON(json.eventId)
      this._paraBlockHeight = marshal.int.fromJSON(json.paraBlockHeight)
      this._relayBlockHeight = marshal.int.fromJSON(json.relayBlockHeight)
    }
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

  get relayBlockHeight(): number {
    assert(this._relayBlockHeight != null, 'uninitialized access')
    return this._relayBlockHeight
  }

  set relayBlockHeight(value: number) {
    this._relayBlockHeight = value
  }

  toJSON(): object {
    return {
      eventId: this.eventId,
      paraBlockHeight: this.paraBlockHeight,
      relayBlockHeight: this.relayBlockHeight,
    }
  }
}
