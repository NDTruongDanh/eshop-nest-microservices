import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import type {
  CreateProductRequest,
  CreateProductResponse,
  GetProductByIdResponse,
  GetProductsResponse,
} from '@app/contracts';
import { CatalogGatewayService } from './catalog.service';

@Controller('catalog/products')
export class CatalogGatewayController {
  constructor(private readonly catalogGatewayService: CatalogGatewayService) {}

  @Post()
  createProduct(
    @Body() payload: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    return this.catalogGatewayService.createProduct(payload);
  }

  @Get()
  getProducts(): Promise<GetProductsResponse> {
    return this.catalogGatewayService.getProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Promise<GetProductByIdResponse> {
    return this.catalogGatewayService.getProductById({ id });
  }
}
