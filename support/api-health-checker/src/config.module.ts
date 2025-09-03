import { Global, Logger, Module } from '@nestjs/common';
import { transformAndValidateSync } from 'class-transformer-validator';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidationError,
} from 'class-validator';
import * as dotenv from 'dotenv';
import { Transform } from 'class-transformer';

dotenv.config({
  path: (() => {
    const envFileName = '.env';
    return `${__dirname}/../${envFileName}`;
  })(),
});

export class AppConfig {
  @IsNotEmpty()
  readonly REDIS_HOST: string;

  @IsNotEmpty()
  readonly REDIS_PORT: string;

  @IsNotEmpty()
  readonly REDIS_PASSWORD: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly REDIS_QUEUE_ENABLE_SSL: boolean = false;

  @IsNotEmpty()
  readonly INDEXER_GRAPHQL_API_URL: string;

  @IsNotEmpty()
  readonly NODE_ENV: string;

  @Transform(({ value }: { value: string }) => value === 'true')
  @IsNotEmpty()
  readonly APP_TERMINATED: boolean;

  @IsNotEmpty({
    message: `Env var WSS_URL has invalid value or not provided.`,
  })
  readonly WSS_URL: string;

  @IsNotEmpty()
  @IsNumber()
  readonly EVENT_CHECK_JOB_DELAY_MS: number = 10000;

  @IsNotEmpty()
  @IsNumber()
  readonly EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD: number = 10;

  @IsNotEmpty()
  @IsNumber()
  readonly BLOCKS_DIFF_ALERT_THRESHOLD: number = 10;

  @IsNotEmpty()
  @IsNumber()
  readonly EVENT_STATUS_MAX_SCORE: number = 5;

  @IsNotEmpty()
  @IsString()
  readonly DISCORD_ALERTS_BOT_TOKEN: string;

  @IsNotEmpty()
  @IsString()
  readonly DISCORD_ALERTS_SERVER: string;

  @IsNotEmpty()
  @IsString()
  readonly DISCORD_ALERTS_CHANEL: string;
}

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useFactory: () => {
        try {
          return transformAndValidateSync(AppConfig, process.env, {
            validator: { stopAtFirstError: true },
          });
        } catch (errors) {
          const logger = new Logger('ConfigModule');
          if (Array.isArray(errors) && errors[0] instanceof ValidationError) {
            errors.forEach((error: ValidationError) => {
              // @ts-ignore
              Object.values(error.constraints).forEach((msg) =>
                logger.error(msg),
              );
            });
          } else {
            logger.error('Unexpected error during the environment validation');
          }
          throw new Error('Failed to validate environment variables');
        }
      },
    },
  ],
  exports: [AppConfig],
})
export class EnvModule {}
