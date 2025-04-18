import { SqdProcessorContext } from '../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { BlockHeader } from '@subsquid/substrate-processor';
import { Asset } from '../../../model';

async function getAssetSpotPrice({
  asset,
  ctx,
  blockHeader,
}: {
  asset: Asset;
  ctx: SqdProcessorContext<Store>;
  blockHeader: BlockHeader;
}) {}

// async function processAssetHistoricalSpotPrices({
//   ctx,
//   blockHeader,
// }: {
//   asset: Asset;
//   ctx: SqdProcessorContext<Store>;
//   blockHeader: BlockHeader;
// }) {}
