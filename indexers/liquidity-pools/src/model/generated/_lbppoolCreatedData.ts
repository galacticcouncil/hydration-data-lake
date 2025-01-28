import assert from "assert"
import * as marshal from "./marshal"

export class LbppoolCreatedData {
  private _assetABalance!: string
  private _assetBBalance!: string
  private _paraChainBlockHeight!: number
  private _relayChainBlockHeight!: number

  constructor(props?: Partial<Omit<LbppoolCreatedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._assetABalance = marshal.string.fromJSON(json.assetABalance)
      this._assetBBalance = marshal.string.fromJSON(json.assetBBalance)
      this._paraChainBlockHeight = marshal.int.fromJSON(json.paraChainBlockHeight)
      this._relayChainBlockHeight = marshal.int.fromJSON(json.relayChainBlockHeight)
    }
  }

  get assetABalance(): string {
    assert(this._assetABalance != null, 'uninitialized access')
    return this._assetABalance
  }

  set assetABalance(value: string) {
    this._assetABalance = value
  }

  get assetBBalance(): string {
    assert(this._assetBBalance != null, 'uninitialized access')
    return this._assetBBalance
  }

  set assetBBalance(value: string) {
    this._assetBBalance = value
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
      assetABalance: this.assetABalance,
      assetBBalance: this.assetBBalance,
      paraChainBlockHeight: this.paraChainBlockHeight,
      relayChainBlockHeight: this.relayChainBlockHeight,
    }
  }
}
