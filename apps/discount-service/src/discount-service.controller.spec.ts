import { Test, TestingModule } from '@nestjs/testing';
import { DiscountServiceController } from './discount-service.controller';
import { DiscountServiceService } from './discount-service.service';

describe('DiscountServiceController', () => {
  let discountServiceController: DiscountServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscountServiceController],
      providers: [DiscountServiceService],
    }).compile();

    discountServiceController = app.get<DiscountServiceController>(DiscountServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(discountServiceController.getHello()).toBe('Hello World!');
    });
  });
});
