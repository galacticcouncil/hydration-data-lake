import assert from "assert"
import * as marshal from "./marshal"
import {AssetMultiLocationsInterior} from "./_assetMultiLocationsInterior"

export class AssetMultiLocation {
    private _parents!: number
    private _hierarchyLevel!: string
    private _interior!: (AssetMultiLocationsInterior)[]

    constructor(props?: Partial<Omit<AssetMultiLocation, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._parents = marshal.int.fromJSON(json.parents)
            this._hierarchyLevel = marshal.string.fromJSON(json.hierarchyLevel)
            this._interior = marshal.fromList(json.interior, val => new AssetMultiLocationsInterior(undefined, marshal.nonNull(val)))
        }
    }

    get parents(): number {
        assert(this._parents != null, 'uninitialized access')
        return this._parents
    }

    set parents(value: number) {
        this._parents = value
    }

    /**
     * Here | X1 | X2 | X3 | X4 | X5 | X6 | X7 | X8
     */
    get hierarchyLevel(): string {
        assert(this._hierarchyLevel != null, 'uninitialized access')
        return this._hierarchyLevel
    }

    set hierarchyLevel(value: string) {
        this._hierarchyLevel = value
    }

    get interior(): (AssetMultiLocationsInterior)[] {
        assert(this._interior != null, 'uninitialized access')
        return this._interior
    }

    set interior(value: (AssetMultiLocationsInterior)[]) {
        this._interior = value
    }

    toJSON(): object {
        return {
            parents: this.parents,
            hierarchyLevel: this.hierarchyLevel,
            interior: this.interior.map((val: any) => val.toJSON()),
        }
    }
}
