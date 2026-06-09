import type * as pg from 'pg';
import { GalacticCouncilSdkManager } from '../../../../../../../utils/galacticCouncilSdkManager';
import { getOmnipoolAssetsAll } from '../../../../../../sql/omnipool/omnipoolAssets.sql';
import { farm } from '@galacticcouncil/sdk-next';
import { AssetFarmsYieldMetrics } from './resolvers';

const isolatedPoolIds: string[] = [
  '15L6BQ1sMd9pESapK13dHaXBPPtBYnDnKTVhb2gBeGrrJNBx',
  '15nzS2D2wJdh52tqZdUJVMeDQqQe7wJfo5NZKL7pUxhwYgwq',
];

function sumFarmApr(farms: (farm.Farm | undefined)[]): number {
  return farms.reduce((sum, f) => (f ? sum + parseFloat(f.apr) : sum), 0);
}

export async function handleAllAssetsFarmsYieldMetrics({
  pgClient,
}: {
  pgClient: pg.Client;
}): Promise<AssetFarmsYieldMetrics[]> {
  const sdkManager = new GalacticCouncilSdkManager();
  const lmApi = await sdkManager.getLiquidityMiningApi();

  const allOmnipoolAssetAssetRegistryIds = (
    await pgClient.query<{
      omnipool_asset_id: string;
      asset_id: string;
      asset_registry_id?: string;
      decimals?: number;
    }>(getOmnipoolAssetsAll)
  ).rows
    .map((a) => a.asset_registry_id)
    .filter((a) => a !== undefined);

  const resultList: AssetFarmsYieldMetrics[] = [];

  await Promise.all(
    allOmnipoolAssetAssetRegistryIds.map(async (assetId: string) => {
      let farms: (farm.Farm | undefined)[] = [];
      try {
        farms = await lmApi.getOmnipoolFarms(assetId);
      } catch (e) {
        console.log(e);
      }

      const activeFarms = farms.filter((f): f is farm.Farm => f !== undefined);
      const totalApr = sumFarmApr(activeFarms);
      if (totalApr === 0) return null;

      const rewardCurrencyIds = [
        ...new Set(activeFarms.map((f) => f.rewardCurrency.toString())),
      ];

      resultList.push({
        id: assetId,
        poolType: 'omnipool',
        farmApy: totalApr.toString(),
        incentivesTokens: rewardCurrencyIds,
      });
    })
  );

  await Promise.all(
    isolatedPoolIds.map(async (poolId: string) => {
      let farms: (farm.Farm | undefined)[] = [];
      try {
        farms = await lmApi.getIsolatedFarms(poolId);
      } catch (e) {
        console.log(e);
      }

      const activeFarms = farms.filter((f): f is farm.Farm => f !== undefined);
      const totalApr = sumFarmApr(activeFarms);
      if (totalApr === 0) return null;

      const rewardCurrencyIds = [
        ...new Set(activeFarms.map((f) => f.rewardCurrency.toString())),
      ];

      resultList.push({
        id: poolId,
        poolType: 'isolatedpool',
        farmApy: totalApr.toString(),
        incentivesTokens: rewardCurrencyIds,
      });
    })
  );

  return resultList;
}
