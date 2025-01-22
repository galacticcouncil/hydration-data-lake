import lbp from './lbp';
import xyk from './xyk';
import omnipool from './omnipool';
import stableswap from './stableswap';
import balances from './balances';
import tokens from './tokens';
import assetRegistry from './assetRegistry';
import { EventParserMethods } from '../../../types/common';

export default {
  lbp,
  xyk,
  omnipool,
  stableswap,
  tokens,
  balances,
  assetRegistry,
} as EventParserMethods;
