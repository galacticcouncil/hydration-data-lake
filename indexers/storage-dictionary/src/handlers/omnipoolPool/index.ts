import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountBalances,
  OmnipoolAssetData,
  OmnipoolAssetState,
  Tradability,
} from '../../model';
import { getAssetBalancesMany } from '../balances';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export async function handleOmnipoolStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  const omnipoolAssetsData: Map<string, OmnipoolAssetData> = new Map();

  const allAssetStates =
    await parsers.storage.omnipool.getOmnipoolAssetsAll(currentBlockHeader);

  const fallbackAccountBalances = new AccountBalances({
    free: BigInt(0),
    reserved: BigInt(0),
    miscFrozen: BigInt(0),
    feeFrozen: BigInt(0),
    frozen: BigInt(0),
    flags: BigInt(0),
  });

  const allAssetBalancesMap = new Map(
    (
      await getAssetBalancesMany(
        currentBlockHeader,
        allAssetStates.map((assetData) => ({
          address: appConfig.OMNIPOOL_ADDRESS,
          assetId: assetData.assetId,
        }))
      )
    ).map((item) => [item.assetId, item])
  );

  for (const assetState of allAssetStates) {
    const newAssetDataEntity = new OmnipoolAssetData({
      id: `${appConfig.OMNIPOOL_ADDRESS}-${assetState.assetId}-${currentBlockHeader.height}`,
      poolAddress: appConfig.OMNIPOOL_ADDRESS,
      assetId: assetState.assetId,
      assetState: new OmnipoolAssetState({
        ...assetState.assetState,
        tradable: new Tradability(assetState.assetState.tradable),
      }),
      balances:
        allAssetBalancesMap.get(assetState.assetId)?.balances ??
        fallbackAccountBalances,
      paraChainBlockHeight: currentBlockHeader.height,
    });

    omnipoolAssetsData.set(newAssetDataEntity.id, newAssetDataEntity);
  }

  await ctx.store.save([...omnipoolAssetsData.values()]);
}
