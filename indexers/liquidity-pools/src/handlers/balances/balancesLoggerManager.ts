import { AccountTotalBalanceHistoricalDataLog } from '../../model';
import * as crypto from 'crypto';
import { SqdProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import { AppConfig } from '../../appConfig';

export type BalanceLogInput = {
  accountId: string;
  assetId: string;
  source:
    | 'ASSET_BALANCE_EXPLICIT'
    | 'ASSET_BALANCE_IMPLICIT'
    | 'ASSET_BALANCE_ENSURED'
    | 'OMNIPOOL_POSITION'
    | 'OMNIPOOL_DEPOSIT'
    | 'XYK_DEPOSIT';
  paraBlockHeight: number;

  memo?: string;
  transferable?: bigint;
  totalLocked?: bigint;
  transferableNorm?: string | null;
  totalLockedNorm?: string | null;
};

const appConfig = AppConfig.getInstance();

export class BalancesLoggerManager {
  private static instance: BalancesLoggerManager;
  public logEntities: Map<string, AccountTotalBalanceHistoricalDataLog> =
    new Map();

  static getInstance(): BalancesLoggerManager {
    if (!BalancesLoggerManager.instance) {
      BalancesLoggerManager.instance = new BalancesLoggerManager();
    }
    return BalancesLoggerManager.instance;
  }

  addLog(input: BalanceLogInput) {
    if (!appConfig.log.BALANCES_LOG_ENABLED) return;

    const entityId = crypto.randomUUID();
    this.logEntities.set(
      entityId,
      new AccountTotalBalanceHistoricalDataLog({
        id: entityId,
        ...input,
      })
    );
  }

  async flushLogs(ctx: SqdProcessorContext<Store>) {
    if (!ctx.appConfig.log.BALANCES_LOG_ENABLED) return;
    await ctx.storeUtils.upsertWithBatches(
      Array.from(this.logEntities.values())
    );
    this.logEntities.clear();
    this.logEntities = new Map();
  }
}
