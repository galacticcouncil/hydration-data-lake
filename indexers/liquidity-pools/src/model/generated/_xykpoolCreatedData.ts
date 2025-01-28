import assert from "assert"
import * as marshal from "./marshal"

export class XykpoolCreatedData {
  private _initialSharesAmount!: string
  private _paraChainBlockHeight!: number
  private _relayChainBlockHeight!: number

  constructor(props?: Partial<Omit<XykpoolCreatedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._initialSharesAmount = marshal.string.fromJSON(json.initialSharesAmount)
      this._paraChainBlockHeight = marshal.int.fromJSON(json.paraChainBlockHeight)
      this._relayChainBlockHeight = marshal.int.fromJSON(json.relayChainBlockHeight)
    }
  }

  get initialSharesAmount(): string {
    assert(this._initialSharesAmount != null, 'uninitialized access')
    return this._initialSharesAmount
  }

  set initialSharesAmount(value: string) {
    this._initialSharesAmount = value
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
      initialSharesAmount: this.initialSharesAmount,
      paraChainBlockHeight: this.paraChainBlockHeight,
      relayChainBlockHeight: this.relayChainBlockHeight,
    }
  }
}
