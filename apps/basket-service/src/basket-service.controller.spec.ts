import { Test, TestingModule } from '@nestjs/testing';
import { BasketServiceController } from './basket-service.controller';
import { BasketServiceService } from './basket-service.service';

describe('BasketServiceController', () => {
  let basketServiceController: BasketServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BasketServiceController],
      providers: [BasketServiceService],
    }).compile();

    basketServiceController = app.get<BasketServiceController>(BasketServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(basketServiceController.getHello()).toBe('Hello World!');
    });
  });
});
