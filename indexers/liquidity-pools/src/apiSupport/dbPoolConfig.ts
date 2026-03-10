import { Pool, PoolConfig } from 'pg';
import { AppConfig } from '../appConfig';

/**
 * Creates a PostgreSQL connection pool with proper reconnection handling
 * and configuration for PostGraphile
 */
export function createDatabasePool(): Pool {
  const appConfig = AppConfig.getInstance();

  const poolConfig: PoolConfig = {
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    database: appConfig.DB_NAME,
    user: appConfig.DB_USER,
    password: appConfig.DB_PASS,

    // Connection pool configuration
    max: 20, // Maximum number of clients in the pool
    min: 2, // Minimum number of clients in the pool

    // Application name for monitoring
    application_name: 'postgraphile-api',
  };

  const pool = new Pool(poolConfig);

  // Handle pool errors globally
  pool.on('error', (err, client) => {
    console.error('PostgreSQL pool error:', err.message);
    // Don't exit on pool errors - the pool will handle reconnection
  });

  // Log when clients are connected
  pool.on('connect', (client) => {
    console.log('PostgreSQL pool: New client connected');
  });

  // Log when clients are removed
  pool.on('remove', (client) => {
    console.log('PostgreSQL pool: Client removed from pool');
  });

  return pool;
}

/**
 * Tests database connectivity with retry logic
 */
export async function testDatabaseConnection(
  pool: Pool,
  maxRetries = 5,
  baseDelayMs = 1000,
  maxDelayMs = 10000
): Promise<boolean> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT NOW()');
        console.log('Database connection test successful:', result.rows[0].now);
        return true;
      } finally {
        client.release();
      }
    } catch (err: any) {
      attempt++;
      console.error(`Database connection test failed (attempt ${attempt}/${maxRetries}):`, err.message);

      if (attempt >= maxRetries) {
        return false;
      }

      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * baseDelayMs),
        maxDelayMs
      );

      console.log(`Retrying database connection in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return false;
}

/**
 * Gracefully shuts down the pool
 */
export async function shutdownPool(pool: Pool): Promise<void> {
  try {
    await pool.end();
    console.log('PostgreSQL pool closed gracefully');
  } catch (err) {
    console.error('Error closing PostgreSQL pool:', err);
  }
}