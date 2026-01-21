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

  constructor() {
    this.pool = new Pool({
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
      max: appConfig.DB_POOL_MAX_SIZE,
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
