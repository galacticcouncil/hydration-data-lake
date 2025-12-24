import assert from 'assert';
import * as marshal from './marshal';

export class StableswapCreatedData {
  private _eventId!: string | undefined | null;
  private _paraBlockHeight!: number;

  constructor(
    props?: Partial<Omit<StableswapCreatedData, 'toJSON'>>,
    json?: any
  ) {
    Object.assign(this, props);
    if (json != null) {
      this._eventId =
        json.eventId == null
          ? undefined
          : marshal.string.fromJSON(json.eventId);
      this._paraBlockHeight = marshal.int.fromJSON(json.paraBlockHeight);
    }
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
      eventId: this.eventId,
      paraBlockHeight: this.paraBlockHeight,
    };
  }
}
