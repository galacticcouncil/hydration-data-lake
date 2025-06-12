import lbp from './lbp';
import dca from './dca';
import xyk from './xyk';
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
  omnipool,
  stableswap,
  tokens,
  balances,
  assetRegistry,
  broadcast,
  dca,
  evm,
  evmAccounts,
  currencies,
} as EventParserMethods;
