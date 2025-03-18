import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ShutdownService } from './modules/platformBootstrap/shutdown.service';
import { AppConfig } from './config.module';
import * as express from 'express';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const corsConfig = { origin: '*' };
    app.get(AppConfig);
    app.enableCors(corsConfig);
    app.enableShutdownHooks();
    app.get(ShutdownService).subscribeToShutdown(() => app.close());
    app.use(express.json({ limit: '50mb' }));
    await app.listen(+(process.env.APP_PORT || 8080));
}
bootstrap();
