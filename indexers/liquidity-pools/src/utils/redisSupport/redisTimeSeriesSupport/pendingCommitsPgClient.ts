import { QueryResult, QueryResultRow } from 'pg';
import { AppConfig } from '../../../appConfig';
import { CommonPgPool } from '../../pgConnectionManagers/pgPool';
import { AddMultiplePricesPayload } from '../redisTimeSeriesManager';

const appConfig = AppConfig.getInstance();

export type PendingCommitJobName = 'commitAssetPriceVolume';

export type PendingCommitRow = {
  id: string;
  jobName: PendingCommitJobName;
  paraBlockHeight: number;
  sampleTimestampMs: number;
  payload: AddMultiplePricesPayload;
};

export class PendingCommitsPgClient {
  private static instance: PendingCommitsPgClient;
  private pgClient: CommonPgPool;

  static getInstance(): PendingCommitsPgClient {
    if (!PendingCommitsPgClient.instance) {
      PendingCommitsPgClient.instance = new PendingCommitsPgClient();
    }
    return PendingCommitsPgClient.instance;
  }

  constructor() {
    this.pgClient = CommonPgPool.getInstance();
  }

  private async query<T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    return this.pgClient.query<T>(text, params);
  }

  async getLatestProcessedBlock(): Promise<number> {
    const result = await this.query<{ latest_processed_block: number }>(
      `SELECT latest_processed_block FROM processor_status WHERE id = $1`,
      [appConfig.STATE_SCHEMA_NAME]
    );
    return result.rows[0]?.latest_processed_block ?? 0;
  }

  async fetchPendingCommits(
    cutoffBlockHeight: number,
    limit: number,
    jobName: PendingCommitJobName = 'commitAssetPriceVolume'
  ): Promise<PendingCommitRow[]> {
    const result = await this.query<{
      id: string;
      job_name: PendingCommitJobName;
      para_block_height: number;
      sample_timestamp_ms: string;
      payload: AddMultiplePricesPayload;
    }>(
      `SELECT id, job_name, para_block_height, sample_timestamp_ms, payload
       FROM pending_redis_ts_commit
       WHERE job_name = $1 AND para_block_height <= $2
       ORDER BY para_block_height ASC
       LIMIT $3`,
      [jobName, cutoffBlockHeight, limit]
    );

    return result.rows.map((r) => ({
      id: r.id,
      jobName: r.job_name,
      paraBlockHeight: r.para_block_height,
      sampleTimestampMs: Number(r.sample_timestamp_ms),
      payload: r.payload,
    }));
  }

  async deletePendingCommits(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await this.query(
      `DELETE FROM pending_redis_ts_commit WHERE id = ANY($1::text[])`,
      [ids]
    );
  }
}