import assert from 'assert';
import * as marshal from './marshal';

export class OmnipoolYieldFarmEntry {
  private _id!: string;
  private _globalFarmId!: string;
  private _yieldFarmId!: string;
  private _valuedShares!: string;
  private _accumulatedRpvs!: string;
  private _accumulatedClaimedRewards!: string;
  private _enteredAtRelayBlock!: string;
  private _updatedAtRelayBlock!: string;
  private _stoppedAtCreation!: string;

  constructor(
    props?: Partial<Omit<OmnipoolYieldFarmEntry, 'toJSON'>>,
    json?: any
  ) {
    Object.assign(this, props);
    if (json != null) {
      this._id = marshal.id.fromJSON(json.id);
      this._globalFarmId = marshal.string.fromJSON(json.globalFarmId);
      this._yieldFarmId = marshal.string.fromJSON(json.yieldFarmId);
      this._valuedShares = marshal.string.fromJSON(json.valuedShares);
      this._accumulatedRpvs = marshal.string.fromJSON(json.accumulatedRpvs);
      this._accumulatedClaimedRewards = marshal.string.fromJSON(
        json.accumulatedClaimedRewards
      );
      this._enteredAtRelayBlock = marshal.string.fromJSON(
        json.enteredAtRelayBlock
      );
      this._updatedAtRelayBlock = marshal.string.fromJSON(
        json.updatedAtRelayBlock
      );
      this._stoppedAtCreation = marshal.string.fromJSON(json.stoppedAtCreation);
    }
  }

  /**
   * <deposit_id>-<omnipool_global_farm_id>-<omnipool_yield_farm_id>
   */
  get id(): string {
    assert(this._id != null, 'uninitialized access');
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get globalFarmId(): string {
    assert(this._globalFarmId != null, 'uninitialized access');
    return this._globalFarmId;
  }

  set globalFarmId(value: string) {
    this._globalFarmId = value;
  }

  get yieldFarmId(): string {
    assert(this._yieldFarmId != null, 'uninitialized access');
    return this._yieldFarmId;
  }

  set yieldFarmId(value: string) {
    this._yieldFarmId = value;
  }

  get valuedShares(): string {
    assert(this._valuedShares != null, 'uninitialized access');
    return this._valuedShares;
  }

  set valuedShares(value: string) {
    this._valuedShares = value;
  }

  get accumulatedRpvs(): string {
    assert(this._accumulatedRpvs != null, 'uninitialized access');
    return this._accumulatedRpvs;
  }

  set accumulatedRpvs(value: string) {
    this._accumulatedRpvs = value;
  }

  get accumulatedClaimedRewards(): string {
    assert(this._accumulatedClaimedRewards != null, 'uninitialized access');
    return this._accumulatedClaimedRewards;
  }

  set accumulatedClaimedRewards(value: string) {
    this._accumulatedClaimedRewards = value;
  }

  get enteredAtRelayBlock(): string {
    assert(this._enteredAtRelayBlock != null, 'uninitialized access');
    return this._enteredAtRelayBlock;
  }

  set enteredAtRelayBlock(value: string) {
    this._enteredAtRelayBlock = value;
  }

  get updatedAtRelayBlock(): string {
    assert(this._updatedAtRelayBlock != null, 'uninitialized access');
    return this._updatedAtRelayBlock;
  }

  set updatedAtRelayBlock(value: string) {
    this._updatedAtRelayBlock = value;
  }

  get stoppedAtCreation(): string {
    assert(this._stoppedAtCreation != null, 'uninitialized access');
    return this._stoppedAtCreation;
  }

  set stoppedAtCreation(value: string) {
    this._stoppedAtCreation = value;
  }

  toJSON(): object {
    return {
      id: this.id,
      globalFarmId: this.globalFarmId,
      yieldFarmId: this.yieldFarmId,
      valuedShares: this.valuedShares,
      accumulatedRpvs: this.accumulatedRpvs,
      accumulatedClaimedRewards: this.accumulatedClaimedRewards,
      enteredAtRelayBlock: this.enteredAtRelayBlock,
      updatedAtRelayBlock: this.updatedAtRelayBlock,
      stoppedAtCreation: this.stoppedAtCreation,
    };
  }
}
