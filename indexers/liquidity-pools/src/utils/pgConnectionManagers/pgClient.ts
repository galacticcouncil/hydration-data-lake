import { AppConfig } from '../../appConfig';
import { Client, QueryResult, QueryResultRow } from 'pg';

export class CommonPgClient {
  private static instance: CommonPgClient;

  public pgClient: Client;

  static getInstance(): CommonPgClient {
    if (!CommonPgClient.instance) {
      CommonPgClient.instance = new CommonPgClient();
    }
    return CommonPgClient.instance;
  }

  constructor() {
    const appConfig = AppConfig.getInstance();

    this.pgClient = new Client({
      host: appConfig.DB_HOST,
      port: appConfig.DB_PORT,
      database: appConfig.DB_NAME,
      user: appConfig.DB_USER,
      password: appConfig.DB_PASS,
    });
  }

  async connectWithRetry(
    max = 5,
    baseDelayMs = 1000,
    maxDelayMs = 10000
  ): Promise<void> {
    let attempt = 0;
    const appConfig = AppConfig.getInstance();

    while (true) {
      try {
        // Create a new client for each attempt
        const client = new Client({
          host: appConfig.DB_HOST,
          port: appConfig.DB_PORT,
          database: appConfig.DB_NAME,
          user: appConfig.DB_USER,
          password: appConfig.DB_PASS,
        });

        await client.connect();

        // Only assign to this.pgClient after successful connection
        this.pgClient = client;

        console.log(
          '[PostgreSQL :: CommonPgClient] connection established successfully'
        );
        return;
      } catch (e: any) {
        if (attempt >= max) {
          console.error(
            `Failed to connect to [PostgreSQL :: CommonPgClient] after ${max} attempts:`,
            e
          );
          throw e;
        }

        attempt++;
        console.log(
          `[PostgreSQL :: CommonPgClient] DB connection retry #${attempt}... Error: ${e.message}`
        );

        const delay = Math.min(
          baseDelayMs * 2 ** attempt + Math.floor(Math.random() * baseDelayMs),
          maxDelayMs
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
