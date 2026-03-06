import { Request, Response } from 'express';
import {
  getMmReserveStateResolver,
  MmReserveState,
} from '../resolvers/mmReserves/reserves.resolver';
import crypto from 'node:crypto';
import { CacheManager } from '../../../utils/cacheManager';
import { OmnipoolAssetsLatestTvlResponse } from '../../graphql/plugins/query/omnipool/omnipoolTvlMetrics/resolvers';
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
