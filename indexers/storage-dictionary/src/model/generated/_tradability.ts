import assert from "assert"
import * as marshal from "./marshal"

export class Tradability {
    private _bits!: number

    constructor(props?: Partial<Omit<Tradability, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._bits = marshal.int.fromJSON(json.bits)
        }
    }

    get bits(): number {
        assert(this._bits != null, 'uninitialized access')
        return this._bits
    }

    set bits(value: number) {
        this._bits = value
    }

    toJSON(): object {
        return {
            bits: this.bits,
        }
    }
}
