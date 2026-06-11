import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogRepository } from './repositories/catalog.repository';
import { Product } from './entities/product.entity';
import {
  CreateProductRequest,
  CreateProductResponse,
  GetProductByIdRequest,
  GetProductByIdResponse,
  GetProductsResponse,
} from '@app/contracts';

@Injectable()
export class CatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async createProduct(
    request: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    const product = Product.create({
      name: request.name,
      category: request.category,
      description: request.description,
      imageFile: request.imageFile,
      price: request.price,
    });

    const savedProduct = await this.catalogRepository.create(product);

    return {
      product: savedProduct.toJson(),
    };
  }

  async getProducts(): Promise<GetProductsResponse> {
    const products = await this.catalogRepository.findAll();

    return {
      // Convert each Product entity to its JSON representation (Product entity -> ProductDto)
      products: products.map((product) => product.toJson()),
    };
  }

  async getProductById(
    request: GetProductByIdRequest,
  ): Promise<GetProductByIdResponse> {
    const product = await this.catalogRepository.findById(request.id);

    if (!product) {
      throw new NotFoundException(`Product with id ${request.id} not found`);
    }
    return {
      product: product.toJson(),
    };
  }
}
