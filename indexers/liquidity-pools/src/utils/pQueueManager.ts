import PQueue from 'p-queue';

export class PQueueManager {
  private static instance: PQueueManager;

  private runtimeApiCallsQueueInst: PQueue;

  private mmOracleContractCallsQueueInst: PQueue;

  constructor() {
    this.runtimeApiCallsQueueInst = new PQueue({
      concurrency: 10,
    });
    this.mmOracleContractCallsQueueInst = new PQueue({
      concurrency: 10,
    });
  }

  static getInstance(): PQueueManager {
    if (!PQueueManager.instance) {
      PQueueManager.instance = new PQueueManager();
    }
    return PQueueManager.instance;
  }

  get runtimeApiCallsQueue() {
    return this.runtimeApiCallsQueueInst;
  }
  get mmOracleContractCallsQueue() {
    return this.mmOracleContractCallsQueueInst;
  }
}
