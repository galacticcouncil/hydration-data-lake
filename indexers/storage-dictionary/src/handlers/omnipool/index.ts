import { Block, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../../parsers';
import {
  AccountBalances,
  Omnipool,
  OmnipoolAssetData,
  OmnipoolAssetState,
  Stableswap,
  Tradability,
} from '../../model';
import { getAssetBalancesMany } from '../balances';
import { AppConfig } from '../../appConfig';
import { Between } from 'typeorm/find-options/operator/Between';
import { In } from 'typeorm/find-options/operator/In';

const appConfig = AppConfig.getInstance();

export async function handleOmnipoolStorage(
  ctx: ProcessorContext<Store>,
  currentBlockHeader: Block
): Promise<void> {
  if (
    ctx.batchState.state.omnipoolsProcessedBlocks.has(currentBlockHeader.height)
  ) {
    return;
  }

  const omnipoolAssetsData: Map<string, OmnipoolAssetData> = new Map();
  const relayChainInfo = ctx.batchState.state.relayChainInfo;

  const allAssetStates =
    await parsers.storage.omnipool.getOmnipoolAssetsAll(currentBlockHeader);

  /**
   * We need add H2O asset manually as it's not presented in storage
   */
  allAssetStates.push({
    assetId: 1,
    assetState: {
      hubReserve: 0n,
      shares: 0n,
      protocolShares: 0n,
      cap: 0n,
      tradable: (await parsers.storage.omnipool.getOmnipoolHubAssetTradability({
        block: currentBlockHeader,
      })) ?? { bits: 1 },
    },
  });

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
      await getAssetBalancesMany({
        ctx,
        block: currentBlockHeader,
        keyPairs: allAssetStates.map((assetData) => ({
          address: appConfig.OMNIPOOL_ADDRESS,
          assetId: assetData.assetId,
        })),
      })
    ).map((item) => [item.assetId, item])
  );

  const hubAssetTradeability =
    await parsers.storage.omnipool.getOmnipoolHubAssetTradability({
      block: currentBlockHeader,
    });

  const newOmnipoolEntity = new Omnipool({
    id: `${appConfig.OMNIPOOL_ADDRESS}-${currentBlockHeader.height}`,
    poolAddress: appConfig.OMNIPOOL_ADDRESS,
    hubAssetTradability: new Tradability({
      bits: hubAssetTradeability?.bits ?? 1,
    }),
    paraBlockHeight: currentBlockHeader.height,
    relayBlockHeight:
      relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber || 0,
  });

  await ctx.store.save(newOmnipoolEntity);

  for (const assetState of allAssetStates) {
    const newAssetDataEntity = new OmnipoolAssetData({
      id: `${appConfig.OMNIPOOL_ADDRESS}-${assetState.assetId}-${currentBlockHeader.height}`,
      pool: newOmnipoolEntity,
      assetId: assetState.assetId,
      assetState: new OmnipoolAssetState({
        ...assetState.assetState,
        tradable: new Tradability(assetState.assetState.tradable),
      }),
      balances:
        allAssetBalancesMap.get(assetState.assetId)?.balances ??
        fallbackAccountBalances,
      paraBlockHeight: currentBlockHeader.height,
      relayBlockHeight:
        relayChainInfo.get(currentBlockHeader.height)?.relaychainBlockNumber ||
        0,
    });

    omnipoolAssetsData.set(newAssetDataEntity.id, newAssetDataEntity);
  }

  await ctx.store.save([...omnipoolAssetsData.values()]);
}

export async function prefetchAllOmnipoolRecordsForBlocksRangeToEnsureMissedBlocks(
  ctx: ProcessorContext<Store>
) {
  if (
    !ctx.appConfig.PROCESS_ONLY_MISSED_BLOCKS ||
    !ctx.appConfig.PROCESS_OMNIPOOLS
  )
    return;

  const orderedNumbers = ctx.blocks
    .map((b) => b.header.height)
    .sort((a, b) => a - b);

  const records = await ctx.store.find(Omnipool, {
    where: {
      paraBlockHeight: Between(
        orderedNumbers[0],
        orderedNumbers[orderedNumbers.length - 1]
      ),
    },
  });

  ctx.batchState.state.omnipools = new Map(records.map((r) => [r.id, r]));
  ctx.batchState.state.omnipoolsProcessedBlocks = new Set(
    records.map((r) => r.paraBlockHeight)
  );

  console.log(
    `Blocks range: ${orderedNumbers[0]}/${orderedNumbers[orderedNumbers.length - 1]}. 
    Number of missed blocks: ${orderedNumbers.filter((b) => !ctx.batchState.state.omnipoolsProcessedBlocks.has(b)).length}/${orderedNumbers.length}`
  );
}
