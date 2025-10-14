import { AppConfig } from '../appConfig';
import {
  Entity,
  EntityClass,
  FindManyOptions,
  FindOneOptions,
} from '@subsquid/typeorm-store/src/store';
import { SqdProcessorContext } from '../processor';
import { splitIntoBatches } from './helpers';
import * as crypto from 'node:crypto';
import { Store } from '@subsquid/typeorm-store';
import { HydratedLogger, HydratedLoggerMeta } from './hydratedLogger';

type RetryableFn<T> = () => Promise<T>;

const appConfig = AppConfig.getInstance();

export class TypeormDatabaseUtils {
  private retryableCodes = new Set(['25P02', '40P01', '40001', '55P03']); // deadlock, serialization, lock timeout/nowait
  private currentProcessingBlocksRangeTag: string;

  constructor(
    private sqdCtx: SqdProcessorContext<Store>,
    private extLogger: HydratedLogger
  ) {
    this.currentProcessingBlocksRangeTag = `${this.sqdCtx.blocks[0].header.height}-${this.sqdCtx.blocks[this.sqdCtx.blocks.length - 1].header.height}`;
  }

  private isRetryablePg(err: any) {
    const code = err?.code || err?.driverError?.code;
    console.log(`isRetryablePg - ${code}`);
    return this.retryableCodes.has(code);
  }

  async runWithRetry<T>(
    fn: RetryableFn<T>,
    max = appConfig.DB_ACTION_RETRIES_NUMBER,
    baseDelayMs = appConfig.DB_ACTION_RETRIES_BASE_DELAY_MS,
    maxDelayMs = appConfig.DB_ACTION_RETRIES_MAX_DELAY_MS
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (e: any) {
        if (!this.isRetryablePg(e) || attempt >= max) throw e;
        attempt++;
        console.log(`DB action retry #${attempt}...`);
        const delay = Math.min(
          baseDelayMs * 2 ** attempt + Math.floor(Math.random() * baseDelayMs),
          maxDelayMs
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  async upsertWithBatches<E extends Entity>(
    data: E[],
    maxBatchSize: number = appConfig.DB_ACTION_MAX_BATCH_SIZE
  ) {
    if (!data.length) return;

    const upsertOpId = crypto.randomUUID();

    for (const batch of splitIntoBatches(data, maxBatchSize)) {
      await this.extLogger.measure({
        fn: () => this.runWithRetry(() => this.sqdCtx.store.upsert(batch)),
        name: `upsertBatch_${batch[0]?.constructor.name}`,
        actionType: 'db_write',
        meta: {
          paraBlockHeight: this.sqdCtx.blocks[0].header.height,
          opId: upsertOpId,
          upsertBatchSize: batch.length,
          paraBlocksRange: this.currentProcessingBlocksRangeTag,
        },
        options: {
          ignoreConsoleLogs: true,
        },
      });
    }
  }

  async findWithLogs<E extends Entity>(
    entityClass: EntityClass<E>,
    options?: FindManyOptions<E>,
    meta?: { className: string } & Record<string, any>
  ): Promise<E[]> {
    let findOptionsDecorated = null;

    try {
      if (options) findOptionsDecorated = JSON.stringify(options);
    } catch (e) {}

    return this.extLogger.measure({
      fn: () => this.sqdCtx.store.find(entityClass, options),
      name: `find_${meta?.className ?? entityClass?.constructor.name}`,
      actionType: 'db_read',
      meta: {
        paraBlockHeight: meta?.paraBlockHeight,
        originCallFn: meta?.originCallFn,
        paraBlocksRange: this.currentProcessingBlocksRangeTag,
        findOptions: findOptionsDecorated,
      },
      options: {
        ignoreConsoleLogs: true,
      },
    });
  }

  async findOneWithLogs<E extends Entity>(
    entityClass: EntityClass<E>,
    options: FindOneOptions<E>,
    meta?: { className: string } & Record<string, any>
  ): Promise<E | undefined> {
    let findOptionsDecorated = null;

    try {
      if (options) findOptionsDecorated = JSON.stringify(options);
    } catch (e) {}

    return this.extLogger.measure({
      fn: () => this.sqdCtx.store.findOne(entityClass, options),
      name: `findOne_${meta?.className ?? entityClass?.constructor.name}`,
      actionType: 'db_read',
      meta: {
        paraBlockHeight: meta?.paraBlockHeight,
        originCallFn: meta?.originCallFn,
        paraBlocksRange: this.currentProcessingBlocksRangeTag,
        findOptions: findOptionsDecorated,
      },
      options: {
        ignoreConsoleLogs: true,
      },
    });
  }
}
