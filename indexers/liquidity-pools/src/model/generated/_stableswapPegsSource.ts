import assert from "assert"
import * as marshal from "./marshal"
import {EmaOraclePeriod} from "./_emaOraclePeriod"

export class StableswapPegsSource {
    private _sourceKind!: string
    private _oracleName!: string | undefined | null
    private _oraclePeriod!: EmaOraclePeriod | undefined | null
    private _oracleAsset!: string | undefined | null
    private _valuePoints!: (string)[] | undefined | null

    constructor(props?: Partial<Omit<StableswapPegsSource, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._sourceKind = marshal.string.fromJSON(json.sourceKind)
            this._oracleName = json.oracleName == null ? undefined : marshal.string.fromJSON(json.oracleName)
            this._oraclePeriod = json.oraclePeriod == null ? undefined : marshal.enumFromJson(json.oraclePeriod, EmaOraclePeriod)
            this._oracleAsset = json.oracleAsset == null ? undefined : marshal.string.fromJSON(json.oracleAsset)
            this._valuePoints = json.valuePoints == null ? undefined : marshal.fromList(json.valuePoints, val => marshal.string.fromJSON(val))
        }
    }

    get sourceKind(): string {
        assert(this._sourceKind != null, 'uninitialized access')
        return this._sourceKind
    }

    set sourceKind(value: string) {
        this._sourceKind = value
    }

    get oracleName(): string | undefined | null {
        return this._oracleName
    }

    set oracleName(value: string | undefined | null) {
        this._oracleName = value
    }

    get oraclePeriod(): EmaOraclePeriod | undefined | null {
        return this._oraclePeriod
    }

    set oraclePeriod(value: EmaOraclePeriod | undefined | null) {
        this._oraclePeriod = value
    }

    get oracleAsset(): string | undefined | null {
        return this._oracleAsset
    }

    set oracleAsset(value: string | undefined | null) {
        this._oracleAsset = value
    }

    get valuePoints(): (string)[] | undefined | null {
        return this._valuePoints
    }

    set valuePoints(value: (string)[] | undefined | null) {
        this._valuePoints = value
    }

    toJSON(): object {
        return {
            sourceKind: this.sourceKind,
            oracleName: this.oracleName,
            oraclePeriod: this.oraclePeriod,
            oracleAsset: this.oracleAsset,
            valuePoints: this.valuePoints,
        }
    }
}
