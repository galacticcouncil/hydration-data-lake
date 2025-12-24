import crypto from 'crypto';

/**
 * Generates a SHA256 hash of a price route for use as a unique identifier.
 * Routes with identical structure will produce the same hash.
 *
 * @param route - 2D array where each inner array is [poolAddress, poolType, assetIn, assetOut]
 * @returns SHA256 hash as hexadecimal string
 */
export function hashPriceRoute(route: string[][]): string {
  // Deterministic JSON string (sorted keys not needed for arrays)
  const routeJson = JSON.stringify(route);
  return crypto.createHash('sha256').update(routeJson).digest('hex');
}

/**
 * Extracts metadata from a price route for denormalized storage and efficient querying.
 *
 * @param route - 2D array where each inner array is [poolAddress, poolType, assetIn, assetOut]
 * @returns Metadata object with poolAddresses, assetPath, and hopCount
 */
export function extractRouteMetadata(route: string[][]) {
  const poolAddresses: string[] = [];
  const assetPath: string[] = [];

  for (let i = 0; i < route.length; i++) {
    const [poolAddress, _poolType, assetIn, assetOut] = route[i];
    poolAddresses.push(poolAddress);

    // First hop: add starting asset
    if (i === 0) {
      assetPath.push(assetIn);
    }
    // All hops: add ending asset
    assetPath.push(assetOut);
  }

  return {
    poolAddresses,
    assetPath,
    hopCount: route.length,
  };
}
