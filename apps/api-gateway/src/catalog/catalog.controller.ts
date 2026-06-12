import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, catchError, throwError, timeout } from 'rxjs';
import {
  CATALOG_PATTERNS,
  CreateProductRequest,
  CreateProductResponse,
  GetProductByIdParams,
  GetProductByIdRequest,
  GetProductByIdResponse,
  GetProductsResponse,
} from '@app/contracts';
import { rpcToHttpException } from '../common/rpc-to-http-exception';

@Controller('catalog/products')
export class CatalogController {
  constructor(
    @Inject('CATALOG_SERVICE')
    private readonly catalogClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(
    @Body() body: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<
          CreateProductResponse,
          CreateProductRequest
        >(CATALOG_PATTERNS.CREATE_PRODUCT, body)
        .pipe(
          timeout(5000),
          catchError((error) => {
            return throwError(() => rpcToHttpException(error));
          }),
        ),
    );
  }

  @Get()
  async getProducts(): Promise<GetProductsResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<
          GetProductsResponse,
          Record<string, never>
        >(CATALOG_PATTERNS.GET_PRODUCTS, {})
        .pipe(
          timeout(5000),
          catchError((error) => {
            return throwError(() => rpcToHttpException(error));
          }),
        ),
    );
  }

  @Get(':id')
  async getProductById(
    @Param() params: GetProductByIdParams,
  ): Promise<GetProductByIdResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<
          GetProductByIdResponse,
          GetProductByIdRequest
        >(CATALOG_PATTERNS.GET_PRODUCT_BY_ID, { id: params.id })
        .pipe(
          timeout(5000),
          catchError((error) => {
            return throwError(() => rpcToHttpException(error));
          }),
        ),
    );
  }
}
