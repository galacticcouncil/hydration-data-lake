import { SqdProcessorContext } from '../../../processor';
import { AssetSpotPriceHistoricalData } from '../../../model';
import { Store } from '@subsquid/typeorm-store';

/**
 * Fills missing asset spot prices across all blocks in the processing range.
 * For each asset pair, backward-fills blocks before the first known price,
 * then forward-fills subsequent gaps using the most recent price.
 */
export function correlateAssetSpotPrices(
  ctx: SqdProcessorContext<Store>,
  spotPrices?: Map<string, AssetSpotPriceHistoricalData>
) {
  const spotPricesMap =
    spotPrices ?? ctx.batchState.state.assetsSpotPriceHistoricalDataBatch;

  // Group spot prices by asset pair (assetInId-assetOutId)
  const spotPricesByAssetPair = new Map<
    string,
    AssetSpotPriceHistoricalData[]
  >();

  for (const spotPrice of spotPricesMap.values()) {
    const pairKey = `${spotPrice.assetInId}-${spotPrice.assetOutId}`;
    if (!spotPricesByAssetPair.has(pairKey)) {
      spotPricesByAssetPair.set(pairKey, []);
    }
    spotPricesByAssetPair.get(pairKey)!.push(spotPrice);
  }

  // Sort spot prices by block height for each asset pair
  for (const prices of spotPricesByAssetPair.values()) {
    prices.sort((a, b) => a.paraBlockHeight - b.paraBlockHeight);
  }

  // Get the block range being processed
  const blocks = ctx.blocks;

  // For each asset pair, backfill gaps
  for (const prices of spotPricesByAssetPair.values()) {
    if (prices.length === 0) continue;

    // Create a map of block height to price for fast lookups
    const pricesByBlockHeight = new Map<number, AssetSpotPriceHistoricalData>();
    for (const price of prices) {
      pricesByBlockHeight.set(price.paraBlockHeight, price);
    }

    // Find the latest price before blocks[0] to use for forward-filling
    let lastKnownPrice: AssetSpotPriceHistoricalData | null = null;
    for (const price of prices) {
      if (price.paraBlockHeight < blocks[0].header.height) {
        lastKnownPrice = price;
      } else {
        break; // prices are sorted, no need to continue
      }
    }

    // Find the first price within the block range for backward-filling
    let firstPriceInRange: AssetSpotPriceHistoricalData | null = null;
    for (const price of prices) {
      if (price.paraBlockHeight >= blocks[0].header.height) {
        firstPriceInRange = price;
        break;
      }
    }

    // For each block in the processing range (assuming blocks are sorted by height)
    for (const block of blocks) {
      const blockHeight = block.header.height;

      // Check if there's already a price for this block
      if (pricesByBlockHeight.has(blockHeight)) {
        // Update lastKnownPrice to this existing price
        lastKnownPrice = pricesByBlockHeight.get(blockHeight)!;
      } else if (lastKnownPrice) {
        // Forward-fill: use the last known price
        const newId = `${lastKnownPrice.assetInId}-${lastKnownPrice.assetOutId}-${blockHeight}`;

        const newSpotPrice = new AssetSpotPriceHistoricalData({
          id: newId,
          assetInId: lastKnownPrice.assetInId,
          assetOutId: lastKnownPrice.assetOutId,
          price: lastKnownPrice.price,
          priceNormalised: lastKnownPrice.priceNormalised,
          priceRoute: lastKnownPrice.priceRoute,
          paraBlockHeight: blockHeight,
        });

        // Add to the global map
        spotPricesMap.set(newSpotPrice.id, newSpotPrice);
        pricesByBlockHeight.set(blockHeight, newSpotPrice);
      } else if (firstPriceInRange && blockHeight < firstPriceInRange.paraBlockHeight) {
        // Backward-fill: use the first price in range for blocks before it
        const newId = `${firstPriceInRange.assetInId}-${firstPriceInRange.assetOutId}-${blockHeight}`;

        const newSpotPrice = new AssetSpotPriceHistoricalData({
          id: newId,
          assetInId: firstPriceInRange.assetInId,
          assetOutId: firstPriceInRange.assetOutId,
          price: firstPriceInRange.price,
          priceNormalised: firstPriceInRange.priceNormalised,
          priceRoute: firstPriceInRange.priceRoute,
          paraBlockHeight: blockHeight,
        });

        // Add to the global map
        spotPricesMap.set(newSpotPrice.id, newSpotPrice);
        pricesByBlockHeight.set(blockHeight, newSpotPrice);
      }
    }
  }
}
