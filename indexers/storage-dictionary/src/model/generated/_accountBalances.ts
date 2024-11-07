import assert from "assert"
import * as marshal from "./marshal"

export class AccountBalances {
    private _free!: bigint
    private _reserved!: bigint
    private _miscFrozen!: bigint | undefined | null
    private _feeFrozen!: bigint | undefined | null
    private _frozen!: bigint | undefined | null
    private _flags!: bigint | undefined | null

    constructor(props?: Partial<Omit<AccountBalances, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._free = marshal.bigint.fromJSON(json.free)
            this._reserved = marshal.bigint.fromJSON(json.reserved)
            this._miscFrozen = json.miscFrozen == null ? undefined : marshal.bigint.fromJSON(json.miscFrozen)
            this._feeFrozen = json.feeFrozen == null ? undefined : marshal.bigint.fromJSON(json.feeFrozen)
            this._frozen = json.frozen == null ? undefined : marshal.bigint.fromJSON(json.frozen)
            this._flags = json.flags == null ? undefined : marshal.bigint.fromJSON(json.flags)
        }
    }

    get free(): bigint {
        assert(this._free != null, 'uninitialized access')
        return this._free
    }

    set free(value: bigint) {
        this._free = value
    }

    get reserved(): bigint {
        assert(this._reserved != null, 'uninitialized access')
        return this._reserved
    }

    set reserved(value: bigint) {
        this._reserved = value
    }

    get miscFrozen(): bigint | undefined | null {
        return this._miscFrozen
    }

    set miscFrozen(value: bigint | undefined | null) {
        this._miscFrozen = value
    }

    get feeFrozen(): bigint | undefined | null {
        return this._feeFrozen
    }

    set feeFrozen(value: bigint | undefined | null) {
        this._feeFrozen = value
    }

    get frozen(): bigint | undefined | null {
        return this._frozen
    }

    set frozen(value: bigint | undefined | null) {
        this._frozen = value
    }

    get flags(): bigint | undefined | null {
        return this._flags
    }

    set flags(value: bigint | undefined | null) {
        this._flags = value
    }

    toJSON(): object {
        return {
            free: marshal.bigint.toJSON(this.free),
            reserved: marshal.bigint.toJSON(this.reserved),
            miscFrozen: this.miscFrozen == null ? undefined : marshal.bigint.toJSON(this.miscFrozen),
            feeFrozen: this.feeFrozen == null ? undefined : marshal.bigint.toJSON(this.feeFrozen),
            frozen: this.frozen == null ? undefined : marshal.bigint.toJSON(this.frozen),
            flags: this.flags == null ? undefined : marshal.bigint.toJSON(this.flags),
        }
    }
}
