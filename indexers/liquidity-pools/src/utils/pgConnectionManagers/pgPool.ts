import { AppConfig } from '../../appConfig';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const appConfig = AppConfig.getInstance();

export class CommonPgPool {
  private static instance: CommonPgPool;

  public pool: Pool;

  static getInstance(): CommonPgPool {
    if (!CommonPgPool.instance) {
      CommonPgPool.instance = new CommonPgPool();
    }
    return CommonPgPool.instance;
  }

  constructor({
    connectionString,
    maxPoolSize = appConfig.DB_POOL_MAX_SIZE,
    readOnly = false,
  }: {
    connectionString?: string;
    maxPoolSize?: number;
    readOnly?: boolean;
  } = {}) {
    this.pool = new Pool({
      ...(connectionString
        ? { connectionString }
        : {
            host: appConfig.DB_HOST,
            port: appConfig.DB_PORT,
            database: appConfig.DB_NAME,
            user: appConfig.DB_USER,
            password: appConfig.DB_PASS,
          }),
      ...(readOnly ? { options: '-c default_transaction_read_only=on' } : {}),
      max: maxPoolSize,
    });

    // Without these listeners a dropped connection — idle ('error' on the pool)
    // or checked-out ('error' on the client) — is an unhandled event that
    // crashes the whole process.
    this.pool.on('error', (err) => {
      console.error(`[CommonPgPool] pool error: ${err.message}`);
    });
    this.pool.on('connect', (client) => {
      client.on('error', (err) => {
        console.error(`[CommonPgPool] client error: ${err.message}`);
      });
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
