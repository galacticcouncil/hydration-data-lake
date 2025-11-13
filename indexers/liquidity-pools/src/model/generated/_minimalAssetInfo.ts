import assert from "assert"
import * as marshal from "./marshal"
import {ResourceType} from "./_resourceType"

export class MinimalAssetInfo {
    private _id!: string
    private _assetRegistryId!: string
    private _name!: string | undefined | null
    private _symbol!: string | undefined | null
    private _decimals!: number
    private _resourceType!: ResourceType
    private _evmAddress!: string | undefined | null

    constructor(props?: Partial<Omit<MinimalAssetInfo, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._id = marshal.string.fromJSON(json.id)
            this._assetRegistryId = marshal.string.fromJSON(json.assetRegistryId)
            this._name = json.name == null ? undefined : marshal.string.fromJSON(json.name)
            this._symbol = json.symbol == null ? undefined : marshal.string.fromJSON(json.symbol)
            this._decimals = marshal.int.fromJSON(json.decimals)
            this._resourceType = marshal.enumFromJson(json.resourceType, ResourceType)
            this._evmAddress = json.evmAddress == null ? undefined : marshal.string.fromJSON(json.evmAddress)
        }
    }

    get id(): string {
        assert(this._id != null, 'uninitialized access')
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    get assetRegistryId(): string {
        assert(this._assetRegistryId != null, 'uninitialized access')
        return this._assetRegistryId
    }

    set assetRegistryId(value: string) {
        this._assetRegistryId = value
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

    get decimals(): number {
        assert(this._decimals != null, 'uninitialized access')
        return this._decimals
    }

    set decimals(value: number) {
        this._decimals = value
    }

    get resourceType(): ResourceType {
        assert(this._resourceType != null, 'uninitialized access')
        return this._resourceType
    }

    set resourceType(value: ResourceType) {
        this._resourceType = value
    }

    get evmAddress(): string | undefined | null {
        return this._evmAddress
    }

    set evmAddress(value: string | undefined | null) {
        this._evmAddress = value
    }

    toJSON(): object {
        return {
            id: this.id,
            assetRegistryId: this.assetRegistryId,
            name: this.name,
            symbol: this.symbol,
            decimals: this.decimals,
            resourceType: this.resourceType,
            evmAddress: this.evmAddress,
        }
    }
}
