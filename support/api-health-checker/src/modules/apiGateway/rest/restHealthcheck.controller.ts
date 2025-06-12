import { Controller, Get } from '@nestjs/common';
import { IndexerStatusResponse } from '../dto/indexerStatus.response';
import { ApiGatewayService } from '../apiGateway.service';

// @UseFilters(ThrottlerExceptionFilter)
@Controller('indexer')
export class RestHealthcheckController {
  constructor(private apiGatewayService: ApiGatewayService) {}
  @Get('status')
  // @UseGuards(ThrottlerGuard)
  async status(): Promise<IndexerStatusResponse> {
    return this.apiGatewayService.getGlobalIndexerStatus();
  }
}
