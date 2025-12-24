import assert from 'assert';
import * as marshal from './marshal';

export class DynamicFeesAssetFeeParameters {
  private _minFee!: number;
  private _maxFee!: number;
  private _decay!: string;
  private _amplification!: string;

  constructor(
    props?: Partial<Omit<DynamicFeesAssetFeeParameters, 'toJSON'>>,
    json?: any
  ) {
    Object.assign(this, props);
    if (json != null) {
      this._minFee = marshal.int.fromJSON(json.minFee);
      this._maxFee = marshal.int.fromJSON(json.maxFee);
      this._decay = marshal.string.fromJSON(json.decay);
      this._amplification = marshal.string.fromJSON(json.amplification);
    }
  }

  get minFee(): number {
    assert(this._minFee != null, 'uninitialized access');
    return this._minFee;
  }

  set minFee(value: number) {
    this._minFee = value;
  }

  get maxFee(): number {
    assert(this._maxFee != null, 'uninitialized access');
    return this._maxFee;
  }

  set maxFee(value: number) {
    this._maxFee = value;
  }

  get decay(): string {
    assert(this._decay != null, 'uninitialized access');
    return this._decay;
  }

  set decay(value: string) {
    this._decay = value;
  }

  get amplification(): string {
    assert(this._amplification != null, 'uninitialized access');
    return this._amplification;
  }

  set amplification(value: string) {
    this._amplification = value;
  }

  toJSON(): object {
    return {
      minFee: this.minFee,
      maxFee: this.maxFee,
      decay: this.decay,
      amplification: this.amplification,
    };
  }
}
