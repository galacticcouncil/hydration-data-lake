import assert from "assert"
import * as marshal from "./marshal"
import {Tradability} from "./_tradability"

export class OmnipoolAssetState {
    private _hubReserve!: bigint
    private _shares!: bigint
    private _protocolShares!: bigint
    private _cap!: bigint
    private _tradable!: Tradability | undefined | null

    constructor(props?: Partial<Omit<OmnipoolAssetState, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._hubReserve = marshal.bigint.fromJSON(json.hubReserve)
            this._shares = marshal.bigint.fromJSON(json.shares)
            this._protocolShares = marshal.bigint.fromJSON(json.protocolShares)
            this._cap = marshal.bigint.fromJSON(json.cap)
            this._tradable = json.tradable == null ? undefined : new Tradability(undefined, json.tradable)
        }
    }

    get hubReserve(): bigint {
        assert(this._hubReserve != null, 'uninitialized access')
        return this._hubReserve
    }

    set hubReserve(value: bigint) {
        this._hubReserve = value
    }

    get shares(): bigint {
        assert(this._shares != null, 'uninitialized access')
        return this._shares
    }

    set shares(value: bigint) {
        this._shares = value
    }

    get protocolShares(): bigint {
        assert(this._protocolShares != null, 'uninitialized access')
        return this._protocolShares
    }

    set protocolShares(value: bigint) {
        this._protocolShares = value
    }

    get cap(): bigint {
        assert(this._cap != null, 'uninitialized access')
        return this._cap
    }

    set cap(value: bigint) {
        this._cap = value
    }

    get tradable(): Tradability | undefined | null {
        return this._tradable
    }

    set tradable(value: Tradability | undefined | null) {
        this._tradable = value
    }

    toJSON(): object {
        return {
            hubReserve: marshal.bigint.toJSON(this.hubReserve),
            shares: marshal.bigint.toJSON(this.shares),
            protocolShares: marshal.bigint.toJSON(this.protocolShares),
            cap: marshal.bigint.toJSON(this.cap),
            tradable: this.tradable == null ? undefined : this.tradable.toJSON(),
        }
    }
}
