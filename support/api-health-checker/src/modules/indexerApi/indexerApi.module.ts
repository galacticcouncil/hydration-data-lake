import { Global, Module } from '@nestjs/common';
import { IndexerApiService } from './indexerApi.service';

@Module({
  providers: [IndexerApiService],
  exports: [IndexerApiService],
})
export class IndexerApiModule {}
