import { AppConfig } from '../../../appConfig';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { getApiState, setApiState } from './sql/apiState.sql';

export type ApiStateEntity = {
  id: string;
  assetPriceLatestProcessedBlock: number;
};

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

  async upsertApiState({
    assetPriceLatestProcessedBlock,
  }: {
    assetPriceLatestProcessedBlock: number;
  }) {
    try {
      await this.query(setApiState, ['1', assetPriceLatestProcessedBlock]);
    } catch (e) {
      console.log(e);
    }
  }

  async getApiState(): Promise<ApiStateEntity> {
    try {
      const state = (
        await this.query<{
          id: string;
          asset_price_latest_processed_block: number;
        }>(getApiState, ['1'])
      ).rows[0];

      return {
        id: state.id,
        assetPriceLatestProcessedBlock:
          state.asset_price_latest_processed_block,
      };
    } catch (e) {
      console.log(e);
      return {
        id: '1',
        assetPriceLatestProcessedBlock: 0,
      };
    }
  }
}
