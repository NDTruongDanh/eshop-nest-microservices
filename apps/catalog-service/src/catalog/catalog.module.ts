import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CatalogRepository } from './repositories/catalog.repository';
import { InMemoryCatalogRepository } from './repositories/in-memory-catalog.repository';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    {
      provide: CatalogRepository,
      useClass: InMemoryCatalogRepository,
    },
  ],
})
export class CatalogModule {}
