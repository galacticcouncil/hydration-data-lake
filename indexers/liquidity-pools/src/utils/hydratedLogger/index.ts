import pino, { Logger as PinoLogger } from 'pino';
import { CommonPgClient } from '../pgClient';
import { AppConfig } from '../../appConfig';
import BaseMigration from './db/baseMigration';
import ViewsMigration from './db/viewsMigration';

const appConfig = AppConfig.getInstance();

type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
type HydratedLoggerActionType =
  | 'db_read'
  | 'db_write'
  | 'storage_fetch'
  | 'rpc_call'
  | 'evm_read'
  | 'other';

export type HydratedLoggerMeta = {
  name?: string;
  actionType?: HydratedLoggerActionType;
  paraBlockHeight?: number;
  paraBlocksRange?: string;
  opId?: string;
} & Record<string, any>;

export interface HydratedLoggerConfig {
  level?: LogLevel; // default: "info"
  logFileEnabled?: boolean; // default: false
  logFilePath?: string; // default: "./logs/app.log"
  prettyInDev?: boolean; // default: true
  consoleLogsEnabled?: boolean; // default: true
  consoleLogsVerbose?: boolean; // default: true
  db?: {
    connectionString?: string;
    maxBatchSize?: number; // default: 100
    flushIntervalMs?: number; // default: 1000
    enabled?: boolean; // default: true
  };
}
export interface HydratedLoggerRuntimeConfig {
  ignoreConsoleLogs?: boolean;
}

interface HydratedLoggerDbRow {
  ts: Date;
  level: LogLevel;
  action_type: HydratedLoggerActionType;
  name?: string;
  message?: string;
  duration_ms?: number;
  success?: boolean;
  meta?: {
    para_block_height?: number;
    op_id?: string;
    para_blocks_range?: string;
  } & Record<string, any>;
}

export class HydratedLogger {
  private static instance: HydratedLogger | null = null;

  private pino: PinoLogger;
  // private pool: Pool | null = null;
  private pgClient: CommonPgClient | null = null;
  private ensureSchemaOnce?: Promise<void>;
  private consoleLogsEnabled = true;
  private consoleLogsVerbose = true;

  private buffer: HydratedLoggerDbRow[] = [];
  private maxBatchSize: number;
  private flushIntervalMs: number;
  private flushTimer: NodeJS.Timeout | null = null;
  private dbEnabled: boolean;
  private initDone = false;

