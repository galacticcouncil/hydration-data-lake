var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Module, RequestMethod, } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import * as dotenv from 'dotenv';
import { UtilsModule } from './utils.module';
import './common/entities/enums';
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
import { OnlyGraphqlMiddleware } from './common/middlewares/onlyGraphql.middleware';
import { IndexerApiModule } from './modules/indexerApi/indexerApi.module';
import { ApiGatewayModule } from './modules/apiGateway/apiGateway.module';
import { NotificationsDispatcherModule } from './modules/notificationsDispatcher/notificationsDispatcher.module';
import { OnChainEventsModule } from './modules/onChainEvents/onChainEvents.module';
let AppModule = (() => {
    let _classDecorators = [Module({
            imports: [
                GraphQLModule.forRootAsync(modulesConfig.graphqlModuleForRoot),
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
            ],
            providers: [ShutdownService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppModule = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        configure(consumer) {
            consumer
                .apply(RobotTxtMiddleware)
                .forRoutes({ path: 'robot.txt', method: RequestMethod.GET });
            consumer
                .apply(OnlyGraphqlMiddleware)
                .forRoutes({ path: '*', method: RequestMethod.ALL });
        }
    };
    return AppModule = _classThis;
})();
export { AppModule };
