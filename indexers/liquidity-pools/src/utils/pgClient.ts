import { AppConfig } from '../appConfig';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const appConfig = AppConfig.getInstance();

export class CommonPgClient {
  private static instance: CommonPgClient;

  public pool: Pool;

  static getInstance(): CommonPgClient {
    if (!CommonPgClient.instance) {
      CommonPgClient.instance = new CommonPgClient();
    }
    return CommonPgClient.instance;
  }

  constructor() {
    this.pool = new Pool({
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
      max: 3,
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
