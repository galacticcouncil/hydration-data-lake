import { SqdBlock, SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import {
  FarmLifeState,
  FarmLifeStateEventName,
  OmnipoolGlobalFarm,
} from '../../../../../model';
import parsers from '../../../../../parsers';
import { getOrCreateAsset } from '../../../../assets/asset';

export async function getOrCreateOmnipoolLMGlobalFarm({
  farmId,
  ensure = false,
  blockHeader,
  ctx,
}: {
  farmId: string;
  ensure?: boolean;
  blockHeader?: SqdBlock;
  ctx: SqdProcessorContext<Store>;
}) {
  if (!farmId) return null;

  let farmEntity = ctx.batchState.state.omnipoolGlobalFarms.get(farmId);

  if (farmEntity) return farmEntity;

  farmEntity = await ctx.store.findOne(OmnipoolGlobalFarm, {
    where: { id: farmId },
  });

  if (farmEntity) {
    ctx.batchState.state.omnipoolGlobalFarms.set(farmId, farmEntity);
    return farmEntity;
  }
  if (!ensure) return null;

  if (!blockHeader) {
    throw Error(
      `getOrCreateOmnipoolLMGlobalFarm :: blockHeader has not been provided`
    );
  }

  const farmStorageData =
    await parsers.storage.omnipoolWarehouseLM.getOmnipoolLMGlobalFarms({
      farmIds: [farmId],
      block: blockHeader,
    });

  if (!farmStorageData || !farmStorageData[0] || !farmStorageData[0].data)
    return null;

  const data = farmStorageData[0].data!;

  const rewardAsset = await getOrCreateAsset({
    assetRegistryId: data.rewardCurrency,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!rewardAsset) {
    throw Error(`rewardAsset with id ${data.rewardCurrency} cannot be found;`);
  }

  const incentivizedAsset = await getOrCreateAsset({
    assetRegistryId: data.incentivizedAsset,
    ctx,
    blockHeader,
    ensure: true,
  });
  if (!incentivizedAsset) {
    throw Error(
      `incentivizedAsset with id ${data.incentivizedAsset} cannot be found;`
    );
  }

  farmEntity = new OmnipoolGlobalFarm({
    id: farmId,
    ownerAccountId: data.owner,

    updatedAtRelayBlock: data.updatedAt,
    totalSharesZ: data.totalSharesZ,
    accumulatedRpz: data.accumulatedRpz,
    rewardAssetId: rewardAsset.id,
    pendingRewards: data.pendingRewards,
    accumulatedPaidRewards: data.accumulatedPaidRewards,
    yieldPerPeriod: data.yieldPerPeriod,
    plannedYieldingPeriods: data.plannedYieldingPeriods,
    blocksPerPeriod: data.blocksPerPeriod,
    incentivizedAssetId: incentivizedAsset.id,
    maxRewardPerPeriod: data.maxRewardPerPeriod,
    minDeposit: data.minDeposit,
    liveYieldFarmsCount: data.liveYieldFarmsCount,
    totalYieldFarmsCount: data.totalYieldFarmsCount,
    priceAdjustment: data.priceAdjustment,
    state: data.state,

    lifeStates: [
      new FarmLifeState({
        eventName: FarmLifeStateEventName.GlobalFarmCreated,
        eventId: null,
        paraBlockHeight: blockHeader.height,
        relayBlockHeight: ctx.batchState.getParaBlockFromCacheByHeight(
          blockHeader.height
        )?.height,
      }),
    ],
    paraBlockHeight: blockHeader.height,
    relayBlockHeight: ctx.batchState.getRelayChainBlockDataFromCache(
      blockHeader.height
    ).height,
  });

  ctx.batchState.state.omnipoolGlobalFarms.set(farmEntity.id, farmEntity);
  await ctx.store.upsert(farmEntity);

  return farmEntity;
}
