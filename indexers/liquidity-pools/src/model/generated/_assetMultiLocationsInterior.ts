import assert from "assert"
import * as marshal from "./marshal"
import {AssetMultiLocationsInteriorKind} from "./_assetMultiLocationsInteriorKind"

export class AssetMultiLocationsInterior {
    private _kind!: AssetMultiLocationsInteriorKind
    private _network!: string | undefined | null
    private _id!: string | undefined | null
    private _index!: string | undefined | null
    private _key!: string | undefined | null
    private _value!: string | undefined | null
    private _valueJson!: unknown | undefined | null
    private _data!: string | undefined | null
    private _part!: string | undefined | null
    private _nom!: string | undefined | null
    private _denom!: string | undefined | null
    private _count!: string | undefined | null
    private _blockNumber!: string | undefined | null
    private _blockHash!: string | undefined | null
    private _chainId!: string | undefined | null

    constructor(props?: Partial<Omit<AssetMultiLocationsInterior, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._kind = marshal.enumFromJson(json.kind, AssetMultiLocationsInteriorKind)
            this._network = json.network == null ? undefined : marshal.string.fromJSON(json.network)
            this._id = json.id == null ? undefined : marshal.string.fromJSON(json.id)
            this._index = json.index == null ? undefined : marshal.string.fromJSON(json.index)
            this._key = json.key == null ? undefined : marshal.string.fromJSON(json.key)
            this._value = json.value == null ? undefined : marshal.string.fromJSON(json.value)
            this._valueJson = json.valueJson
            this._data = json.data == null ? undefined : marshal.string.fromJSON(json.data)
            this._part = json.part == null ? undefined : marshal.string.fromJSON(json.part)
            this._nom = json.nom == null ? undefined : marshal.string.fromJSON(json.nom)
            this._denom = json.denom == null ? undefined : marshal.string.fromJSON(json.denom)
            this._count = json.count == null ? undefined : marshal.string.fromJSON(json.count)
            this._blockNumber = json.blockNumber == null ? undefined : marshal.string.fromJSON(json.blockNumber)
            this._blockHash = json.blockHash == null ? undefined : marshal.string.fromJSON(json.blockHash)
            this._chainId = json.chainId == null ? undefined : marshal.string.fromJSON(json.chainId)
        }
    }

    get kind(): AssetMultiLocationsInteriorKind {
        assert(this._kind != null, 'uninitialized access')
        return this._kind
    }

    set kind(value: AssetMultiLocationsInteriorKind) {
        this._kind = value
    }

    get network(): string | undefined | null {
        return this._network
    }

    set network(value: string | undefined | null) {
        this._network = value
    }

    get id(): string | undefined | null {
        return this._id
    }

    set id(value: string | undefined | null) {
        this._id = value
    }

    get index(): string | undefined | null {
        return this._index
    }

    set index(value: string | undefined | null) {
        this._index = value
    }

    get key(): string | undefined | null {
        return this._key
    }

    set key(value: string | undefined | null) {
        this._key = value
    }

    get value(): string | undefined | null {
        return this._value
    }

    set value(value: string | undefined | null) {
        this._value = value
    }

    get valueJson(): unknown | undefined | null {
        return this._valueJson
    }

    set valueJson(value: unknown | undefined | null) {
        this._valueJson = value
    }

    get data(): string | undefined | null {
        return this._data
    }

    set data(value: string | undefined | null) {
        this._data = value
    }

    get part(): string | undefined | null {
        return this._part
    }

    set part(value: string | undefined | null) {
        this._part = value
    }

    get nom(): string | undefined | null {
        return this._nom
    }

    set nom(value: string | undefined | null) {
        this._nom = value
    }

    get denom(): string | undefined | null {
        return this._denom
    }

    set denom(value: string | undefined | null) {
        this._denom = value
    }

    get count(): string | undefined | null {
        return this._count
    }

    set count(value: string | undefined | null) {
        this._count = value
    }

    get blockNumber(): string | undefined | null {
        return this._blockNumber
    }

    set blockNumber(value: string | undefined | null) {
        this._blockNumber = value
    }

    get blockHash(): string | undefined | null {
        return this._blockHash
    }

    set blockHash(value: string | undefined | null) {
        this._blockHash = value
    }

    get chainId(): string | undefined | null {
        return this._chainId
    }

    set chainId(value: string | undefined | null) {
        this._chainId = value
    }

    toJSON(): object {
        return {
            kind: this.kind,
            network: this.network,
            id: this.id,
            index: this.index,
            key: this.key,
            value: this.value,
            valueJson: this.valueJson,
            data: this.data,
            part: this.part,
            nom: this.nom,
            denom: this.denom,
            count: this.count,
            blockNumber: this.blockNumber,
            blockHash: this.blockHash,
            chainId: this.chainId,
        }
    }
}
