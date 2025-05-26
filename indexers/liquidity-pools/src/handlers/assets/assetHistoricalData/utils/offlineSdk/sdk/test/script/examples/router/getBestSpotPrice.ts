import { ApiPromise } from '@polkadot/api';
import { PoolService, PoolType, TradeRouter } from '../../../../src';

import { PolkadotExecutor } from '../../PjsExecutor';
import { ApiUrl } from '../../types';

class GetBestSpotPriceExample extends PolkadotExecutor {
  async script(api: ApiPromise): Promise<any> {
    const external = [
      {
        decimals: 10,
        id: '30',
        name: 'DED',
        origin: 1000,
        symbol: 'DED',
        internalId: '1000019',
      },
      {
        decimals: 10,
        id: '23',
        name: 'PINK',
        origin: 1000,
        symbol: 'PINK',
        internalId: '1000021',
      },
      {
        decimals: 2,
        id: '420',
        name: 'BEEFY',
        origin: 1000,
        symbol: 'BEEFY',
        internalId: '1000036',
      },
    ];

    const poolService = new PoolService(api);
    // await poolService.syncRegistry(external);
    await poolService.syncRegistry();
    const router = new TradeRouter(poolService);

    // const spotPrice = await router.getBestSpotPrice('0', '15');
    // const spotPriceRoute = await router.getMostLiquidRoute('0', '15');
    //
    // console.dir(spotPriceRoute, { depth: null });
    // console.dir(spotPrice?.amount.toFixed(), { depth: null });

    const routerAssets = (await router.getAllAssets()).sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });

    const routerPools = [
      ...(await new TradeRouter(poolService, {
        includeOnly: [PoolType.XYK],
      }).getPools()),
      ...(await new TradeRouter(poolService, {
        includeOnly: [PoolType.Stable],
      }).getPools()),
      ...(await new TradeRouter(poolService, {
        includeOnly: [PoolType.Omni],
      }).getPools()),
      ...(await new TradeRouter(poolService, {
        includeOnly: [PoolType.Aave],
      }).getPools()),
    ];

    const assetSpotPrices = [];
    for (const assetA of routerAssets) {
      for (const assetB of routerAssets) {
        if (assetB.id === assetA.id) continue;
        const result = {
          assetA: assetA.id,
          assetB: assetB.id,
          price: null,
        };
        try {
          const spotPrice = await router.getBestSpotPrice(assetA.id, assetB.id);
          // @ts-ignore
          result.price = spotPrice ? spotPrice.amount.toFixed() : null;
        } catch (e) {
          console.log(e);
        }
        assetSpotPrices.push(result);
      }
    }

    const fs = require('fs');
    fs.writeFileSync(
      `router-assets-${7457803}.json`,
      JSON.stringify(
        routerAssets.map((a) => ({
          id: a.id,
        })),
        null,
        2
      )
    );
    fs.writeFileSync(
      `asset-spot-prices-${7457803}.json`,
      JSON.stringify(assetSpotPrices, null, 2)
    );
    fs.writeFileSync(
      `pools-${7457803}.json`,
      JSON.stringify(routerPools, null, 2)
    );

    return true;
  }
}

new GetBestSpotPriceExample(ApiUrl.Local, 'Get best spot price', true).run();
