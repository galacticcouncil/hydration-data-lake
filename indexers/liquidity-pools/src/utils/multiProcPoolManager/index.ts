import { AppConfig } from '../../appConfig';
import { PgBoss } from 'pg-boss';

export enum PgBossQueueName {
  CORE_PROCESSOR = 'CORE_PROCESSOR',
  SPOT_PRICES_PROCESSOR = 'SPOT_PRICES_PROCESSOR',
  BALANCES_PROCESSOR = 'BALANCES_PROCESSOR',
  POOL_AND_ASSET_METRICS_PROCESSOR = 'POOL_AND_ASSET_METRICS_PROCESSOR',
}

export type MultiProcPoolJobPayload = {
  blockNumber: number;
  jobStatus: MultiProcPoolJobProcessingStatus;
  producedBy?: string; // producer STATE_SCHEMA_NAME
  consumedBy?: string; // consumer STATE_SCHEMA_NAME
};

export enum MultiProcPoolJobProcessingStatus {
  READY_TO_PICK_UP = 'READY_TO_PICK_UP',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type MultiProcPoolJobsMap = Map<
  PgBossQueueName,
  MultiProcPoolJobPayload[]
>;

export class MultiProcPoolManager {
  private static instance: MultiProcPoolManager;
  private bossInstance: PgBoss;
  private appConfig: AppConfig;

  static getInstance(): MultiProcPoolManager {
    if (!MultiProcPoolManager.instance) {
      MultiProcPoolManager.instance = new MultiProcPoolManager();
    }
    return MultiProcPoolManager.instance;
  }

  constructor() {
    this.appConfig = AppConfig.getInstance();

    this.bossInstance = new PgBoss({
      host: this.appConfig.DB_HOST,
      port: this.appConfig.DB_PORT,
      database: this.appConfig.DB_NAME,
      user: this.appConfig.DB_USER,
      password: this.appConfig.DB_PASS,
      ssl: false,
      max: 2,
    });
  }

  async start() {
    const createQueue = async (qName: PgBossQueueName) => {
      await this.bossInstance.createQueue(`${qName}_DL`, {
        expireInSeconds: 3600,
      });
      await this.bossInstance.createQueue(qName, {
        deadLetter: `${qName}_DL`,
        policy: 'singleton',
        expireInSeconds: 3600,
      });
    };

    await this.bossInstance.start();

    await createQueue(PgBossQueueName.CORE_PROCESSOR);
    await createQueue(PgBossQueueName.SPOT_PRICES_PROCESSOR);
    await createQueue(PgBossQueueName.BALANCES_PROCESSOR);
    await createQueue(PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR);

    console.log('PgBoss started');
  }
  async stop() {
    await this.bossInstance.stop();
    console.log('PgBoss stopped');
  }

  async publishPendingJobs(jobsMap: MultiProcPoolJobsMap) {
    /**
     * Do this in the end of the batch after all handlers.
     *
     * Publish jobs for other processors with processed block numbers (one job per block) with status PENDING and singletonKey = data.blockNumber.
     * In such case we will have pending jobs for blocks from this batch. If batch
     * data commit will fail, processor will start processing from the same batch
     * and method changeJobsStatusFromPreviousBatch will not find pending jobs
     * related with this batch as all of them will have blockNumber >= ctx.blocks[0].height
     */
    try {
      let totalJobsPublished = 0;

      for (const [queueName, jobs] of jobsMap) {
        if (jobs.length === 0) continue;

        // Use Promise.allSettled to handle individual job failures
        const jobPromises = jobs.map((job) =>
          this.bossInstance
            .send(queueName, job, {
              singletonKey: `${job.blockNumber}-${job.producedBy}`,
              retryLimit: 15,
              retryDelay: 60,
              retryBackoff: true,
              expireInSeconds: 3600, // 1 hour
            })
            .catch((error) => {
              // Log but don't fail if it's a duplicate key error (job already exists)
              if (
                error.message?.includes('duplicate key') ||
                error.code === '23505'
              ) {
                console.log(
                  `Job for block ${job.blockNumber} already exists, skipping`
                );
                return null;
              }
              throw error;
            })
        );

        // Execute all job insertions in parallel
        const jobIds = await Promise.all(jobPromises);
        const successfulJobs = jobIds.filter((id) => id !== null).length;

        totalJobsPublished += successfulJobs;
        console.log(`Published ${successfulJobs} jobs to queue ${queueName}`);
      }

      console.log(
        `Published ${totalJobsPublished} pending jobs across all queues`
      );
    } catch (error) {
      console.error('Error publishing pending jobs:', error);
      throw error;
    }
  }

