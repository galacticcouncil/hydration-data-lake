import assert from "assert"
import * as marshal from "./marshal"
import {AssetType} from "./_assetType"

export class EmbeddedAsset {
    private _id!: string
    private _assetRegistryId!: string | undefined | null
    private _existentialDeposit!: bigint
    private _decimals!: number | undefined | null
    private _name!: string | undefined | null
    private _symbol!: string | undefined | null
    private _isSufficient!: boolean | undefined | null
    private _assetType!: AssetType | undefined | null

    constructor(props?: Partial<Omit<EmbeddedAsset, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._id = marshal.string.fromJSON(json.id)
            this._assetRegistryId = json.assetRegistryId == null ? undefined : marshal.string.fromJSON(json.assetRegistryId)
            this._existentialDeposit = marshal.bigint.fromJSON(json.existentialDeposit)
            this._decimals = json.decimals == null ? undefined : marshal.int.fromJSON(json.decimals)
            this._name = json.name == null ? undefined : marshal.string.fromJSON(json.name)
            this._symbol = json.symbol == null ? undefined : marshal.string.fromJSON(json.symbol)
            this._isSufficient = json.isSufficient == null ? undefined : marshal.boolean.fromJSON(json.isSufficient)
            this._assetType = json.assetType == null ? undefined : marshal.enumFromJson(json.assetType, AssetType)
        }
    }

    get id(): string {
        assert(this._id != null, 'uninitialized access')
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get assetRegistryId(): string | undefined | null {
        return this._assetRegistryId
    }

    set assetRegistryId(value: string | undefined | null) {
        this._assetRegistryId = value
    }

    get existentialDeposit(): bigint {
        assert(this._existentialDeposit != null, 'uninitialized access')
        return this._existentialDeposit
    }

    set existentialDeposit(value: bigint) {
        this._existentialDeposit = value
    }

    get decimals(): number | undefined | null {
        return this._decimals
    }

    set decimals(value: number | undefined | null) {
        this._decimals = value
    }

    get name(): string | undefined | null {
        return this._name
    }

    set name(value: string | undefined | null) {
        this._name = value
    }

    get symbol(): string | undefined | null {
        return this._symbol
    }

    set symbol(value: string | undefined | null) {
        this._symbol = value
    }

    get isSufficient(): boolean | undefined | null {
        return this._isSufficient
    }

    set isSufficient(value: boolean | undefined | null) {
        this._isSufficient = value
    }

    get assetType(): AssetType | undefined | null {
        return this._assetType
    }

    set assetType(value: AssetType | undefined | null) {
        this._assetType = value
    }

    toJSON(): object {
        return {
            id: this.id,
            assetRegistryId: this.assetRegistryId,
            existentialDeposit: marshal.bigint.toJSON(this.existentialDeposit),
            decimals: this.decimals,
            name: this.name,
            symbol: this.symbol,
            isSufficient: this.isSufficient,
            assetType: this.assetType,
        }
    }
}
