import assert from 'assert';
import * as marshal from './marshal';

export class AssetDynamicFee {
  private _assetFee!: number;
  private _protocolFee!: number;
  private _timestamp!: number;

  constructor(props?: Partial<Omit<AssetDynamicFee, 'toJSON'>>, json?: any) {
    Object.assign(this, props);
    if (json != null) {
      this._assetFee = marshal.int.fromJSON(json.assetFee);
      this._protocolFee = marshal.int.fromJSON(json.protocolFee);
      this._timestamp = marshal.int.fromJSON(json.timestamp);
    }
  }

  get assetFee(): number {
    assert(this._assetFee != null, 'uninitialized access');
    return this._assetFee;
  }

  set assetFee(value: number) {
    this._assetFee = value;
  }

  get protocolFee(): number {
    assert(this._protocolFee != null, 'uninitialized access');
    return this._protocolFee;
  }

  set protocolFee(value: number) {
    this._protocolFee = value;
  }

  get timestamp(): number {
    assert(this._timestamp != null, 'uninitialized access');
    return this._timestamp;
  }

  set timestamp(value: number) {
    this._timestamp = value;
  }

  toJSON(): object {
    return {
      assetFee: this.assetFee,
      protocolFee: this.protocolFee,
      timestamp: this.timestamp,
    };
  }
}
