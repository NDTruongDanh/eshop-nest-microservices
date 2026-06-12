import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  CATALOG_PATTERNS,
  CreateProductRequest,
  CreateProductResponse,
  GetProductsResponse,
  type GetProductByIdRequest,
  GetProductByIdResponse,
} from '@app/contracts';

import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern(CATALOG_PATTERNS.CREATE_PRODUCT)
  createProduct(
    @Payload() payload: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    return this.catalogService.createProduct(payload);
  }

  @MessagePattern(CATALOG_PATTERNS.GET_PRODUCTS)
  getProducts(): Promise<GetProductsResponse> {
    return this.catalogService.getProducts();
  }

  @MessagePattern(CATALOG_PATTERNS.GET_PRODUCT_BY_ID)
  getProductById(
    @Payload() payload: GetProductByIdRequest,
  ): Promise<GetProductByIdResponse> {
    return this.catalogService.getProductById(payload);
  }
}
