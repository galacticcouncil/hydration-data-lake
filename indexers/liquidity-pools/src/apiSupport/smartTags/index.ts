import { makePgSmartTagsFromFilePlugin } from 'postgraphile/plugins';
import { getEnvPath } from '../../utils/helpers';

export default [
  makePgSmartTagsFromFilePlugin(
    getEnvPath('apiSupport/smartTags/configs/misc.postgraphile.tags.json5')
  ),
  makePgSmartTagsFromFilePlugin(
    getEnvPath('apiSupport/smartTags/configs/dca.postgraphile.tags.json5')
  ),
  makePgSmartTagsFromFilePlugin(
    getEnvPath('apiSupport/smartTags/configs/swap.postgraphile.tags.json5')
  ),
  makePgSmartTagsFromFilePlugin(
    getEnvPath(
      'apiSupport/smartTags/configs/routedTrade.postgraphile.tags.json5'
    )
  ),
  makePgSmartTagsFromFilePlugin(
    getEnvPath(
      'apiSupport/smartTags/configs/moneyMarket.postgraphile.tags.json5'
    )
  ),
];
