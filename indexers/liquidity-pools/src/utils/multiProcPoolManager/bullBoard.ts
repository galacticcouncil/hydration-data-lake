import Queue from 'bull';
import { AppConfig } from '../../appConfig';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

const appConfig = AppConfig.getInstance();

export function getBullBoardExpressAdapter() {
  const processingPoolQueue = new Queue(
    `${appConfig.INDEXER_ID}_PROCESSING_POOL`,
    {
      redis: {
        port: appConfig.TS_REDIS_PORT,
        host: appConfig.TS_REDIS_HOST,
        password: appConfig.TS_REDIS_PASS,
      },
    }
  );

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: [new BullAdapter(processingPoolQueue)],
    serverAdapter: serverAdapter,
  });

  return serverAdapter;
}
