import { RuntimeApiMethodName, RuntimeApiName, SpecVersion } from './types';
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
  Option,
  u64,
  Enum,
} from 'scale-ts';

const OrmlAccountDataCodec = Struct({
  free: u128,
  reserved: u128,
  frozen: u128,
});

const LbpPoolData_v182 = Struct({
  owner: u32,
  start: Option(u32),
  end: Option(u32),
  assets: Tuple(u32, u32),
  initialWeight: u32,
  finalWeight: u32,
  weightCurve: Enum({
    Linear: str,
  }),
  fee: Tuple(u32, u32),
  feeCollector: u32,
  repayTarget: u128,
});

export class ScaleCodecManager {
  private static instance: ScaleCodecManager;

  private readonly decodersScope = {
    storage: {
      [SpecVersion.v182]: {
        lbp: {
          poolData: LbpPoolData_v182,
        },
      },
    },
    runtimeApi: {
      [SpecVersion.v264]: {
        [RuntimeApiName.CurrenciesApi]: {
          [RuntimeApiMethodName.account]: OrmlAccountDataCodec,
          [RuntimeApiMethodName.accounts]: Vector(
            Tuple(u32, OrmlAccountDataCodec)
          ),
        },
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
