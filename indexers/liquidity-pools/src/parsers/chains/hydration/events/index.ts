import lbp from './lbp';
import xyk from './xyk';
import dca from './dca';
import otc from './otc';
import omnipool from './omnipool';
import stableswap from './stableswap';
import balances from './balances';
import tokens from './tokens';
import assetRegistry from './assetRegistry';
import broadcast from './broadcast';
import { EventParserMethods } from '../../../types/common';

export default {
  lbp,
  xyk,
  dca,
  otc,
  omnipool,
  stableswap,
  tokens,
  balances,
  assetRegistry,
  broadcast,
} as EventParserMethods;
