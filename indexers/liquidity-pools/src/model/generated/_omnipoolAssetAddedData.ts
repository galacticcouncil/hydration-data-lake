import assert from "assert"
import * as marshal from "./marshal"

export class OmnipoolAssetAddedData {
  private _initialAmount!: string | undefined | null
  private _initialPrice!: string | undefined | null
  private _paraChainBlockHeight!: number
  private _relayChainBlockHeight!: number

  constructor(props?: Partial<Omit<OmnipoolAssetAddedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._initialAmount = json.initialAmount == null ? undefined : marshal.string.fromJSON(json.initialAmount)
      this._initialPrice = json.initialPrice == null ? undefined : marshal.string.fromJSON(json.initialPrice)
      this._paraChainBlockHeight = marshal.int.fromJSON(json.paraChainBlockHeight)
      this._relayChainBlockHeight = marshal.int.fromJSON(json.relayChainBlockHeight)
    }
  }

  get initialAmount(): string | undefined | null {
    return this._initialAmount
  }

  set initialAmount(value: string | undefined | null) {
    this._initialAmount = value
  }

  get initialPrice(): string | undefined | null {
    return this._initialPrice
  }

  set initialPrice(value: string | undefined | null) {
    this._initialPrice = value
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
      initialAmount: this.initialAmount,
      initialPrice: this.initialPrice,
      paraChainBlockHeight: this.paraChainBlockHeight,
      relayChainBlockHeight: this.relayChainBlockHeight,
    }
  }
}
