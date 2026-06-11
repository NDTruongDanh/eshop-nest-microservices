import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CATALOG_PATTERNS,
  CreateProductRequest,
  CreateProductResponse,
  GetProductByIdResponse,
  GetProductsRequest,
  GetProductsResponse,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
@Injectable()
export class CatalogGatewayService {
  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  createProduct(payload: CreateProductRequest): Promise<CreateProductResponse> {
    return firstValueFrom(
      this.catalogClient.send<CreateProductResponse, CreateProductRequest>(
        CATALOG_PATTERNS.CREATE_PRODUCT,
        payload,
      ),
    );
  }

  getProducts(): Promise<GetProductsResponse> {
    return firstValueFrom(
      this.catalogClient.send<GetProductsResponse, GetProductsRequest>(
        CATALOG_PATTERNS.GET_PRODUCTS,
        {},
      ),
    );
  }

  getProductById(payload: { id: string }): Promise<GetProductByIdResponse> {
    return firstValueFrom(
      this.catalogClient.send<GetProductByIdResponse, { id: string }>(
        CATALOG_PATTERNS.GET_PRODUCT_BY_ID,
        payload,
      ),
    );
  }
}
