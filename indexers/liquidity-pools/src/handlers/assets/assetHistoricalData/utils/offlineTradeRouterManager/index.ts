import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';
import {
  TradeRouter,
  OfflinePoolService,
  IPersistentDataInput,
  OfflinePoolUtils,
} from '../../../../../../../../../../hydration-sdk/packages/sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  PoolService,
  TradeRouter as OriginalTradeRouter,
  PoolType,
  BigNumber,
} from '@galacticcouncil/sdk';

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

    const spotPrice = await router.getBestSpotPrice('5', '0');
    const spotPriceRoute = await router.getMostLiquidRoute('5', '0');

    if (spotPrice)
      console.log(
        spotPrice?.amount
          .div(new BigNumber!(10 ** +spotPrice.decimals.toFixed()))
          .toFixed()
      );
    console.dir(spotPriceRoute, { depth: null });

    console.log('POOLS OFFLINE');
    console.dir(await router.getPools(), { depth: null });

    console.log('\n\n\n\n\n');

    // Initialize Polkadot API
    const wsProvider = new WsProvider('wss://hydration-rpc.n.dwellir.com');
    const api = await ApiPromise.create({ provider: wsProvider });

    // Initialize Trade Router
    const poolService = new PoolService(api);
    await poolService.syncRegistry(); // Wait until pools initialized (optional), fallback to lazy init
    const tradeRouter = new OriginalTradeRouter(poolService);

    const price = await tradeRouter.getBestSpotPrice('5', '0');
    const priceRoute = await router.getMostLiquidRoute('5', '0');

    console.log(
      price?.amount
        .div(new BigNumber!(10 ** +price.decimals.toFixed()))
        .toFixed()
    );

    console.dir(priceRoute, { depth: null });

    console.log('POOLS ONLINE');
    console.dir(await tradeRouter.getPools(), { depth: null });
  }
}
