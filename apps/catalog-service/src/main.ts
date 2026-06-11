import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CatalogServiceModule } from './catalog-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CatalogServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3001,
    },
  });
  await app.listen();
  console.log('Catalog Service is listening on TCP port 3001');
}
bootstrap();