  async changeJobsStatusFromPreviousBatch({
    batchStartBlockHeight,
    derivativeQueueNames,
    currentProcQueueName,
    schemaName,
  }: {
    batchStartBlockHeight: number; //ctx.blocks[0].height
    currentProcQueueName: PgBossQueueName;
    derivativeQueueNames?: PgBossQueueName[];
    schemaName: string; // STATE_SCHEMA for current processor
  }) {
    /**
     * Run at the beginning of the batch to change jobs statuses:
     * - from PENDING to READE_TO_PICK_UP.
     * - from READE_TO_PICK_UP to COMPLETED
     *
     * Each processor changes statuses of it's own jobs (by consumedBy) in queues for another processors (e.g. core_proc changes in balances_proc queue).)
     * Select all jobs with data.jobStatus = PENDING && blockHeight < batchStartBlockHeight && && consumedBy = STATE_SCHEMA - it means all job created on previous batch.
     * Change status to READY_TO_PICK_UP to allow further processing by lower processors.
     *
     * Each processor changes statuses of it's own jobs (by consumedBy) in it's own queues.
     * Select all jobs with data.jobStatus = READE_TO_PICK_UP && blockHeight < batchStartBlockHeight&& consumedBy = STATE_SCHEMA- it means all job created on previous batch.
     * Change data.jobStatus to COMPLETED and state = "completed"
     *
     */
    const db = this.bossInstance.getDb();

    try {
      // // Clean up stale active jobs (jobs that were picked up but never completed - likely from crashed processors)
      // const cleanupStaleJobsQuery = `
      //   UPDATE pgboss.job
      //   SET
      //     state = 'created',
      //     started_on = NULL,
      //     data = data - 'consumedBy'
      //   WHERE name = $1
      //     AND state = 'active'
      //     AND (data->>'blockNumber')::integer < $2
      //     AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}'
      //     AND started_on < NOW() - INTERVAL '5 minutes'
      // `;
      //
      // const cleanupResult = await db.executeSql(cleanupStaleJobsQuery, [
      //   currentProcQueueName,
      //   batchStartBlockHeight,
      // ]);
      //
      // if (cleanupResult.rows.length > 0) {
      //   console.log(
      //     `Cleaned up ${cleanupResult.rows.length} stale active jobs`
      //   );
      // }

      if (derivativeQueueNames && derivativeQueueNames.length > 0) {
        // 1. Update PENDING jobs to READY_TO_PICK_UP in OTHER queues (jobs created by this processor for other processors)
        const updatePendingQuery = `
        UPDATE pgboss.job
        SET data = jsonb_set(data, '{jobStatus}', '"${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}"')
        WHERE name = ANY($1::text[])
          AND (data->>'producedBy') = $2
          AND state = 'created'
          AND (data->>'blockNumber')::integer < $3
          AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.PENDING}'
      `;

        const pendingResult = await db.executeSql(updatePendingQuery, [
          derivativeQueueNames,
          schemaName,
          batchStartBlockHeight,
        ]);

        console.log(
          `Updated ${pendingResult.rows.length} PENDING jobs to READY_TO_PICK_UP`
        );
      }

      // 2. Complete READY_TO_PICK_UP jobs in THIS queue (jobs consumed by this processor)
      const completeJobsQuery = `
        UPDATE pgboss.job
        SET
          data = jsonb_set(data, '{jobStatus}', '"${MultiProcPoolJobProcessingStatus.COMPLETED}"'),
          state = 'completed',
          completed_on = NOW()
        WHERE name = $1
--           AND (state = 'created' OR state = 'active')
          AND state = 'active'
          AND (data->>'blockNumber')::integer < $2
          AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}'
          AND data->>'consumedBy' = $3
      `;

      const completeResult = await db.executeSql(completeJobsQuery, [
        currentProcQueueName,
        batchStartBlockHeight,
        schemaName,
      ]);

      console.log(
        `Completed ${completeResult.rows.length} READY_TO_PICK_UP jobs`
      );
    } catch (error) {
      console.error('Error changing job statuses from previous batch:', error);
      throw error;
    }
  }

