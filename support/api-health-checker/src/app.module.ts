import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as dotenv from 'dotenv';
import { UtilsModule } from './utils.module';
import { EnvModule } from './config.module';
import { ShutdownService } from './modules/platformBootstrap/shutdown.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import modulesConfig from './modulesConfig';
import { AppBootstrapperModule } from './modules/platformBootstrap/appBootstrapper.module';
dotenv.config();
import { QueueModule } from './modules/queue/queue.module';
import { RobotTxtMiddleware } from './common/middlewares/robotTxt.middleware';
import { IndexerApiModule } from './modules/indexerApi/indexerApi.module';
import { ApiGatewayModule } from './modules/apiGateway/apiGateway.module';
import { NotificationsDispatcherModule } from './modules/notificationsDispatcher/notificationsDispatcher.module';
import { OnChainEventsModule } from './modules/onChainEvents/onChainEvents.module';
import { HealthCheckCoreModule } from './modules/healthCheckCore/healthCheckCore.module';

@Module({
  imports: [
    BullModule.forRootAsync(modulesConfig.bullModuleForRoot),
    // https://til.selleo.com/posts/826-bull-board-for-nestjs
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      // middleware: (req: Request, resp: Response, next: NextFunction) => {
      //   if (
      //     process.env.NODE_ENV === 'production' &&
      //     (!req.headers ||
      //       !req.headers.authorization ||
      //       req.headers.authorization !==
      //         `Bearer ${process.env.QUEUE_DASH_TOKEN}`)
      //   ) {
      //     resp.status(403).send('Access to this resource is forbidden.');
      //     return;
      //   }
      //   next();
      // },
    }),
    EnvModule,
    UtilsModule,
    AppBootstrapperModule,
    QueueModule,
    IndexerApiModule,
    ApiGatewayModule,
    NotificationsDispatcherModule,
    OnChainEventsModule,
    HealthCheckCoreModule,
  ],
  providers: [ShutdownService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RobotTxtMiddleware)
      .forRoutes({ path: 'robot.txt', method: RequestMethod.GET });
  }
}
