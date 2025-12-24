import assert from 'assert';
import * as marshal from './marshal';

export class LbppoolCreatedData {
  private _assetABalance!: string;
  private _assetBBalance!: string;
  private _eventId!: string | undefined | null;
  private _paraBlockHeight!: number;

  constructor(props?: Partial<Omit<LbppoolCreatedData, 'toJSON'>>, json?: any) {
    Object.assign(this, props);
    if (json != null) {
      this._assetABalance = marshal.string.fromJSON(json.assetABalance);
      this._assetBBalance = marshal.string.fromJSON(json.assetBBalance);
      this._eventId =
        json.eventId == null
          ? undefined
          : marshal.string.fromJSON(json.eventId);
      this._paraBlockHeight = marshal.int.fromJSON(json.paraBlockHeight);
    }
  }

  get assetABalance(): string {
    assert(this._assetABalance != null, 'uninitialized access');
    return this._assetABalance;
  }

  set assetABalance(value: string) {
    this._assetABalance = value;
  }

  get assetBBalance(): string {
    assert(this._assetBBalance != null, 'uninitialized access');
    return this._assetBBalance;
  }

  set assetBBalance(value: string) {
    this._assetBBalance = value;
  }

  get eventId(): string | undefined | null {
    return this._eventId;
  }

  set eventId(value: string | undefined | null) {
    this._eventId = value;
  }

  get paraBlockHeight(): number {
    assert(this._paraBlockHeight != null, 'uninitialized access');
    return this._paraBlockHeight;
  }

  set paraBlockHeight(value: number) {
    this._paraBlockHeight = value;
  }

  toJSON(): object {
    return {
      assetABalance: this.assetABalance,
      assetBBalance: this.assetBBalance,
      eventId: this.eventId,
      paraBlockHeight: this.paraBlockHeight,
    };
  }
}
