import { AppConfig } from '../../../appConfig';
import { Pool, QueryResult, QueryResultRow } from 'pg';

const appConfig = AppConfig.getInstance();

export class SupportPgClient {
  private static instance: SupportPgClient;

  private pool: Pool;

  static getInstance(): SupportPgClient {
    if (!SupportPgClient.instance) {
      SupportPgClient.instance = new SupportPgClient();
    }
    return SupportPgClient.instance;
  }

  constructor() {
    this.pool = new Pool({
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
    });
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }
}