  // checkAndWaitForCoreProcStatus can be used as well

  async waitAndGetJobsToProcess({
    queueName,
    fromBlock,
    toBlock,
    schemaName,
    states = ['active', 'retry', 'failed'], // Default to ['active'] for backward compatibility
  }: {
    queueName: PgBossQueueName;
    fromBlock: number;
    toBlock: number;
    schemaName: string; // STATE_SCHEMA for current processor
    states?: string[]; // Array of states to check for READY_TO_PICK_UP jobs
  }): Promise<MultiProcPoolJobPayload[]> {
    /**
     * Run after changeJobsStatusFromPreviousBatch
     *
     * Periodically fetch READE_TO_PICK_UP jobs related with current processor by queueName.
     *
     * WHERE:
     * - (state = "created" && jobStatus = READE_TO_PICK_UP && name = queueName) || (state = "active" && jobStatus = READE_TO_PICK_UP && consumedBy = STATE_SCHEMA && name = queueName)
     *
     * Don't lock them.
     *
     * If queue contains jobs for each block within fromBlock - toBlock range (based on data.blockNumber),
     * pick these jobs up (set state => "active"), return block range which can be processed by
     * current processor (or return jobs list whith some extra payload - for future).
     *
     * If queue doesn't contain enough jobs for range fromBlock - toBlock, wait and
     * retry in some interval (300ms).
     */
    const db = this.bossInstance.getDb();
    const retryInterval = 300; // milliseconds

    while (true) {
      try {
        // Check if we have READY_TO_PICK_UP jobs for the entire block range
        const checkQuery = `
          SELECT id, data, singleton_key, state
          FROM pgboss.job
          WHERE name = $1
            AND (
              (state = 'created' AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}')
              OR
              (state = ANY($5::pgboss.job_state[]) AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}' AND data->>'consumedBy' = $2)
            )
            AND (data->>'blockNumber')::integer >= $3
            AND (data->>'blockNumber')::integer <= $4
          ORDER BY (data->>'blockNumber')::integer ASC
        `;

        const result = await db.executeSql(checkQuery, [
          queueName,
          schemaName,
          fromBlock,
          toBlock,
          states,
        ]);

        // Check if we have jobs for all blocks in the range
        const expectedBlockCount = toBlock - fromBlock + 1;
        const blockNumbers = new Set(
          result.rows.map((row) => row.data.blockNumber)
        );

        if (blockNumbers.size === expectedBlockCount) {
          // We have all required blocks, update jobs to active state
          const jobIds = result.rows.map((row: any) => row.id);

          // Use FOR UPDATE SKIP LOCKED to prevent race conditions
          // Handle both: new jobs (created state) and jobs from failed runs (states array with same consumedBy)
          // IMPORTANT: Don't update jobs that are already 'active' - just return them
          const updateQuery = `
            WITH jobs_to_update AS (
              SELECT id, state, data
              FROM pgboss.job
              WHERE id = ANY($2::uuid[])
                AND data->>'jobStatus' = '${MultiProcPoolJobProcessingStatus.READY_TO_PICK_UP}'
                AND (
                  state = 'created'
                  OR (state = ANY($4::pgboss.job_state[]) AND data->>'consumedBy' = $1)
                )
              FOR UPDATE SKIP LOCKED
            ),
            updated_jobs AS (
              UPDATE pgboss.job j
              SET
                state = 'active',
                started_on = NOW(),
                data = jsonb_set(data, '{consumedBy}', $3::jsonb, true)
              FROM jobs_to_update jtu
              WHERE j.id = jtu.id
                AND jtu.state != 'active'  -- Don't update already active jobs
              RETURNING j.id, j.data, j.singleton_key
            ),
            already_active_jobs AS (
              SELECT jtu.id, jtu.data, j.singleton_key
              FROM jobs_to_update jtu
              JOIN pgboss.job j ON j.id = jtu.id
              WHERE jtu.state = 'active'
            )
            SELECT * FROM updated_jobs
            UNION ALL
            SELECT * FROM already_active_jobs
          `;

          const updateResult = await db.executeSql(updateQuery, [
            schemaName, // $1 - for text comparison with ->>
            jobIds, // $2
            JSON.stringify(schemaName), // $3 - for jsonb_set
            states, // $4
          ]);

          // Check if we successfully locked all required jobs
          if (updateResult.rows.length < expectedBlockCount) {
            // Debug: Let's see what jobs we found vs what we could lock
            const foundJobStates = result.rows.map((row: any) => ({
              id: row.id,
              state: row.state || 'created',
              blockNumber: row.data.blockNumber,
              consumedBy: row.data.consumedBy,
            }));

            const lockedJobIds = new Set(
              updateResult.rows.map((row: any) => row.id)
            );
            const unlockedJobs = foundJobStates.filter(
              (job) => !lockedJobIds.has(job.id)
            );

            console.log(
              `Only locked ${updateResult.rows.length} of ${expectedBlockCount} jobs. ` +
                `Unable to lock: ${JSON.stringify(unlockedJobs.slice(0, 3))}... ` +
                `Retrying...`
            );
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
            continue;
          }

          // Return the job payloads
          const jobs: MultiProcPoolJobPayload[] = updateResult.rows.map(
            (row: any) => row.data
          );

          console.log(
            `Picked up ${jobs.length} jobs for blocks ${fromBlock}-${toBlock}`
          );

          return jobs;
        } else {
          // Not all blocks are available yet
          const missingBlocks: number[] = [];
          for (let block = fromBlock; block <= toBlock; block++) {
            if (!blockNumbers.has(block)) {
              missingBlocks.push(block);
            }
          }

          console.log(
            `Waiting for blocks in queue ${queueName} ... (${missingBlocks.length} missing)`
          );

          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      } catch (error) {
        console.error('Error waiting for jobs to process:', error);
        throw error;
      }
    }
  }
}

//
//
// import { AppConfig } from '../../appConfig';
// import { PgBoss } from 'pg-boss';
//
// export enum PgBossQueueName {
//   CORE_PROCESSOR = 'CORE_PROCESSOR',
//   SPOT_PRICES_PROCESSOR = 'SPOT_PRICES_PROCESSOR',
//   BALANCES_PROCESSOR = 'BALANCES_PROCESSOR',
//   POOL_AND_ASSET_METRICS_PROCESSOR = 'POOL_AND_ASSET_METRICS_PROCESSOR',
// }
//
// export type MultiProcPoolJobPayload = {
//   blockNumber: number;
//   jobStatus: MultiProcPoolJobProcessingStatus;
//   consumedBy?: string; // SCHEMA_NAME
// };
//
// export enum MultiProcPoolJobProcessingStatus {
//   READY_TO_PICK_UP = 'READY_TO_PICK_UP',
//   PENDING = 'PENDING',
//   COMPLETED = 'COMPLETED',
// }
//
// const appConfig = AppConfig.getInstance();
//
// export class MultiProcPoolManager {
//   private static instance: MultiProcPoolManager;
//   private bossInstance: PgBoss;
//   private maxJobsBatchNumber = appConfig.MAX_JOB_BATCH_SIZE;
//
//   static getInstance(): MultiProcPoolManager {
//     if (!MultiProcPoolManager.instance) {
//       MultiProcPoolManager.instance = new MultiProcPoolManager();
//     }
//     return MultiProcPoolManager.instance;
//   }
//
//   constructor() {
//     this.bossInstance = new PgBoss({
//       host: appConfig.DB_HOST,
//       port: appConfig.DB_PORT,
//       database: appConfig.DB_NAME,
//       user: appConfig.DB_USER,
//       password: appConfig.DB_PASS,
//       ssl: false,
//       max: 2,
//     });
//   }
//
//   async start() {
//     await this.bossInstance.start();
//     await this.bossInstance.createQueue(PgBossQueueName.CORE_PROCESSOR);
//     await this.bossInstance.createQueue(PgBossQueueName.BALANCES_PROCESSOR);
//     await this.bossInstance.createQueue(
//       PgBossQueueName.POOL_AND_ASSET_METRICS_PROCESSOR
//     );
//     await this.bossInstance.createQueue(PgBossQueueName.SPOT_PRICES_PROCESSOR);
//     console.log('PgBoss started');
//   }
//   async stop() {
//     await this.bossInstance.stop();
//     console.log('PgBoss stopped');
//   }
//
//   async publishPendingJobs(
//     jobsMap: Map<PgBossQueueName, MultiProcPoolJobPayload[]>
//   ) {
//     /**
//      * Do this in the end of the batch after all handlers.
//      *
//      * Publish jobs for other processors with processed block numbers (one job per block) with status PENDING and singletonKey = data.blockNumber.
//      * In such case we will have pending jobs for blocks from this batch. If batch
//      * data commit will fail, processor will start processing from the same batch
//      * and method changeJobsStatusFromPreviousBatch will not find pending jobs
//      * related with this batch as all of them will have blockNumber >= ctx.blocks[0].height
//      */
//   }
//
//   async changeJobsStatusFromPreviousBatch({
//     batchStartBlockHeight,
//     queueName,
//   }: {
//     batchStartBlockHeight: number; //ctx.blocks[0].height
//     queueName: PgBossQueueName;
//   }) {
//     /**
//      * Run at the beginning of the batch to change jobs statuses:
//      * - from PENDING to READE_TO_PICK_UP.
//      * - from READE_TO_PICK_UP to COMPLETED
//      *
//      * Each processor changes statuses of it's own jobs (by consumedBy) in queues for another processors (e.g. core_proc changes in balances_proc queue).)
//      * Select all jobs with data.jobStatus = PENDING && blockHeight < batchStartBlockHeight && && consumedBy = STATE_SCHEMA - it means all job created on previous batch.
//      * Change status to READY_TO_PICK_UP to allow further processing by lower processors.
//      *
//      * Each processor changes statuses of it's own jobs (by consumedBy) in it's own queues.
//      * Select all jobs with data.jobStatus = READE_TO_PICK_UP && blockHeight < batchStartBlockHeight&& consumedBy = STATE_SCHEMA- it means all job created on previous batch.
//      * Change data.jobStatus to COMPLETED and state = "completed"
//      *
//      */
//     // this.bossInstance.fetch();
//   }
//
//   // checkAndWaitForCoreProcStatus can be used as well
//
//   async waitAndGetJobsToProcess({
//     queueName,
//     fromBlock,
//     toBlock,
//   }: {
//     queueName: PgBossQueueName;
//     fromBlock: number;
//     toBlock: number;
//   }) {
//     /**
//      * Run after changeJobsStatusFromPreviousBatch
//      *
//      * Periodically fetch READE_TO_PICK_UP jobs related with current processor by queueName.
//      *
//      * WHERE:
//      * - (state = "created" && jobStatus = READE_TO_PICK_UP && name = queueName) || (state = "active" && jobStatus = READE_TO_PICK_UP && consumedBy = STATE_SCHEMA && name = queueName)
//      *
//      * Don't lock them.
//      *
//      * If queue contains jobs for each block within fromBlock - toBlock range (based on data.blockNumber),
//      * pick these jobs up (set state => "active"), return block range which can be processed by
//      * current processor (or return jobs list whith some extra payload - for future).
//      *
//      * If queue doesn't contain enough jobs for range fromBlock - toBlock, wait and
//      * retry in some interval (300ms).
//      */
//   }
// }
