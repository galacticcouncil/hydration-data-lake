import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import './common/entities/enums';
export declare class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
