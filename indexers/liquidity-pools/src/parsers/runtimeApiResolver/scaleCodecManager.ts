import {
  RpcCallMethodName,
  RpcCallName,
  RuntimeApiMethodName,
  RuntimeApiName,
  RuntimeApiVersion,
} from './types';
import {
  bool,
  _void,
  str,
  u32,
  u128,
  Struct,
  Vector,
  compact,
  Tuple,
  Codec,
  u256,
} from 'scale-ts';

const OrmlAccountDataCodec = Struct({
  free: u128,
  reserved: u128,
  frozen: u128,
});

export class ScaleCodecManager {
  private static instance: ScaleCodecManager;

  private readonly decodersScope = {
    [RuntimeApiVersion.v264]: {
      [RuntimeApiName.CurrenciesApi]: {
        [RuntimeApiMethodName.account]: OrmlAccountDataCodec,
        [RuntimeApiMethodName.accounts]: Vector(
          Tuple(u32, OrmlAccountDataCodec)
        ),
      },
      [RpcCallName.EthCall]: {
        [RpcCallMethodName.balanceOf]: u256,
      },
    },
  };

  static getInstance(): ScaleCodecManager {
    if (!ScaleCodecManager.instance) {
      ScaleCodecManager.instance = new ScaleCodecManager();
    }
    return ScaleCodecManager.instance;
  }

  constructor() {}

  get decoders() {
    return this.decodersScope;
  }
}
