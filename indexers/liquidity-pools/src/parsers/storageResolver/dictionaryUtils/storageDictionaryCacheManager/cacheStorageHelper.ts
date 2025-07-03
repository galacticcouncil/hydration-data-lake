// import { DataSource, Repository } from 'typeorm';
// import { BlockCompressedData } from './cacheStorageEntities/blockCompressedData';
// import { AppConfig } from '../../../../appConfig';
// import { QueriesHelper } from '../queriesHelper';
//
//
// export class CacheStorageHelper {
//   protected connection: DataSource | null = null;
//   protected repoBlockCompressedData: Repository<BlockCompressedData> | null =
//     null;
//
//   constructor() {}
//
//   get blockCompressedDataRepository() {
//     this.initConnection();
//     if (!this.repoBlockCompressedData)
//       throw Error(`blockCompressedDataRepository is not defined`);
//     return this.repoBlockCompressedData;
//   }
//
//   initConnection() {
//     if (this.connection) return;
//
//     this.connection = new DataSource({
//       type: 'better-sqlite3',
//       database: 'storage_dict_cache.db',
//       //   database:   ":memory:"
//       synchronize: true, // dev only: auto-create tables
//       logging: false,
//       entities: [__dirname + '/cacheStorageEntities/*.{js,ts}'],
//       // migrations: [__dirname + '/migrations/*.{js,ts}'],
//       // subscribers: [__dirname + '/subscribers/*.{js,ts}'],
//     });
//
//     this.repoBlockCompressedData =
//       this.connection.getRepository(BlockCompressedData);
//   }
// }
