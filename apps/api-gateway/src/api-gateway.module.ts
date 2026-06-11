import { Module } from '@nestjs/common';
import { CatalogGatewayController } from './catalog/catalog.controller';
import { CatalogGatewayService } from './catalog/catalog.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [CatalogGatewayController],
  providers: [CatalogGatewayService],
})
export class ApiGatewayModule {}
