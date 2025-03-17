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
import evm from './evm';
import evmAccounts from './evmAccounts';
import currencies from './currencies';
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
  evm,
  evmAccounts,
  currencies,
} as EventParserMethods;
