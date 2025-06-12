import { Global, Module } from '@nestjs/common';
import { ApiGatewayService } from './apiGateway.service';
import { RestHealthcheckController } from './rest/restHealthcheck.controller';

@Module({
  providers: [ApiGatewayService],
  exports: [ApiGatewayService],
  controllers: [RestHealthcheckController],
})
export class ApiGatewayModule {}
