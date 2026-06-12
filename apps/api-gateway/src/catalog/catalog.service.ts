import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CATALOG_PATTERNS,
  CreateProductRequest,
  CreateProductResponse,
  GetProductByIdRequest,
  GetProductByIdResponse,
  GetProductsRequest,
  GetProductsResponse,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { rpcToHttpException } from '../common/rpc-to-http-exception';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { timeout } from 'rxjs/internal/operators/timeout';
@Injectable()
export class CatalogGatewayService {
  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  createProduct(payload: CreateProductRequest): Promise<CreateProductResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<
          CreateProductResponse,
          CreateProductRequest
        >(CATALOG_PATTERNS.CREATE_PRODUCT, payload)
        .pipe(
          timeout(5000),
          catchError((error) => {
            return throwError(() => rpcToHttpException(error));
          }),
        ),
    );
  }

  getProducts(): Promise<GetProductsResponse> {
    return firstValueFrom(
      this.catalogClient
        .send<
          GetProductsResponse,
          GetProductsRequest
        >(CATALOG_PATTERNS.GET_PRODUCTS, {})
        .pipe(
          timeout(5000),
          catchError((error) => {
            return throwError(() => rpcToHttpException(error));
          }),
        ),
    );
  }

  getProductById(
    params: GetProductByIdRequest,
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
