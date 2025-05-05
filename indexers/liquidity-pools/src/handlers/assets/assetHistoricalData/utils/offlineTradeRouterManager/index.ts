import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';
import {
  TradeRouter,
  OfflinePoolService,
  IPersistentDataInput,
  OfflinePoolUtils,
  PoolType,
  PoolService,
  BigNumber,
} from '../../../../../../../../../../hydration-sdk/packages/sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex, u8aToString } from '@polkadot/util';
import fs from 'fs';
import { PoolPair } from '@galacticcouncil/sdk';

export class OfflineTradeRouterManager extends OfflineTradeRouterManagerHelper {
  private static instance: OfflineTradeRouterManager;

  private routerInstancesMap: Map<number, TradeRouter> = new Map();

  static getInstance(): OfflineTradeRouterManager {
    if (!OfflineTradeRouterManager.instance) {
      OfflineTradeRouterManager.instance = new OfflineTradeRouterManager();
    }
    return OfflineTradeRouterManager.instance;
  }
  private constructor() {
    super();
  }

  async init({
    blockNumbers,
    ctx,
  }: {
    blockNumbers: number[];
    ctx: SqdProcessorContext<Store>;
  }) {
    await this.prefetchAllHistoricalData({ blockNumbers, ctx });

    await Promise.all(
      blockNumbers.map(async (blockNumber) => {
        await this.initOfflineTradeRouterForBlock(blockNumber, ctx);
      })
    );
  }

  private async initOfflineTradeRouterForBlock(
    blockNumber: number,
    ctx: SqdProcessorContext<Store>
  ) {
    const block = ctx.batchState.getParaBlockFromCacheByHeight(blockNumber);

    if (!block) throw new Error(`Block ${blockNumber} not found in cache`);

    const persistentDataSource: IPersistentDataInput = {
      meta: {
        paraBlockNumber: block.height,
        paraBlockHash: block.hash,
        relayBlockNumber: block.relayBlockHeight,
      },
      constants: this.getDecoratedConstantsHistDataAsPersistentDataInput({
        blockNumber,
      }),
      emaOracle: this.getDecoratedEmaOraclesHistDataAsPersistentDataInput({
        blockNumber,
      }),
      assets: this.getDecoratedAssetsHistDataAsPersistentDataInput({
        blockNumber,
      }),
      pools: {
        lbp: this.getDecoratedLbppoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        xyk: this.getDecoratedXykpoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        stableswap: this.getDecoratedStableswapHistDataAsPersistentDataInput({
          blockNumber,
        }),
        omnipool: this.getDecoratedOmnipoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        aave: this.getDecoratedAavepoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
      },
    };

    // console.dir(
    //   OfflinePoolUtils.fromPersistentDataToDataSource(persistentDataSource),
    //   { depth: null }
    // );

    const offlinePoolService = new OfflinePoolService(
      OfflinePoolUtils.fromPersistentDataToDataSource(persistentDataSource)
    );
    // const omnipools = await offlinePoolService.getPools([PoolType.Omni]);
    const router = new TradeRouter(offlinePoolService);

    console.log('====================================== ', block.height);

    const routerAssets = (await router.getAllAssets()).sort((a, b) => {
      return Number(a.id) - Number(b.id);
    });

    const routerPools = [
      ...(await new TradeRouter(offlinePoolService, {
        includeOnly: [PoolType.XYK],
      }).getPools()),
      ...(await new TradeRouter(offlinePoolService, {
        includeOnly: [PoolType.Stable],
      }).getPools()),
      ...(await new TradeRouter(offlinePoolService, {
        includeOnly: [PoolType.Omni],
      }).getPools()),
      ...(await new TradeRouter(offlinePoolService, {
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

    fs.writeFileSync(
      `router-assets-${block.height}.json`,
      JSON.stringify(
        routerAssets.map((a) => ({
          id: a.id,
        })),
        null,
        2
      )
    );
    fs.writeFileSync(
      `asset-spot-prices-${block.height}.json`,
      JSON.stringify(assetSpotPrices, null, 2)
    );

    fs.writeFileSync(
      `pools-${block.height}.json`,
      JSON.stringify(routerPools, null, 2)
    );

    // const spotPrice = await router.getBestSpotPrice('0', '15');
    // const spotPriceRoute = await router.getMostLiquidRoute('0', '15');
    //
    // console.dir(spotPriceRoute, { depth: null });
    // console.dir(spotPrice?.amount.toFixed(), { depth: null });
    //
    // if (spotPrice)
    //   console.log(
    //     'OFFLINE PRICE:: ',
    //     spotPrice?.amount
    //       .div(new BigNumber!(10 ** +spotPrice.decimals.toFixed()))
    //       .toFixed()
    //   );

    // console.log('POOLS OFFLINE');
    // const offlinePools = await router.getPools();
    // console.dir(offlinePools, { depth: null });
    // console.dir(
    //   offlinePools.filter((p) => p.type === 'Xyk').map((p) => p.id),
    //   { depth: null }
    // );
    //
    // console.log('\n\n\n\n\n');
    // console.log('\n\n\n\n\n');
    //
    // // Initialize Polkadot API
    // const wsProvider = new WsProvider('wss://hydration-rpc.n.dwellir.com');
    // const api = await ApiPromise.create({ provider: wsProvider });
    //
    // // const apiAtBlock = await api.at(block.hash);
    //
    // // Initialize Trade Router
    // const poolService = new PoolService(api);
    // await poolService.syncRegistry(); // Wait until pools initialized (optional), fallback to lazy init
    // const tradeRouter = new TradeRouter(poolService);
    //
    // const price = await tradeRouter.getBestSpotPrice('0', '15');
    // const priceRoute = await router.getMostLiquidRoute('0', '15');
    // //
    // console.dir(priceRoute, { depth: null });
    // console.dir(price?.amount.toFixed(), { depth: null });

    //
    // console.log(
    //   'ONLINE PRICE:: ',
    //   price?.amount
    //     .div(new BigNumber!(10 ** +price.decimals.toFixed()))
    //     .toFixed()
    // );

    // console.log('POOLS ONLINE');
    // const onlinePools = await tradeRouter.getPools();
    // console.dir(onlinePools, { depth: null });
    // console.dir(
    //   onlinePools.map((p) => ({
    //     ...p,
    //     address: u8aToHex(decodeAddress(p.address)),
    //   })),
    //   { depth: null }
    // );
    //
    // console.dir(
    //   onlinePools
    //     .filter((p) => p.type === 'Xyk')
    //     .map((p) => u8aToHex(decodeAddress(p.address))),
    //   { depth: null }
    // );

    throw Error('STOP');
  }
}
