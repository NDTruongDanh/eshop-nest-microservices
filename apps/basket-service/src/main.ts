import { NestFactory } from '@nestjs/core';
import { BasketServiceModule } from './basket-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BasketServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
