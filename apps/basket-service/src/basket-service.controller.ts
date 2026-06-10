import { Controller, Get } from '@nestjs/common';
import { BasketServiceService } from './basket-service.service';

@Controller()
export class BasketServiceController {
  constructor(private readonly basketServiceService: BasketServiceService) {}

  @Get()
  getHello(): string {
    return this.basketServiceService.getHello();
  }
}
