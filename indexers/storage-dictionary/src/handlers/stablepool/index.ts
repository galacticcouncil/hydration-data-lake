import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountBalances,
  Stablepool,
  StablepoolAssetData,
  XykPool,
  XykPoolAssetsData,
} from '../../model';
import { getAssetBalancesMany } from '../balances';
import { StableMath } from '@galacticcouncil/sdk';
import { blake2AsHex } from '@polkadot/util-crypto';

export async function handleStablepoolStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  const stablepools: Map<string, Stablepool> = new Map();
  const stablepoolAssetsData: Map<string, StablepoolAssetData> = new Map();

  const allPools = (
    await parsers.storage.stableswap.getPoolsAll(currentBlockHeader)
  ).map((poolData) => ({
    ...poolData,
    poolAddress: blake2AsHex(StableMath.getPoolAddress(poolData.poolId)),
  }));

  const fallbackAccountBalances = new AccountBalances({
    free: BigInt(0),
    reserved: BigInt(0),
    miscFrozen: BigInt(0),
    feeFrozen: BigInt(0),
    frozen: BigInt(0),
    flags: BigInt(0),
  });

  const allPoolAssetBalancesMap = new Map(
    (
      await getAssetBalancesMany(
        currentBlockHeader,
        allPools
          .map((pool) =>
            pool.assetIds.map((id) => ({
              address: pool.poolAddress,
              assetId: id,
            }))
          )
          .flat()
      )
    ).map((item) => [`${item.poolAddress}-${item.assetId}`, item])
  );

  for (const {
    poolId,
    poolAddress,
    initialBlock,
    finalBlock,
    initialAmplification,
    finalAmplification,
    fee,
    assetIds,
  } of allPools) {
    const newPoolEntity = new Stablepool({
      id: `${poolId}-${currentBlockHeader.height}`,
      paraChainBlockHeight: currentBlockHeader.height,
      poolAddress,
      poolId,
      initialAmplification,
      finalAmplification,
      initialBlock,
      finalBlock,
      fee,
    });

    for (const assetId of assetIds) {
      stablepoolAssetsData.set(
        `${poolId}-${assetId}-${currentBlockHeader.height}`,
        new StablepoolAssetData({
          id: `${poolId}-${assetId}-${currentBlockHeader.height}`,
          paraChainBlockHeight: currentBlockHeader.height,
          assetId: assetId,
          pool: newPoolEntity,
          balances:
            allPoolAssetBalancesMap.get(`${poolAddress}-${assetId}`)
              ?.balances ?? fallbackAccountBalances,
        })
      );
    }

    stablepools.set(newPoolEntity.id, newPoolEntity);
  }

  await ctx.store.save([...stablepools.values()]);
  await ctx.store.save([...stablepoolAssetsData.values()]);
}
