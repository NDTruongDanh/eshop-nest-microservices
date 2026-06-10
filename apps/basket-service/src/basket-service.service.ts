import { Injectable } from '@nestjs/common';

@Injectable()
export class BasketServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
