import { Global, Module } from '@nestjs/common';
import { CryptoUtils } from './utils/cryptoUtils';
import { CommonUtils } from './utils/commonUtils';
import { PolkadotApiProviderFactory } from './providers/polkadotApi.provider';
import { GraphQlClientProviderFactory } from './providers/graphQlClient.provider';
import { RedisOmClientProviderFactory } from './providers/redisOmClient.provider';
import { DiscordClientProviderFactory } from './providers/discordClient.provider';

@Global()
@Module({
  providers: [
    CryptoUtils,
    CommonUtils,
    PolkadotApiProviderFactory,
    GraphQlClientProviderFactory,
    RedisOmClientProviderFactory,
    DiscordClientProviderFactory,
  ],
  exports: [
    CryptoUtils,
    CommonUtils,
    PolkadotApiProviderFactory,
    GraphQlClientProviderFactory,
    RedisOmClientProviderFactory,
    DiscordClientProviderFactory,
  ],
})
export class UtilsModule {}
