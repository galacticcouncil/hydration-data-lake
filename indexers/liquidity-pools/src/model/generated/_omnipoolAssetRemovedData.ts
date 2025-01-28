import assert from "assert"
import * as marshal from "./marshal"

export class OmnipoolAssetRemovedData {
  private _removedAmount!: string | undefined | null
  private _hubWithdrawn!: string | undefined | null
  private _paraChainBlockHeight!: number
  private _relayChainBlockHeight!: number

  constructor(props?: Partial<Omit<OmnipoolAssetRemovedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._removedAmount = json.removedAmount == null ? undefined : marshal.string.fromJSON(json.removedAmount)
      this._hubWithdrawn = json.hubWithdrawn == null ? undefined : marshal.string.fromJSON(json.hubWithdrawn)
      this._paraChainBlockHeight = marshal.int.fromJSON(json.paraChainBlockHeight)
      this._relayChainBlockHeight = marshal.int.fromJSON(json.relayChainBlockHeight)
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

  get paraChainBlockHeight(): number {
    assert(this._paraChainBlockHeight != null, 'uninitialized access')
    return this._paraChainBlockHeight
  }

  set paraChainBlockHeight(value: number) {
    this._paraChainBlockHeight = value
  }

  get relayChainBlockHeight(): number {
    assert(this._relayChainBlockHeight != null, 'uninitialized access')
    return this._relayChainBlockHeight
  }

  set relayChainBlockHeight(value: number) {
    this._relayChainBlockHeight = value
  }

  toJSON(): object {
    return {
      removedAmount: this.removedAmount,
      hubWithdrawn: this.hubWithdrawn,
      paraChainBlockHeight: this.paraChainBlockHeight,
      relayChainBlockHeight: this.relayChainBlockHeight,
    }
  }
}
