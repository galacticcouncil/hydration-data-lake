import lbp from './lbp';
import xyk from './xyk';
import xykLiquidityMining from './xykLiquidityMining';
import dca from './dca';
import otc from './otc';
import omnipool from './omnipool';
import omnipoolLiquidityMining from './omnipoolLiquidityMining';
import omnipoolWarehouseLM from './omnipoolWarehouseLm';
import stableswap from './stableswap';
import balances from './balances';
import tokens from './tokens';
import assetRegistry from './assetRegistry';
import broadcast from './broadcast';
import evm from './evm';
import hsm from './hsm';
import evmAccounts from './evmAccounts';
import currencies from './currencies';

import { EventParserMethods } from '../../../types/common';

export default {
  lbp,
  xyk,
  xykLiquidityMining,
  dca,
  otc,
  omnipool,
  omnipoolLiquidityMining,
  omnipoolWarehouseLM,
  stableswap,
  tokens,
  balances,
  assetRegistry,
  broadcast,
  evm,
  evmAccounts,
  currencies,
  hsm,
} as EventParserMethods;
