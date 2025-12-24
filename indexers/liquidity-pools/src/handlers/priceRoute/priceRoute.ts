import { Store } from '@subsquid/typeorm-store';

import { PriceRoute } from '../../model';
import { SqdProcessorContext } from '../../processor';
import { hashPriceRoute, extractRouteMetadata } from '../../utils/priceRouteHash';

export function getOrCreatePriceRoute(
  route: string[][],
  ctx: SqdProcessorContext<Store>
): PriceRoute {
  const hash = hashPriceRoute(route);

  // Check batch state cache first
  let priceRoute = ctx.batchState.state.priceRoutes.get(hash);
  if (priceRoute) return priceRoute;

  // Create new route
  const { poolAddresses, assetPath, hopCount } = extractRouteMetadata(route);

  priceRoute = new PriceRoute({
    id: hash,
    route,
    poolAddresses,
    assetPath,
    hopCount,
  });

  ctx.batchState.state.priceRoutes.set(hash, priceRoute);
  return priceRoute;
}