  private constructor(cfg: HydratedLoggerConfig = {}) {
    const isProd = process.env.NODE_ENV === 'production';
    const level = cfg.level ?? 'info';

    const targets: any[] = [];
    if (cfg.consoleLogsEnabled) {
      targets.push({ target: 'pino-pretty', options: { colorize: true } });
    }
    if (cfg.logFileEnabled)
      targets.push({
        target: 'pino/file',
        options: {
          destination: cfg.logFilePath ?? './logs/app.log',
          mkdir: true,
        },
      });

    this.pino = pino(
      {
        level,
        base: undefined,
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.transport({ targets })
    );

    // Console log transport
    this.consoleLogsEnabled = cfg.consoleLogsEnabled ?? true;
    this.consoleLogsVerbose = cfg.consoleLogsVerbose ?? true;

    // DB transport (batched)
    this.dbEnabled = cfg.db?.enabled ?? true;
    if (this.dbEnabled) {
      this.pgClient = new CommonPgClient();

      this.maxBatchSize = cfg.db?.maxBatchSize ?? 100;
      this.flushIntervalMs = cfg.db?.flushIntervalMs ?? 1000;

      this.flushTimer = setInterval(
        () => this.flush().catch(() => {}),
        this.flushIntervalMs
      );
      // Don't keep the process alive just because of the timer
      this.flushTimer.unref?.();
    } else {
      this.maxBatchSize = 0;
      this.flushIntervalMs = 0;
    }
  }

  static getInstance(cfg?: HydratedLoggerConfig): HydratedLogger {
    if (!this.instance) this.instance = new HydratedLogger(cfg);
    return this.instance;
  }

  async init() {
    if (this.initDone) return this;

    if (this.dbEnabled) {
      await this.ensureSchema();
    }
    this.initDone = true;

    return this;
  }

  private async ensureSchema(): Promise<void> {
    if (!this.pgClient) return;
    if (this.ensureSchemaOnce) return this.ensureSchemaOnce;

    this.ensureSchemaOnce = (async () => {
      try {
        await this.pgClient!.query(BaseMigration);
        await this.pgClient!.query(ViewsMigration);
      } catch (e) {
        await this.pgClient!.query('ROLLBACK');
        // don’t crash prod if ensure fails — log and continue
        this.pino.warn(
          { err: (e as any)?.message },
          'logger ensureSchemaOnce failed'
        );
      }
    })();

    return this.ensureSchemaOnce;
  }

  info(
    obj: HydratedLoggerMeta,
    message?: string,
    options?: HydratedLoggerRuntimeConfig
  ): void;
  info(
    message: string,
    meta?: HydratedLoggerMeta,
    options?: HydratedLoggerRuntimeConfig
  ): void;
  info(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('info', a, b, options);
  }

  warn(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('warn', a, b, options);
  }
  error(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('error', a, b, options);
  }
  debug(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('debug', a, b, options);
  }
  trace(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('trace', a, b, options);
  }
  fatal(a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    this.log('fatal', a, b, options);
  }

  log(level: LogLevel, a: any, b?: any, options?: HydratedLoggerRuntimeConfig) {
    let message: string | undefined;
    let meta: HydratedLoggerMeta | undefined;
    const ignoreConsoleLogs = (options && options.ignoreConsoleLogs) ?? false;

    if (typeof a === 'string') {
      message = a;
      meta = b;
      if (this.consoleLogsEnabled && !ignoreConsoleLogs)
        this.pino[level](this.consoleLogsVerbose && meta ? meta : {}, message);
    } else {
      meta = a;
      message = b;
      if (this.consoleLogsEnabled && !ignoreConsoleLogs)
        this.pino[level](this.consoleLogsVerbose && meta ? meta : {}, message);
    }

    if (this.dbEnabled) {
      const name = meta?.name ?? meta?.op ?? meta?.event ?? undefined;
      const row: HydratedLoggerDbRow = {
        ts: new Date(),
        level,
        name,
        action_type: meta?.actionType ?? 'other',
        duration_ms: meta?.durationMs,
        success: meta?.success,
        meta: {
          ...meta,
          message,
          para_block_height: meta?.paraBlockHeight,
          para_blocks_range: meta?.paraBlocksRange,
          op_id: meta?.opId,
        },
      };
      this.buffer.push(row);
      if (this.buffer.length >= this.maxBatchSize) {
        this.flush().catch(() => {});
      }
    }
  }

  async measure<T>({
    fn,
    name,
    actionType,
    meta = {},
    options,
  }: {
    fn: () => Promise<T> | T;
    actionType: HydratedLoggerActionType;
    name: string;
    meta: HydratedLoggerMeta;
    options?: HydratedLoggerRuntimeConfig;
  }): Promise<T> {
    const start = process.hrtime.bigint();
    try {
      const result = await fn();
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      const formattedDuration = this.formatDuration(durationMs);

      this.info(
        `✔ ${name} - ${formattedDuration}`,
        {
          event: 'timing',
          name,
          actionType,
          durationMs,
          success: true,
          ...meta,
        },
        options
      );

      return result;
    } catch (err: any) {
      const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
      const formattedDuration = this.formatDuration(durationMs);
      this.error(
        `✖ ${name} - ${formattedDuration}`,
        {
          event: 'timing',
          name,
          actionType,
          durationMs,
          success: false,
          error: { message: err?.message, stack: err?.stack },
          ...meta,
        },
        options
      );
      throw err;
    }
  }

  // --- Flush buffered rows to Postgres
  async flush(): Promise<void> {
    if (!this.pgClient || this.buffer.length === 0) return;
    const batch = this.buffer.splice(0, this.maxBatchSize);

    // Build a single multi-row INSERT
    const cols = [
      'ts',
      'level',
      'name',
      'action_type',
      'para_block_height',
      'op_id',
      'para_blocks_range',
      'duration_ms',
      'success',
      'meta',
    ];
    const values: any[] = [];
    const placeholders: string[] = [];

    batch.forEach((r, i) => {
      const base = i * cols.length;
      placeholders.push(
        `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10})`
      );
      values.push(
        r.ts,
        r.level,
        r.name ?? null,
        r.action_type ?? null,
        r.meta?.para_block_height ?? null,
        r.meta?.op_id ?? null,
        r.meta?.para_blocks_range ?? null,
        r.duration_ms ?? null,
        r.success ?? null,
        r.meta ?? null
      );
    });

    const sql = `
      INSERT INTO support.app_logs (${cols.join(',')})
      VALUES ${placeholders.join(',')}
    `;

    try {
      await this.pgClient?.query(sql, values);
    } catch (e) {
      // If DB is unavailable, don't crash the app; drop this batch.
      this.pino.warn(
        { err: (e as any)?.message },
        'app_logs insert failed (dropped batch)'
      );
    }
  }

  async shutdown(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flush();
    if (this.pgClient) await this.pgClient.pool.end();
    await new Promise<void>((resolve) => {
      this.pino.flush?.(() => resolve());
      // If flush not available, resolve immediately
      setTimeout(resolve, 50);
    });
  }

  private formatDuration(durationMs: number): string {
    if (durationMs < 1000) {
      // Less than 1 second - show as milliseconds
      return `${durationMs.toFixed(3)}ms`;
    } else if (durationMs < 60000) {
      // Less than 1 minute - show as seconds
      return `${(durationMs / 1000).toFixed(3)}s`;
    } else {
      // 1 minute or more - show as m:ss.mmm
      const totalSeconds = durationMs / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toFixed(3).padStart(6, '0')} (m:ss.mmm)`;
    }
  }
}

export async function getHydratedLogger() {
  const log = await HydratedLogger.getInstance({
    level: 'info',
    prettyInDev: true,
    logFileEnabled: appConfig.log.HLOG_LOG_FILE_ENABLED,
    logFilePath: appConfig.log.HLOG_LOG_FILE_PATH,
    consoleLogsEnabled: appConfig.log.HLOG_CONSOLE_LOGS_ENABLED,
    consoleLogsVerbose: appConfig.log.HLOG_CONSOLE_LOGS_VERBOSE,
    db: {
      enabled: appConfig.log.HLOG_DB_FLUSH_ENABLED,
      maxBatchSize: appConfig.log.HLOG_DB_FLUSH_MAX_BATCH_SIZE,
      flushIntervalMs: appConfig.log.HLOG_DB_FLUSH_INTERVAL_MS,
    },
  }).init();
  return log;
}

export async function initHydratedLogger(cfg?: HydratedLoggerConfig) {
  const log = await getHydratedLogger();

  process.on('SIGINT', async () => {
    await log.shutdown();
    process.exit(0);
  });
  process.on('SIGTERM', async () => {
    await log.shutdown();
    process.exit(0);
  });
}
