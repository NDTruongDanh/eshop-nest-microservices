import { Module } from '@nestjs/common';
import { BasketServiceController } from './basket-service.controller';
import { BasketServiceService } from './basket-service.service';

@Module({
  imports: [],
  controllers: [BasketServiceController],
  providers: [BasketServiceService],
})
export class BasketServiceModule {}
