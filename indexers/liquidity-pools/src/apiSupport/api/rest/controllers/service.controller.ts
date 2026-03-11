import { Request, Response } from 'express';
import { AppConfig } from '../../../../appConfig';

export type IndexerMetadata = {
  metadataVersion: string;
  indexer: {
    id: string;
    version: string;
    network: string;
    master: boolean;
  };
  coverage: {
    timeBounds: {
      minTime: string;
      maxTime: string;
    };
    blockBounds: {
      minBlockHeight: number;
      maxBlockHeight: number;
    };
  };
};

const appConfig = AppConfig.getInstance();

export const getMetadata = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = {
      metadataVersion: 1,
      indexer: {
        id: 'orca-aggregator-mainnet',
        version: appConfig.INDEXER_VERSION,
        network: appConfig.CHAIN,
        master: appConfig.IS_MASTER_INSTANCE,
      },
      coverage: {
        timeBounds: {
          minTime: '2023-01-01T00:00:00Z',
          maxTime: '2026-01-29T01:15:00Z',
        },
        blockBounds: {
          minBlockHeight: appConfig.PROCESS_FROM_BLOCK,
          maxBlockHeight: -1,
        },
      },
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHealthStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const client = await dbPool!.connect();
    // try {
    //   const result = await client.query(
    //     'SELECT NOW() as time, current_database() as db'
    //   );
    //   res.json({
    //     status: 'healthy',
    //     timestamp: new Date().toISOString(),
    //     database: {
    //       connected: true,
    //       database: result.rows[0].db,
    //       serverTime: result.rows[0].time,
    //       poolInfo: {
    //         totalCount: dbPool!.totalCount,
    //         idleCount: dbPool!.idleCount,
    //         waitingCount: dbPool!.waitingCount,
    //       },
    //     },
    //   });
    // } finally {
    //   client.release();
    // }
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message,
      },
    });
  }
};
