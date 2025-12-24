import { Store } from '@subsquid/typeorm-store';

import { AssetSpotPriceRoute } from '../../../model';
import { SqdProcessorContext } from '../../../processor';
import {
  hashPriceRoute,
  extractRouteMetadata,
} from '../../../utils/priceRouteHash';

export function getOrCreatePriceRoute(
  route: string[][],
  ctx: SqdProcessorContext<Store>
): AssetSpotPriceRoute {
  const hash = hashPriceRoute(route);

  // Check batch state cache first
  let priceRoute = ctx.batchState.state.priceRoutes.get(hash);
  if (priceRoute) return priceRoute;

  // Create a new route
  const { fillerAddresses, assetPath, hopCount } = extractRouteMetadata(route);

  priceRoute = new AssetSpotPriceRoute({
    id: hash,
    route,
    fillerAddresses,
    assetPath,
    hopCount,
  });

  ctx.batchState.state.priceRoutes.set(hash, priceRoute);
  return priceRoute;
}
