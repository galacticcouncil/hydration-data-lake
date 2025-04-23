import { SqdProcessorContext } from '../../../../../processor';
import { Store } from '@subsquid/typeorm-store';
import { OfflineTradeRouterManagerHelper } from './offlineTradeRouterManagerHelper';
import {
  TradeRouter,
  OfflinePoolService,
  IPersistentDataInput,
} from '../../../../../../../../../../hydration-sdk/packages/sdk';

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
    const persistentDataSource: IPersistentDataInput = {
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
        omni: this.getDecoratedOmnipoolHistDataAsPersistentDataInput({
          blockNumber,
        }),
        aave: [],
      },
    };

    // const offlinePoolService = new OfflinePoolService(
    //   OfflinePoolService.fromPersistentDataToDataSource(persistentDataSource)
    // );
  }
}
