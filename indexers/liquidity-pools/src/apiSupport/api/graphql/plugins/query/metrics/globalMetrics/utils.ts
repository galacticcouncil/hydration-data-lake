import type * as pg from 'pg';
import { GalacticCouncilSdkManager } from '../../../../../../../utils/galacticCouncilSdkManager';
import { getOmnipoolAssetsAll } from '../../../../../../sql/omnipool/omnipoolAssets.sql';
import { AppConfig } from '../../../../../../../appConfig';
import { AssetFarmsYieldMetrics } from './resolvers';

const appConfig = AppConfig.getInstance();

export async function handleAllAssetsFarmsYieldMetrics({
  pgClient,
}: {
  pgClient: pg.Client;
}): Promise<AssetFarmsYieldMetrics[]> {
  const sdkManager = new GalacticCouncilSdkManager();

  const farmClientInstance = await sdkManager.getFarmClient();
  const polkadotApiInstance = await sdkManager.getPolkadotApi();

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

  const isolatedPoolIds: string[] = [
    '15L6BQ1sMd9pESapK13dHaXBPPtBYnDnKTVhb2gBeGrrJNBx',
    '15nzS2D2wJdh52tqZdUJVMeDQqQe7wJfo5NZKL7pUxhwYgwq',
  ];

  const resultList: AssetFarmsYieldMetrics[] = [];

  await Promise.all(
    allOmnipoolAssetAssetRegistryIds.map(async (assetId: string) => {
      let farmApy = null;
      try {
        farmApy = await farmClientInstance.getFarmApr(assetId, 'omnipool');
      } catch (e) {
        console.log(e);
      }

      if (!farmApy || farmApy === '0') return null;

      const activeYieldFarmIds =
        await polkadotApiInstance.query.omnipoolWarehouseLM.activeYieldFarm.entries(
          assetId
        );

      const rewardCurrencyIds = await Promise.all(
        activeYieldFarmIds.map(async ([storageKey, option]) => {
          const [, globalFarmIdRaw] = storageKey.args;

          const globalFarmId = globalFarmIdRaw.toString();

          const globalFarm = (
            await polkadotApiInstance.query.omnipoolWarehouseLM.globalFarm(
              globalFarmId
            )
          )
            // @ts-ignore
            .unwrap();

          const rewardCurrency = globalFarm.rewardCurrency.toString();

          return rewardCurrency;
        })
      );

      resultList.push({
        id: assetId,
        poolType: 'omnipool',
        farmApy,
        incentivesTokens: rewardCurrencyIds,
      });
    })
  );

  await Promise.all(
    isolatedPoolIds.map(async (poolId: string) => {
      let farmApy = null;
      try {
        farmApy = await farmClientInstance.getFarmApr(poolId, 'isolatedpool');
      } catch (e) {
        console.log(e);
      }

      if (!farmApy || farmApy === '0') return null;

      const activeYieldFarmIds =
        await polkadotApiInstance.query.xykWarehouseLM.activeYieldFarm.entries(
          poolId
        );

      const rewardCurrencyIds = await Promise.all(
        activeYieldFarmIds.map(async ([storageKey, option]) => {
          const [, globalFarmIdRaw] = storageKey.args;

          const globalFarmId = globalFarmIdRaw.toString();

          const globalFarm = (
            await polkadotApiInstance.query.xykWarehouseLM.globalFarm(
              globalFarmId
            )
          )
            // @ts-ignore
            .unwrap();

          const rewardCurrency = globalFarm!.rewardCurrency.toString();

          return rewardCurrency;
        })
      );

      resultList.push({
        id: poolId,
        poolType: 'isolatedpool',
        farmApy,
        incentivesTokens: rewardCurrencyIds,
      });
    })
  );

  return resultList;
}
