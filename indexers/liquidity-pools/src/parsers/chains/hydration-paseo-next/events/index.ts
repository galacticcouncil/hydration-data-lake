import lbp from './lbp';
import xyk from './xyk';
import omnipool from './omnipool';
import stableswap from './stableswap';
import balances from './balances';
import tokens from './tokens';
import assetRegistry from './assetRegistry';
import ammSupport from './ammSupport';
import otc from './otc';
import dca from './dca';
import { EventParserMethods } from '../../../types/common';

export default {
  lbp,
  xyk,
  omnipool,
  stableswap,
  tokens,
  balances,
  assetRegistry,
  ammSupport,
  otc,
  dca,
} as EventParserMethods;
