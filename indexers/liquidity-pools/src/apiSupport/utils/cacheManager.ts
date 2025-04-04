const Keyv = require('keyv');
import { createCache, Cache } from 'cache-manager';
import KeyvPostgres from '@keyv/postgres';
import { CacheableMemory } from 'cacheable';
import { AppConfig } from '../../appConfig';

const appConfig = AppConfig.getInstance();

export class CacheManager {
  private static instance: CacheManager;

  private cacheInstance: Cache;

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }
  constructor() {
    this.cacheInstance = this.initCache();
  }

  private initCache() {
    return createCache({
      ttl: appConfig.API_CACHE_TTL_MS,
      stores: [
        new Keyv({
          store: new CacheableMemory({
            ttl: appConfig.API_CACHE_TTL_MS,
            lruSize: 5000,
          }),
        }),

        new Keyv({
          store: new KeyvPostgres({
            uri: `postgresql://${appConfig.DB_USER}:${appConfig.DB_PASS}@${appConfig.DB_HOST}:${appConfig.DB_PORT}/${appConfig.DB_NAME}`,
            schema: 'support',
            table: 'api_cache',
          }),
        }),
      ],
    });
  }

  get cache() {
    if (!this.cacheInstance) this.cacheInstance = this.initCache();
    return this.cacheInstance;
  }
}
