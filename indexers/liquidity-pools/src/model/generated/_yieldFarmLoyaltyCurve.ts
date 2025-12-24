import assert from 'assert';
import * as marshal from './marshal';

export class YieldFarmLoyaltyCurve {
  private _initialRewardPercentage!: string;
  private _scaleCoef!: number;

  constructor(
    props?: Partial<Omit<YieldFarmLoyaltyCurve, 'toJSON'>>,
    json?: any
  ) {
    Object.assign(this, props);
    if (json != null) {
      this._initialRewardPercentage = marshal.string.fromJSON(
        json.initialRewardPercentage
      );
      this._scaleCoef = marshal.int.fromJSON(json.scaleCoef);
    }
  }

  get initialRewardPercentage(): string {
    assert(this._initialRewardPercentage != null, 'uninitialized access');
    return this._initialRewardPercentage;
  }

  set initialRewardPercentage(value: string) {
    this._initialRewardPercentage = value;
  }

  get scaleCoef(): number {
    assert(this._scaleCoef != null, 'uninitialized access');
    return this._scaleCoef;
  }

  set scaleCoef(value: number) {
    this._scaleCoef = value;
  }

  toJSON(): object {
    return {
      initialRewardPercentage: this.initialRewardPercentage,
      scaleCoef: this.scaleCoef,
    };
  }
}
