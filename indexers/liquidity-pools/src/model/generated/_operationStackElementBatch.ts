import assert from "assert"
import * as marshal from "./marshal"
import {SwappedExecutionTypeKind} from "./_swappedExecutionTypeKind"

export class OperationStackElementBatch {
  public readonly isTypeOf = 'OperationStackElementBatch'
  private _index!: number
  private _kind!: SwappedExecutionTypeKind
  private _incrementalId!: number

  constructor(props?: Partial<Omit<OperationStackElementBatch, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._index = marshal.int.fromJSON(json.index)
      this._kind = marshal.enumFromJson(json.kind, SwappedExecutionTypeKind)
      this._incrementalId = marshal.int.fromJSON(json.incrementalId)
    }
  }

  get index(): number {
    assert(this._index != null, 'uninitialized access')
    return this._index
  }

  set index(value: number) {
    this._index = value
  }

  get kind(): SwappedExecutionTypeKind {
    assert(this._kind != null, 'uninitialized access')
    return this._kind
  }

  set kind(value: SwappedExecutionTypeKind) {
    this._kind = value
  }

  get incrementalId(): number {
    assert(this._incrementalId != null, 'uninitialized access')
    return this._incrementalId
  }

  set incrementalId(value: number) {
    this._incrementalId = value
  }

  toJSON(): object {
    return {
      isTypeOf: this.isTypeOf,
      index: this.index,
      kind: this.kind,
      incrementalId: this.incrementalId,
    }
  }
}
