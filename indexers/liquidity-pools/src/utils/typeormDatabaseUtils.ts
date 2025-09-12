import { AppConfig } from '../appConfig';

type RetryableFn<T> = () => Promise<T>;

const appConfig = AppConfig.getInstance();

export class TypeormDatabaseUtils {
  private retryableCodes = new Set(['40P01', '40001', '55P03']); // deadlock, serialization, lock timeout/nowait

  private isRetryablePg(err: any) {
    const code = err?.code || err?.driverError?.code;
    console.log(`isRetryablePg - ${code}`);
    return this.retryableCodes.has(code);
  }

  async runWithRetry<T>(
    fn: RetryableFn<T>,
    max = appConfig.DB_ACTION_RETRIES_NUMBER,
    baseDelayMs = appConfig.DB_ACTION_RETRIES_BASE_DELAY_MS,
    maxDelayMs = appConfig.DB_ACTION_RETRIES_MAX_DELAY_MS
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        return await fn();
      } catch (e: any) {
        if (!this.isRetryablePg(e) || attempt >= max) throw e;
        attempt++;
        console.log(`DB action retry #${attempt}...`);
        const delay = Math.min(
          baseDelayMs * 2 ** attempt + Math.floor(Math.random() * baseDelayMs),
          maxDelayMs
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
}
